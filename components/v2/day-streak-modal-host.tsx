"use client";

import { useEffect } from "react";
import { getLocalDateStamp, useStreakStore } from "@/app/store/streak";
import { DayStreakModal } from "@/components/v2/day-streak-modal";
import { useDayStreakModal } from "@/components/v2/hooks/useDayStreakModal";

/** Renders day-streak modal requests opened via useDayStreakModal /
 * openDayStreakModal from anywhere in the app (streak badges, tutorial
 * finish). Mounted once in the root layout. */
export function DayStreakModalHost() {
  const request = useDayStreakModal((s) => s.request);
  const close = useDayStreakModal((s) => s.close);

  // A static (login-style) show counts as today's streak check-in, so the
  // once-per-day login modal doesn't open again on the next page visit.
  useEffect(() => {
    if (request?.staticFlame) {
      useStreakStore.getState().setLastLoginModalDate(getLocalDateStamp());
    }
  }, [request]);

  if (!request) return null;

  return (
    <DayStreakModal
      variant={request.variant}
      streak={request.streak}
      staticFlame={request.staticFlame}
      onClose={close}
    />
  );
}
