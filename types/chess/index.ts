export interface Position {
  x: number;
  y: number;
}

export interface MoveDetails {
  from: Position;
  to: Position;
  piece: string;
  isCapture?: boolean;
  isCheck?: boolean;
  isCheckmate?: boolean;
  promotedTo?: string;
}

export type ChessBoard = string[][];
