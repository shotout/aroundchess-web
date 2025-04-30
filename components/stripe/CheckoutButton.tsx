// components/CheckoutButton.tsx
"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutButton() {
  const handleClick = async () => {
    const res = await fetch("/api/stripe/checkout_sessions", {
      method: "POST",
      body: JSON.stringify({
        productName: "Premium",
        price: 99,
        quantity: 2,
      }),
    });

    const data = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: data.id });
  };

  return <button onClick={handleClick}>Buy Now</button>;
}
