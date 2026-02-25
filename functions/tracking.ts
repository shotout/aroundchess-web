export function trackPaywallInteraction(
  sessionId: string,
  data: {
    buttonName: "get_unlimited_package" | "get_premium" | "purchase_tokens";
    planType?: "monthly" | "yearly" | null;
    source: "sidebar" | "user_settings" | "pricing_dialog" | "token_purchase";
  }
) {
  if (!sessionId) return;

  fetch(`${process.env.BASE_URL}/tracking/paywall-interaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
    body: JSON.stringify({
      ...data,
      platform: "web",
    }),
  }).catch((err) => {
    console.error("[tracking] paywall interaction failed", err);
  });
}
