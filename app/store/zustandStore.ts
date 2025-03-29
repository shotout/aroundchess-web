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
  dataGamesImport: any;
  setDataGamesImport: (dataGamesImport: any) => void;
  dataGames: any;
  setDataGames: (dataGames: any) => void;
  hideDiv: boolean;
  setHideDiv: (hideDiv: boolean) => void;
  
  capturedWhite:any[];
  setCapturedWhite: (capturedWhite: any[]) => void;
  capturedBlack:any[]
  setCapturedBlack: (capturedBlack: any[]) => void;
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
  dataGamesImport : null,
  setDataGamesImport : (dataGamesImport: any) => set({dataGamesImport}),
  hideDiv : false,
  setHideDiv : (hideDiv: boolean) => set({hideDiv}),
  
  capturedWhite:[],
  setCapturedWhite: (capturedWhite: any[]) => set({capturedWhite}),
  capturedBlack:[],
  setCapturedBlack: (capturedBlack: any[]) => set({capturedBlack}),
}),
{
  name: 'pgn-storage', // unique name for the storage
  storage: createJSONStorage(() => localStorage), // use localStorage by default
  partialize: (state) => ({
    pgn: state.pgn,
    dataAnalysis: state.dataAnalysis,
    username:state.username,
    dataGames:state.dataGames,
  }),
}
)
);

