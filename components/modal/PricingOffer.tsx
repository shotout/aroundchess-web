"use client";

import { usePricingOffer } from "@/app/store/pricingOffer";
import React, { useEffect, useState } from "react";
import { PaywallContent } from "@/components/v2/paywall-content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";
import { usePathname, useRouter } from "next/navigation";

export const PAYWALL_ROUTE = "/premium";
const PAYWALL_PAGE_MAX_WIDTH = 640;

export const PricingOffer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { open, setOpen } = usePricingOffer();

  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 0 : window.innerWidth
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = viewportWidth > 0 && viewportWidth < PAYWALL_PAGE_MAX_WIDTH;

  useEffect(() => {
    if (!open || !isMobile) return;
    setOpen(false);
    if (pathname !== PAYWALL_ROUTE) router.push(PAYWALL_ROUTE);
  }, [open, isMobile, pathname, router, setOpen]);

  if (isMobile) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogContent
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:max-w-[680px] xl:max-w-[1141px] max-h-[97%] rounded-lg bg-[#F7FCFF] p-4 sm:p-6 shadow-xl overflow-y-auto z-[1000]`}
        >
          <div className="text-center py-2 z-2 md:px-8">
            <DialogTitle className=" text-[18px] lg:text-[32px] font-medium">
              Become a Chess Master
            </DialogTitle>
            <DialogDescription className="font-normal text-[14px] lg:text-[20px] text-[#2e2e2e]">
              <span className="text-[#221AE9]">
                Go Premium for Unlimited Access{" "}
              </span>
              or buy Analysis Tokens for access to more Analyses.
            </DialogDescription>
          </div>

          <PaywallContent source="pricing_dialog" />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
