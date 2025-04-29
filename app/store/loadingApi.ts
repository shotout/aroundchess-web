import { create } from "zustand";

interface LoadingAPIState {
  isLoading: boolean;
  setIsLoading: (LoadingAPI: any) => void;
  estimateSecond: number;
  setEstimateSecond: (estimateSecond: any) => void;
  estimateMinute: number;
  setEstimateMinute: (estimateMinute: any) => void;
}

export const useLoadingAPI = create<LoadingAPIState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  estimateSecond: 0,
  setEstimateSecond: (estimateSecond) => set({ estimateSecond }),
  estimateMinute: 0,
  setEstimateMinute: (estimateMinute) => set({ estimateMinute }),
}));
