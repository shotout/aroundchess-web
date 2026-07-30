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

/** ?streakDemo= values and the modal they preview. "zero", "unlit" and "broken"
 *  are the day-not-played states; the rest map straight to the modal's own
 *  variants. */
const DEMO_VARIANTS: Record<string, DayStreakVariant> = {
  zero: "celebration",
  unlit: "celebration",
  login: "login",
  celebration: "celebration",
  reward: "reward",
  broken: "broken",
};

/** Streak number each preview shows when no &streak= is given. */
const DEMO_STREAKS: Record<string, number> = {
  zero: 0,
  unlit: 2,
  login: 2,
  celebration: 3,
  reward: 7,
  broken: 0,
};

/** Previews that stand for "today's game isn't in yet", so they default to the
 *  static unlit flame (and with it the next-day chip + "Play now"). &flame=
 *  still overrides. */
const DEMO_UNLIT = new Set(["zero", "unlit"]);

/** Renders day-streak modal requests opened via useDayStreakModal /
 * openDayStreakModal from anywhere in the app (streak badges, tutorial
 * finish). Mounted once in the root layout. */
export function DayStreakModalHost() {
  const request = useDayStreakModal((s) => s.request);
  const close = useDayStreakModal((s) => s.close);

  useBrokenStreakModal();

  // UI preview, same idea as the playing page's ?winDemo=1: append
  // ?streakDemo=<state> to ANY page (the host lives in the root layout) to pop
  // the modal without playing games or waiting for the real conditions.
  //
  //   ?streakDemo=zero        0 Day Streak check-in (unlit flame)
  //   ?streakDemo=unlit       streak running, today not played yet (unlit flame)
  //   ?streakDemo=broken      "Your Streak Broke!" alert
  //   ?streakDemo=login | celebration | reward
  //   &streak=N               the number to show (0 included)
  //   &flame=on | off         static flame instead of the lottie
  //
  // Flagged as a preview so it never stamps the once-per-day guard below.
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

  // A static (login-style) show counts as today's streak check-in, so the
  // once-per-day login modal doesn't open again on the next page visit.
  // Previews are exempt — looking at the modal shouldn't burn the real one.
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
