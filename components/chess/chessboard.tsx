"use client";

import { Chessboard as ReactChessboard } from "react-chessboard";
import { Square } from "chess.js";

interface ChessboardProps {
  position: string;
  boardSize: number;
  isDraggable: boolean;
  onPieceDrop?: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => boolean;
}

export default function Chessboard({
  position,
  boardSize,
  isDraggable,
  onPieceDrop,
}: ChessboardProps) {
  return (
    <div style={{ width: boardSize, height: boardSize }}>
      <ReactChessboard
        position={position}
        boardWidth={boardSize}
        isDraggablePiece={() => isDraggable}
        onPieceDrop={onPieceDrop}
        customBoardStyle={{
          borderRadius: "4px",
        }}
      />
    </div>
  );
}
