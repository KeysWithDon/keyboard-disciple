"""Authenticated Chatterbox speech service for Keyboard Disciple."""

from __future__ import annotations

import importlib
import importlib.util
import io
import json
import os
import re
import time
from collections import OrderedDict, defaultdict, deque
from dataclasses import dataclass
from pathlib import Path
from threading import Lock
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field


SERVICE_DIR = Path(__file__).resolve().parent
VOICE_ROOT = Path(os.getenv("CHATTERBOX_VOICE_ROOT", SERVICE_DIR / "voices")).resolve()
VOICE_MANIFEST = Path(os.getenv("CHATTERBOX_VOICE_MANIFEST", VOICE_ROOT / "voices.json")).resolve()
MAX_TEXT_LENGTH = max(40, min(1000, int(os.getenv("CHATTERBOX_MAX_TEXT_LENGTH", "300"))))
CACHE_TTL_SECONDS = max(30, int(os.getenv("CHATTERBOX_CACHE_TTL_SECONDS", "1800")))
CACHE_MAX_ENTRIES = max(8, int(os.getenv("CHATTERBOX_CACHE_MAX_ENTRIES", "256")))
RATE_LIMIT_REQUESTS = max(1, int(os.getenv("CHATTERBOX_RATE_LIMIT_REQUESTS", "30")))
RATE_LIMIT_WINDOW_SECONDS = max(1, int(os.getenv("CHATTERBOX_RATE_LIMIT_WINDOW_SECONDS", "60")))
SERVICE_TOKEN = os.getenv("CHATTERBOX_SERVICE_TOKEN", "").strip()
ALLOW_UNAUTHENTICATED = os.getenv("CHATTERBOX_ALLOW_UNAUTHENTICATED", "false").lower() == "true"
DEVICE_SETTING = os.getenv("CHATTERBOX_DEVICE", "auto").lower()

SUPPORTED_LANGUAGES = [
    "ar", "da", "de", "el", "en", "es", "fi", "fr", "he", "hi", "it",
    "ja", "ko", "ms", "nl", "no", "pl", "pt", "ru", "sv", "sw", "tr", "zh",
]


@dataclass(frozen=True)
class ModelSpec:
    model_id: str
    display_name: str
    description: str
    module: str
    class_name: str
    languages: tuple[str, ...]
    requires_reference: bool = False

    def public(self) -> dict[str, Any]:
        return {
            "id": self.model_id,
            "name": self.display_name,
            "description": self.description,
            "languages": list(self.languages),
            "requiresReferenceAudio": self.requires_reference,
        }


MODEL_SPECS: dict[str, ModelSpec] = {
    "chatterbox-turbo": ModelSpec(
        "chatterbox-turbo", "Chatterbox Turbo", "Fast English voice",
        "chatterbox.tts_turbo", "ChatterboxTurboTTS", ("en",), True,
    ),
    "chatterbox-english": ModelSpec(
        "chatterbox-english", "Chatterbox English", "Expressive English voice",
        "chatterbox.tts", "ChatterboxTTS", ("en",),
    ),
    "chatterbox-multilingual": ModelSpec(
        "chatterbox-multilingual", "Chatterbox Multilingual", "Multilingual voice",
        "chatterbox.mtl_tts", "ChatterboxMultilingualTTS", tuple(SUPPORTED_LANGUAGES),
    ),
}


