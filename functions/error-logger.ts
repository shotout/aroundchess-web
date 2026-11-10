// Sends structured logs to the backend (POST /v4/error-logs). The web
// counterpart of the mobile app's src/lib/errorLogger.ts: same endpoint, same
// payload, same codes, same message format, so both platforms read the same in
// app_error_logs. Every payload carries the same browser/app snapshot; text
// fields with no value are sent as "-" (as mobile does), numeric fields
// (opponentElo, moveCount) as null, because the backend rejects the WHOLE log
// when those are not whole numbers.
//
// Differences from mobile, all from the backend contract (FE-APP-ERROR-LOGS.md):
//   - Batched: logs are queued and sent together (up to 50 per request) every
//     few seconds, instead of one request per log. With every API call logged,
//     one request per log would hit the 120 requests/minute limit.
//   - A tab that is closed or reloaded hands what is queued to a keepalive
//     request; what can't go (offline, no session) waits in sessionStorage for
//     the next page load in the same tab.
//
// Sent with the fetch from BEFORE the app's wrappers (see installErrorLogger)
// so a log never goes back through the auth wrapper or the API tracker and
// loops on itself. Nothing here ever throws into, awaits in, or blocks the
// calling code.
//
// Usage:
//   import { logError, logSuccess } from "@/functions/error-logger";
//   logError("HINT_FAILED", err);                      // level inferred from err
//   logError("SOUND_FAILED", err, {}, "warning");
//   logError("AI_MOVE_FAILED", err, { extra: { attempts: 3 } });
//   logSuccess("LOGIN_SUCCESS", { extra: { method: "email" } });
//
// The code prefixes `message` and `extra` is appended to it as JSON:
// "HINT_FAILED: <reason> {"attempts":3}" — same as mobile.

import { useProfileStore } from "@/app/store/profile";
import { areDebugHooksAvailable } from "@/components/v2/debug-hooks";
import { isBrowserOnline } from "@/components/v2/offline-simulation";
import { redactSecrets } from "./api-error-message";

export type ErrorLogType = "error" | "success";
export type ErrorLogLevel = "fatal" | "error" | "warning" | "info";

export interface ErrorLogInput {
  message?: string | null;
  stack?: string | null;
  screen?: string | null;
  // Play vs AI extras
  gameId?: string | null;
  opponentElo?: number | null;
  fen?: string | null;
  moveCount?: number | null;
  context: { type: ErrorLogType; level: ErrorLogLevel };
  /**
   * For logs about the session itself dying (forced logout): by then the token
   * is gone or revoked and the endpoint 401s, so hold the log and send it once
   * the user logs in again.
   */
  deferUntilSession?: boolean;
}

// ── Play vs AI game snapshot ───────────────────────────────────────────────
// Attached to EVERY log while a game is open, so an engine/save error can be
// traced to the exact position. Set by PlayingPage, cleared when it unmounts.
export interface ErrorLogGameContext {
  gameId?: string | null;
  opponentElo?: number | null;
  fen?: string | null;
  moveCount?: number | null;
}
let gameContext: ErrorLogGameContext = {};

export function setErrorLogGameContext(ctx: ErrorLogGameContext): void {
  gameContext = { ...gameContext, ...ctx };
}

export function clearErrorLogGameContext(): void {
  gameContext = {};
}

// ── Constants ──────────────────────────────────────────────────────────────
const ENDPOINT_PATH = "/v4/error-logs";
const EMPTY = "-";
/** Wait this long after the first queued log before sending, to batch. */
const FLUSH_DELAY_MS = 3000;
/** …or send at once when this many are waiting. */
const FLUSH_AT = 20;
/** Backend maximum per request. */
const MAX_BATCH = 50;
/** Keep a request well under the backend's 1 MB body limit. */
const MAX_BATCH_BYTES = 512_000;
/** Newest logs kept while they can't be sent. */
const MAX_QUEUED = 200;
const MAX_ATTEMPTS = 5;
const TIMEOUT_MS = 10_000;
/** The same error fired again inside this window (a render loop) is dropped. */
const REPEAT_WINDOW_MS = 3000;
/** Browsers cap in-flight keepalive bodies at 64 KiB in total. */
const KEEPALIVE_BUDGET_BYTES = 60_000;
/** After a 404 (logging switched off on this server), stop trying for a while. */
const DISABLED_FOR_MS = 10 * 60 * 1000;
const RETRY_MIN_MS = 5000;
const RETRY_MAX_MS = 60_000;
const MAX_MESSAGE_CHARS = 4000;
/** The backend keeps 20,000, but a batch of full stacks would not fit in one request. */
const MAX_STACK_CHARS = 8000;
const PERSIST_KEY = "aroundchess:pending-error-logs";

