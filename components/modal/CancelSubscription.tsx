"use client";

import { useCancelSubscription } from "@/app/store/cancelSubscription";
import { useProfileStore } from "@/app/store/profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DotSpinner from "@/components/game-history/Spinner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useApiClient } from "@/functions/api-client";
import { redactSecrets } from "@/functions/api-error-message";
import { formatDateHistory } from "@/functions/format-date";
import { toast } from "sonner";

export function CancelSubscription() {

  const router = useRouter();
  const { activeMembership, setActiveMembership, setIsMember, setIsMemberMonthly } =
    useProfileStore();
  const { open, setOpen } = useCancelSubscription();
  const { postCancelMembership, getActiveMembership } = useApiClient();
  const [isCancelling, setIsCancelling] = useState(false);
  useEffect(() => {
    setOpen(open);
  }, [open]);

  // POST /membership/cancel sets the Stripe subscription to cancel at period
  // end; Premium keeps running until endDate. Its response is the raw row
  // without `isCancelled`, so the active membership is re-read afterwards.
  const handleCancel = async () => {
    if (isCancelling) return;
    setIsCancelling(true);

    try {
      const res = await postCancelMembership({});
      if (!res || res.success === false) {
        throw new Error(String(res?.message ?? "Cancel request failed"));
      }
    } catch (error: any) {
      console.error(
        "Cancel subscription failed:",
        redactSecrets(String(error?.message ?? ""))
      );
      toast.error("We couldn't cancel your subscription. Please try again later.");
      setIsCancelling(false);
      return;
    }

    let endDate = activeMembership?.endDate;
    try {
      const response = await getActiveMembership({});
      const data = response?.data;
      if (!data) throw new Error("No active membership returned");
      endDate = data.endDate ?? endDate;
      setIsMember(data.membershipPackage?.type == "YEARLY");
      setIsMemberMonthly(data.membershipPackage?.type == "MONTHLY");
      setActiveMembership(data);
    } catch {
      // The cancel went through; only the refresh failed. A reload refetches.
      window.location.reload();
      return;
    }

    setIsCancelling(false);
    setOpen(false);
    toast.success(
      endDate
        ? `Your subscription has been cancelled. Premium stays active until ${formatDateHistory(
            endDate
          )}.`
        : "Your subscription has been cancelled."
    );
  };
  const handleKeep = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={(next) => !isCancelling && setOpen(next)}>
      <DialogContent className="rounded-lg max-w-sm sm:max-w-[640px] sm:max-h-[95%] lg:p-[32px] bg-white max-h-[95%] overflow-y-hidden">
        {/* Radix requires an accessible name on every DialogContent */}
        <DialogTitle className="sr-only">Cancel subscription</DialogTitle>
        <DialogHeader className="flex items-center">
          <span className="text-center font-medium text-[18px] w-2/3">
            Are you sure you want to cancel your AroundChess Subscription
          </span>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center bg-white">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image
              src="/icons/isolation-mode.png"
              alt="isolation-mode"
              width={1000}
              height={1000}
              className="w-[150px] h-[120px] sm:w-[188px] sm:h-[160px] object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-4 mb-4">
            <span className="font-normal text-[18px] text-[#364152] text-center">
              The cancellation will take effect and you will lose all of your
              AroundChess Unlimited Benefits at the end of the current billing
              period. You can reactivate your Subscription at any time.
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-3">
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="w-full btn-secondary rounded-full h-[44px] disabled:cursor-not-allowed"
          >
            {isCancelling ? (
              <DotSpinner size={8} />
            ) : (
              <span className="font-medium text-[14px] -- sm:text-[16px] text-[#221AE9]">
                Cancel Subscription
              </span>
            )}
          </button>
          <button
            onClick={handleKeep}
            disabled={isCancelling}
            className="w-full btn-primary rounded-full h-[44px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="font-medium text-[14px] -- sm:text-[16px] text-[#e6f7fe]">
              Keep Subscription
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
