"use client";

import { useConfirmLogin } from "@/app/store/confirmLogin";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import { usePricingOffer } from "@/app/store/pricingOffer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ConfirmLogin() {
  const router = useRouter();
  const { open, setOpen } = useConfirmLogin();
  const { setOpen: setOpenPricingOffer } = usePricingOffer();
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleRegister = () => {
    setOpen(false);
    setOpenPricingOffer(false);
    router.push("/register");
  };
  const handleLogin = () => {
    setOpen(false);
    setOpenPricingOffer(false);
    router.push("/login");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-lg z-[9999] max-w-sm sm:max-w-[640px] sm:h-[408px] lg:p-[32px] bg-white max-h-[95%] overflow-y-hidden">
        <div className="flex flex-col justify-center items-center bg-white">
          <div className="flex flex-row items-center justify-center gap-3">
            <Image
              src="/images/validation/login-vector.png"
              alt="Logo"
              width={1000}
              height={1000}
              className="w-[150px] h-[120px] sm:w-[188px] sm:h-[160px] object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-4 mb-4">
            <span className="font-semibold text-[24px] text-[#121212] text-center">
              Login to see all features
            </span>
            <span className="font-normal text-[18px] text-[#364152] text-center">
              To see all Features of AroundChess, please Login or Create an
              Account.
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-3">
          <button
            onClick={handleRegister}
            className="w-full btn-secondary rounded-full h-[44px] "
          >
            <span className="font-medium text-[14px] -- sm:text-[16px] text-[#221AE9]">
              Create an Account
            </span>
          </button>
          <button
            onClick={handleLogin}
            className="w-full btn-primary rounded-full h-[44px] "
          >
            <span className="font-medium text-[14px] -- sm:text-[16px] text-[#e6f7fe]">
              Login
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