// Stamped by next.config.js at build time.
const APP_VERSION = process.env.APP_VERSION;
const BUILD_NUMBER = process.env.APP_BUILD_NUMBER;

function endpointUrl(): string | null {
  const base = (process.env.BASE_URL || "").replace(/\/+$/, "");
  return base ? `${base}${ENDPOINT_PATH}` : null;
}

/** True for the logger's own request, which must never be logged. */
export function isErrorLogUrl(url: string): boolean {
  return url.includes(ENDPOINT_PATH);
}

// ── Small helpers ──────────────────────────────────────────────────────────
const orEmpty = (value: unknown): string => {
  if (value === null || value === undefined) return EMPTY;
  const text = String(value);
  return text.trim() === "" ? EMPTY : text;
};

/** A whole number the backend accepts (0..10000), or null. */
const orCount = (value: unknown): number | null => {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : NaN;
  if (!Number.isFinite(n)) return null;
  const whole = Math.round(n);
  return whole >= 0 && whole <= 10000 ? whole : null;
};

const clip = (value: string | null | undefined, max: number) =>
  typeof value === "string" && value.length > max ? value.slice(0, max) : value;

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/** No tokens, keys or emails in a log. */
function scrub(value: string | null | undefined): string | null | undefined {
  if (typeof value !== "string" || value === "") return value;
  try {
    return redactSecrets(value).replace(EMAIL_PATTERN, "[email]");
  } catch {
    return value;
  }
}

const errorMessage = (err: unknown): string | null => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err == null) return null;
  // ErrorEvent (a failed Worker), DOMException-likes, { message } objects.
  const message = (err as { message?: unknown })?.message;
  if (typeof message === "string" && message) return message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
};

function currentScreen(): string | null {
  try {
    return window.location.pathname || null;
  } catch {
    return null;
  }
}

// ── Browser description (computed once) ────────────────────────────────────
interface ClientInfo {
  osVersion: string | null;
  deviceModel: string | null;
}
let clientInfo: ClientInfo | null = null;

function parseOs(ua: string): string | null {
  let m: RegExpMatchArray | null;
  if ((m = ua.match(/Windows NT ([\d.]+)/))) return `Windows NT ${m[1]}`;
  if ((m = ua.match(/Android ([\d.]+)/))) return `Android ${m[1]}`;
  if ((m = ua.match(/(?:iPhone|iPad|iPod)[^)]*? OS ([\d_]+)/)))
    return `iOS ${m[1].replace(/_/g, ".")}`;
  if ((m = ua.match(/Mac OS X ([\d_.]+)/)))
    return `macOS ${m[1].replace(/_/g, ".")}`;
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";
  return null;
}

// Order matters: in-app browsers and Chromium forks also say "Chrome"/"Safari".
const BROWSERS: [RegExp, string][] = [
  [/\bFB(?:AN|AV)\b/, "Facebook in-app"],
  [/Instagram (\d+)/, "Instagram in-app"],
  [/\bTikTok\b|musical_ly/, "TikTok in-app"],
  [/Edg(?:e|A|iOS)?\/(\d+)/, "Edge"],
  [/OPR\/(\d+)/, "Opera"],
  [/SamsungBrowser\/(\d+)/, "Samsung Internet"],
  [/FxiOS\/(\d+)/, "Firefox"],
  [/Firefox\/(\d+)/, "Firefox"],
  [/CriOS\/(\d+)/, "Chrome"],
  [/Chrome\/(\d+)/, "Chrome"],
  [/Version\/(\d+)\S* (?:Mobile\/\S+ )?Safari\//, "Safari"],
];

function parseBrowser(ua: string): string | null {
  for (const [pattern, name] of BROWSERS) {
    const m = ua.match(pattern);
    if (m) return m[1] ? `${name} ${m[1]}` : name;
  }
  return null;
}

function parseDevice(ua: string): string {
  if (/iPad/.test(ua)) return "iPad";
  // iPadOS asks for the desktop site and reports itself as a Mac.
  if (/Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1) return "iPad";
  if (/iPhone|iPod/.test(ua)) return "iPhone";
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? "Android phone" : "Android tablet";
  return /Mobi/.test(ua) ? "mobile" : "desktop";
}

function describeClient(): ClientInfo {
  if (clientInfo) return clientInfo;
  let osVersion: string | null = null;
  let deviceModel: string | null = null;
  try {
    const ua = navigator.userAgent || "";
    osVersion = parseOs(ua);
    deviceModel =
      [parseBrowser(ua), parseDevice(ua)].filter(Boolean).join(" · ") || null;
  } catch {
    // Leave both unknown.
  }
  clientInfo = { osVersion, deviceModel };
  return clientInfo;
}

// ── Session ────────────────────────────────────────────────────────────────
interface Session {
  token: string;
  /** The token's `sub`: the same account across token refreshes. */
  userId: string | null;
}

let lastDecoded: { token: string; userId: string | null } | null = null;

function tokenSubject(token: string): string | null {
  if (lastDecoded?.token === token) return lastDecoded.userId;
  let userId: string | null = null;
  try {
    const payload = token.split(".")[1];
    if (payload) {
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "="
      );
      const sub = JSON.parse(atob(padded))?.sub;
      userId = typeof sub === "string" && sub ? sub : null;
    }
  } catch {
    userId = null;
  }
  lastDecoded = { token, userId };
  return userId;
}

