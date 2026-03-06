"use client";

import { useMarchOfferDialog } from "@/app/store/marchOfferDialog";
import { useProfileStore } from "@/app/store/profile";
import { usePricingOffer } from "@/app/store/pricingOffer";
import {
  isMarchOfferEligibleProfile,
  MARCH_OFFER_DIALOG_DELAY_MS,
  MARCH_OFFER_DIALOG_MAX_WAIT_MS,
  MARCH_OFFER_DIALOG_SESSION_KEY,
} from "@/constants/marchOffer";
import { useApiClient } from "@/functions/api-client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MarchOfferDialog } from "./MarchOfferDialog";

export function MarchOfferDialogTrigger() {
  const { setOpen } = useMarchOfferDialog();
  const { setOpenOffer } = usePricingOffer();
  const { hydrated, profile, sessionId, setProfile } = useProfileStore();
  const { getProfile } = useApiClient();
  const pathname = usePathname();
  const isEligibleRoute = pathname === "/analysis" || pathname === "/my-game-history";

  useEffect(() => {
    if (!isEligibleRoute) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (!hydrated) {
      return;
    }

    const shouldShowModal =
      window.sessionStorage.getItem(MARCH_OFFER_DIALOG_SESSION_KEY) === "true";

    if (!shouldShowModal) {
      return;
    }

    if (!sessionId) {
      return;
    }

    let loadTimer: number | null = null;
    let maxTimer: number | null = null;
    let isModalShown = false;
    let isCancelled = false;

    const showModal = () => {
      if (isModalShown || isCancelled) {
        return;
      }

      isModalShown = true;
      setOpenOffer(false);
      setOpen(true);
      window.sessionStorage.removeItem(MARCH_OFFER_DIALOG_SESSION_KEY);

      if (loadTimer) {
        window.clearTimeout(loadTimer);
      }

      if (maxTimer) {
        window.clearTimeout(maxTimer);
      }
    };

    const scheduleModalDisplay = () => {
      if (document.readyState === "complete") {
        loadTimer = window.setTimeout(showModal, MARCH_OFFER_DIALOG_DELAY_MS);
        return undefined;
      }

      const handleLoad = () => {
        loadTimer = window.setTimeout(showModal, MARCH_OFFER_DIALOG_DELAY_MS);
      };

      window.addEventListener("load", handleLoad);

      return () => {
        window.removeEventListener("load", handleLoad);
        if (loadTimer) {
          window.clearTimeout(loadTimer);
        }
      };
    };

    let cleanup: (() => void) | undefined;

    const verifyEligibilityAndSchedule = async () => {
      try {
        const existingProfile = profile && Object.keys(profile).length > 0 ? profile : null;
        const response = existingProfile ? null : await getProfile({});
        if (isCancelled) {
          return;
        }

        const profileData = existingProfile ?? response?.data;
        if (!existingProfile && profileData) {
          setProfile(profileData);
        }

        if (!isMarchOfferEligibleProfile(profileData)) {
          window.sessionStorage.removeItem(MARCH_OFFER_DIALOG_SESSION_KEY);
          return;
        }

        cleanup = scheduleModalDisplay();
        maxTimer = window.setTimeout(showModal, MARCH_OFFER_DIALOG_MAX_WAIT_MS);
      } catch (error) {
        console.error("Error checking March offer eligibility:", error);
        window.sessionStorage.removeItem(MARCH_OFFER_DIALOG_SESSION_KEY);
      }
    };

    void verifyEligibilityAndSchedule();

    return () => {
      isCancelled = true;
      if (loadTimer) {
        window.clearTimeout(loadTimer);
      }

      if (maxTimer) {
        window.clearTimeout(maxTimer);
      }

      if (cleanup) {
        cleanup();
      }
    };
  }, [getProfile, hydrated, isEligibleRoute, profile, sessionId, setOpen, setOpenOffer, setProfile]);

  if (!isEligibleRoute) {
    return null;
  }

  return <MarchOfferDialog />;
}
