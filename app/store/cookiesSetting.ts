import { create } from "zustand";

interface ModalSettingState {
  open: boolean;
  setOpen: (ModalSettingn: any) => void;
  setting: any;
  setSetting: (setting: any) => void;
}

export const useModalSetting = create<ModalSettingState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  setting: {
    essential: true, // Always enabled
    marketing: true,
    functional: true,
    analytics: true,
  },
  setSetting: (setting) => set({ setting }),
}));