function sessionFor(token: unknown): Session | null {
  return typeof token === "string" && token
    ? { token, userId: tokenSubject(token) }
    : null;
}

function currentSession(): Session | null {
  try {
    return sessionFor(useProfileStore.getState().sessionId);
  } catch {
    return null;
  }
}

/**
 * Level for a failed request, so the dashboard can tell "the user typed the
 * wrong password" apart from "the server is broken":
 *   - no response (offline / DNS / timeout) → 'warning' (device-side)
 *   - 4xx (bad credentials, not found, validation, 429) → 'warning'
 *   - 5xx, or anything unexpected → 'error'
 * `status` may be the HTTP status OR the backend's body `statusCode` — the BE
 * answers many business failures with HTTP 200 + {success:false, statusCode}.
 */
export function levelForStatus(
  status?: number | null,
  opts?: { noResponse?: boolean }
): ErrorLogLevel {
  if (opts?.noResponse) return "warning";
  if (typeof status === "number" && status >= 400 && status < 500) {
    return "warning";
  }
  return "error";
}

// ── Queue ──────────────────────────────────────────────────────────────────
// A log that can't be delivered yet is held here instead of dropped:
//   - no connection / timeout / 5xx / 429 → retried later, with backoff
//   - 401 (token expired, refresh pending) → retried when a new token lands
//   - `deferUntilSession` logs with no usable token → sent after the next login
// A log is only ever sent under the account it was fired under (a log fired
// while logged out goes with whoever is logged in when it is sent, as on
// mobile). Logs fired with no session are dropped at send time if there is
// still none, unless they asked to wait for it.
type LogBody = Record<string, unknown>;

interface QueuedLog {
  body: LogBody;
  /** JSON length of `body`, to size batches. */
  size: number;
  defer: boolean;
  userId: string | null;
  attempts: number;
}

let queue: QueuedLog[] = [];
let flushing = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushDueAt = 0;
/** Backoff after 429 / 5xx / network failures. */
let pausedUntil = 0;
let retryDelayMs = RETRY_MIN_MS;
/** The token the last 401 came back for — not retried until it changes. */
let rejectedToken: string | null = null;
/** After a 404: logging is switched off on this server. */
let disabledUntil = 0;
/** Halved after a 413 until a request goes through. */
let batchLimit = MAX_BATCH;

/** Set by installErrorLogger: the fetch from before the app's wrappers. */
let baseFetch: typeof fetch | null = null;

function trimQueue() {
  if (queue.length > MAX_QUEUED) queue = queue.slice(-MAX_QUEUED);
}

function scheduleFlush(delayMs: number) {
  if (typeof window === "undefined") return;
  const dueAt = Date.now() + delayMs;
  if (flushTimer !== null && flushDueAt <= dueAt) return;
  if (flushTimer !== null) clearTimeout(flushTimer);
  flushDueAt = dueAt;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, Math.max(0, delayMs));
}

function enqueue(entry: QueuedLog) {
  queue.push(entry);
  trimQueue();
  scheduleFlush(queue.length >= FLUSH_AT ? 0 : FLUSH_DELAY_MS);
}

/** Drops what can never be sent under `session`; returns what is left. */
function pruneFor(session: Session | null) {
  queue = session
    ? // Never file one account's logs under another.
      queue.filter((e) => e.defer || !e.userId || e.userId === session.userId)
    : // Nobody to file them under: only logs that asked to wait survive.
      queue.filter((e) => e.defer);
}

/** JSON length of a batch as sent: "[a,b,c]". */
const batchBytes = (batch: QueuedLog[]) =>
  batch.reduce((sum, e) => sum + e.size + 1, 1);

