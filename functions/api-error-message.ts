export const PAYMENT_ERROR_MESSAGE =
  "We can't process transactions right now. Please try again later.";

export const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

const SECRET_PATTERNS: RegExp[] = [
  /\b(?:sk|rk|pk)_(?:live|test)_[A-Za-z0-9*_-]+/,
  /\bwhsec_[A-Za-z0-9*_-]+/,
  /\bey[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+/,
  /\bBearer\s+[A-Za-z0-9._-]{8,}/i,
];

const INTERNAL_PATTERNS: RegExp[] = [
  /\bapi[ _-]?key\b/i,
  /\bsecret[ _-]?key\b/i,
  /\bstripe\b/i,
  /\bprisma\b/i,
  /\bsupabase\b/i,
  /\b(?:ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN)\b/,
  /internal server error/i,
  /\bat\s+\S+\s+\(?[^\s)]+:\d+:\d+\)?/,
];

const isUnsafe = (message: string): boolean =>
  SECRET_PATTERNS.some((pattern) => pattern.test(message)) ||
  INTERNAL_PATTERNS.some((pattern) => pattern.test(message));

export const redactSecrets = (value: string): string =>
  SECRET_PATTERNS.reduce(
    (acc, pattern) => acc.replace(new RegExp(pattern.source, "gi"), "[redacted]"),
    value
  );

export const toSafeApiErrorMessage = (
  message: unknown,
  path: string,
  fallback: string = GENERIC_ERROR_MESSAGE
): string => {
  const isPayment = /\/payments\b|\/membership\/(?:purchase|cancel)\b/.test(path);

  if (isPayment) return PAYMENT_ERROR_MESSAGE;

  const text = Array.isArray(message)
    ? message.filter((part) => typeof part === "string").join(", ")
    : message;

  if (typeof text !== "string" || text.trim().length === 0) {
    return fallback;
  }

  return isUnsafe(text) ? GENERIC_ERROR_MESSAGE : text;
};
