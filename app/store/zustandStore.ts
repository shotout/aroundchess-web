// Updated zustandStore.ts with Performance data support
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define a Game interface for type safety
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

// Define the shape of your store state
interface PgnState {
  // Data
  pgn: string;
  username: string;
  dataAnalysis: any | null; 
  isLoading: boolean;
  lastFetchTimestamp: number;
  hideDiv: boolean;
  
  // Games data cache
  gamesData: Game[];
  gamesLastFetched: number | null;
  
  // Analytics data cache
  analyticsData: any | null;
  analyticsLastFetched: number | null;
  
  // Performance data cache
  performanceData: any | null;
  performanceLastFetched: number | null;
  
  // Actions for PGN and state
  setPgn: (pgn: string) => void;
  setUsername: (username: string) => void;
  setDataAnalysis: (dataAnalysis: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  resetFetchState: () => void;
  setHideDiv: (hideDiv: boolean) => void;
  
  // Actions for games data
  setGamesData: (games: Game[]) => void;
  clearGamesData: () => void;
  
  // Actions for analytics data
  setAnalyticsData: (data: any) => void;
  clearAnalyticsData: () => void;
  resetAnalyticsState: () => void;
  
  // Actions for performance data
  setPerformanceData: (data: any) => void;
  clearPerformanceData: () => void;
  resetPerformanceState: () => void;
  
  // Clear everything
  clearAll: () => void;
}

export const usePgnStore = create<PgnState>()(
  persist(
    (set) => ({
      // Initial state
      pgn: "",
      username: "",
      dataAnalysis: null,
      isLoading: false,
      lastFetchTimestamp: 0,
      hideDiv: false,
      
      // Game data cache - initially empty
      gamesData: [],
      gamesLastFetched: null,
      
      // Analytics data cache - initially empty
      analyticsData: null,
      analyticsLastFetched: null,
      
      // Performance data cache - initially empty
      performanceData: null,
      performanceLastFetched: null,
      
      // Actions
      setPgn: (pgn: string) => set({ pgn }),
      
      setUsername: (username: string) => set((state) => ({ 
        username,
        // Only update timestamp if username actually changed
        lastFetchTimestamp: username !== state.username ? Date.now() : state.lastFetchTimestamp
      })),

      setHideDiv: (hideDiv: boolean) => set({ hideDiv }),
      
      setDataAnalysis: (dataAnalysis: any) => set({ dataAnalysis }),
      
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      
      resetFetchState: () => set({ lastFetchTimestamp: Date.now() }),
      
      // Game data actions
      setGamesData: (games: Game[]) => set({ 
        gamesData: games,
        gamesLastFetched: Date.now()
      }),
      
      clearGamesData: () => set({ 
        gamesData: [],
        gamesLastFetched: null
      }),
      
      // Analytics data actions
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
      
      // Performance data actions
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
      
      // Clear everything (still available but not needed for session expiration)
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
        performanceLastFetched: null
      }),
    }),
    {
      name: 'pgn-session-storage', // Changed name to indicate session storage
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
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