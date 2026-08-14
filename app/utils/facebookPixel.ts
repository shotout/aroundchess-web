declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    gtag: any;
  }
}

export const trackSubscription = (value: number, currency: string = "USD") => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Subscribe", {
      value,
      currency,
      predicted_ltv: "0.00",
    });
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "subscribe", {
      value,
      currency,
    });
  }
};

export const trackPurchase = (value: number, currency: string = "USD") => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", { value, currency });
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "purchase", {
      value,
      currency,
    });
  }
};

export const trackSignUp = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "CompleteRegistration");
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "sign_up");
  }
};
export const trackInitialCheckout = () => {
  console.log("trackInitialCheckout");
  if (typeof window !== "undefined" && window.fbq) {
    console.log("trackInitialCheckout FB");
    window.fbq("track", "InitiateCheckout");
  }

  if (typeof window !== "undefined" && window.gtag) {
    console.log("trackInitialCheckout GA4");
    window.gtag("event", "begin_checkout");
  }
};

export const trackCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== "undefined" && window.fbq) {
    console.log("track FB", eventName, parameters);
    window.fbq("track", eventName, parameters);
  }

  if (typeof window !== "undefined" && window.gtag) {
    console.log("track GA4", eventName, parameters);
    window.gtag("event", eventName, parameters);
  }
};