/** Takes the next batch off the front of the queue. */
function takeBatch(maxBytes = MAX_BATCH_BYTES): QueuedLog[] {
  const batch: QueuedLog[] = [];
  let bytes = 2; // "[]"
  while (queue.length > 0 && batch.length < batchLimit) {
    const next = queue[0];
    if (bytes + next.size + 1 > maxBytes) {
      // A single log bigger than a whole request can never be sent; skip it
      // rather than stalling everything behind it.
      if (batch.length === 0 && maxBytes >= MAX_BATCH_BYTES) {
        queue.shift();
        continue;
      }
      break;
    }
    batch.push(next);
    bytes += next.size + 1;
    queue.shift();
  }
  return batch;
}

/** Puts a batch back at the front, counting the attempt. */
function requeue(batch: QueuedLog[], countAttempt = true) {
  const kept = batch
    .map((e) => (countAttempt ? { ...e, attempts: e.attempts + 1 } : e))
    .filter((e) => e.attempts < MAX_ATTEMPTS);
  queue = [...kept, ...queue];
  trimQueue();
}

type Outcome =
  | "sent"
  | "drop" // 400: sending it again fails the same way
  | "unauthorized" // 401
  | "disabled" // 404: logging is off on this server
  | "split" // 413: too large
  | "throttled" // 429
  | "later"; // 5xx / network / timeout

async function postBatch(
  url: string,
  batch: QueuedLog[],
  token: string,
  keepalive: boolean
): Promise<Outcome> {
  if (!baseFetch) return "later";
  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller
    ? setTimeout(() => controller.abort(), TIMEOUT_MS)
    : null;
  try {
    const res = await baseFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(batch.map((e) => e.body)),
      keepalive,
      signal: controller?.signal,
    });
    if (res.ok) {
      // 201 can still list logs the backend refused — say so in the console.
      res
        .json()
        .then((data: any) => {
          const rejected = data?.data?.rejected;
          if (Array.isArray(rejected) && rejected.length > 0) {
            console.warn("[errorLogger] logs rejected:", rejected);
          }
        })
        .catch(() => {});
      return "sent";
    }
    if (res.status === 401) return "unauthorized";
    if (res.status === 404) return "disabled";
    if (res.status === 413) return "split";
    if (res.status === 429) return "throttled";
    if (res.status >= 500) return "later";
    const reason = await res.text().catch(() => "");
    console.warn("[errorLogger] logs rejected:", res.status, reason.slice(0, 500));
    return "drop";
  } catch {
    // Offline / DNS / timeout — the request never reached the server.
    return "later";
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Applies a send's outcome to the batch it was for. Returns true to keep going. */
function settle(batch: QueuedLog[], outcome: Outcome, token: string): boolean {
  switch (outcome) {
    case "sent":
      retryDelayMs = RETRY_MIN_MS;
      batchLimit = MAX_BATCH;
      return true;
    case "drop":
      return true;
    case "disabled":
      disabledUntil = Date.now() + DISABLED_FOR_MS;
      queue = [];
      return false;
    case "split":
      if (batch.length > 1) {
        batchLimit = Math.max(1, Math.floor(batch.length / 2));
        requeue(batch, false);
      }
      return true;
    case "unauthorized":
      rejectedToken = token;
      requeue(batch);
      return false;
    case "throttled":
      pausedUntil = Date.now() + RETRY_MAX_MS;
      requeue(batch);
      return false;
    case "later":
    default:
      pausedUntil = Date.now() + retryDelayMs;
      retryDelayMs = Math.min(retryDelayMs * 2, RETRY_MAX_MS);
      requeue(batch);
      return false;
  }
}

/** Whether a send may be attempted now; null when it may not. */
function readyToSend(override?: Session | null): { session: Session; url: string } | null {
  if (!baseFetch) return null;
  const url = endpointUrl();
  if (!url) {
    queue = [];
    return null;
  }
  const now = Date.now();
  if (now < disabledUntil) {
    queue = [];
    return null;
  }
  const session = override ?? currentSession();
  pruneFor(session);
  if (!session || queue.length === 0) return null;
  if (session.token === rejectedToken) return null; // wait for a new token
  if (now < pausedUntil) {
    scheduleFlush(pausedUntil - now);
    return null;
  }
  if (!isBrowserOnline()) return null; // the "online" listener flushes
  return { session, url };
}

/** Sends everything that can go now. Never throws. */
async function flush(override?: Session | null): Promise<void> {
  if (flushing || queue.length === 0) return;
  flushing = true;
  try {
    const ready = readyToSend(override);
    if (!ready) return;
    while (queue.length > 0) {
      const batch = takeBatch();
      if (batch.length === 0) break;
      const outcome = await postBatch(ready.url, batch, ready.session.token, false);
      if (!settle(batch, outcome, ready.session.token)) break;
    }
  } catch (err) {
    console.warn("[errorLogger] flush failed:", err);
  } finally {
    flushing = false;
  }
  // Whatever is left goes on the next pass: after the backoff, if one is
  // running. A 401 waits for a new token and offline waits for "online"
  // instead — both have their own triggers.
  if (queue.length > 0 && isBrowserOnline()) {
    const session = currentSession();
    if (session && session.token !== rejectedToken) {
      scheduleFlush(Math.max(FLUSH_DELAY_MS, pausedUntil - Date.now()));
    }
  }
}

// ── Page exit ──────────────────────────────────────────────────────────────
function persistQueue() {
  try {
    if (queue.length === 0) sessionStorage.removeItem(PERSIST_KEY);
    else sessionStorage.setItem(PERSIST_KEY, JSON.stringify(queue));
  } catch {
    // Storage blocked or full: those logs are lost with the page.
  }
}

function clearPersisted() {
  try {
    sessionStorage.removeItem(PERSIST_KEY);
  } catch {
    // Nothing to clear.
  }
}

function restorePersisted() {
  try {
    const raw = sessionStorage.getItem(PERSIST_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PERSIST_KEY);
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) return;
    const valid = saved.filter(
      (e: any): e is QueuedLog =>
        e &&
        typeof e === "object" &&
        e.body &&
        typeof e.body === "object" &&
        typeof e.body.message === "string" &&
        typeof e.size === "number"
    );
    if (valid.length === 0) return;
    queue = [...valid, ...queue];
    trimQueue();
    scheduleFlush(FLUSH_DELAY_MS);
  } catch {
    // A corrupt entry is just dropped.
  }
}

