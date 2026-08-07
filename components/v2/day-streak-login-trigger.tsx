"use client";

import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/app/store/profile";
import {
  getLocalDateStamp,
  refreshStreakStatus,
  useStreakStore,
} from "@/app/store/streak";
import { useApiClient } from "@/functions/api-client";
import {
  CELEBRATION_LOTTIE,
  DayStreakModal,
  DayStreakStaticFlame,
  DayStreakVariant,
} from "@/components/v2/day-streak-modal";
import { isPlaygroundTourPending } from "@/components/v2/playground-tour-gate";
import { preloadLottie } from "@/components/v2/hooks/useLottieData";

const DAILY_LOGIN_MODAL_ENABLED = false;

export function DayStreakLoginTrigger({ suppressed }: { suppressed: boolean }) {
  const { sessionId, hydrated: profileHydrated } = useProfileStore();
  const hydrated = useStreakStore((s) => s.hydrated);
  const { getStreakStatus } = useApiClient();
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<DayStreakVariant>("login");
  const [staticFlame, setStaticFlame] = useState<
    DayStreakStaticFlame | undefined
  >(undefined);
  const [streakToShow, setStreakToShow] = useState(0);
  const fetchedRef = useRef(false);
  const isDemoRef = useRef(false);

  useEffect(() => {
    preloadLottie(CELEBRATION_LOTTIE);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("streakDemo")) {
      isDemoRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (
      !hydrated ||
      !profileHydrated ||
      !sessionId ||
      fetchedRef.current ||
      isDemoRef.current
    )
      return;
    fetchedRef.current = true;
    refreshStreakStatus(sessionId, getStreakStatus)
      .then((res: any) => {
        if (!res?.success) return;
        const store = useStreakStore.getState();
        const currentStreak = res.data?.currentStreak ?? 0;
        store.setLastSeenStreak(currentStreak);
        if (!DAILY_LOGIN_MODAL_ENABLED) return;
        if (isPlaygroundTourPending()) return;
        if (store.lastLoginModalDate !== getLocalDateStamp()) {
          const playedToday = store.lastPlayDate === getLocalDateStamp();
          setVariant("celebration");
          setStaticFlame(playedToday ? "on" : "off");
          setStreakToShow(currentStreak);
          setOpen(true);
        }
      })
      .catch(() => {});
  }, [hydrated, profileHydrated, sessionId, getStreakStatus]);

  useEffect(() => {
    if (open && !suppressed && !isDemoRef.current) {
      useStreakStore.getState().setLastLoginModalDate(getLocalDateStamp());
    }
  }, [open, suppressed]);

  if (!open || suppressed) return null;

  return (
    <DayStreakModal
      variant={variant}
      streak={streakToShow}
      staticFlame={staticFlame}
      onClose={() => setOpen(false)}
    />
  );
}
