declare global {
  interface Window {
    fbq: any;
    _fbq: any;
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
};

export const trackPurchase = (value: number, currency: string = "USD") => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", { value, currency });
  }
};

export const trackSignUp = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "CompleteRegistration");
  }
};
export const trackInitialCheckout = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout");
  }
};

export const trackCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, parameters);
  }
};
