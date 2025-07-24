"use client";

import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { AnalysisSection } from "@/components/analysis-section";
import { CTASection } from "@/components/cta-section";
import { SiteHeaderNew } from "@/components/site-header-new";
import { SiteFooterNew } from "@/components/site-footer-new";
import { BasedOnAI } from "@/components/based-on-ai";
import { ImproveSection } from "@/components/improve-section";
import { BenefitsOf } from "@/components/benefits-of";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PricingOffer } from "@/components/modal/PricingOffer";
import { useProfileStore } from "./store/profile";
import { useApiClient } from "@/functions/api-client";
import { GrandmastersSection } from "@/components/GrandmasterSection";
import { formatTimePgn } from "@/functions/format-date";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";

const checkForAccessToken = () => {
  if (typeof window !== "undefined") {
    const hash = window.location.hash;
    return hash && hash.includes("access_token=");
  }
  return false;
};

export default function Home() {
  const [isRedirecting, setIsRedirecting] = useState(() =>
    checkForAccessToken()
  );
  const { setCallFetch } = useProfileFetch();
  const { sessionId, setAlreadyFetch } = useProfileStore();
  const hasRun = useRef(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && hash.includes("access_token=")) {
        setIsRedirecting(true);
        window.location.href = `/auth/callback${hash}`;
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (sessionId && sessionId !== "") {
      if (hasRun.current) return;
      hasRun.current = true;
      setAlreadyFetch(false);
      setCallFetch(formatTimePgn());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <>
      {isRedirecting ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Redirecting...
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your sign-in.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#e6f7fe]">
          <PricingOffer />
          <SiteHeaderNew />
          <HeroSection />
          <FeaturesSection />
          <AnalysisSection />
          <ImproveSection />
          <BenefitsOf />
          <BasedOnAI />
          <GrandmastersSection />
          <CTASection />
          <SiteFooterNew />
        </div>
      )}
    </>
  );
}