/**
 * The tab is being hidden, closed or reloaded: hand what fits to a keepalive
 * request (it outlives the page), and keep the rest in sessionStorage for the
 * next load in this tab. If the page comes back instead, memory stays the
 * source of truth and the stored copy is dropped.
 */
let keepaliveBytesInFlight = 0;

function flushOnExit() {
  try {
    if (queue.length === 0) {
      clearPersisted();
      return;
    }
    const ready = readyToSend();
    // "hidden" and then "pagehide" usually fire back to back, and the 64 KiB
    // keepalive cap is shared by every request still in flight.
    const budget = KEEPALIVE_BUDGET_BYTES - keepaliveBytesInFlight;
    if (ready && budget > 1024) {
      const batch = takeBatch(budget);
      if (batch.length > 0) {
        const { url, session } = ready;
        const bytes = batchBytes(batch);
        keepaliveBytesInFlight += bytes;
        postBatch(url, batch, session.token, true)
          .then((outcome) => {
            settle(batch, outcome, session.token);
          })
          .catch(() => {})
          .finally(() => {
            keepaliveBytesInFlight = Math.max(0, keepaliveBytesInFlight - bytes);
          });
      }
    }
    persistQueue();
  } catch {
    // never throw from logging
  }
}

// ── Public API ─────────────────────────────────────────────────────────────
const recentErrors = new Map<string, number>();

/** "Don't spam repeats": the same error inside REPEAT_WINDOW_MS goes once. */
function isRepeat(input: ErrorLogInput): boolean {
  if (input.context.type !== "error") return false;
  const key = `${input.context.level}|${input.message ?? ""}`;
  const now = Date.now();
  const last = recentErrors.get(key);
  if (last !== undefined && now - last < REPEAT_WINDOW_MS) return true;
  recentErrors.set(key, now);
  if (recentErrors.size > 200) {
    recentErrors.forEach((at, k) => {
      if (now - at >= REPEAT_WINDOW_MS) recentErrors.delete(k);
    });
    if (recentErrors.size > 200) recentErrors.clear();
  }
  return false;
}

