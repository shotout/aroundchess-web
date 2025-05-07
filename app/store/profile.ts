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
  activeMembership: any;
  setActiveMembership: (activeMembership: any) => void;
  allMembershipPackages: any;
  setAllMembershipPackages: (allMembershipPackages: any) => void;
  puzzleLog: any;
  setPuzzleLog: (puzzleLog: any) => void;

  isMember: any;
  setIsMember: (isMember: any) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {},
      setProfile: (profile) => set({ profile }),
      tokenPackage: {},
      setTokenPackage: (tokenPackage) => set({ tokenPackage }),
      token: {},
      setToken: (token) => set({ token }),
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
    }),
    {
      name: "Profile-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage), // use localStorage by default
      partialize: (state) => ({
        profile: state.profile,
        token: state.token,
        sessionId: state.sessionId,
        activeMembership: state.activeMembership,
        allMembershipPackages: state.allMembershipPackages,
        puzzleLog: state.puzzleLog,
        isMember: state.isMember,
      }),
    }
  )
);
