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
  /** Local date the auto-popped "Your Streak Broke!" modal was last shown —
   * guards it to once per day so it doesn't re-open on every status refetch
   * / page visit while the streak stays broken. */
  lastBrokenModalDate: string | null;
  lastSeenStreak: number;
  /** Local date of the last finished game — used to detect the first game
   * of the day (streak record-play call + celebration modal). */
  lastPlayDate: string | null;
  hydrated: boolean;
  setStatus: (status: any) => void;
  setLastLoginModalDate: (date: string) => void;
  setLastBrokenModalDate: (date: string) => void;
  setLastSeenStreak: (streak: number) => void;
  setLastPlayDate: (date: string | null) => void;
  setHydrated: () => void;
}

/** Whether today's game has already been played — drives the lit/unlit
 * flame on the streak badges (sidebar, header, play top bar) so they match
 * the status modal's on/off flame logic. */
export const useHasPlayedToday = () =>
  useStreakStore((s) => s.lastPlayDate === getLocalDateStamp());

/** True once the status payload's lastPlayDate is 2 or more days behind
 * today — catches a stale streak even when the backend hasn't (yet) marked
 * streakJustBroken. */
export function isStatusLastPlayStale(
  lastPlayDate: string | null | undefined
): boolean {
  if (!lastPlayDate) return false;
  const last = new Date(lastPlayDate).getTime();
  const today = new Date(getLocalDateStamp()).getTime();
  if (Number.isNaN(last)) return false;
  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
  return diffDays >= 2;
}

/** Shared "should the broken-streak variant show" rule — true when the
 * backend flagged streakJustBroken or the status's lastPlayDate is stale.
 * Used by both the auto-pop watcher and the badge click handler so they
 * always agree. */
export function isStreakBroken(status: any): boolean {
  return !!status?.streakJustBroken || isStatusLastPlayStale(status?.lastPlayDate);
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set) => ({
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      status: null,
      currentStreak: 0,
      lastLoginModalDate: null,
      lastBrokenModalDate: null,
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
      setLastBrokenModalDate: (lastBrokenModalDate) =>
        set({ lastBrokenModalDate }),
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
        lastBrokenModalDate: state.lastBrokenModalDate,
        lastSeenStreak: state.lastSeenStreak,
        lastPlayDate: state.lastPlayDate,
      }),
    }
  )
);
