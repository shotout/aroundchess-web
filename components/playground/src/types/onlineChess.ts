import type { 
  Board,
  kingCheckOrMoved as KingCheckOrMoved,
  MovePiece,
  NullableLastMove,
  PieceType,
  rookMoved as RookMoved,
  ValidState,
  LastMove,
  EliminatedPieces,
  CanPromotePawn
} from "./chess";
import { type Dispatch, type SetStateAction } from "react";

export interface Player {
  id: string;
  gameId?: string;
  name?: string;
  drawRequest?: boolean;
  color: "white" | "black";
}

export interface GameState {
  board: (PieceType | null)[][];
  status: "in-progress" | "checkmate" | "draw" | "resigned" | "promote";
  currentPlayer: "white" | "black";
  winner?: Winner;
  lastMove: LastMove | null;
  movingPiece?: NullableLastMove;
  kingCheckOrMoved?: KingCheckOrMoved;
  rookMoved?: RookMoved;
  eliminatedPieces?: EliminatedPieces;
  isKingInCheck?: string;
  canPromotePawn?: CanPromotePawn | null;
  whiteTime?: number;
  blackTime?: number;
}

export interface OnlineChessStore {
  players: Player[];
  gameState: GameState;
}

export type Winner = "white" | "black" | "none" | "draw" | "stalemate" | null;

export interface OnlineChessStoreActions {
  updateGameState: (gameState: Partial<GameState>) => void;
  updatePlayersState: (players: Player[]) => void;
  promotePawn: (row: number, col: number, newPiece: PieceType) => void;
  movePiece: MovePiece;
  isValidMove: ValidState;
}

export interface OnlinePiece {
  type: string;
  movingPiece?: NullableLastMove;
  position: { row: number; col: number };
  lastMove?: NullableLastMove;
  highlight: boolean;
  currentPlayer: "white" | "black";
  setSelectedPiece: Dispatch<SetStateAction<{ row: number; col: number } | null>>;
  playerColor: "white" | "black";
}
