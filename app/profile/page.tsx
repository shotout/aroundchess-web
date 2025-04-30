"use client";
import { ChangePassword } from "@/components/modal/ChangePassword";
import Navigation from "@/components/navigator/navigation";
import MyAccount from "@/components/profile/MyAccount";
import MyRemainingAnalysisTokens from "@/components/profile/MyRemainingAnalysisTokens";
import MyRemainingPuzzle from "@/components/profile/MyRemainingPuzzle";
import MySubscription from "@/components/profile/MySubscription";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSuccessSubscription } from "../store/successSubscription";
import { useCancelSubscription } from "../store/cancelSubscription";
import { useStatusPurchaseTokens } from "../store/statusPurchaseTokens";
export default function Profile() {
  const searchParams = useSearchParams();
  const status = searchParams?.get("status");
  const amount = searchParams?.get("amount");
  const { setOpen: setOpenSuccess } = useSuccessSubscription();
  const { setOpen: setOpenCancel } = useCancelSubscription();
  const {
    setOpen: setOpenPurchaseStatus,
    setQuantity,
    setStatus,
  } = useStatusPurchaseTokens();
  useEffect(() => {
    if (status == "successSubscribe") {
      setOpenSuccess(true);
    } else if (status == "cancelSubscribe") {
      setOpenCancel(true);
    } else if (status == "successToken") {
      // http://localhost:3000/profile?status=successToken&amount=20
      setOpenPurchaseStatus(true);
      setQuantity(amount)
      setStatus("success");
    } else if (status == "cancelToken") {
      // http://localhost:3000/profile?status=cancelToken&amount=20
      setOpenPurchaseStatus(true);
      setQuantity(amount)
      setStatus("failed");
    }
  }, [status]);
  return (
    <Navigation>
      <ChangePassword />
      <div className="flex flex-col z-10 p-[32px] gap-4">
        <MyAccount />
        <MySubscription />
        <MyRemainingAnalysisTokens />
        <MyRemainingPuzzle />
      </div>
    </Navigation>
  );
}
