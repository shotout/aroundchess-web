import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ModalSettingState {
  open: boolean;
  setOpen: (open: boolean) => void;
  setting: {
    essential: boolean;
    marketing: boolean;
    functional: boolean;
    analytics: boolean;
  };
  setSetting: (setting: {
    essential: boolean;
    marketing: boolean;
    functional: boolean;
    analytics: boolean;
  }) => void;
}

export const useModalSetting = create<ModalSettingState>()(
  persist(
    (set) => ({
      open: false,
      setOpen: (open) => set({ open }),
      setting: {
        essential: false, // Always enabled
        marketing: false,
        functional: false,
        analytics: false,
      },
      setSetting: (setting) => set({ setting }),
    }),
    {
      name: "modal-settings",
      partialize: (state) => ({
        setting: state.setting,
      }),
    }
  )
);
