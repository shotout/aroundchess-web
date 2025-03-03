import { AnalysisResult } from '@/types/analysis-result';
import { create } from 'zustand';

interface PgnState {
  pgn: string;
  setPgn: (pgn: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  dataAnalysis: AnalysisResult | null;
  setDataAnalysis: () => void;
}

export const usePgnStore = create<PgnState>((set) => ({
  pgn: '',
  setPgn: (pgn) => set({ pgn }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
  dataAnalysis : null,
  setDataAnalysis : (dataAnalysis) => set({dataAnalysis})
}));