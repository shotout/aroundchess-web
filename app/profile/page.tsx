"use client";
import { ChangePassword } from "@/components/modal/ChangePassword";
import Navigation from "@/components/navigator/navigation";
import MyAccount from "@/components/profile/MyAccount";
import MyRemainingAnalysisTokens from "@/components/profile/MyRemainingAnalysisTokens";
import MyRemainingPuzzle from "@/components/profile/MyRemainingPuzzle";
import MySubscription from "@/components/profile/MySubscription";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSuccessSubscription } from "../store/successSubscription";
import { useCancelSubscription } from "../store/cancelSubscription";
import { useStatusPurchaseTokens } from "../store/statusPurchaseTokens";
import { Suspense } from "react";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { formatTimePgn } from "@/functions/format-date";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setCallFetch } = useProfileFetch();
  const { setOpen: setOpenSuccess } = useSuccessSubscription();
  const { setOpen: setOpenCancel } = useCancelSubscription();
  const {
    setOpen: setOpenPurchaseStatus,
    setQuantity,
    setStatus,
    status,
  } = useStatusPurchaseTokens();
  useEffect(() => {
    const status = searchParams?.get("status");
    const amount = searchParams?.get("amount");
    if (status == "successSubscribe") {
      // http://localhost:3000/profile?status=successSubscribe
      // setCallFetch(formatTimePgn());
      setOpenSuccess(true);
      router.replace("/profile");
    } else if (status == "cancelSubscribe") {
      // http://localhost:3000/profile?status=cancelSubscribe
      setOpenPurchaseStatus(true);
      setStatus("failed-membership")
      router.replace("/profile");
    } else if (status == "successToken") {
      // http://localhost:3000/profile?status=successToken&amount=20
      // setCallFetch(formatTimePgn());
      setOpenPurchaseStatus(true);
      setQuantity(amount);
      setStatus("success");
      router.replace("/profile");
    } else if (status == "cancelToken") {
      // http://localhost:3000/profile?status=cancelToken&amount=20
      setOpenPurchaseStatus(true);
      setQuantity(amount);
      setStatus("failed");
      router.replace("/profile");
    }
  }, [status]);
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
