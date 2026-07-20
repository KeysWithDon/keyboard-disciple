import test from "node:test";
import assert from "node:assert/strict";
import { normalizeApiPath, staticFilePath } from "../index.mjs";

test("gateway accepts only the four TTS routes", () => {
  assert.equal(normalizeApiPath("/api/tts/health"), "/health");
  assert.equal(normalizeApiPath("/api/tts/voices?model=chatterbox-english"), "/voices?model=chatterbox-english");
  assert.equal(normalizeApiPath("/api/tts/synthesize"), "/synthesize");
  assert.equal(normalizeApiPath("/api/tts/../../etc/passwd"), null);
  assert.equal(normalizeApiPath("/api/files"), null);
});

test("gateway serves the app shell without exposing server files", () => {
  assert.match(staticFilePath("/") || "", /[\\/]index\.html$/);
  assert.match(staticFilePath("/assets/keyboard-disciple-logo.png") || "", /[\\/]assets[\\/]keyboard-disciple-logo\.png$/);
  assert.equal(staticFilePath("/assets/../server/index.mjs"), null);
  assert.equal(staticFilePath("/server/index.mjs"), null);
});
