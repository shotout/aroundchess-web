"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ChangePassword } from "@/components/modal/ChangePassword";
import Navigation from "@/components/navigator/navigation";
import MyAccount from "@/components/profile/MyAccount";
import MyRemainingAnalysisTokens from "@/components/profile/MyRemainingAnalysisTokens";
import MyRemainingPuzzle from "@/components/profile/MyRemainingPuzzle";
import MySubscription from "@/components/profile/MySubscription";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { useSuccessSubscription } from "../store/successSubscription";
import { useStatusPurchaseTokens } from "../store/statusPurchaseTokens";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setCallFetch } = useProfileFetch();
  const { setOpen: setOpenSuccess } = useSuccessSubscription();
  const {
    setOpen: setOpenPurchaseStatus,
    setQuantity,
    setStatus,
  } = useStatusPurchaseTokens();

  useEffect(() => {
    const status = searchParams?.get("status");
    const amount = searchParams?.get("amount");

    if (!status) return;

    router.replace("/profile");

    switch (status) {
      case "successSubscribe":
        setCallFetch(Date.now().toString());
        setOpenSuccess(true);
        break;

      case "cancelSubscribe":
        setOpenPurchaseStatus(true);
        setStatus("failed-membership");
        break;

      case "successToken":
        setCallFetch(Date.now().toString());
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
    setCallFetch,
    setOpenSuccess,
    setOpenPurchaseStatus,
    setQuantity,
    setStatus,
  ]);

  return (
    <Suspense>
      <Navigation>
        <ChangePassword />
        <div className="flex flex-col z-10 p-[32px] gap-4">
          <MyAccount />
          <MySubscription />
          <MyRemainingAnalysisTokens />
          <MyRemainingPuzzle />
        </div>
      </Navigation>
    </Suspense>
  );
}
