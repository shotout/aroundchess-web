"use client";

import { useMarchOfferDialog } from "@/app/store/marchOfferDialog";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { MARCH_OFFER_END_DATE_LABEL } from "@/constants/marchOffer";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

const DESKTOP_MAIN_BANNER_SRC =
  "/special-offer/20260306/Desktop%20Version/Desktop%20Main%20Banner.png";

export function MarchOfferDialog() {
  const { open, setOpen } = useMarchOfferDialog();
  const {
    setOpen: setOpenPricingOffer,
    setTabType,
    setSubscriptionFilter,
  } = usePricingOffer();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen]);

  const handleGetOffer = () => {
    setOpen(false);
    setTabType("subscription");
    setSubscriptionFilter("monthly");
    setOpenPricingOffer(true);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[460] flex items-center justify-center p-4 md:p-6">
      <div
        className="absolute inset-0 bg-[rgba(8,18,46,0.44)] backdrop-blur-[3px]"
        onClick={() => setOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="march-offer-dialog-title"
        aria-describedby="march-offer-dialog-description"
        className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[28px] bg-[#D9EFF8] shadow-[0_40px_90px_rgba(6,17,46,0.34)]"
      >
        <div className="sr-only">
          <h2 id="march-offer-dialog-title">March special offer</h2>
          <p id="march-offer-dialog-description">
            Up to 55 percent off monthly and yearly AroundChess analysis plans.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close March special offer dialog"
          className="absolute right-4 top-4 z-20 text-white transition-transform duration-200 hover:scale-105 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A5B9D] md:right-5 md:top-5"
        >
          <X className="h-6 w-6 md:h-7 md:w-7" />
        </button>

        <div className="relative">
          <Image
            src={DESKTOP_MAIN_BANNER_SRC}
            alt="March special offer featuring monthly and yearly discounted analysis plans."
            width={886}
            height={997}
            priority
            draggable={false}
            className="h-auto w-full select-none"
          />
        </div>

        <div className="relative -mt-12 px-6 pb-6 sm:-mt-14 sm:px-8 md:-mt-16 md:px-10 md:pb-7">
          <button
            type="button"
            onClick={handleGetOffer}
            className="w-full rounded-full bg-[linear-gradient(180deg,#3C30FF_0%,#261CEB_100%)] px-6 py-3.5 text-[17px] font-semibold text-white shadow-[0_16px_36px_rgba(38,28,235,0.28)] transition-all duration-200 hover:scale-[1.01] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C30FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#D9EFF8] md:py-4 md:text-[18px]"
          >
            Get Offer
          </button>

          <p className="mt-3 text-center text-[13px] font-medium text-[#5E7389] md:text-[15px]">
            Offer ends {MARCH_OFFER_END_DATE_LABEL}
          </p>
        </div>
      </div>
    </div>
  );
}
