import { AnalysisResult } from '@/types/analysis-result';
import { create } from 'zustand';

interface PgnState {
  data: AnalysisResult | any;
  setData: (data: AnalysisResult | any) => void;
}

export const useGameHistory = create<PgnState>((set) => ({
  data : null,
  setData : (data: any) => set({data})
}));