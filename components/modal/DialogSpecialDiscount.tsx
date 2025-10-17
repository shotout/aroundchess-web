"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
} from "components/ui/dialog";

interface Props {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onClose: (open: boolean) => void;
}

export const DialogSpecialDiscount: React.FC<Props> = ({
  open,
  setOpen,
  onClose,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [width, setWidth] = useState<number>(0);

  const isControlled =
    typeof open !== "undefined" && typeof setOpen === "function";

  const dialogOpen = isControlled ? open! : internalOpen;
  const setDialogOpen = (v: boolean) => {
    if (isControlled) return setOpen!(v);
    return setInternalOpen(v);
  };

  useEffect(() => {
    // only run on client
    setWidth(window?.innerWidth || 0);
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const src = "/offers/special-discount.png";

  return (
    <Dialog open={dialogOpen} onOpenChange={() => onClose(false)}>
      <DialogPortal>
        <DialogContent
          className={`pt-4 pb-12 px-4 bg-white flex flex-col justify-center items-center shadow-none overflow-hidden max-w-[92%] sm:max-w-[720px]`}
        >
          <DialogTitle className="">
            <span className="text-[16px] font-semibold">
              You have used all of your Analysis Tokens!
            </span>
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
              onClick={() => setDialogOpen(false)}
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
