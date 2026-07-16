"use client";

import { create } from "zustand";
import { getLocalDateStamp, useStreakStore } from "@/app/store/streak";
import type {
  DayStreakStaticFlame,
  DayStreakVariant,
} from "@/components/v2/day-streak-modal";

export interface DayStreakModalRequest {
  variant: DayStreakVariant;
  streak: number;
  /** Set to render the static flame image instead of playing the lottie —
   * "off" when the user hasn't played today, "on" when they already have. */
  staticFlame?: DayStreakStaticFlame;
}

interface DayStreakModalState {
  request: DayStreakModalRequest | null;
  open: (request: DayStreakModalRequest) => void;
  close: () => void;
}

/** Global day-streak modal requests, rendered by DayStreakLoginTrigger.
 * Lets any flow (tutorial finish, login check) pop the modal without owning
 * the modal markup itself. */
export const useDayStreakModal = create<DayStreakModalState>((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

/** Imperative opener for non-React call sites (event handlers, callbacks). */
export function openDayStreakModal(request: DayStreakModalRequest) {
  useDayStreakModal.getState().open(request);
}

/** Opens the modal with the user's current streak status — static flame,
 * lit only if today's game is already played. Used by the streak badges in
 * the sidebar, headers, and play top bar. Pass the badge's own streak value
 * so the modal always matches what the badge shows. */
export function openDayStreakStatusModal(streak?: number) {
  const { currentStreak, lastPlayDate } = useStreakStore.getState();
  openDayStreakModal({
    variant: "celebration",
    streak: streak ?? currentStreak,
    staticFlame: lastPlayDate === getLocalDateStamp() ? "on" : "off",
  });
}
