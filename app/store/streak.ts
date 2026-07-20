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
  setLastPlayDate: (date: string | null) => void;
  setHydrated: () => void;
}

/** Whether today's game has already been played — drives the lit/unlit
 * flame on the streak badges (sidebar, header, play top bar) so they match
 * the status modal's on/off flame logic. */
export const useHasPlayedToday = () =>
  useStreakStore((s) => s.lastPlayDate === getLocalDateStamp());

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
        set((state) => {
          // The backend's hasPlayedToday is authoritative over the local
          // first-game-of-the-day stamp: stamp today when it already counted
          // a play (e.g. another device), and clear a stale stamp when it
          // hasn't (e.g. reset backend data) so the next finished game
          // retries record-play instead of skipping it.
          const today = getLocalDateStamp();
          let lastPlayDate = state.lastPlayDate;
          if (status?.hasPlayedToday === true) {
            lastPlayDate = today;
          } else if (
            status?.hasPlayedToday === false &&
            lastPlayDate === today
          ) {
            lastPlayDate = null;
          }
          return {
            status,
            currentStreak: status?.currentStreak ?? 0,
            lastPlayDate,
          };
        }),
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
