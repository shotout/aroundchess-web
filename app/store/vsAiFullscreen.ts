import { create } from "zustand";

// Play vs AI fullscreen flag, read by modals that must re-position over it.
interface VsAiFullscreenState {
  isFullscreen: boolean;
  setFullscreen: (value: boolean) => void;
}

export const useVsAiFullscreenStore = create<VsAiFullscreenState>((set) => ({
  isFullscreen: false,
  setFullscreen: (value) => set({ isFullscreen: value }),
}));
