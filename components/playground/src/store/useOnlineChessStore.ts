import { create } from "zustand";
import { initialBoard } from "../utils/initialSetup";
import type { Board, PieceType } from "../types/chess";
import type { GameState, Player, Winner } from "../types/onlineChess";

interface OnlineChessStore {
  players: Player[];
  gameState: GameState;
  setPlayers: (players: Player[]) => void;
  setGameState: (gameState: GameState) => void;
  updatePlayersState: (players: Player[]) => void;
  updateGameState: (gameState: Partial<GameState>) => void;
  isValidMove: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
  movePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
  promotePawn: (row: number, col: number, piece: PieceType) => void;
}

const useOnlineChessStore = create<OnlineChessStore>((set, get) => ({
  players: [],
  gameState: {
    board: initialBoard as Board,
    currentPlayer: "white",
    movingPiece: null,
    winner: "none",
    isKingInCheck: "noCheck",
    status: "in-progress",
    lastMove: null,
    eliminatedPieces: { white: [], black: [] },
    kingCheckOrMoved: { white: false, black: false },
    rookMoved: { white: { left: false, right: false }, black: { left: false, right: false } },
    canPromotePawn: null
  },
  setPlayers: (players) => set({ players }),
  setGameState: (gameState) => set({ gameState }),
  updatePlayersState: (players) => set({ players }),
  updateGameState: (gameState) => set((state) => ({
    gameState: { ...state.gameState, ...gameState }
  })),
  isValidMove: (fromRow, fromCol, toRow, toCol) => {
    // Basic validation - can be expanded based on chess rules
    return true;
  },
  movePiece: (fromRow, fromCol, toRow, toCol) => {
    const state = get();
    if (state.isValidMove(fromRow, fromCol, toRow, toCol)) {
      // Implement move logic here
      return true;
    }
    return false;
  },
  promotePawn: (row, col, piece) => {
    const state = get();
    const newBoard = [...state.gameState.board];
    newBoard[row][col] = piece;
    set((state) => ({
      gameState: {
        ...state.gameState,
        board: newBoard,
        canPromotePawn: null
      }
    }));
  }
}));

export default useOnlineChessStore;
