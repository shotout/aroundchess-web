import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileState {
  profile: any;
  setProfile: (profile: any) => void;
  token: any;
  setToken: (token: any) => void;
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
      token: {},
      setToken: (token) => set({ token }),
      activeMembership: {},
      setActiveMembership: (activeMembership) => set({ activeMembership }),
      allMembershipPackages: {},
      setAllMembershipPackages: (allMembershipPackages) =>
        set({ allMembershipPackages }),
      puzzleLog: {},
      setPuzzleLog: (puzzleLog) => set({ puzzleLog }),
      isMember:false,
      setIsMember:(isMember)=>set({isMember})
    }),
    {
      name: "AI-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage), // use localStorage by default
      partialize: (state) => ({
        profile: state.profile,
        token: state.token,
        activeMembership: state.activeMembership,
        allMembershipPackages: state.allMembershipPackages,
        puzzleLog: state.puzzleLog,
        isMember: state.isMember,
      }),
    }
  )
);
