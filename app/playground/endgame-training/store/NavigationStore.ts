import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ViewState {
  view: "categories" | "subcategories" | "detail";
  category?: string;
  subcategory?: string;
  position?: string;
  positionIndex?: number;
  movesToCheckmate?: number;
}

interface NavigationStore {
  activeTab: string;
  viewState: ViewState;
  hydrated: boolean;
  setActiveTab: (activeTab: string) => void;
  setViewState: (viewState: ViewState) => void;
  resetState: () => void;
  setHydrated: (state: boolean) => void;
}

export const useEndgameNavigation = create<NavigationStore>()(
  persist(
    (set) => ({
      activeTab: "board",
      viewState: { view: "categories" },
      hydrated: false,

      setActiveTab: (activeTab) => set({ activeTab }),
      setViewState: (viewState) => set({ viewState }),
      
      resetState: () => set({
        activeTab: "board",
        viewState: { view: "categories" }
      }),
      
      setHydrated: (state) => set({ hydrated: state }),
    }),
    {
      name: 'navigation-endgame', 
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);