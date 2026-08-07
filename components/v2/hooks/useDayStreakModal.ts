"use client";

import { create } from "zustand";
import { getLocalDateStamp, isStreakBroken, useStreakStore } from "@/app/store/streak";
import type {
  DayStreakStaticFlame,
  DayStreakVariant,
} from "@/components/v2/day-streak-modal";

export interface DayStreakModalRequest {
  variant: DayStreakVariant;
  streak: number;
  staticFlame?: DayStreakStaticFlame;
  preview?: boolean;
}

interface DayStreakModalState {
  request: DayStreakModalRequest | null;
  open: (request: DayStreakModalRequest) => void;
  close: () => void;
}

export const useDayStreakModal = create<DayStreakModalState>((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

export function openDayStreakModal(request: DayStreakModalRequest) {
  useDayStreakModal.getState().open(request);
}

export function openDayStreakStatusModal(streak?: number) {
  const { currentStreak, lastPlayDate, status } = useStreakStore.getState();
  if (isStreakBroken(status)) {
    openDayStreakModal({
      variant: "broken",
      streak: streak ?? currentStreak,
    });
    return;
  }
  openDayStreakModal({
    variant: "celebration",
    streak: streak ?? currentStreak,
    staticFlame: lastPlayDate === getLocalDateStamp() ? "on" : "off",
  });
}
