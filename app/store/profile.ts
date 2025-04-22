import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileState {
  profile: any;
  setProfile: (profile: any) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {},
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: "AI-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage), // use localStorage by default
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
);