def _env_origins() -> list[str]:
    raw = os.getenv("CHATTERBOX_ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


def _device() -> str:
    if DEVICE_SETTING in {"cpu", "cuda", "mps"}:
        return DEVICE_SETTING
    try:
        import torch

        if torch.cuda.is_available():
            return "cuda"
        if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
            return "mps"
    except Exception:
        pass
    return "cpu"


def clean_text(value: str) -> str:
    """Remove markup, URLs, and internal UI details before synthesis."""

    text = re.sub(r"<[^>]*>", " ", str(value or ""))
    text = re.sub(r"https?://\S+|data:[^\s]+", " ", text)
    text = re.sub(r"[`*_>#\[\]{}]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _safe_relative_path(value: str | None) -> Path | None:
    if not value:
        return None
    candidate = (VOICE_ROOT / value).resolve()
    try:
        candidate.relative_to(VOICE_ROOT)
    except ValueError:
        return None
    return candidate


def _read_voices() -> list[dict[str, Any]]:
    try:
        data = json.loads(VOICE_MANIFEST.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        data = []
    if not isinstance(data, list):
        return []
    voices = []
    for item in data:
        if not isinstance(item, dict):
            continue
        voice_id = str(item.get("id", "")).strip()
        if not re.fullmatch(r"[a-z0-9][a-z0-9_-]{1,63}", voice_id):
            continue
        compatible = [str(model) for model in item.get("models", []) if str(model) in MODEL_SPECS]
        voices.append({
            "id": voice_id,
            "name": str(item.get("name", voice_id)),
            "description": str(item.get("description", "")),
            "models": compatible,
            "language": str(item.get("language", "en")).lower(),
            "referenceAudio": str(item.get("referenceAudio", "")).strip() or None,
            "enabled": bool(item.get("enabled", False)),
        })
    return voices


def _public_voice(voice: dict[str, Any]) -> dict[str, Any]:
    return {key: voice[key] for key in ("id", "name", "description", "models", "language")}


class SynthesisRequest(BaseModel):
    text: str = Field(min_length=1, max_length=MAX_TEXT_LENGTH)
    model: str = Field(alias="modelId", min_length=1, max_length=80)
    voice: str = Field(alias="voiceId", min_length=1, max_length=80)
    language: str = Field(default="en", min_length=2, max_length=8)

    class Config:
        populate_by_name = True


class ModelRegistry:
    """Lazy, process-wide model cache. Loading is serialized and happens once."""

    def __init__(self) -> None:
        self.device = _device()
        self._models: dict[str, Any] = {}
        self._lock = Lock()

    def installed(self, spec: ModelSpec) -> bool:
        try:
            return importlib.util.find_spec(spec.module) is not None
        except ModuleNotFoundError:
            return False

    def available(self) -> list[ModelSpec]:
        return [spec for spec in MODEL_SPECS.values() if self.installed(spec)]

    def get(self, model_id: str) -> Any:
        spec = MODEL_SPECS.get(model_id)
        if not spec or not self.installed(spec):
            raise HTTPException(status_code=503, detail="Selected speech model is unavailable.")
        with self._lock:
            if model_id in self._models:
                return self._models[model_id]
            module = importlib.import_module(spec.module)
            model_class = getattr(module, spec.class_name)
            if model_id == "chatterbox-multilingual":
                model = model_class.from_pretrained(device=self.device, t3_model="v3")
            else:
                model = model_class.from_pretrained(device=self.device)
            self._models[model_id] = model
            return model

    def generate(self, payload: SynthesisRequest, reference_audio: Path | None) -> tuple[Any, int]:
        model = self.get(payload.model)
        spec = MODEL_SPECS[payload.model]
        kwargs: dict[str, Any] = {}
        if payload.model == "chatterbox-multilingual":
            kwargs["language_id"] = payload.language
        if spec.requires_reference:
            if not reference_audio or not reference_audio.is_file():
                raise HTTPException(status_code=503, detail="This voice needs an approved reference clip on the TTS server.")
            kwargs["audio_prompt_path"] = str(reference_audio)
        try:
            wav = model.generate(payload.text, **kwargs)
        except Exception as exc:
            raise HTTPException(status_code=502, detail="Speech generation failed.") from exc
        return wav, int(getattr(model, "sr", 24000))


class AudioCache:
    def __init__(self) -> None:
        self.entries: OrderedDict[str, tuple[float, bytes]] = OrderedDict()
        self.lock = Lock()

    def get(self, key: str) -> bytes | None:
        with self.lock:
            entry = self.entries.get(key)
            if not entry:
                return None
            created, content = entry
            if time.monotonic() - created > CACHE_TTL_SECONDS:
                self.entries.pop(key, None)
                return None
            self.entries.move_to_end(key)
            return content

    def put(self, key: str, content: bytes) -> None:
        with self.lock:
            self.entries[key] = (time.monotonic(), content)
            self.entries.move_to_end(key)
            while len(self.entries) > CACHE_MAX_ENTRIES:
                self.entries.popitem(last=False)


class RateLimiter:
    def __init__(self) -> None:
        self.events: defaultdict[str, deque[float]] = defaultdict(deque)
        self.lock = Lock()

    def allow(self, identity: str) -> bool:
        now = time.monotonic()
        with self.lock:
            bucket = self.events[identity]
            while bucket and now - bucket[0] > RATE_LIMIT_WINDOW_SECONDS:
                bucket.popleft()
            if len(bucket) >= RATE_LIMIT_REQUESTS:
                return False
            bucket.append(now)
            return True


registry = ModelRegistry()
cache = AudioCache()
limiter = RateLimiter()
bearer = HTTPBearer(auto_error=False)
app = FastAPI(title="Keyboard Disciple Chatterbox Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_env_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type", "X-KD-User-Id"],
)


def _authorized(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> str:
    if ALLOW_UNAUTHENTICATED and not SERVICE_TOKEN:
        return request.headers.get("x-kd-user-id", "local")
    if not SERVICE_TOKEN or not credentials or credentials.credentials != SERVICE_TOKEN:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return request.headers.get("x-kd-user-id", "authenticated")


def _voice_for_request(model_id: str, voice_id: str, language: str) -> dict[str, Any]:
    spec = MODEL_SPECS.get(model_id)
    if not spec:
        raise HTTPException(status_code=400, detail="Unknown speech model.")
    if language not in spec.languages:
        raise HTTPException(status_code=400, detail="Language is not supported by this model.")
    for voice in _read_voices():
        if not voice["enabled"] or voice["id"] != voice_id:
            continue
        if model_id not in voice["models"] or voice["language"] != language:
            continue
        reference = _safe_relative_path(voice.get("referenceAudio"))
        if spec.requires_reference and (not reference or not reference.is_file()):
            continue
        return voice
    raise HTTPException(status_code=403, detail="Voice is not available for this model and language.")


def _wav_bytes(wav: Any, sample_rate: int) -> bytes:
    try:
        array = wav.detach().float().cpu().numpy() if hasattr(wav, "detach") else wav
        if getattr(array, "ndim", 1) > 1:
            array = array.squeeze()
        import soundfile as sf

        output = io.BytesIO()
        sf.write(output, array, sample_rate, format="WAV", subtype="PCM_16")
        return output.getvalue()
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Generated audio could not be encoded.") from exc


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": True, "service": "keyboard-disciple-chatterbox", "device": registry.device}


@app.get("/models")
def models(_: str = Depends(_authorized)) -> dict[str, Any]:
    return {"models": [spec.public() for spec in registry.available()]}


@app.get("/voices")
def voices(
    model: str | None = Query(default=None),
    language: str = Query(default="en"),
    _: str = Depends(_authorized),
) -> dict[str, Any]:
    selected_model = model or "chatterbox-english"
    if selected_model not in MODEL_SPECS:
        raise HTTPException(status_code=400, detail="Unknown speech model.")
    spec = MODEL_SPECS[selected_model]
    available = []
    for voice in _read_voices():
        if not voice["enabled"] or selected_model not in voice["models"] or voice["language"] != language:
            continue
        reference = _safe_relative_path(voice.get("referenceAudio"))
        if spec.requires_reference and (not reference or not reference.is_file()):
            continue
        available.append(_public_voice(voice))
    return {"voices": available}


@app.post("/synthesize")
def synthesize(payload: SynthesisRequest, user_id: str = Depends(_authorized)) -> Response:
    if not limiter.allow(user_id):
        raise HTTPException(status_code=429, detail="Speech request limit reached. Try again shortly.")
    text = clean_text(payload.text)
    if not text:
        raise HTTPException(status_code=422, detail="Speech text cannot be empty.")
    if len(text) > MAX_TEXT_LENGTH:
        raise HTTPException(status_code=413, detail="Speech text is too long.")
    voice = _voice_for_request(payload.model, payload.voice, payload.language.lower())
    reference = _safe_relative_path(voice.get("referenceAudio"))
    language = payload.language.lower()
    key = json.dumps([user_id, text, payload.model, payload.voice, language], separators=(",", ":"))
    cached = cache.get(key)
    if cached is None:
        payload.text = text
        payload.language = language
        wav, sample_rate = registry.generate(payload, reference)
        cached = _wav_bytes(wav, sample_rate)
        cache.put(key, cached)
    return Response(
        content=cached,
        media_type="audio/wav",
        headers={"Cache-Control": "private, max-age=0", "X-Content-Type-Options": "nosniff"},
    )
