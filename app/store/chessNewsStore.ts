import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ChessNewsState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  categories:any[];
  setCategories: (categories: any[]) => void;
  chessNews: any[];
  setChessNews: (chessNews: any[]) => void; 
  detailNews: any;
  setDetailNews: (detailNews: any) => void; 
}

export const useChessNewsStore= create<ChessNewsState>()(
  persist((set) => ({
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    categories: [],
    setCategories: (categories) => set({ categories }),
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