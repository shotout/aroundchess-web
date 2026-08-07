"use client";

import { useEffect } from "react";
import {
  getLocalDateStamp,
  isStreakBroken,
  useStreakStore,
} from "@/app/store/streak";
import { openDayStreakModal } from "@/components/v2/hooks/useDayStreakModal";

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
      streak: status.currentStreak ?? 0,
    });
  }, [status, lastBrokenModalDate]);
}
