"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTitle,
} from "components/ui/dialog";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { usePlaygroundTourActive } from "@/components/v2/playground-tour-active";

interface Props {}

export const DialogSpecialDiscount: React.FC<Props> = () => {
  const [width, setWidth] = useState<number>(0);
  const {
    openOffer,
    setOpenOffer,
    setOpen: setOpenPricing,
    setTabType,
  } = usePricingOffer();
  // Queue behind the playground tutorial: the offer stays armed (openOffer)
  // but the dialog only actually opens once the tour is off screen, so the
  // two never overlap on a first login that also ran out of analyses.
  const tourActive = usePlaygroundTourActive();

  useEffect(() => {
    // only run on client
    setWidth(window?.innerWidth || 0);
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const src = "/offers/special-discount.png";
  const close = () => {
    setOpenOffer(false);
    console.log("close offer")
  };
  return (
    <Dialog open={openOffer && !tourActive}>
      <DialogPortal>
        <DialogContent
          className={`pt-10 pb-12 px-4 bg-white flex flex-col justify-center items-center shadow-none overflow-hidden max-w-[92%] sm:max-w-[720px]`}
        >
          <DialogTitle className="">
            <span className="text-[16px] font-semibold">
              You have used all of your Analysis Tokens!
            </span>
            <div className="absolute top-3 right-2 bg-white z-[100]" onClick={close}>
              <Image
                onClick={close}
                src={"/icons/close.png"}
                alt="Close"
                width={1000}
                height={1000}
                className="cursor-pointer object-contain w-[30px] h-[24px] block bg-white"
                priority
              />
            </div>
          </DialogTitle>
          <div className="w-full flex flex-col items-center justify-center space-y-4 relative">
            <span className="text-[24px] text-center font-bold text-[#221AE9]">
              Get more Analyses at the best price!
            </span>
            <Image
              src={src}
              alt="Special Discount Offer"
              width={width < 768 ? 277 : 299}
              height={width < 768 ? 285 : 254}
              className="object-cover block"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full flex justify-center">
            <button
              onClick={() => {
                setOpenOffer(false);
                setTabType("subscription");

                setOpenPricing(true);
              }}
              className={`min-w-[92%] sm:max-w-[720px] px-5 py-2 btn-primary rounded-full`}
            >
              SEE OFFER
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default DialogSpecialDiscount;
