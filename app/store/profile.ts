import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileState {
  profile: any;
  setProfile: (profile: any) => void;
  sessionId: any;
  setSessionId: (sessionId: any) => void;
  token: any;
  setToken: (token: any) => void;
  tokenPackage: any;
  setTokenPackage: (token: any) => void;
  tokenData: any;
  setTokenData: (token: any) => void;
  activeMembership: any;
  setActiveMembership: (activeMembership: any) => void;
  allMembershipPackages: any;
  setAllMembershipPackages: (allMembershipPackages: any) => void;
  puzzleLog: any;
  setPuzzleLog: (puzzleLog: any) => void;
  alreadyFetch: boolean;
  setAlreadyFetch: (alreadyFetch: any) => void;
  alreadyFetchProfile: boolean;
  setAlreadyFetchProfile: (alreadyFetch: any) => void;
  isMember: any;
  setIsMember: (isMember: any) => void;
  isMemberMonthly: any;
  setIsMemberMonthly: (isMemberMonthly: any) => void;
  clearAll: () => void;
  hydrated: boolean;
  setHydrated: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      hydrated: false, // manually track hydration
      setHydrated: () => set({ hydrated: true }),
      profile: {},
      setProfile: (profile) => set({ profile }),
      tokenPackage: {},
      setTokenPackage: (tokenPackage) => set({ tokenPackage }),
      tokenData: {},
      setTokenData: (tokenData) => set({ tokenData }),
      token: {},
      setToken: (token) => set({ token }),
      alreadyFetch: false,
      setAlreadyFetch: (alreadyFetch) => set({ alreadyFetch }),
      alreadyFetchProfile: false,
      setAlreadyFetchProfile: (alreadyFetchProfile) => set({ alreadyFetchProfile }),
      sessionId: "",
      setSessionId: (sessionId) => set({ sessionId }),
      activeMembership: {},
      setActiveMembership: (activeMembership) => set({ activeMembership }),
      allMembershipPackages: {},
      setAllMembershipPackages: (allMembershipPackages) =>
        set({ allMembershipPackages }),
      puzzleLog: {},
      setPuzzleLog: (puzzleLog) => set({ puzzleLog }),
      isMember: null,
      setIsMember: (isMember) => set({ isMember }),
      isMemberMonthly: null,
      setIsMemberMonthly: (isMemberMonthly) => set({ isMemberMonthly }),
      clearAll: () =>
        set({
          profile: {},
          tokenPackage: {},
          token: {},
          sessionId: "",
          activeMembership: {},
          allMembershipPackages: {},
          puzzleLog: {},
          isMember: null,
          isMemberMonthly: null,
        }),
    }),

    {
      name: "Profile-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({
        alreadyFetch: state.alreadyFetch,
        alreadyFetchProfile: state.alreadyFetchProfile,
        profile: state.profile,
        token: state.token,
        sessionId: state.sessionId,
        activeMembership: state.activeMembership,
        allMembershipPackages: state.allMembershipPackages,
        puzzleLog: state.puzzleLog,
        isMember: state.isMember,
        isMemberMonthly: state.isMemberMonthly,
      }),
    }
  )
);
