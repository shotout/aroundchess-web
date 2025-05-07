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
import { useProfileStore } from "./store/profile";
import { useApiClient } from "@/functions/api-client";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function Home() {
  const { isLoading, dataAnalysis } = usePgnStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setTokenId] = useLocalStorage<string>("token", "");

  const { setUsername } = usePgnStore();
  const {
    getTokenBalance,
    getProfile,
    getActiveMembership,
    getAllMembershipPackage,
    getPuzzle,
  } = useApiClient();
  const {
    token: tokenBalance,
    setToken,
    setActiveMembership,
    setAllMembershipPackages,
    setProfile,
    setPuzzleLog,
    setIsMember,
  } = useProfileStore();
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      getProfile({}).then((response) => {
        let data = response.data;
        console.log("getProfile", data);
        setProfile(data);
        setUsername(data.username);
      });
      getTokenBalance({}).then((response) => {
        let data = response.data;
        console.log("getTokenBalance", data);
        setToken(data);
      });
      getActiveMembership({}).then((response) => {
        let data = response.data;
        console.log("getActiveMembership", data);
        setIsMember(data.status == "ACTIVE");
        setActiveMembership(data);
      });
      getAllMembershipPackage({}).then((response) => {
        let data = response.data;
        console.log("getAllMembershipPackage", data);
        setAllMembershipPackages(data);
      });
      getPuzzle().then((res) => {
        let logs = res.data;
        setPuzzleLog(logs);
        console.log("log puzzle", logs);
      });
    }
  }, [token]);
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
