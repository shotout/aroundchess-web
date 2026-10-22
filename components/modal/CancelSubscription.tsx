"use client";

import { useCancelSubscription } from "@/app/store/cancelSubscription";
import { useProfileStore } from "@/app/store/profile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import DotSpinner from "@/components/game-history/Spinner";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useApiClient } from "@/functions/api-client";
import { redactSecrets } from "@/functions/api-error-message";
import { formatDateSubscription } from "@/functions/format-date";
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
        ? `Your subscription has been cancelled. Premium stays active until ${formatDateSubscription(
            endDate
          )}.`
        : "Your subscription has been cancelled."
    );
  };
  const handleKeep = () => {
    setOpen(false);
  };
  const endDate = activeMembership?.endDate;

  return (
    <Dialog open={open} onOpenChange={(next) => !isCancelling && setOpen(next)}>
      {/* [&>button]:hidden drops the shared dialog's own X; this one is
          wrapped, so it stays. Phones: buttons stacked full width. sm: side
          by side, and the X gets its bordered box. */}
      <DialogContent className="w-[calc(100%-32px)] max-w-[400px] max-h-[95vh] gap-0 overflow-y-auto rounded-[24px] border-none bg-[#F8FBFF] p-[16px] sm:max-w-[550px] sm:rounded-[16px] md:p-[20px] [&>button]:hidden">
        <div className="absolute right-[16px] top-[20px] sm:top-[16px]">
          <DialogClose
            disabled={isCancelling}
            aria-label="Close"
            className="flex h-[32px] w-[32px] items-center justify-center text-black transition-opacity hover:opacity-70 disabled:cursor-not-allowed sm:w-[40px] sm:rounded-[8px] sm:border sm:border-[#D0D5DD] sm:bg-white"
          >
            <X className="h-[24px] w-[24px] sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
          </DialogClose>
        </div>

        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/delete-knight.png"
            alt=""
            aria-hidden
            width={480}
            height={481}
            priority
            className="h-auto w-[112px]"
          />
          <DialogTitle className="mt-[20px] px-[8px] text-[20px] font-semibold leading-[130%] tracking-normal text-black">
            Are you sure you want to cancel your subscription?
          </DialogTitle>
          <DialogDescription className="mt-[8px] max-w-[380px] text-[16px] leading-[150%] text-[#4B5563]">
            {endDate
              ? `If you cancel this subscription, your Premium benefits remain active until ${formatDateSubscription(
                  endDate
                )}`
              : "If you cancel this subscription, your Premium benefits remain active until the end of your billing period"}
          </DialogDescription>
        </div>

        <div className="mt-[20px] flex flex-col gap-[16px] sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="flex h-[48px] w-full items-center justify-center rounded-full border border-[#C01B1B] bg-white px-[24px] text-[15px] font-medium text-[#C01B1B] transition-colors hover:bg-red-50 disabled:cursor-not-allowed sm:h-[40px] sm:w-auto sm:min-w-[160px]"
          >
            {isCancelling ? <DotSpinner size={8} /> : "Cancel Subscription"}
          </button>
          <button
            type="button"
            onClick={handleKeep}
            disabled={isCancelling}
            className="flex h-[48px] w-full items-center justify-center rounded-full bg-[#C01B1B] px-[24px] text-[15px] font-medium text-white transition-colors hover:bg-[#A51616] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[40px] sm:w-auto sm:min-w-[160px]"
          >
            Keep Subscription
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
