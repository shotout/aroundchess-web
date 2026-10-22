"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ChangePassword } from "@/components/modal/ChangePassword";
import Navigation from "@/components/navigator/navigation";
import ProfileAccountCard from "@/components/v2/profile-account-card";
import ProfileTokensBar from "@/components/v2/profile-tokens-bar";
import ProfileSubscription from "@/components/v2/profile-subscription";
import { useSuccessSubscription } from "../store/successSubscription";
import { useStatusPurchaseTokens } from "../store/statusPurchaseTokens";
import DeleteAccount from "@/components/profile/DeleteAccount";
import DotSpinner from "@/components/game-history/Spinner";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";
import { usePgnStore } from "../store/zustandStore";
import { refreshTokenBalance, useProfileStore } from "../store/profile";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { useApiClient } from "@/functions/api-client";
import { formatTimePgn } from "@/functions/format-date";
import { trackCustomEvent, trackSubscription } from "../utils/facebookPixel";
import { usePricingOffer } from "../store/pricingOffer";

/** Gaps between GET /membership/active reads after a Stripe checkout, ~30s in
 *  all. */
const MEMBERSHIP_POLL_DELAYS_MS = [1500, 2000, 3000, 5000, 8000, 10000];

function Profile() {
  const { paramsPayment } = usePricingOffer();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setCallFetch } = useProfileFetch();
  const {
    sessionId,
    setAlreadyFetchProfile,
    setAlreadyFetch,
    setActiveMembership,
    setIsMember,
    setIsMemberMonthly,
  } = useProfileStore();
  const { getActiveMembership, getTokenBalance } = useApiClient();
  const { setOpen: setOpenSuccess } = useSuccessSubscription();

  const [openAccountConnected, setOpenAccountConnected] = useState(false);
  const [awaitingMembership, setAwaitingMembership] = useState(false);
  const membershipIdBeforeCheckout = useRef<string | undefined>(undefined);

  const {
    setOpen: setOpenPurchaseStatus,
    setQuantity,
    setStatus,
  } = useStatusPurchaseTokens();
  const { isLoading } = usePgnStore();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const mainElement = document.querySelector("main");
    if (mainElement instanceof HTMLElement) {
      mainElement.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);
  useEffect(() => {
    trackCustomEvent("ViewProfile");
  }, []);
  useEffect(() => {
    const status = searchParams?.get("status");
    const amount = searchParams?.get("amount");

    if (!status) return;

    setAlreadyFetchProfile(false);
    setAlreadyFetch(false);
    setCallFetch(formatTimePgn());
    router.replace("/profile");

    switch (status) {
      case "successSubscribe":
        // Still the persisted pre-checkout row: the refetch above hasn't
        // resolved yet.
        membershipIdBeforeCheckout.current =
          useProfileStore.getState().activeMembership?.id;
        setAwaitingMembership(true);
        setOpenSuccess(true);
        trackCustomEvent("Subscribe", {
          ...paramsPayment,
          currency: "USD",
          value: paramsPayment.price,
          predicted_ltv:paramsPayment.price
        });
        break;

      case "cancelSubscribe":
        setOpenPurchaseStatus(true);
        setStatus("failed-membership");
        break;

      case "successToken":
        setOpenPurchaseStatus(true);
        setQuantity(amount);
        setStatus("success");
        trackCustomEvent("Purchase", {
          ...paramsPayment,
          currency: "USD",
          value: paramsPayment.price,
        });
        break;

      case "cancelToken":
        setOpenPurchaseStatus(true);
        setQuantity(amount);
        setStatus("failed");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stripe sends the browser back here as soon as the payment clears, but the
  // membership is only written by the checkout.session.completed webhook,
  // which usually lands a few seconds later. The one refetch on arrival loses
  // that race and stores the old FREE row (or nothing), so keep reading until
  // a paid plan that wasn't there before checkout shows up. The id check is
  // for the cancellation offer: its buyer can still be on a cancelled-but-paid
  // plan, and the pass is a new row.
  useEffect(() => {
    if (!awaitingMembership || !sessionId) return;

    let cancelled = false;
    let timer: number | undefined;
    let attempt = 0;

    const check = async () => {
      const response = await getActiveMembership({}).catch(() => null);
      if (cancelled) return;

      const data = response?.data;
      const type = data?.membershipPackage?.type;
      if (
        (type == "MONTHLY" || type == "YEARLY") &&
        data.id !== membershipIdBeforeCheckout.current
      ) {
        setIsMember(type == "YEARLY");
        setIsMemberMonthly(type == "MONTHLY");
        setActiveMembership(data);
        // The cancellation pass credits bonus tokens in the same webhook.
        refreshTokenBalance(sessionId, () => getTokenBalance({}));
        setAwaitingMembership(false);
        return;
      }

      if (attempt >= MEMBERSHIP_POLL_DELAYS_MS.length) {
        setAwaitingMembership(false);
        return;
      }
      timer = window.setTimeout(check, MEMBERSHIP_POLL_DELAYS_MS[attempt++]);
    };

    timer = window.setTimeout(check, MEMBERSHIP_POLL_DELAYS_MS[attempt++]);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awaitingMembership, sessionId]);

  return (
    <Suspense>
      {isLoggingOut ? (
        <div className="fixed no-scrollbar top-0 left-0 w-screen h-screen bg-white z-[9999] flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center gap-4">
            <span className="text-lg font-medium text-gray-600">
              Signing out...
            </span>
          </div>
        </div>
      ) : (
        <Navigation>
          <ChangePassword />
          <ChessAccountSetup 
            isLoading={isLoading} 
            open={openAccountConnected} 
            setOpen={setOpenAccountConnected} 
          />
          
          <div className="relative">
            <div
              className={`flex flex-col z-10 p-[16px] md:p-[32px] gap-4 ${
                isLoggingOut ? "pointer-events-none" : ""
              }`}
            >
              <ProfileAccountCard
                onLogoutStart={() => setIsLoggingOut(true)}
                handleUsernameClicked={() => setOpenAccountConnected(true)}
                onConnectClicked={() => setOpenAccountConnected(true)}
              />
              <ProfileSubscription />
              <ProfileTokensBar />
              <DeleteAccount />
            </div>
          </div>
        </Navigation>
      )}
    </Suspense>
  );
}
export default function Page() {
  return (
    <Suspense>
      <Profile />
    </Suspense>
  );
}
