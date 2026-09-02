

/** Replacement for a leaky message on a payment endpoint. */
export const PAYMENT_ERROR_MESSAGE =
  "We can't process transactions right now. Please try again later.";

/** Replacement for a leaky message on any other endpoint. */
export const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

/**
 * Credential shapes that must never reach the UI: Stripe secret / restricted /
 * publishable keys and webhook secrets, JWTs, bearer tokens. Providers often
 * mask the middle of a key, so the character classes allow `*`.
 */
const SECRET_PATTERNS: RegExp[] = [
  /\b(?:sk|rk|pk)_(?:live|test)_[A-Za-z0-9*_-]+/,
  /\bwhsec_[A-Za-z0-9*_-]+/,
  /\bey[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+/,
  /\bBearer\s+[A-Za-z0-9._-]{8,}/i,
];

/**
 * Server- and provider-side failures. Nothing here is actionable for a user and
 * the wording quotes internals (key names, table names, stack frames), so the
 * whole message is replaced rather than patched up.
 */
const INTERNAL_PATTERNS: RegExp[] = [
  /\bapi[ _-]?key\b/i,
  /\bsecret[ _-]?key\b/i,
  /\bstripe\b/i,
  /\bprisma\b/i,
  /\bsupabase\b/i,
  /\b(?:ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN)\b/,
  /internal server error/i,
  /\bat\s+\S+\s+\(?[^\s)]+:\d+:\d+\)?/, // a stack frame leaked into the message
];

/** True when `message` exposes a credential or a server-side internal. */
const isUnsafe = (message: string): boolean =>
  SECRET_PATTERNS.some((pattern) => pattern.test(message)) ||
  INTERNAL_PATTERNS.some((pattern) => pattern.test(message));

/** Replaces credential-looking substrings so a value is safe to log. */
export const redactSecrets = (value: string): string =>
  SECRET_PATTERNS.reduce(
    (acc, pattern) => acc.replace(new RegExp(pattern.source, "gi"), "[redacted]"),
    value
  );

/**
 * The message to show for a failed request to `path`. Payment endpoints get the
 * transaction wording, everything else the generic line.
 */
export const toSafeApiErrorMessage = (
  message: unknown,
  path: string,
  fallback: string = GENERIC_ERROR_MESSAGE
): string => {
  // Only the endpoints that actually move money — a failed /membership/packages
  // fetch is not a transaction and shouldn't be described as one.
  const isPayment = /\/payments\b|\/membership\/(?:purchase|cancel)\b/.test(path);

  // Payment failures never pass through. They all originate server-side (keys,
  // products, coupons) so none of the wording helps a user, and pattern-matching
  // each new variant of "No such <internal>" is a losing game. Card declines
  // happen on Stripe's own page, not here, so nothing actionable is lost.
  if (isPayment) return PAYMENT_ERROR_MESSAGE;

  // Validation failures arrive as `message: string[]`; `new Error(array)` used to
  // stringify them, so join rather than discarding real feedback like
  // "email must be an email".
  const text = Array.isArray(message)
    ? message.filter((part) => typeof part === "string").join(", ")
    : message;

  if (typeof text !== "string" || text.trim().length === 0) {
    return fallback;
  }

  return isUnsafe(text) ? GENERIC_ERROR_MESSAGE : text;
};
