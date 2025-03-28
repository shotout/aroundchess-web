// Updated zustandStore.ts using sessionStorage instead of localStorage
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
  
  gamesData: Game[];
  gamesLastFetched: number | null;
  
  setPgn: (pgn: string) => void;
  setUsername: (username: string) => void;
  setDataAnalysis: (dataAnalysis: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  resetFetchState: () => void;
  setHideDiv: (hideDiv: boolean) => void
  
  setGamesData: (games: Game[]) => void;
  clearGamesData: () => void;
  
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
      
      // Actions
      setPgn: (pgn: string) => set({ pgn }),
      
      setUsername: (username: string) => set((state) => ({ 
        username,
        // Only update timestamp if username actually changed
        lastFetchTimestamp: username !== state.username ? Date.now() : state.lastFetchTimestamp
      })),

      setHideDiv: (hideDiv:boolean) => set({hideDiv}),
      
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
      
      // Clear everything (still available but not needed for session expiration)
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
      name: 'pgn-session-storage', // Changed name to indicate session storage
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
      partialize: (state) => ({
        username: state.username,
        pgn: state.pgn,
        gamesData: state.gamesData,
        gamesLastFetched: state.gamesLastFetched,
      }),
    }
  )
);