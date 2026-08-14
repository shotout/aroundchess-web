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

export const DialogAnalyzeFree: React.FC<Props> = ({
  open,
  setOpen,
  onClose,
}) => {
  const [width, setWidth] = useState<number>(0);

  const dialogOpen = open;
  const setDialogOpen = (v: boolean) => {
    setOpen!(v);
  };

  useEffect(() => {
    setWidth(window?.innerWidth || 0);
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const src =
    width < 768
      ? "/offers/mobile-analyze-free.png"
      : "/offers/desktop-analyze-free.png";

  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
      <DialogPortal>
        <DialogContent
          className={`p-0 bg-white shadow-none overflow-hidden max-w-[92%] sm:max-w-[720px]`}
        >
          <div className="w-full h-full block -mt-4">
            <Image
              src={src}
              alt="Analyze 10 games for free"
              width={width < 768 ? 360 : 720}
              height={width < 768 ? 780 : 720}
              className="w-full h-full object-cover block"
              priority
            />
          </div>

          <div className=" absolute bottom-[10%] sm:bottom-[20%] left-1/2 transform -translate-x-1/2 w-full flex justify-center">
            <button
              onClick={() => setDialogOpen(false)}
              className={`max-w-[92%] sm:max-w-[720px] px-5 py-2 btn-primary rounded-full`}
            >
              Discover the Game Analysis
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default DialogAnalyzeFree;
