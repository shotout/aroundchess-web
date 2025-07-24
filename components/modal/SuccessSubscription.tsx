"use client";

import { useSuccessSubscription } from "@/app/store/successSubscription";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SuccessSubscription() {
  const router = useRouter();
  const { open, setOpen } = useSuccessSubscription();
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleBack = () => {
    setOpen(false);
    router.replace("/profile");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        style={{
          backgroundImage: `url(/images/background-modal.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maxHeight: "95vh",
          width: "100%",
        }}
        className="rounded-lg max-w-sm sm:max-w-[640px] sm:max-h-[95%] lg:p-[32px] bg-[#E3F3FF] border border-[#C0CED4] max-h-[95%] overflow-y-hidden"
      >
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image
              src="/images/pricing/success-icon.png"
              alt="success-icon"
              width={1000}
              height={1000}
              className="w-[151px] h-[160px] lg:w-[244px] lg:h-[258px] object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-4 mb-4">
            <span className="font-medium text-[18px] text-[#2e2e2e] text-center">
              Your AroundChess Premium Subscription successful!
            </span>
            <span className="font-normal text-[14px] text-[#2e2e2e] text-center">
              Enhance your Chess Skills now with Full Access to our advanced AI Features!
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-3">
          <button
            onClick={handleBack}
            className="w-full btn-primary rounded-full h-[44px] "
          >
            <span className="font-medium text-[12px] sm:text-[16px] text-[#e6f7fe]">
              Back to Dashboard
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
