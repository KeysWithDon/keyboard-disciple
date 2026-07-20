# Spoken reminders deployment

## Architecture

The static Keyboard Disciple frontend calls `/api/tts/*`. The Node gateway
adds the private service token and forwards requests to the FastAPI Chatterbox
service. The browser never receives that token. In production, put the gateway
behind the app's existing authentication/session layer and set
`KD_REQUIRE_APP_AUTH=true`.

GitHub Pages can host the frontend, but it cannot run `/api/tts` or a Python
model. To enable spoken reminders on the published site, deploy the gateway
and FastAPI service separately and reverse-proxy `/api/tts` from the same app
origin, or set `window.KD_TTS_API_BASE` to the HTTPS gateway URL before loading
`app.js`. Never put `CHATTERBOX_SERVICE_TOKEN` in that browser-visible value.

## Start locally

### One-command Docker setup

The gateway serves the website and the `/api/tts` routes together, so the
browser uses one origin and no CORS wiring is needed. From the repository root:

```sh
cp services/chatterbox/.env.example services/chatterbox/.env
cp server/.env.example server/.env
# Put the same long random CHATTERBOX_SERVICE_TOKEN in both .env files.
docker compose up --build
```

Open `http://127.0.0.1:8080`, choose `Dictation` in Settings, and press
`Play prompt`. The first model load can take a while and consumes substantial
RAM; later prompts use the in-browser and server caches.

Terminal 1, the model service:

```sh
cd services/chatterbox
python3.11 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Set the same random CHATTERBOX_SERVICE_TOKEN in .env and server/.env.
set -a; . ./.env; set +a
uvicorn app:app --host 127.0.0.1 --port 8200
```

Terminal 2, the application gateway:

```sh
cd server
cp .env.example .env
set -a; . ./.env; set +a
node index.mjs
```

The gateway now serves the repository itself at `http://127.0.0.1:8080`. If
you use a separate static server instead, configure `window.KD_TTS_API_BASE` to
point at the gateway. The features are opt-in; the rest of the app works when
the service is offline.

## Database migration

Apply `server/migrations/001_spoken_reminders.sql` to the account database.
Existing users receive disabled spoken reminders and safe model, voice,
language, and volume defaults. The current static build also persists these
preferences locally so users do not lose settings before account sync exists.

## Environment variables

The FastAPI service reads `services/chatterbox/.env.example`. The gateway reads
`server/.env.example`. Keep both service tokens identical, keep voice reference
recordings on private server storage, and restrict allowed origins to the
actual app origins.

## Checks

```sh
node --check server/index.mjs
node --test server/test/proxy.test.mjs
python3 -m compileall services/chatterbox
pytest -q services/chatterbox/tests
```

The FastAPI tests use stubs for model loading; run a real smoke test with an
installed model and approved reference audio before production rollout. Model
weights are large, first-request loading is expensive, and CPU inference is
only a development fallback. Keep the service warm and use CUDA where the
deployment permits it.
