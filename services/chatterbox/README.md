# Keyboard Disciple Chatterbox service

This service keeps Chatterbox Python models away from the browser. The
Keyboard Disciple application gateway supplies the service token and proxies
only `/health`, `/models`, `/voices`, and `/synthesize`.

## Local setup

Python 3.11 is recommended. The Chatterbox package may download large model
weights on first use.

```sh
cd services/chatterbox
python3.11 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
openssl rand -hex 32
# Put the generated value in CHATTERBOX_SERVICE_TOKEN.
set -a; . ./.env; set +a
uvicorn app:app --host 127.0.0.1 --port 8200
```

The service selects CUDA when PyTorch reports a CUDA device, otherwise it uses
CPU. Set `CHATTERBOX_DEVICE=cpu` to force the slower development path.

## Approved voices

Edit `voices/voices.json` on the TTS server. A voice is enabled only after its
owner has approved the recording and the server administrator has added its
manifest entry. For Turbo, place the approved reference clip under
`voices/reference/` and use a relative `referenceAudio` value. Do not add
celebrity voices or recordings without permission. The API returns voice IDs,
names, descriptions, models, and language, but never the private file path.

## Docker

```sh
docker build -t keyboard-disciple-chatterbox services/chatterbox
docker run --rm --env-file services/chatterbox/.env \
  -p 8200:8200 keyboard-disciple-chatterbox
```

The included image is a CPU-friendly baseline. For production GPU inference,
use an image with a CUDA-compatible PyTorch wheel and a host/runtime that
exposes the GPU; keep the same app contract and secret configuration.
