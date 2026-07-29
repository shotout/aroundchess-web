"use client";

import { useMarchOfferDialog } from "@/app/store/marchOfferDialog";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { hasMembership, useHasMembership } from "@/app/store/profile";
import {
  MARCH_OFFER_DIALOG_DELAY_MS,
  MARCH_OFFER_DIALOG_MAX_WAIT_MS,
  MARCH_OFFER_DIALOG_SESSION_KEY,
} from "@/constants/marchOffer";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MarchOfferDialog } from "./MarchOfferDialog";

export function MarchOfferDialogTrigger() {
  const { open, setOpen } = useMarchOfferDialog();
  const { setOpenOffer } = usePricingOffer();
  const pathname = usePathname();
  const isEligibleRoute = pathname === "/analysis" || pathname === "/my-game-history";
  const isMember = useHasMembership();

  // Members have nothing to buy here. The membership call can land after the
  // dialog opened, so close it as soon as we know rather than only gating the
  // initial show.
  useEffect(() => {
    if (isMember && open) {
      setOpen(false);
    }
  }, [isMember, open, setOpen]);

  useEffect(() => {
    if (!isEligibleRoute || isMember) {
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

      // Re-checked at fire time: the membership call may have resolved during
      // the delay. Drop the pending flag either way so it can't fire later.
      if (hasMembership()) {
        window.sessionStorage.removeItem(MARCH_OFFER_DIALOG_SESSION_KEY);
        return;
      }
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
  }, [isEligibleRoute, isMember, setOpen, setOpenOffer]);

  if (!isEligibleRoute || isMember) {
    return null;
  }

  return <MarchOfferDialog />;
}
