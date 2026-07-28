"use client";

import Navigation from "@/components/navigator/navigation";
import { PaywallContent } from "@/components/v2/paywall-content";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import { useEffect } from "react";

/**
 * Mobile paywall. The desktop equivalent is the PricingOffer dialog, which
 * redirects here below its breakpoint so the app header's back arrow and menu
 * stay available (a full-screen dialog covered both).
 */
export default function PremiumPage() {
  useEffect(() => {
    trackCustomEvent("ViewPremiumPage");
  }, []);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full bg-[#F3FBFF] px-4 pt-3 pb-8">
            <p className="text-[14px] font-normal text-[#2e2e2e] pb-2">
              <span className="text-[#221AE9]">
                Go Premium for Unlimited Access{" "}
              </span>
              or buy Analysis Tokens for access to more AD-FREE Analyses.
            </p>

            <PaywallContent source="pricing_dialog" />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
