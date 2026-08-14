export type Player = "white" | "black"
export type PieceColor = "white" | "black"
export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k' | 'P' | 'R' | 'N' | 'B' | 'Q' | 'K';
export type typeCheckMate = "white" | "black" | "noCheckMate"
export type Board = (PieceType | null)[][];

export interface MoveDetails {
  piece: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  isCapture: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
}

export interface Piece {
  type: PieceType | null
  position: { row: number; col: number }
  lastMove: { type: string; fromRow: number; fromCol: number; toRow: number; toCol: number } | null
  currentPlayer: Player
  highlight: boolean
  setSelectedPiece: (piece: { row: number; col: number } | null) => void
  movingPiece: { 
    type: string; 
    fromRow: number; 
    fromCol: number; 
    toRow?: number; 
    toCol?: number; 
  } | null
}

export type CanPromotePawn = { row: number; col: number; piece: string | null } | null;

export interface MovingPiece {
  type: string
  fromRow: number
  fromCol: number
}

export interface GameResult {
  id: string;
  winner: 'white' | 'black' | 'draw'
  winnerName: string
  method: 'checkmate' | 'draw'
  date: string
  moveCount: number
  duration: number
}

export type kingCheckOrMoved = {
  white: boolean
  black: boolean
}

export type rookMoved = {
  white: { left: boolean; right: boolean }
  black: { left: boolean; right: boolean }
}

export type MovePiece = (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean
export type ValidState = (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean
export type IsMoveValid = (
  board: (PieceType | null)[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
) => boolean
export interface LastMove {
  type: string
  fromRow: number
  fromCol: number
  toRow: number
  toCol: number
}

export type NullableLastMove = LastMove | null

export interface GameEndResult {
  winner: Player;
  reason: 'checkmate' | 'resignation' | 'draw';
  message: string;
}

export interface ChessState {
  board: (PieceType | null)[][]
  currentPlayer: Player
  selectedPiece: { row: number; col: number } | null
  lastMove: { type: string; fromRow: number; fromCol: number; toRow: number; toCol: number } | null
  movingPiece: MovingPiece | null
  winner: Player | null
  kingCheckOrMoved: kingCheckOrMoved
  rookMoved: rookMoved
  isKingInCheck: "white" | "black" | "noCheck"
  isCheckMate: "white" | "black" | "noCheckMate"
  eliminatedPieces: { white: string[]; black: string[] }
  historyIndex: number
  moves: string[]
  computer: Player | null
  stockfishLevel: number
  fiftyMoveRuleCounter: number
  numberOfFullMoves: number
  targetELO: number
  stockfishSettings: { depth: number; randomness: number }
  canPromotePawn: { row: number; col: number } | null
  gameResults: GameResult[]
  gameResult: GameEndResult | null;

  movePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean
  isValidMove: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean
  resetGame: () => void
  undoMove: () => void
  redoMove: () => void
  addMove: (move: string) => void
  updateComputer: (color: Player | null) => void
  computerMove: (state: ChessState) => Promise<void>
  updateStockfishLevel: (level: number) => void
  promotePawn: (row: number, col: number, piece: string) => void
  refetchStore: () => void
  updateTargetELO: (elo: number) => void
  addGameResult: (result: GameResult) => void
  updateKingMoved: (color: "white" | "black") => void;
  updateRookMoved: (color: "white" | "black", side: "left" | "right") => void;
}

export type Winner = "white" | "black" | null;

export type { GameState } from './onlineChess';

export type ChessPiece = {
  type: PieceType;
  color: PieceColor;
} | null;

export type EliminatedPieces = {
  white: string[];
  black: string[];
};

export function convertToChessPiece(piece: PieceType | null): ChessPiece {
  if (!piece) return null;
  return {
    type: piece,
    color: piece.toUpperCase() === piece ? "white" : "black"
  };
}

export function convertBoard(board: (PieceType | null)[][]): ChessPiece[][] {
  return board.map(row => 
    row.map(piece => convertToChessPiece(piece))
  );
}

export type typePromotePawn = {
  row: number;
  col: number;
  piece: string;
};
