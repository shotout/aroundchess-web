"use client";

import { useLimitPuzzle } from "@/app/store/limitPuzzle";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LimitPuzzle() {
  const router = useRouter();
  const { open, setOpen } = useLimitPuzzle();
  const { setOpen: setOpenPricingOffer,setTabType } = usePricingOffer();
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleOpenPaywall = () => {
    setTabType("subscription");
    setOpenPricingOffer(true);
    setOpen(false);
  };
  const nextMonth =
    new Date().getMonth() + 2 > 12
      ? "01." + (new Date().getFullYear() + 1)
      : "01." + (new Date().getMonth() + 2) + "." + new Date().getFullYear();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-lg z-[9999] max-w-sm sm:max-w-[640px] sm:h-[408px] lg:p-[32px] bg-white max-h-[95%] overflow-y-hidden">
        <div className="flex flex-col justify-center items-center bg-white">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image
              src="/icons/asset-puzzle-limit.png"
              alt="Logo"
              width={1000}
              height={1000}
              className="w-[187px] h-[160px] sm:w-[188px] sm:h-[160px] object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-4 mb-4">
            <span className="font-semibold text-[24px] text-[#121212] text-center">
              No free puzzles left this month
            </span>
            <span className="font-normal text-[18px] text-[#364152] text-center">
              Free Puzzles reset on {nextMonth}. Get Unlimited Puzzles now by
              clicking the button below.
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-3">
          <button
            onClick={handleOpenPaywall}
            className="w-full btn-primary rounded-full h-[44px] "
          >
            <span className="font-medium text-[14px] -- sm:text-[16px] text-[#e6f7fe]">
              Go Unlimited
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
