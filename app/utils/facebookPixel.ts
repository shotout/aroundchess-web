import { useModalSetting } from "@/app/store/cookiesSetting";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    gtag: any;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = "G-C2DL4G5MEB";
const META_PIXEL_ID = "1143400640994363";

// Staging, Vercel previews and localhost would otherwise report into the same
// GA4 property and Pixel as the live site, so their test sign-ups and
// checkouts landed in production numbers (and Meta optimises ad spend on
// Purchase). Only these hosts send anything.
const PRODUCTION_HOSTS = ["aroundchess.com", "www.aroundchess.com"];

export const isTrackingHost = () =>
  typeof window !== "undefined" &&
  PRODUCTION_HOSTS.includes(window.location.hostname);

// Both loaders install the vendor's command queue synchronously, so calls made
// before the remote script arrives are queued, not lost. Page-view events fire
// from page effects, which run before the layout's effects get to load
// anything, so every send loads the tracker it needs first.
const initGoogleAnalytics = () => {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  // gtag.js only recognises commands pushed as `arguments` objects; an array
  // with the same contents is ignored.
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
};

// Meta's base snippet, without the string eval.
const initMetaPixel = () => {
  if (window.fbq) return;
  const fbq: any = function () {
    // eslint-disable-next-line prefer-rest-params, prefer-spread
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
    // eslint-disable-next-line prefer-rest-params
    else fbq.queue.push(arguments);
  };
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
};

/** Loads GA4 and the Pixel for whichever the visitor consented to. Idempotent. */
export const loadTrackers = () => {
  if (!isTrackingHost()) return;
  const { analytics, marketing } = useModalSetting.getState().setting;
  if (analytics) initGoogleAnalytics();
  if (marketing) initMetaPixel();
};

// Meta's standard events go through "track"; anything else is a custom event
// and belongs on "trackCustom".
const META_STANDARD_EVENTS = new Set([
  "AddPaymentInfo",
  "AddToCart",
  "AddToWishlist",
  "CompleteRegistration",
  "Contact",
  "CustomizeProduct",
  "Donate",
  "FindLocation",
  "InitiateCheckout",
  "Lead",
  "PageView",
  "Purchase",
  "Schedule",
  "Search",
  "StartTrial",
  "SubmitApplication",
  "Subscribe",
  "ViewContent",
]);

// GA4 only counts its own recommended names (lowercase, case-sensitive) as
// sign-ups, checkouts and revenue. Meta keeps the names the call sites use.
const GA4_EVENT_NAMES: Record<string, string> = {
  CompleteRegistration: "sign_up",
  InitiateCheckoutSubscription: "begin_checkout",
  InitiateCheckoutToken: "begin_checkout",
  Subscribe: "purchase",
  Purchase: "purchase",
};
const GA4_ECOMMERCE_EVENTS = new Set(["begin_checkout", "purchase"]);

// GA4 discards an event whose name has anything outside [A-Za-z0-9_].
const toGa4EventName = (eventName: string) =>
  GA4_EVENT_NAMES[eventName] ?? eventName.replace(/[^A-Za-z0-9_]/g, "_");

// GA4 keeps string and number parameter values (strings up to 100
// characters) and silently drops anything else, so lists are joined and
// nested objects left out.
const toGa4Value = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value.slice(0, 100);
  if (typeof value === "boolean") return String(value);
  if (
    Array.isArray(value) &&
    value.every((v) => typeof v === "string" || typeof v === "number")
  ) {
    return value.join(",").slice(0, 100);
  }
  return undefined;
};

const toGa4Params = (ga4EventName: string, parameters?: TrackingParams) => {
  const params: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parameters ?? {})) {
    const converted = toGa4Value(value);
    if (converted !== undefined) params[key] = converted;
  }
  // Item-level ecommerce reports need `items`; checkoutEventParams supplies
  // the fields.
  if (GA4_ECOMMERCE_EVENTS.has(ga4EventName) && parameters?.product_name) {
    const quantity = Number(parameters.quantity) || 1;
    const value = Number(parameters.value);
    params.items = [
      {
        item_name: parameters.product_name,
        item_category: parameters.product_type,
        quantity,
        ...(Number.isFinite(value) ? { price: value / quantity } : {}),
      },
    ];
  }
  return params;
};

export type TrackingParams = Record<string, unknown>;

export const trackCustomEvent = (
  eventName: string,
  parameters?: TrackingParams
) => {
  if (typeof window === "undefined") return;
  if (!isTrackingHost()) {
    // Still visible in the console so events can be checked on staging.
    console.info("[tracking] not sent (non-production host):", eventName, parameters);
    return;
  }

  const { analytics, marketing } = useModalSetting.getState().setting;
  if (marketing) {
    initMetaPixel();
    window.fbq(
      META_STANDARD_EVENTS.has(eventName) ? "track" : "trackCustom",
      eventName,
      parameters
    );
  }
  if (analytics) {
    initGoogleAnalytics();
    const ga4EventName = toGa4EventName(eventName);
    window.gtag("event", ga4EventName, toGa4Params(ga4EventName, parameters));
  }
};

export type CheckoutBody = {
  type?: string;
  productName?: string;
  price?: number | string;
  totalPrice?: number | string;
  quantity?: number;
  couponId?: string;
};

/**
 * Event parameters for a checkout body. Memberships and the cancellation
 * offer are priced in cents in `price`; token packs carry their dollar total
 * in `totalPrice`. Without a body (the details were lost before Stripe sent
 * the visitor back) the event is still counted, just without a value.
 */
export const checkoutEventParams = (body?: CheckoutBody | null) => {
  if (!body || typeof body !== "object") return { currency: "USD" };
  const value =
    body.type === "token"
      ? Number(body.totalPrice)
      : Math.round(Number(body.price)) / 100;
  return {
    currency: "USD",
    ...(Number.isFinite(value) ? { value } : {}),
    product_type: body.type,
    product_name: body.productName,
    quantity: body.quantity ?? 1,
    ...(body.couponId ? { coupon: body.couponId } : {}),
  };
};
