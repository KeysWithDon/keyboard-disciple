import http from "node:http";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 8080);
const BACKEND_URL = String(process.env.CHATTERBOX_BACKEND_URL || "http://127.0.0.1:8200").replace(/\/$/, "");
const SERVICE_TOKEN = String(process.env.CHATTERBOX_SERVICE_TOKEN || "");
const USER_HEADER = String(process.env.KD_USER_HEADER || "x-user-id").toLowerCase();
const REQUIRE_APP_AUTH = String(process.env.KD_REQUIRE_APP_AUTH || "false").toLowerCase() === "true";
const ALLOWED_ORIGIN = String(process.env.KD_ALLOWED_ORIGIN || "");
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = Math.max(1, Number(process.env.KD_TTS_RATE_LIMIT || 60));
const RATE_WINDOW_MS = 60_000;
const requestBuckets = new Map();

export function normalizeApiPath(url) {
  const parsed = new URL(url, "http://localhost");
  if (!parsed.pathname.startsWith("/api/tts/")) return null;
  const route = parsed.pathname.slice("/api/tts".length);
  if (!["/health", "/models", "/voices", "/synthesize"].includes(route)) return null;
  return `${route}${parsed.search}`;
}

function clientAddress(request) {
  return String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "anonymous").split(",")[0];
}

function rateAllowed(request) {
  const id = clientAddress(request);
  const now = Date.now();
  const bucket = requestBuckets.get(id) || [];
  const active = bucket.filter(timestamp => now - timestamp < RATE_WINDOW_MS);
  if (active.length >= RATE_LIMIT) {
    requestBuckets.set(id, active);
    return false;
  }
  active.push(now);
  requestBuckets.set(id, active);
  if (requestBuckets.size > 2000) {
    for (const [key, values] of requestBuckets) {
      if (!values.some(timestamp => now - timestamp < RATE_WINDOW_MS)) requestBuckets.delete(key);
    }
  }
  return true;
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("request-too-large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function writeJson(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...(ALLOWED_ORIGIN ? { "access-control-allow-origin": ALLOWED_ORIGIN, "access-control-allow-credentials": "true" } : {}),
  });
  response.end(JSON.stringify(body));
}

async function proxy(request, response, route) {
  if (REQUIRE_APP_AUTH && !request.headers[USER_HEADER]) {
    writeJson(response, 401, { error: "Authentication required." });
    return;
  }
  const headers = { accept: request.headers.accept || "application/json" };
  if (SERVICE_TOKEN) headers.authorization = `Bearer ${SERVICE_TOKEN}`;
  const userId = request.headers[USER_HEADER] || clientAddress(request);
  headers["x-kd-user-id"] = String(userId).slice(0, 160);
  let body;
  if (request.method === "POST") {
    try {
      body = await readBody(request);
    } catch (error) {
      writeJson(response, error.message === "request-too-large" ? 413 : 400, { error: "Request body could not be read." });
      return;
    }
    headers["content-type"] = request.headers["content-type"] || "application/json";
  }
  try {
    const upstream = await fetch(`${BACKEND_URL}${route}`, { method: request.method, headers, body });
    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const data = Buffer.from(await upstream.arrayBuffer());
    response.writeHead(upstream.status, {
      "content-type": contentType,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...(ALLOWED_ORIGIN ? { "access-control-allow-origin": ALLOWED_ORIGIN, "access-control-allow-credentials": "true" } : {}),
    });
    response.end(data);
  } catch (error) {
    console.error("Chatterbox gateway request failed:", error.message);
    writeJson(response, 502, { error: "Spoken reminders are temporarily unavailable." });
  }
}

export const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS" && normalizeApiPath(request.url || "/")) {
    response.writeHead(204, {
      ...(ALLOWED_ORIGIN ? { "access-control-allow-origin": ALLOWED_ORIGIN, "access-control-allow-credentials": "true" } : {}),
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "Content-Type, Authorization, X-User-Id",
    });
    response.end();
    return;
  }
  if (!rateAllowed(request)) {
    writeJson(response, 429, { error: "Too many speech requests." });
    return;
  }
  const route = normalizeApiPath(request.url || "/");
  if (!route || !["GET", "POST"].includes(request.method)) {
    writeJson(response, 404, { error: "Not found." });
    return;
  }
  await proxy(request, response, route);
});

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  server.listen(PORT, () => console.log(`Keyboard Disciple TTS gateway listening on http://127.0.0.1:${PORT}`));
}
