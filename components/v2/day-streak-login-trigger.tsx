"use client";

import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/app/store/profile";
import { getLocalDateStamp, useStreakStore } from "@/app/store/streak";
import { useApiClient } from "@/functions/api-client";
import {
  CELEBRATION_LOTTIE,
  DayStreakModal,
  DayStreakVariant,
} from "@/components/v2/day-streak-modal";
import { preloadLottie } from "@/components/v2/hooks/useLottieData";

export function DayStreakLoginTrigger({ suppressed }: { suppressed: boolean }) {
  const { sessionId, hydrated: profileHydrated } = useProfileStore();
  const hydrated = useStreakStore((s) => s.hydrated);
  const { getStreakStatus } = useApiClient();
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<DayStreakVariant>("login");
  const [streakToShow, setStreakToShow] = useState(0);
  const fetchedRef = useRef(false);
  const isDemoRef = useRef(false);

  // Warm the flame animation before the modal can open so the celebration
  // variant plays immediately instead of waiting on a fetch.
  useEffect(() => {
    preloadLottie(CELEBRATION_LOTTIE);
  }, []);

  // Demo/testing hook: /playground/play-vs-ai?streakDemo=login&streak=2
  // (also celebration / reward) previews any variant without waiting for
  // the real once-per-day and streak conditions.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const demo = params.get("streakDemo");
    if (demo === "login" || demo === "celebration" || demo === "reward") {
      isDemoRef.current = true;
      const fallback = demo === "reward" ? 7 : demo === "celebration" ? 3 : 2;
      setVariant(demo);
      setStreakToShow(parseInt(params.get("streak") ?? "", 10) || fallback);
      setOpen(true);
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
    getStreakStatus()
      .then((res: any) => {
        if (!res?.success) return;
        const store = useStreakStore.getState();
        const currentStreak = res.data?.currentStreak ?? 0;
        store.setStatus(res.data);
        store.setLastSeenStreak(currentStreak);
        if (store.lastLoginModalDate !== getLocalDateStamp()) {
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
      onClose={() => setOpen(false)}
    />
  );
}
