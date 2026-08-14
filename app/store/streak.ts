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
  lastBrokenModalDate: string | null;
  lastSeenStreak: number;
  lastPlayDate: string | null;
  hydrated: boolean;
  setStatus: (status: any) => void;
  setLastLoginModalDate: (date: string) => void;
  setLastBrokenModalDate: (date: string) => void;
  setLastSeenStreak: (streak: number) => void;
  setLastPlayDate: (date: string | null) => void;
  setHydrated: () => void;
}

export const useHasPlayedToday = () =>
  useStreakStore((s) => s.lastPlayDate === getLocalDateStamp());

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

export function isStreakBroken(status: any): boolean {
  return !!status?.streakJustBroken || isStatusLastPlayStale(status?.lastPlayDate);
}

let statusRefreshKey: string | null = null;
let statusRefresh: Promise<any> | null = null;

export function refreshStreakStatus(
  sessionKey: string,
  fetchStatus: () => Promise<any>
): Promise<any> {
  if (statusRefresh && statusRefreshKey === sessionKey) return statusRefresh;
  statusRefreshKey = sessionKey;
  const pending: Promise<any> = fetchStatus()
    .then((res: any) => {
      if (res?.success) useStreakStore.getState().setStatus(res.data);
      return res;
    })
    .catch(() => null)
    .finally(() => {
      if (statusRefresh === pending) statusRefresh = null;
    });
  statusRefresh = pending;
  return pending;
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
