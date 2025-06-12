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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";

export default function Home() {
  const { isLoading, dataAnalysis } = usePgnStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setTokenId] = useLocalStorage<string>("token", "");
  const { setCallFetch } = useProfileFetch();

  const { setSessionId } = useProfileStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        if (accessToken) {
          handleSSOSuccess(accessToken);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSSOSuccess = (accessToken: string) => {
    try {
      setPersistedCookie("token", accessToken, 365);

      setSessionId(accessToken);

      toast.success("Logged in successfully with Google!");

      router.push("/analysis");
    } catch (error) {
      toast.error("Failed to process Google login");
    }
  };

  const { getActiveMembership, getTokenPackage } = useApiClient();
  const { sessionId, setActiveMembership, setIsMember, setTokenPackage } =
    useProfileStore();
  useEffect(() => {
    if (sessionId && sessionId != "") {
      localStorage.setItem("token", token);

      getTokenPackage({}).then((response) => {
        if (response.data != null) {
          let data = response.data;
          console.log("getTokenPackage", data);
          setTokenPackage(data);
        }
      });
      getActiveMembership({}).then((response) => {
        let data = response.data;
        console.log("getActiveMembership", data);
        setIsMember(data.status == "ACTIVE");
        setActiveMembership(data);
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
