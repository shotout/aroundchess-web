"use client";

import { useEffect } from "react";
import { getLocalDateStamp, useStreakStore } from "@/app/store/streak";
import {
  DayStreakModal,
  DayStreakStaticFlame,
  DayStreakVariant,
} from "@/components/v2/day-streak-modal";
import {
  openDayStreakModal,
  useDayStreakModal,
} from "@/components/v2/hooks/useDayStreakModal";
import { useBrokenStreakModal } from "@/components/v2/hooks/useBrokenStreakModal";

const DEMO_VARIANTS: Record<string, DayStreakVariant> = {
  zero: "celebration",
  unlit: "celebration",
  login: "login",
  celebration: "celebration",
  reward: "reward",
  broken: "broken",
};

const DEMO_STREAKS: Record<string, number> = {
  zero: 0,
  unlit: 2,
  login: 2,
  celebration: 3,
  reward: 7,
  broken: 0,
};

const DEMO_UNLIT = new Set(["zero", "unlit"]);

export function DayStreakModalHost() {
  const request = useDayStreakModal((s) => s.request);
  const close = useDayStreakModal((s) => s.close);

  useBrokenStreakModal();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const demo = params.get("streakDemo");
    const variant = demo ? DEMO_VARIANTS[demo] : undefined;
    if (!demo || !variant) return;

    const streak = parseInt(params.get("streak") ?? "", 10);
    const flame = params.get("flame");
    openDayStreakModal({
      variant,
      streak: Number.isFinite(streak) ? streak : DEMO_STREAKS[demo],
      staticFlame:
        variant === "broken"
          ? undefined
          : flame === "on" || flame === "off"
            ? (flame as DayStreakStaticFlame)
            : DEMO_UNLIT.has(demo)
              ? "off"
              : undefined,
      preview: true,
    });
  }, []);

  useEffect(() => {
    if (request?.staticFlame && !request.preview) {
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
