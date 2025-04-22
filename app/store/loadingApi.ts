import { create } from "zustand";

interface LoadingAPIState {
  isLoading: boolean;
  setIsLoading: (LoadingAPI: any) => void;
}

export const useLoadingAPI = create<LoadingAPIState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
