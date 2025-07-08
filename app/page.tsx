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
import { useEffect, useRef, useState } from "react";
import { PricingOffer } from "@/components/modal/PricingOffer";
import { useProfileStore } from "./store/profile";
import { useApiClient } from "@/functions/api-client";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GrandmastersSection } from "@/components/GrandmasterSection";

export default function Home() {
  const { isLoading, dataAnalysis, username } = usePgnStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setTokenId] = useLocalStorage<string>("token", "");
  // const { setCallFetch } = useProfileFetch();
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const { setSessionId } = useProfileStore();
  const router = useRouter();
  const baseUrl = process.env.BASE_URL;

  const showAlert = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setAlertDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const closeAlert = () => {
    setAlertDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleAlertConfirm = () => {
    if (alertDialog.onConfirm) {
      alertDialog.onConfirm();
    }
    closeAlert();
  };

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
  }, []);

  const handleSSOSuccess = async (accessToken: string) => {
    try {
      const response = await fetch(`${baseUrl}/profile/status`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showAlert(
          "Authentication Failed",
          "Authentication failed. Please try again.",
          () => router.push("/login")
        );
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        const { isActive, canLogin } = data.data;

        if (!isActive && !canLogin) {
          try {
            await fetch(`${baseUrl}/auth/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });
          } catch (logoutError) {}

          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token");
          setPersistedCookie("token", "", 0);
          setSessionId("");

          showAlert(
            "Account Deactivated",
            "Account has been deactivated. Please use account reactivation or contact support.",
            () => router.push("/login")
          );
          return;
        }

        setPersistedCookie("token", accessToken, 365);
        setSessionId(accessToken);

        try {
          const profileResponse = await fetch(`${baseUrl}/profile`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userUsername =
              profileData.data?.username || profileData.username;

            if (userUsername && userUsername.trim() !== "") {
              router.push("/my-game-history");
            } else {
              router.push("/analysis");
            }
          } else {
            router.push("/analysis");
          }
        } catch (profileError) {
          router.push("/analysis");
        }
      } else {
        showAlert(
          "Verification Failed",
          "Failed to verify account status. Please try again.",
          () => router.push("/login")
        );
      }
    } catch (error) {
      showAlert(
        "Login Failed",
        "Failed to process login. Please try again.",
        () => router.push("/login")
      );
    }
  };

  const { getActiveMembership, getTokenPackage } = useApiClient();
  const { sessionId, setActiveMembership, setIsMember, setTokenPackage } =
    useProfileStore();
  const hasRun = useRef(false);

  useEffect(() => {
    if (sessionId && sessionId != "") {
      localStorage.setItem("token", token);
      if (hasRun.current) return;
      hasRun.current = true;
      getTokenPackage({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setTokenPackage(data);
        }
      });
      getActiveMembership({}).then((response) => {
        const data = response.data;
        setIsMember(data.status == "ACTIVE");
        setActiveMembership(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(isLoading);
  }, [dataAnalysis, isLoading]);

  return (
    <div className="bg-[#e6f7fe]">
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
          <GrandmastersSection />
          <CTASection />
          <SiteFooterNew />
        </>
      )}

      <AlertDialog open={alertDialog.isOpen} onOpenChange={closeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAlertConfirm}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
