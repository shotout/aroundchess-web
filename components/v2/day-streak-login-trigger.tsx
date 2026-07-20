"use client";

import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/app/store/profile";
import { getLocalDateStamp, useStreakStore } from "@/app/store/streak";
import { useApiClient } from "@/functions/api-client";
import {
  CELEBRATION_LOTTIE,
  DayStreakModal,
  DayStreakStaticFlame,
  DayStreakVariant,
} from "@/components/v2/day-streak-modal";
import { isPlaygroundTourPending } from "@/components/v2/playground-tour-gate";
import { preloadLottie } from "@/components/v2/hooks/useLottieData";

/** Feature flag for the automatic daily check-in modal. When false the
 * component still fetches /streaks/status and keeps the streak store in sync
 * (badges + post-game celebration detection depend on it), but never opens
 * the modal on its own. Demo previews (?streakDemo=...) keep working.
 * Flip back to true to re-enable the daily modal. */
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

  // Warm the flame animation before the modal can open so the celebration
  // variant plays immediately instead of waiting on a fetch.
  useEffect(() => {
    preloadLottie(CELEBRATION_LOTTIE);
  }, []);

  // Demo/testing hook: /playground/play-vs-ai?streakDemo=login&streak=2
  // (also celebration / reward) previews any variant without waiting for
  // the real once-per-day and streak conditions. Add &flame=on|off to
  // preview the static-image (no lottie) celebration variants.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const demo = params.get("streakDemo");
    if (demo === "login" || demo === "celebration" || demo === "reward") {
      isDemoRef.current = true;
      const fallback = demo === "reward" ? 7 : demo === "celebration" ? 3 : 2;
      const flame = params.get("flame");
      setVariant(demo);
      setStaticFlame(flame === "on" || flame === "off" ? flame : undefined);
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
        if (!DAILY_LOGIN_MODAL_ENABLED) return;
        // New users see the playground tour first; the tour's finish opens
        // the (streak 0) modal itself, so don't also open it here.
        if (isPlaygroundTourPending()) return;
        if (store.lastLoginModalDate !== getLocalDateStamp()) {
          // Daily check-in is always the static image (no lottie): unlit
          // flame until today's first game is played, lit after.
          const playedToday = store.lastPlayDate === getLocalDateStamp();
          setVariant("celebration");
          setStaticFlame(playedToday ? "on" : "off");
          setStreakToShow(currentStreak);
          setOpen(true);
        }
      })
      .catch(() => {});
  }, [hydrated, profileHydrated, sessionId, getStreakStatus]);

  // Stamp the once-per-day guard when the daily modal actually shows.
  // (Hook-request shows — tutorial finish, badge clicks — are stamped by
  // DayStreakModalHost in the root layout.)
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