/** Queue one log. Fire-and-forget: never awaits, never throws. */
export function sendErrorLog(input: ErrorLogInput): void {
  try {
    if (typeof window === "undefined") return;
    if (Date.now() < disabledUntil) return;
    if (isRepeat(input)) return;

    const client = describeClient();
    const body: LogBody = {
      platform: "web",
      osVersion: orEmpty(client.osVersion),
      appVersion: orEmpty(APP_VERSION),
      buildNumber: orEmpty(BUILD_NUMBER),
      deviceModel: orEmpty(client.deviceModel),
      screen: orEmpty(input.screen || currentScreen()),
      isOnline: isBrowserOnline(),
      occurredAt: new Date().toISOString(),
      message: orEmpty(clip(scrub(input.message), MAX_MESSAGE_CHARS)),
      stack: orEmpty(clip(scrub(input.stack), MAX_STACK_CHARS)),
      gameId: orEmpty(input.gameId ?? gameContext.gameId),
      // Numeric columns: the BE rejects the WHOLE log with 400 when these are
      // not whole numbers 0..10000, so anything else goes as null.
      opponentElo: orCount(input.opponentElo ?? gameContext.opponentElo),
      fen: orEmpty(input.fen ?? gameContext.fen),
      moveCount: orCount(input.moveCount ?? gameContext.moveCount),
      context: { type: input.context.type, level: input.context.level },
    };

    enqueue({
      body,
      size: JSON.stringify(body).length,
      defer: !!input.deferUntilSession,
      userId: currentSession()?.userId ?? null,
      attempts: 0,
    });
  } catch (err) {
    // Never let a failed log crash or block the app.
    console.warn("[errorLogger] failed to queue log:", err);
  }
}

/**
 * Level for a logError call that didn't pass one, so call sites that only say
 * "this failed" still get a level that matches the cause:
 *   - a Response / { status } → by HTTP status (4xx → 'warning', 5xx → 'error')
 *   - fetch network failure / abort / timeout → 'warning'
 *   - no exception but `extra.status` given → by that status
 *   - anything else (a real bug / unexpected state) → 'error'
 */
function inferLevel(
  err: unknown,
  extra?: Record<string, unknown>
): ErrorLogLevel {
  const e = err as any;
  if (e && typeof e === "object") {
    if (typeof e.status === "number") return levelForStatus(e.status);
    if (
      e.name === "AbortError" ||
      e.name === "TimeoutError" ||
      /failed to fetch|networkerror|network error|load failed/i.test(
        String(e.message ?? "")
      )
    ) {
      return "warning";
    }
  }
  if (err == null && typeof extra?.status === "number") {
    return levelForStatus(extra.status);
  }
  return "error";
}

type LogOptions = Omit<ErrorLogInput, "context" | "message" | "stack"> & {
  message?: string;
  extra?: Record<string, unknown>;
};

/**
 * Log one failure. `err` may be anything thrown/rejected (or null for a
 * condition that isn't an exception, e.g. a timeout). Without an explicit
 * `level`, it's inferred from `err` (see inferLevel).
 * Fire-and-forget: never awaits, never throws.
 */
export function logError(
  code: string,
  err?: unknown,
  options: LogOptions = {},
  explicitLevel?: ErrorLogLevel
): void {
  try {
    const { message, extra, ...rest } = options;
    const level = explicitLevel ?? inferLevel(err, extra);
    const reason = errorMessage(err);
    let text = [code, message, reason].filter(Boolean).join(": ");
    if (extra && Object.keys(extra).length > 0) {
      text += ` ${errorMessage(extra)}`;
    }
    const stack = (err as { stack?: unknown } | null)?.stack;
    sendErrorLog({
      ...rest,
      message: text,
      stack: typeof stack === "string" ? stack : null,
      context: { type: "error", level },
    });
  } catch {
    // never throw from logging
  }
}

/**
 * Positive counterpart of logError: marks a flow that completed (e.g.
 * 'LOGIN_SUCCESS'), so the backend shows what worked and not only what
 * failed. Sent as type 'success', level 'info'.
 * Fire-and-forget: never awaits, never throws.
 */
export function logSuccess(code: string, options: LogOptions = {}): void {
  try {
    const { message, extra, ...rest } = options;
    let text = [code, message].filter(Boolean).join(": ");
    if (extra && Object.keys(extra).length > 0) {
      text += ` ${errorMessage(extra)}`;
    }
    sendErrorLog({
      ...rest,
      message: text,
      context: { type: "success", level: "info" },
    });
  } catch {
    // never throw from logging
  }
}

// ── API call tracking ──────────────────────────────────────────────────────
// Every request to the backend (and to this site's own /api routes) is logged
// as API_SUCCESS / API_ERROR, the way mobile's axios interceptor does:
//   "API_SUCCESS: GET /profile → 200"
//   "API_ERROR: POST /auth/login → 401: Your password is incorrect"
// The backend answers many business failures with HTTP 200 +
// {success:false, statusCode}, so the head of a JSON response is read from a
// clone to tell those apart. The caller's response is never touched.
const API_BASES = [process.env.BASE_URL, process.env.NEXT_PUBLIC_BASE_URL]
  .filter((base): base is string => typeof base === "string" && base.length > 0)
  .map((base) => base.replace(/\/+$/, ""));

