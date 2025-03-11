import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ChessNewsState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  chessNews: any[];
  setChessNews: (chessNews: any[]) => void; 
  detailNews: any;
  setDetailNews: (detailNews: any) => void; 
}

export const useChessNewsStore= create<ChessNewsState>()(
  persist((set) => ({
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    chessNews: [],
    setChessNews: (chessNews) => set({ chessNews }),
    detailNews: {},
    setDetailNews: (detailNews) => set({detailNews}),
   
  }),
  {
    name: 'pgn-storage', // unique name for the storage
    storage: createJSONStorage(() => localStorage), // use localStorage by default
    partialize: (state) => ({
      chessNews: state.chessNews,
      detailNews: state.detailNews,
    }),
  }
  )
  );