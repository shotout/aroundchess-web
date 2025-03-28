// Updated zustandStore.ts with game data caching
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  dataAnalysis: any | null; // Replace 'any' with a more specific type if available
  isLoading: boolean;
  lastFetchTimestamp: number;
  
  // Game data cache
  gamesData: Game[];
  gamesLastFetched: number | null;
  
  // Actions
  setPgn: (pgn: string) => void;
  setUsername: (username: string) => void;
  setDataAnalysis: (dataAnalysis: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  resetFetchState: () => void;
  
  // Game data actions
  setGamesData: (games: Game[]) => void;
  clearGamesData: () => void;
  
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
      
      // Game data cache - initially empty
      gamesData: [],
      gamesLastFetched: null,
      
      // Actions
      setPgn: (pgn: string) => set({ pgn }),
      
      setUsername: (username: string) => set((state) => ({ 
        username,
        // Only update timestamp if username actually changed
        lastFetchTimestamp: username !== state.username ? Date.now() : state.lastFetchTimestamp
      })),
      
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
      
      // Clear everything for logout
      clearAll: () => set({ 
        pgn: "",
        username: "",
        dataAnalysis: null,
        isLoading: false,
        lastFetchTimestamp: 0,
        gamesData: [],
        gamesLastFetched: null
      }),
    }),
    {
      name: 'pgn-storage', // Name for localStorage
      partialize: (state) => ({
        // Only persist these fields to localStorage
        username: state.username,
        pgn: state.pgn,
        gamesData: state.gamesData,
        gamesLastFetched: state.gamesLastFetched,
        // Don't persist loading state or volatile data
      }),
    }
  )
);