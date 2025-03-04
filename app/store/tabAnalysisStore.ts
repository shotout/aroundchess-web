import { create } from 'zustand';

interface TabFocusState {
  tabFocus: string;
  setTabFocus: (tabFocus: string) => void; 
}

export const useTabFocusStore = create<TabFocusState>((set) => ({
    tabFocus: "",
    setTabFocus: (tabFocus) => set({ tabFocus }),
   
}));