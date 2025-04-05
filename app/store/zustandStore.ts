import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Game {
  id: number;
  date: string;
  opponent: string;
  result: string;
  eloChange: string;
  resultColor: string;
  rating: string;
  opening: string;
  moves: string;
  timeControl: string;
  source: string;
  gameType: string;
  color: string;
  gameFormat: string;
  pgn: string;
}

export interface AnalysisResult {
  [key: string]: any;
}

interface PgnState {
  pgn: string;
  username: string;
  dataAnalysis: AnalysisResult | null;
  isLoading: boolean;
  lastFetchTimestamp: number;
  hideDiv: boolean;
  
  gamesData: Game[];
  gamesLastFetched: number | null;

  otherGamesData: Game[];
  otherGamesLastFetched: number | null;
  
  analyticsData: any | null;
  analyticsLastFetched: number | null;
  
  performanceData: any | null;
  performanceLastFetched: number | null;

  error: Error | null;
  dataGamesImport: any;
  dataGames: any;
  capturedWhite: any[];
  capturedBlack: any[];
  
  setPgn: (pgn: string) => void;
  setUsername: (username: string) => void;
  setDataAnalysis: (dataAnalysis: AnalysisResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  resetFetchState: () => void;
  setError: (error: Error | null) => void;
  setDataGamesImport: (dataGamesImport: any) => void;
  setDataGames: (dataGames: any) => void;
  setHideDiv: (hideDiv: boolean) => void;
  
  setCapturedWhite: (capturedWhite: any[]) => void;
  setCapturedBlack: (capturedBlack: any[]) => void;
  
  setGamesData: (games: Game[]) => void;
  setOtherGamesData: (games: Game[]) => void;
  clearGamesData: () => void;
  clearOtherGamesData: () => void;
  
  setAnalyticsData: (data: any) => void;
  clearAnalyticsData: () => void;
  resetAnalyticsState: () => void;
  
  setPerformanceData: (data: any) => void;
  clearPerformanceData: () => void;
  resetPerformanceState: () => void;
  
  clearAll: () => void;
}

export const usePgnStore = create<PgnState>()(
  persist(
    (set) => ({
      pgn: "",
      username: "",
      dataAnalysis: null,
      isLoading: false,
      lastFetchTimestamp: 0,
      hideDiv: false,
      
      gamesData: [],
      gamesLastFetched: null,

      otherGamesData: [],
      otherGamesLastFetched: null,
      
      analyticsData: null,
      analyticsLastFetched: null,
      
      performanceData: null,
      performanceLastFetched: null,

      error: null,
      dataGamesImport: null,
      dataGames: null,
      capturedWhite: [],
      capturedBlack: [],
      
      setPgn: (pgn: string) => set({ pgn }),
      
      setUsername: (username: string) => set((state) => ({ 
        username,
        lastFetchTimestamp: username !== state.username ? Date.now() : state.lastFetchTimestamp
      })),

      setHideDiv: (hideDiv: boolean) => set({ hideDiv }),
      
      setDataAnalysis: (dataAnalysis: AnalysisResult | null) => set({ dataAnalysis }),
      
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      
      resetFetchState: () => set({ lastFetchTimestamp: Date.now() }),

      setError: (error: Error | null) => set({ error }),
      
      setDataGamesImport: (dataGamesImport: any) => set({ dataGamesImport }),
      
      setDataGames: (dataGames: any) => set({ dataGames }),

      setCapturedWhite: (capturedWhite: any[]) => set({ capturedWhite }),
      
      setCapturedBlack: (capturedBlack: any[]) => set({ capturedBlack }),
      
      setGamesData: (games: Game[]) => set({ 
        gamesData: games,
        gamesLastFetched: Date.now()
      }),

      setOtherGamesData: (games: Game[]) => set({
        otherGamesData: games,
        otherGamesLastFetched: Date.now()
      }),
      
      clearGamesData: () => set({ 
        gamesData: [],
        gamesLastFetched: null
      }),

      clearOtherGamesData: () => set({
        otherGamesData: [],
        otherGamesLastFetched: null
      }),
      
      setAnalyticsData: (data: any) => set({
        analyticsData: data,
        analyticsLastFetched: Date.now()
      }),
      
      clearAnalyticsData: () => set({
        analyticsData: null,
        analyticsLastFetched: null
      }),
      
      resetAnalyticsState: () => set({
        analyticsLastFetched: Date.now()
      }),
      
      setPerformanceData: (data: any) => set({
        performanceData: data,
        performanceLastFetched: Date.now()
      }),
      
      clearPerformanceData: () => set({
        performanceData: null,
        performanceLastFetched: null
      }),
      
      resetPerformanceState: () => set({
        performanceLastFetched: Date.now()
      }),
      
      clearAll: () => set({ 
        pgn: "",
        username: "",
        dataAnalysis: null,
        isLoading: false,
        lastFetchTimestamp: 0,
        gamesData: [],
        gamesLastFetched: null,
        analyticsData: null,
        analyticsLastFetched: null,
        performanceData: null,
        performanceLastFetched: null,
        error: null,
        dataGamesImport: null,
        dataGames: null,
        capturedWhite: [],
        capturedBlack: [],
        hideDiv: false,
        otherGamesData: [],
        otherGamesLastFetched: null
      }),
    }),
    {
      name: 'pgn-session-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        username: state.username,
        pgn: state.pgn,
        gamesData: state.gamesData,
        gamesLastFetched: state.gamesLastFetched,
        analyticsData: state.analyticsData,
        analyticsLastFetched: state.analyticsLastFetched,
        performanceData: state.performanceData,
        performanceLastFetched: state.performanceLastFetched,
      }),
    }
  )
);