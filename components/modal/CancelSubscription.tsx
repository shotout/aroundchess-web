"use client";

import { useCancelSubscription } from "@/app/store/cancelSubscription";
import { useProfileStore } from "@/app/store/profile";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useApiClient } from "@/functions/api-client";

export function CancelSubscription() {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

  const router = useRouter();
  const { activeMembership } = useProfileStore();
  const { open, setOpen } = useCancelSubscription();
  const { postCancelMembership } = useApiClient();
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleCancel = async () => {
    postCancelMembership({}).then(() => {
      setOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };
  const handleKeep = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-lg max-w-sm sm:max-w-[640px] sm:max-h-[95%] lg:p-[32px] bg-white max-h-[95%] overflow-y-hidden">
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
            className="w-full btn-secondary rounded-full h-[44px] "
          >
            <span className="font-medium text-[12px] sm:text-[16px] text-[#221AE9]">
              Cancel Subscription
            </span>
          </button>
          <button
            onClick={handleKeep}
            className="w-full btn-primary rounded-full h-[44px] "
          >
            <span className="font-medium text-[12px] sm:text-[16px] text-[#e6f7fe]">
              Keep Subscription
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
