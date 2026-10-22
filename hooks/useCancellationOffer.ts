"use client";

import { usePricingOffer } from "@/app/store/pricingOffer";
import { useApiClient } from "@/functions/api-client";
import {
  PAYMENT_ERROR_MESSAGE,
  redactSecrets,
} from "@/functions/api-error-message";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/** The parts of GET /membership/cancellation-offer the web reads. */
export interface CancellationOfferStatus {
  eligible: boolean;
  /** When the offer stops being sold: the cancellation + 7 days. */
  validUntil: string | null;
  offer: {
    price: number;
    durationInMonths: number;
    tokens: number;
    webAvailable: boolean;
  } | null;
}

/**
 * The cancellation-offer pass while the backend sells it to this user (7 days
 * from their cancellation, once). `offer` is null whenever it isn't for sale
 * here, including a failed request, so callers just leave the banner out.
 * `terms` is the pass as configured, for sale or not: what a pass holder's
 * card shows. `fetchKey` re-reads it when it changes, e.g. right after a cancel.
 */
export const useCancellationOffer = (enabled: boolean, fetchKey?: string) => {
  const { getCancellationOffer, postCancellationOfferCheckout } = useApiClient();
  const { setParamsPayment } = usePricingOffer();
  const [status, setStatus] = useState<CancellationOfferStatus | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setStatus(null);
      return;
    }

    let cancelled = false;
    getCancellationOffer({})
      .then((res: any) => {
        if (!cancelled) setStatus(res?.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, fetchKey]);

  const offer =
    status?.eligible && status.offer?.webAvailable && status.validUntil
      ? { ...status.offer, validUntil: status.validUntil }
      : null;

  const startCheckout = async () => {
    if (!offer || isCheckingOut) return;
    setIsCheckingOut(true);

    // The profile page's Subscribe pixel event reads this when Stripe sends
    // them back; price in cents, as the plan checkout stores it.
    setParamsPayment({
      productName: "Cancellation Offer",
      type: "cancellation_offer",
      quantity: 1,
      price: Math.round(offer.price * 100),
    });

    try {
      const res = await postCancellationOfferCheckout({});
      if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      console.error(
        "Cancellation offer checkout without url:",
        redactSecrets(String(res?.message ?? ""))
      );
    } catch (error: any) {
      console.error(
        "Cancellation offer checkout failed:",
        redactSecrets(String(error?.message ?? ""))
      );
    }
    toast.error(PAYMENT_ERROR_MESSAGE);
    setIsCheckingOut(false);
  };

  return { offer, terms: status?.offer ?? null, startCheckout, isCheckingOut };
};
