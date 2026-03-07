"use client";

import { useMarchOfferDialog } from "@/app/store/marchOfferDialog";
import { usePricingOffer } from "@/app/store/pricingOffer";
import {
  MARCH_OFFER_DIALOG_DELAY_MS,
  MARCH_OFFER_DIALOG_MAX_WAIT_MS,
  MARCH_OFFER_DIALOG_SESSION_KEY,
} from "@/constants/marchOffer";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MarchOfferDialog } from "./MarchOfferDialog";

export function MarchOfferDialogTrigger() {
  const { setOpen } = useMarchOfferDialog();
  const { setOpenOffer } = usePricingOffer();
  const pathname = usePathname();
  const isEligibleRoute = pathname === "/analysis" || pathname === "/my-game-history";

  useEffect(() => {
    if (!isEligibleRoute) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const shouldShowModal =
      window.sessionStorage.getItem(MARCH_OFFER_DIALOG_SESSION_KEY) === "true";

    if (!shouldShowModal) {
      return;
    }

    let loadTimer: number | null = null;
    let maxTimer: number | null = null;
    let isModalShown = false;

    const showModal = () => {
      if (isModalShown) {
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

    const cleanup = scheduleModalDisplay();
    maxTimer = window.setTimeout(showModal, MARCH_OFFER_DIALOG_MAX_WAIT_MS);

    return () => {
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
  }, [isEligibleRoute, setOpen, setOpenOffer]);

  if (!isEligibleRoute) {
    return null;
  }

  return <MarchOfferDialog />;
}
