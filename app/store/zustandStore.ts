import { AnalysisResult } from '@/types/analysis-result';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
interface PgnState {
  username: string;
  setUsername: (pgn: string) => void;
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
  hideDiv: boolean;
  setHideDiv: (hideDiv: boolean) => void;
} 
export const usePgnStore = create<PgnState>()(
  persist(
    (set) => ({
  pgn: '',
  setPgn: (pgn) => set({ pgn }),
  username: '',
  setUsername: (username) => set({ username }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
  dataAnalysis : null,
  setDataAnalysis : (dataAnalysis: any) => set({dataAnalysis}),
  dataGames : null,
  setDataGames : (dataGames: any) => set({dataGames}),
  hideDiv : false,
  setHideDiv : (hideDiv: boolean) => set({hideDiv})
}),
{
  name: 'pgn-storage', // unique name for the storage
  storage: createJSONStorage(() => localStorage), // use localStorage by default
  partialize: (state) => ({
    pgn: state.pgn,
    dataAnalysis: state.dataAnalysis,
  }),
}
)
);

