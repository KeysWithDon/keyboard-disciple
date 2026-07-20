import json
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def service(monkeypatch):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    import app

    monkeypatch.setattr(app, "SERVICE_TOKEN", "test-token")
    monkeypatch.setattr(app.registry, "available", lambda: list(app.MODEL_SPECS.values()))
    monkeypatch.setattr(app, "_read_voices", lambda: [
        {
            "id": "default-english", "name": "Clear English", "description": "",
            "models": ["chatterbox-english"], "language": "en", "referenceAudio": None, "enabled": True,
        },
        {
            "id": "french-only", "name": "French", "description": "",
            "models": ["chatterbox-multilingual"], "language": "fr", "referenceAudio": None, "enabled": True,
        },
    ])
    monkeypatch.setattr(app.registry, "generate", lambda payload, reference: ([0.0, 0.0], 24000))
    monkeypatch.setattr(app, "_wav_bytes", lambda wav, rate: b"RIFF-test-wav")
    app.cache.entries.clear()
    app.limiter.events.clear()
    return TestClient(app.app), app


def auth_headers():
    return {"Authorization": "Bearer test-token", "X-KD-User-Id": "test-user"}


def test_health_is_public(service):
    client, _ = service
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_models_and_voices_are_authenticated_and_filtered(service):
    client, _ = service
    assert client.get("/models").status_code == 401
    models = client.get("/models", headers=auth_headers())
    assert models.status_code == 200
    assert {item["id"] for item in models.json()["models"]} == {
        "chatterbox-turbo", "chatterbox-english", "chatterbox-multilingual"
    }
    voices = client.get("/voices?model=chatterbox-multilingual&language=fr", headers=auth_headers())
    assert voices.json()["voices"][0]["id"] == "french-only"


def test_synthesis_is_cleaned_and_cached(service, monkeypatch):
    client, app = service
    calls = []

    def fake_generate(payload, reference):
        calls.append(payload.text)
        return [0.0], 24000

    monkeypatch.setattr(app.registry, "generate", fake_generate)
    payload = {"text": "<strong>Keep</strong>   your hands.", "modelId": "chatterbox-english", "voiceId": "default-english"}
    first = client.post("/synthesize", headers=auth_headers(), content=json.dumps(payload))
    second = client.post("/synthesize", headers=auth_headers(), content=json.dumps(payload))
    assert first.status_code == second.status_code == 200
    assert first.headers["content-type"] == "audio/wav"
    assert calls == ["Keep your hands."]


def test_empty_speech_is_rejected(service):
    client, _ = service
    response = client.post(
        "/synthesize",
        headers=auth_headers(),
        json={"text": "<div></div>", "modelId": "chatterbox-english", "voiceId": "default-english"},
    )
    assert response.status_code in (400, 422)
