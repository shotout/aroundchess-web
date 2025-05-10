// components/ChessWithArrows.tsx
"use client";

import { Chessboard } from "react-chessboard";
import { useRef, useEffect, useState } from "react";

const SQUARE_SIZE = 64; // Board = 64 * 8 = 512px

function squareToXY(square: string): { x: number; y: number } {
  const file = square.charCodeAt(0) - "a".charCodeAt(0); // 0-7
  const rank = 8 - parseInt(square[1]); // rank '8' at top -> 0
  return {
    x: file * SQUARE_SIZE + SQUARE_SIZE / 2,
    y: rank * SQUARE_SIZE + SQUARE_SIZE / 2,
  };
}

function Arrow({ from, to, color }: { from: string; to: string; color: string }) {
  const start = squareToXY(from);
  const end = squareToXY(to);

  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke={color}
      strokeWidth={4}
      markerEnd={`url(#arrowhead-${color})`}
    />
  );
}

export default function ChessWithArrows() {
  const boardSize = SQUARE_SIZE * 8;

  const arrows = [
    { from: "f1", to: "b5", color: "blue" },
    { from: "b5", to: "e8", color: "blue" },
    { from: "b5", to: "a4", color: "green" },
    { from: "a7", to: "a6", color: "red" },
    { from: "b7", to: "b6", color: "red" },
  ];

  const customSquareStyles = {
    e3: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
    d6: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
    e8: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
  };

  return (
    <div className="relative" style={{ width: boardSize, height: boardSize }}>
      <Chessboard
        id="CustomArrowBoard"
        boardWidth={boardSize}
        position="start"
        customSquareStyles={customSquareStyles}
        arePiecesDraggable={false}
      />
      <svg
        width={boardSize}
        height={boardSize}
        className="absolute top-0 left-0 pointer-events-none"
      >
        <defs>
          <marker
            id="arrowhead-blue"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
          </marker>
          <marker
            id="arrowhead-green"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="green" />
          </marker>
          <marker
            id="arrowhead-red"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="red" />
          </marker>
        </defs>

        {arrows.map((arrow, idx) => (
          <Arrow key={idx} {...arrow} />
        ))}
      </svg>
    </div>
  );
}
