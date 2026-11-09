"use client";

import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { checkoutEventParams, trackCustomEvent } from "@/app/utils/facebookPixel";
import { useApiClient } from "@/functions/api-client";
import {
  PAYMENT_ERROR_MESSAGE,
  redactSecrets,
} from "@/functions/api-error-message";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/** What the failed-payment modal is reporting: a plan or a token pack. */
export type RetryKind = "membership" | "token";

/** The stored checkout types each failure can replay. Stripe's cancel link
 *  for the 6-month cancellation offer lands on the membership failure too. */
const REPLAYABLE_TYPES: Record<RetryKind, string[]> = {
  membership: ["membership", "cancellation_offer"],
  token: ["token"],
};

/**
 * "Retry Payment" on the failed-payment modal. Backing out of Stripe lands on
 * /profile?status=cancel… with nothing selected any more, so this replays the
 * checkout the visitor just left (the same plan, 6-month offer or token pack,
 * as remembered in `paramsPayment`) and sends them straight back to Stripe.
 *
 * `retry` resolves false when there is nothing to replay (another tab, another
 * account, a different kind of checkout); the caller then opens the paywall.
 * Otherwise it has either started the redirect or already told the visitor
 * why it couldn't.
 */
export const useRetryCheckout = () => {
  const { checkoutSessions, postCancellationOfferCheckout } = useApiClient();
  const [isRetrying, setIsRetrying] = useState(false);

  // The browser's Back button on Stripe can restore this page from the
  // back/forward cache with the redirect still "in progress"; unlock it.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsRetrying(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const retry = async (kind: RetryKind): Promise<boolean> => {
    if (isRetrying) return true;

    // Read at click time: the store is rehydrated from sessionStorage and may
    // have changed since the modal rendered.
    const stored = usePricingOffer.getState().paramsPayment;
    const { sessionId, profile } = useProfileStore.getState();

    if (!sessionId || !stored || typeof stored !== "object") return false;
    if (!REPLAYABLE_TYPES[kind].includes(stored.type)) return false;

    const isOffer = stored.type === "cancellation_offer";
    // Plan and token bodies name the buyer; never replay one for someone else.
    if (!isOffer && (!profile?.id || stored.idUser !== profile.id)) return false;

    setIsRetrying(true);
    try {
      let res: any;
      if (isOffer) {
        // The pass is priced and checked server-side; the body is empty, as on
        // the offer banner.
        res = await postCancellationOfferCheckout({});
      } else {
        trackCustomEvent(
          stored.type === "token"
            ? "InitiateCheckoutToken"
            : "InitiateCheckoutSubscription",
          checkoutEventParams(stored)
        );
        res = await checkoutSessions(stored);
      }

      if (res?.data?.url) {
        // Left locked: the page is navigating away.
        window.location.href = res.data.url;
        return true;
      }

      // A plan still renewing through the App Store / Google Play can't be
      // switched here until it's cancelled there; the backend says which store.
      const message = String(res?.message ?? "");
      if (!isOffer && message.includes("Cancel it there first")) {
        toast.info(message);
      } else {
        console.error("Retry checkout without url:", redactSecrets(message));
        toast.error(PAYMENT_ERROR_MESSAGE);
      }
    } catch (error: any) {
      console.error(
        "Retry checkout failed:",
        redactSecrets(String(error?.message ?? ""))
      );
      toast.error(PAYMENT_ERROR_MESSAGE);
    }
    setIsRetrying(false);
    return true;
  };

  return { retry, isRetrying };
};
