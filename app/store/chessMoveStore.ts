import { ChessMove } from '@/types/chess-move';
import { create } from 'zustand';

interface ChessMoveState {
  chessMove: ChessMove|any;
  setChessMove: (chessMove: any) => void; 
}

export const useChessMoveStore = create<ChessMoveState>((set) => ({
  chessMove: {},
  setChessMove: (chessMove) => set({ chessMove }),
   
}));