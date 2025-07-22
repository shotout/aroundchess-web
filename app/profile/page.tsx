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

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setOpen: setOpenSuccess } = useSuccessSubscription();
  const {
    setOpen: setOpenPurchaseStatus,
    setQuantity,
    setStatus,
  } = useStatusPurchaseTokens();
  const { isLoading } = usePgnStore();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const status = searchParams?.get("status");
    const amount = searchParams?.get("amount");

    if (!status) return;

    router.replace("/profile");

    switch (status) {
      case "successSubscribe":
        setOpenSuccess(true);
        break;

      case "cancelSubscribe":
        setOpenPurchaseStatus(true);
        setStatus("failed-membership");
        break;

      case "successToken":
        setOpenPurchaseStatus(true);
        setQuantity(amount);
        setStatus("success");
        break;

      case "cancelToken":
        setOpenPurchaseStatus(true);
        setQuantity(amount);
        setStatus("failed");
        break;
    }
  }, [
    searchParams,
    router,
    setOpenSuccess,
    setOpenPurchaseStatus,
    setQuantity,
    setStatus,
  ]);

  return (
    <Suspense>
      {isLoggingOut && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <DotSpinner size={8} />
            <span className="text-lg font-medium text-gray-600">
              Signing out...
            </span>
          </div>
        </div>
      )}
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
    </Suspense>
  );
}