/** Bytes of a response read to find {success, message, statusCode}. */
const PEEK_BYTES = 8192;
const MAX_API_MESSAGE_CHARS = 500;

/** "GET /profile" for a request worth logging, null for anything else. */
function apiCallLabel(input: RequestInfo | URL, init?: RequestInit): string | null {
  const raw =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : (input as Request)?.url;
  if (!raw) return null;
  const url = new URL(raw, window.location.href);
  if (isErrorLogUrl(url.pathname)) return null; // never log the logger
  const method = (
    init?.method ||
    (typeof input === "object" && !(input instanceof URL)
      ? (input as Request).method
      : "") ||
    "GET"
  ).toUpperCase();
  // Query strings dropped: they can carry emails, codes or cache-busters.
  const href = url.origin + url.pathname;
  for (const base of API_BASES) {
    if (href === base || href.startsWith(`${base}/`)) {
      return `${method} ${href.slice(base.length) || "/"}`;
    }
  }
  if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) {
    return `${method} ${url.pathname}`;
  }
  return null;
}

interface PeekedBody {
  success?: boolean;
  statusCode?: number;
  message?: string;
}

const messageText = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const parts = value.filter((part) => typeof part === "string");
    return parts.length ? parts.join(", ") : undefined;
  }
  return undefined;
};

/** Reads up to `limit` bytes of a (cloned) response, then lets the rest go. */
async function readHead(
  res: Response,
  limit: number
): Promise<{ text: string; complete: boolean }> {
  const reader = res.body!.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let complete = false;
  try {
    while (size < limit) {
      const { done, value } = await reader.read();
      if (done) {
        complete = true;
        break;
      }
      if (value) {
        chunks.push(value);
        size += value.byteLength;
      }
    }
  } finally {
    if (!complete) reader.cancel().catch(() => {});
  }
  const merged = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { text: new TextDecoder().decode(merged), complete };
}

