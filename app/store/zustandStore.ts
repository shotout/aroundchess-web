import { AnalysisResult } from '@/types/analysis-result';
import { create } from 'zustand';

interface PgnState {
  pgn: string;
  setPgn: (pgn: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  dataAnalysis: AnalysisResult | any;
  setDataAnalysis: (dataAnalysis: AnalysisResult | any) => void;
  dataGames: any;
  setDataGames: (dataGames: any) => void;
}

export const usePgnStore = create<PgnState>((set) => ({
  pgn: '',
  setPgn: (pgn) => set({ pgn }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
  dataAnalysis : null,
  setDataAnalysis : (dataAnalysis: any) => set({dataAnalysis}),
  dataGames : null,
  setDataGames : (dataGames: any) => set({dataGames}),
}));