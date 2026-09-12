"use client";

import { useEffect } from "react";
import {
  getLocalDateStamp,
  isStreakBroken,
  useStreakStore,
} from "@/app/store/streak";
import { openDayStreakModal } from "@/components/v2/hooks/useDayStreakModal";

/** Watches the streak store's last-fetched /v4/streaks/status payload
 * (populated by Sidebar, DayStreakLoginTrigger, post-game record-play, ...)
 * and pops the "Your Streak Broke!" modal whenever isStreakBroken(status)
 * is true. Mounted once in DayStreakModalHost so it fires regardless of
 * which page/component triggered the fetch.
 *
 * Guarded to once per day: the status is persisted and refetched by several
 * components on every page (each setStatus is a new object), so without the
 * date stamp the modal would re-open on every refetch / page visit while the
 * streak stays broken. Mirrors the daily login modal's lastLoginModalDate. */
export function useBrokenStreakModal() {
  const status = useStreakStore((s) => s.status);
  const lastBrokenModalDate = useStreakStore((s) => s.lastBrokenModalDate);

  useEffect(() => {
    if (!isStreakBroken(status)) return;
    const today = getLocalDateStamp();
    if (lastBrokenModalDate === today) return;
    useStreakStore.getState().setLastBrokenModalDate(today);
    openDayStreakModal({
      variant: "broken",
      // Always 0, not status.currentStreak: the status payload still carries
      // the pre-break count (a 2-day streak that lapsed reports 2), and
      // showing it made the modal say "Play 5 more days" instead of the
      // "Start playing today - only 7 more days" copy a broken streak needs.
      streak: 0,
    });
  }, [status, lastBrokenModalDate]);
}
