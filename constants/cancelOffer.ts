/** `?cancel_offer` — opens the resubscribe banner on any page for a signed-in
 *  user (e.g. `/profile?cancel_offer` from the "subscription cancelled" email).
 *  Any value, or none, works. */
export const CANCEL_OFFER_QUERY_PARAM = "cancel_offer";

/**
 * Keeps the banner pending until it has been shown to a signed-in user. Set by
 * the banner host when it reads the param, and by the middleware when a
 * signed-out visitor to a protected page is bounced to /login (the redirect
 * drops the query string). A cookie rather than storage so it survives the
 * OAuth round trip and is readable on both sides. Not httpOnly — the client
 * clears it once shown.
 */
export const CANCEL_OFFER_PENDING_COOKIE = "cancel_offer_pending";

/** The email promises the offer for 7 days. */
export const CANCEL_OFFER_PENDING_MAX_AGE_S = 7 * 24 * 60 * 60;

/** The pass is sold for 7 days from the cancellation (the backend's
 *  CANCELLATION_OFFER_WINDOW_DAYS); the plan cards follow the same window. */
export const CANCEL_OFFER_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
