import { create } from 'zustand';

interface ChessNewsState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  chessNews: any[];
  setChessNews: (chessNews: any[]) => void; 
  detailNews: any;
  setDetailNews: (detailNews: any) => void; 
}

export const useChessNewsStore = create<ChessNewsState>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    chessNews: [],
    setChessNews: (chessNews) => set({ chessNews }),
    detailNews: {},
    setDetailNews: (detailNews) => set({detailNews}),
   
}));