function parsePeek({ text, complete }: { text: string; complete: boolean }): PeekedBody {
  if (complete) {
    try {
      const data = JSON.parse(text);
      if (data && typeof data === "object" && !Array.isArray(data)) {
        return {
          success: typeof data.success === "boolean" ? data.success : undefined,
          statusCode: Number.isInteger(data.statusCode) ? data.statusCode : undefined,
          message: messageText(data.message ?? data.error),
        };
      }
      return {};
    } catch {
      // Not JSON after all; fall through to the envelope match.
    }
  }
  // Truncated: trust only the API's envelope, which starts {"success":…,"message":…}.
  const head = text.match(
    /^\s*\{\s*"success"\s*:\s*(true|false)\s*(?:,\s*"message"\s*:\s*("(?:[^"\\]|\\.)*"))?/
  );
  if (!head) return {};
  let message: string | undefined;
  try {
    message = head[2] ? JSON.parse(head[2]) : undefined;
  } catch {
    message = undefined;
  }
  return { success: head[1] === "true", message };
}

/** The head of a JSON response, from a clone. Resolves null when not readable. */
function peekJson(response: Response): Promise<PeekedBody | null> {
  let clone: Response;
  try {
    const type = response.headers.get("content-type") || "";
    if (!/json/i.test(type) || !response.body || response.bodyUsed) {
      return Promise.resolve(null);
    }
    clone = response.clone();
  } catch {
    return Promise.resolve(null);
  }
  return readHead(clone, PEEK_BYTES)
    .then(parsePeek)
    .catch(() => null);
}

const apiMessage = (value: unknown) =>
  clip(messageText(value) ?? "-", MAX_API_MESSAGE_CHARS);

function logApiResponse(label: string, response: Response) {
  const status = response.status;
  const screen = currentScreen();
  // Clone synchronously, before the caller can start reading the body.
  const peeked = peekJson(response);
  peeked
    .then((body) => {
      if (!response.ok) {
        sendErrorLog({
          screen,
          message: `API_ERROR: ${label} → ${status}: ${apiMessage(
            body?.message ?? response.statusText
          )}`,
          context: { type: "error", level: levelForStatus(status) },
        });
      } else if (body?.success === false) {
        const bodyStatus = body.statusCode ?? status;
        sendErrorLog({
          screen,
          message: `API_ERROR: ${label} → ${bodyStatus}: ${apiMessage(body.message)}`,
          context: { type: "error", level: levelForStatus(bodyStatus) },
        });
      } else {
        sendErrorLog({
          screen,
          message: `API_SUCCESS: ${label} → ${status}`,
          context: { type: "success", level: "info" },
        });
      }
    })
    .catch(() => {});
}

function logApiFailure(label: string, error: unknown) {
  const name = (error as { name?: unknown } | null)?.name;
  const aborted = name === "AbortError" || name === "TimeoutError";
  const stack = (error as { stack?: unknown } | null)?.stack;
  sendErrorLog({
    message: `API_ERROR: ${label} → ${aborted ? "ABORTED" : "NO_RESPONSE"}: ${
      errorMessage(error) ?? "-"
    }`,
    stack: typeof stack === "string" ? stack : null,
    context: { type: "error", level: levelForStatus(null, { noResponse: true }) },
  });
}

/** Wraps window.fetch (outermost) to log each API call. Behaviour is unchanged:
 *  the same response is returned and the same error rethrown. */
function installApiTracking() {
  const inner = window.fetch.bind(window);
  const tracked = async (input: RequestInfo | URL, init?: RequestInit) => {
    let label: string | null = null;
    try {
      label = apiCallLabel(input, init);
    } catch {
      label = null;
    }
    if (!label) return inner(input, init);

    let response: Response;
    try {
      response = await inner(input, init);
    } catch (error) {
      try {
        logApiFailure(label, error);
      } catch {
        // never let logging change what the caller sees
      }
      throw error;
    }
    try {
      logApiResponse(label, response);
    } catch {
      // same
    }
    return response;
  };
  window.fetch = tracked as typeof window.fetch;
}

// ── Install ────────────────────────────────────────────────────────────────
const INSTALLED_FLAG = "__aroundchessErrorLoggerInstalled";
/** Set by install-auth-fetch: window.fetch as it was before the auth wrapper. */
const ORIGINAL_FETCH_KEY = "__aroundchessOriginalFetch";

/**
 * Global capture, once per page: uncaught errors, unhandled rejections, every
 * API call, and the flush triggers (timer, new token, back online, tab
 * hidden/closed). Must run AFTER install-auth-fetch so the API tracker wraps
 * it and the logger's own requests bypass both.
 */
export function installErrorLogger(): void {
  if (typeof window === "undefined") return;
  const globals = window as unknown as Record<string, unknown>;
  if (globals[INSTALLED_FLAG]) return;
  globals[INSTALLED_FLAG] = true;

  try {
    const original = globals[ORIGINAL_FETCH_KEY];
    baseFetch =
      typeof original === "function"
        ? (original as typeof fetch)
        : window.fetch.bind(window);
  } catch {
    baseFetch = null;
  }

  try {
    installApiTracking();
  } catch (err) {
    console.warn("[errorLogger] API tracking not installed:", err);
  }

  // Uncaught errors. Resource load failures (<img>, <script>) don't bubble, so
  // only script errors land here. Not prevented: the console, Sentry and the
  // browser still see them exactly as before.
  window.addEventListener("error", (event: ErrorEvent) => {
    try {
      const where = event.filename
        ? `${event.filename}:${event.lineno}:${event.colno}`
        : null;
      logError(
        "JS_FATAL",
        event.error ?? event.message,
        { extra: { isFatal: false, ...(where ? { source: where } : {}) } },
        "error"
      );
    } catch {
      // never throw from logging
    }
  });

  window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    try {
      logError("UNHANDLED_REJECTION", event.reason);
    } catch {
      // never throw from logging
    }
  });

  window.addEventListener("online", () => scheduleFlush(0));
  window.addEventListener("pagehide", flushOnExit);
  window.addEventListener("pageshow", clearPersisted);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushOnExit();
    else clearPersisted();
  });

  try {
    useProfileStore.subscribe((state, prev) => {
      const next = state.sessionId;
      const before = prev.sessionId;
      if (next === before) return;
      if (next) {
        // Login or refresh: whatever waited for a token can go now.
        scheduleFlush(0);
      } else if (before) {
        // Logout, by any path (sign-out button, forced, account deletion,
        // password change): record it, and send what this account queued
        // while its token may still work.
        logSuccess("SESSION_ENDED");
        void flush(sessionFor(before));
      }
    });
  } catch {
    // Without it, logs still go on the timer.
  }

  restorePersisted();

  // Dev / QA hook (same flag as __offline / __nps): fire logs by hand from the
  // console, e.g.
  //   __errorLogger.logError('TEST_LOG', new Error('boom'), {}, 'warning')
  //   __errorLogger.logSuccess('TEST_LOG')
  //   __errorLogger.flush()
  // Needs a logged-in session — the endpoint 401s without a token.
  if (areDebugHooksAvailable()) {
    globals.__errorLogger = {
      logError,
      logSuccess,
      flush: () => flush(),
      pending: () => queue.length,
    };
  }
}
