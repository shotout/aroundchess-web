import { create } from "zustand";

interface MobileSidebarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useMobileSidebar = create<MobileSidebarState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

