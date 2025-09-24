"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ChangePassword } from "@/components/modal/ChangePassword";
import Navigation from "@/components/navigator/navigation";
import MyAccount from "@/components/profile/MyAccount";
import MyRemainingAnalysisTokens from "@/components/profile/MyRemainingAnalysisTokens";
import MyRemainingPuzzle from "@/components/profile/MyRemainingPuzzle";
import MySubscription from "@/components/profile/MySubscription";
import { useSuccessSubscription } from "../store/successSubscription";
import { useStatusPurchaseTokens } from "../store/statusPurchaseTokens";
import DeleteAccount from "@/components/profile/DeleteAccount";
import DotSpinner from "@/components/game-history/Spinner";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";
import { usePgnStore } from "../store/zustandStore";
import { useProfileStore } from "../store/profile";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { formatTimePgn } from "@/functions/format-date";
import { trackCustomEvent, trackSubscription } from "../utils/facebookPixel";
import { usePricingOffer } from "../store/pricingOffer";
function Profile() {
  const { paramsPayment } = usePricingOffer();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setCallFetch } = useProfileFetch();
  const { setAlreadyFetchProfile, setAlreadyFetch } = useProfileStore();
  const { setOpen: setOpenSuccess } = useSuccessSubscription();
  const {
    setOpen: setOpenPurchaseStatus,
    setQuantity,
    setStatus,
  } = useStatusPurchaseTokens();
  const { isLoading } = usePgnStore();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
        setOpenSuccess(true);
        trackCustomEvent("Subscribe", {
          ...paramsPayment,
          currency: "USD",
          value: paramsPayment.price,
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
          <ChessAccountSetup isLoading={isLoading} />
          <div className="relative">
            <div
              className={`flex flex-col z-10 p-[32px] gap-4 ${
                isLoggingOut ? "pointer-events-none" : ""
              }`}
            >
              <MyAccount onLogoutStart={() => setIsLoggingOut(true)} />
              <MySubscription />
              <MyRemainingAnalysisTokens />
              <MyRemainingPuzzle />
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
