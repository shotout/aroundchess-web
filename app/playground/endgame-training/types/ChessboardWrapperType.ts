import { Chess, Square } from "chess.js";

export interface ChessboardWrapperProps {
  game: Chess;
  position: string | null;
  optionSquares: Record<string, { background: string }>;
  moveSquares: Record<string, { background: string }>;
  moveFrom: string;
  setMoveFrom: React.Dispatch<React.SetStateAction<string>>;
  moveTo: Square | null;
  setMoveTo: React.Dispatch<React.SetStateAction<Square | null>>;
  setOptionSquares: React.Dispatch<
    React.SetStateAction<Record<string, { background: string }>>
  >;
  setMoveSquares: React.Dispatch<
    React.SetStateAction<Record<string, { background: string }>>
  >;
  showPromotionDialog: boolean;
  setShowPromotionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
  gameStatus: "ongoing" | "solved";
  setMoveHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setPosition: React.Dispatch<React.SetStateAction<string | null>>;
  checkGameStatus: () => boolean;
  boardOrientation: "white" | "black";
  playerColor: "w" | "b";
  bestMove?: string | null;
  showHint?: boolean;
  is3DMode: boolean;
  handleShare: () => void;
}