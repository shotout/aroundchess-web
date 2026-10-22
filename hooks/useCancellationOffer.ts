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
  /** Why not, when not: e.g. "window_closed", "already_redeemed". */
  reason?: string;
  /** The cancellation that opened the offer. */
  cancellationDate: string | null;
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
 * card shows. `loaded` turns true once the backend has answered (or failed).
 * `fetchKey` re-reads it when it changes, e.g. right after a cancel.
 */
export const useCancellationOffer = (enabled: boolean, fetchKey?: string) => {
  const { getCancellationOffer, postCancellationOfferCheckout } = useApiClient();
  const { setParamsPayment } = usePricingOffer();
  const [status, setStatus] = useState<CancellationOfferStatus | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setLoaded(false);
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
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, fetchKey]);

  const offer =
    status?.eligible && status.offer?.webAvailable && status.validUntil
      ? {
          ...status.offer,
          validUntil: status.validUntil,
          cancellationDate: status.cancellationDate,
        }
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

  return {
    offer,
    terms: status?.offer ?? null,
    reason: status?.reason ?? null,
    loaded,
    startCheckout,
    isCheckingOut,
  };
};

/**
 * The paid plan whose cancellation opened the offer, once it has already run
 * out inside the 7 days (the user is back on FREE): its type and end date,
 * from GET /membership/history. Matched on the cancellation date the offer
 * status reports, so a pass or an older plan is never picked. Pass null to
 * skip the request.
 */
export const useLapsedPlan = (cancellationDate: string | null) => {
  const { getMembershipHistory } = useApiClient();
  const [plan, setPlan] = useState<{
    type: "MONTHLY" | "YEARLY";
    endDate: string;
  } | null>(null);

  useEffect(() => {
    setPlan(null);
    if (!cancellationDate) return;

    const wanted = new Date(cancellationDate).getTime();
    let cancelled = false;
    getMembershipHistory({})
      .then((res: any) => {
        if (cancelled) return;
        const rows: any[] = Array.isArray(res?.data) ? res.data : [];
        const row = rows.find((m) => {
          const type = m?.membershipPackage?.type;
          return (
            (type === "MONTHLY" || type === "YEARLY") &&
            m.cancellationDate != null &&
            new Date(m.cancellationDate).getTime() === wanted
          );
        });
        setPlan(row ? { type: row.membershipPackage.type, endDate: row.endDate } : null);
      })
      .catch(() => {
        if (!cancelled) setPlan(null);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancellationDate]);

  return plan;
};
