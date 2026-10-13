"use client";

import { useConfirmLogin } from "@/app/store/confirmLogin";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import { useApiClient } from "@/functions/api-client";
import {
  PAYMENT_ERROR_MESSAGE,
  redactSecrets,
} from "@/functions/api-error-message";
import { trackPaywallInteraction } from "@/functions/tracking";
import { useState } from "react";
import { toast } from "sonner";

export type MembershipPlan = "monthly" | "yearly";

/** Paywall analytics bucket — the backend accepts only these values. */
type PaywallSource = "user_settings" | "pricing_dialog";

/**
 * Starts a Stripe Checkout for the monthly or yearly membership and redirects
 * to it. Shared by the plan cards (/profile and the pricing dialog) and the
 * `?cancel_offer` resubscribe banner, so every entry point sends the same body.
 */
export const useMembershipCheckout = (source: PaywallSource) => {
  const { allMembershipPackages, profile, sessionId, setAllMembershipPackages } =
    useProfileStore();
  const { setOpen: setOpenLogin } = useConfirmLogin();
  const { setParamsPayment } = usePricingOffer();
  const { checkoutSessions, isLoading, getAllMembershipPackage } = useApiClient();
  const [paySelected, setPaySelected] = useState<MembershipPlan | "">("");

  // Ensure we have membership packages loaded (fallback to API if needed)
  const resolveMembershipPackages = async () => {
    let packagesArray: any[] = [];

    if (Array.isArray(allMembershipPackages)) {
      packagesArray = allMembershipPackages;
    } else if (allMembershipPackages && typeof allMembershipPackages === "object") {
      packagesArray = Object.values(allMembershipPackages);
    }

    if (!packagesArray.length) {
      try {
        const response = await getAllMembershipPackage({});
        if (response?.data && Array.isArray(response.data)) {
          packagesArray = response.data;
          setAllMembershipPackages(response.data);
        }
      } catch (e) {
        console.error("Failed to load membership packages", e);
      }
    }

    if (!packagesArray.length) {
      return { premium: null as any, monthlyPremium: null as any };
    }

    const premium = packagesArray.find((pkg: any) => pkg?.type === "YEARLY") ?? null;
    const monthlyPremium =
      packagesArray.find((pkg: any) => pkg?.type === "MONTHLY") ?? null;

    return { premium, monthlyPremium };
  };

  const startCheckout = async (type: MembershipPlan) => {
    setPaySelected(type);

    trackPaywallInteraction(sessionId, {
      buttonName: "get_premium",
      planType: type,
      source,
    });

    if (sessionId.length == 0) {
      setOpenLogin(true);
      return;
    }

    const { premium, monthlyPremium } = await resolveMembershipPackages();

    const isMonthly = type == "monthly";
    const selectedPackage = isMonthly ? monthlyPremium : premium;

    if (!selectedPackage) {
      console.error(
        `Membership package not found for type ${isMonthly ? "MONTHLY" : "YEARLY"}`
      );
      setPaySelected("");
      return;
    }

    type BodyType = {
      productName: any;
      price: number;
      quantity: number;
      description: any;
      type: string;
      idUser: any;
      membershipId: any;
      stripeProductId: any;
      totalPrice: any;
      couponId?: any;
    };

    const deadline =
      new Date(profile?.discountInfo?.startDate).getTime() + 7 * 24 * 60 * 60 * 1000;
    const isPass = deadline - Date.now();

    const yearlyCheckoutPrice = (premium?.price ?? 79.99) * 100;
    const monthlyCheckoutPrice =
      profile?.discountInfo?.hasActiveDiscount && isPass > 0
        ? 699
        : (monthlyPremium?.price ?? 9.99) * 100;
    const body: BodyType = {
      productName: selectedPackage.name,
      price: isMonthly ? monthlyCheckoutPrice : yearlyCheckoutPrice,
      quantity: 1,
      description: selectedPackage.description,
      type: "membership",
      idUser: profile.id,
      membershipId: selectedPackage.id,
      stripeProductId: selectedPackage.stripeProductId,
      totalPrice: isMonthly ? monthlyCheckoutPrice : yearlyCheckoutPrice,
    };
    if (profile.discountInfo?.discountCode) {
      body.couponId = profile.discountInfo?.discountCode;
    }
    setParamsPayment(body);
    trackCustomEvent("InitiateCheckoutSubscription", body);
    try {
      const res = await checkoutSessions(body);
      if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      // The backend reports checkout failures in a 200 body, so apiRequest's
      // sanitizer (which only runs on thrown errors) never sees them and the raw
      // wording used to reach the toast — including provider detail like
      // "Expired API Key provided: sk_live_***". None of it is actionable for a
      // user, so show the shared payment line and keep the detail in the log.
      console.error(
        "Checkout session response without url:",
        redactSecrets(String(res?.message ?? ""))
      );
      toast.error(PAYMENT_ERROR_MESSAGE);
    } catch (error: any) {
      console.error(
        "Checkout session failed:",
        redactSecrets(String(error?.message ?? ""))
      );
      toast.error(PAYMENT_ERROR_MESSAGE);
    } finally {
      setPaySelected("");
    }
  };

  return { startCheckout, paySelected, isLoading };
};
