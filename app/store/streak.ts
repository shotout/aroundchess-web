import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const getLocalDateStamp = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

interface StreakState {
  status: any | null;
  currentStreak: number;
  lastLoginModalDate: string | null;
  lastSeenStreak: number;
  /** Local date of the last finished game — used to detect the first game
   * of the day (streak record-play call + celebration modal). */
  lastPlayDate: string | null;
  hydrated: boolean;
  setStatus: (status: any) => void;
  setLastLoginModalDate: (date: string) => void;
  setLastSeenStreak: (streak: number) => void;
  setLastPlayDate: (date: string) => void;
  setHydrated: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set) => ({
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      status: null,
      currentStreak: 0,
      lastLoginModalDate: null,
      lastSeenStreak: 0,
      setStatus: (status) =>
        set({ status, currentStreak: status?.currentStreak ?? 0 }),
      setLastLoginModalDate: (lastLoginModalDate) => set({ lastLoginModalDate }),
      setLastSeenStreak: (lastSeenStreak) => set({ lastSeenStreak }),
      lastPlayDate: null,
      setLastPlayDate: (lastPlayDate) => set({ lastPlayDate }),
    }),
    {
      name: "day-streak-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({
        status: state.status,
        currentStreak: state.currentStreak,
        lastLoginModalDate: state.lastLoginModalDate,
        lastSeenStreak: state.lastSeenStreak,
        lastPlayDate: state.lastPlayDate,
      }),
    }
  )
);
