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

/** The mobile paywall lives at its own route so the app header's back arrow and
 *  menu stay usable; below this width the dialog hands over to that page. */
export const PAYWALL_ROUTE = "/premium";
const PAYWALL_PAGE_MAX_WIDTH = 640;

export const PricingOffer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { open, setOpen } = usePricingOffer();

  // Read the width during the first client render (not in an effect) so mobile
  // never flashes the dialog before the redirect lands.
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

  // On mobile, any setOpen(true) from the ~10 call sites is turned into a
  // navigation to PAYWALL_ROUTE instead of opening the dialog. Every call site
  // keeps using the store, so none of them need to know about the route.
  useEffect(() => {
    if (!open || !isMobile) return;
    setOpen(false);
    // Already on the paywall page — just swallow the open request.
    if (pathname !== PAYWALL_ROUTE) router.push(PAYWALL_ROUTE);
  }, [open, isMobile, pathname, router, setOpen]);

  if (isMobile) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogContent
          style={{
            backgroundImage: "url(/images/pricing/bg-laptop.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:max-w-[680px] xl:max-w-[1141px] max-h-[97%] rounded-lg p-4 shadow-xl overflow-y-auto z-[1000]`}
        >
          <div className="text-center py-2 z-2 md:px-8">
            <DialogTitle className=" text-[18px] lg:text-[32px] font-medium">
              Become a Chess Master
            </DialogTitle>
            <DialogDescription className="font-normal text-[14px] lg:text-[20px] text-[#2e2e2e]">
              <span className="text-[#221AE9]">
                Go Premium for Unlimited Access{" "}
              </span>
              or buy Analysis Tokens for access to more AD-FREE Analyses.
            </DialogDescription>
          </div>

          <PaywallContent source="pricing_dialog" />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
