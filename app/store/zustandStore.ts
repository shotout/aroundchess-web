// store/zustandStore.ts
"use client";

import { AnalysisResult } from '@/types/analysis-result';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PgnState {
  // Existing properties
  username: string;
  setUsername: (username: string) => void;
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
  
  // New properties for chess connection
  isChessConnected: boolean;
  setIsChessConnected: (isConnected: boolean) => void;
  chessComUsername: string;
  setChessComUsername: (username: string) => void;
} 

export const usePgnStore = create<PgnState>()(
  persist(
    (set) => ({
      // Existing state
      pgn: '',
      setPgn: (pgn) => set({ pgn }),
      username: '',
      setUsername: (username) => set({ username }),
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      error: null,
      setError: (error) => set({ error }),
      dataAnalysis: null,
      setDataAnalysis: (dataAnalysis: any) => set({dataAnalysis}),
      dataGames: null,
      setDataGames: (dataGames: any) => set({dataGames}),
      hideDiv: false,
      setHideDiv: (hideDiv: boolean) => set({hideDiv}),
      
      // New state for chess connection
      isChessConnected: false,
      setIsChessConnected: (isConnected: boolean) => set({ isChessConnected: isConnected }),
      chessComUsername: '',
      setChessComUsername: (username: string) => set({ chessComUsername: username }),
    }),
    {
      name: 'pgn-storage', // unique name for the storage
      storage: createJSONStorage(() => localStorage), // use localStorage by default
      partialize: (state) => ({
        pgn: state.pgn,
        dataAnalysis: state.dataAnalysis,
        username: state.username,
        dataGames: state.dataGames,
        // Include new state in persistence
        isChessConnected: state.isChessConnected,
        chessComUsername: state.chessComUsername,
      }),
    }
  )
);