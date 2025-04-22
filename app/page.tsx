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
import { usePgnStore } from "./store/zustandStore";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import { useEffect, useState } from "react";
import { PricingOffer } from "@/components/modal/PricingOffer";

export default function Home() {
  const { isLoading, dataAnalysis, setDataAnalysis } = usePgnStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("listening dataAnalysis", dataAnalysis);
    setLoading(isLoading);
  }, [dataAnalysis, isLoading]);
  return (
    <div>
      {loading == true ? (
        <LoadingPage />
      ) : (
        <>
          <PricingOffer />
          <SiteHeaderNew />
          <HeroSection />
          <FeaturesSection />
          <AnalysisSection />
          <ImproveSection />
          <BenefitsOf />
          <BasedOnAI />
          <CTASection />
          <SiteFooterNew />
        </>
      )}
    </div>
  );
}
