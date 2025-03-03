/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Chessboard } from "react-chessboard";
import { useMemo } from "react";

interface CustomChessBoardProps {
  position: string;
  boardOrientation: "white" | "black";
}

const CustomBoard: React.FC<CustomChessBoardProps> = ({
  position,
  boardOrientation,
}) => {
  // Board size configuration
  const boardWidth = 600;

  const threeDPieces = useMemo(() => {
    const pieces = [
      {
        piece: "wP",
        pieceHeight: 1,
      },
      {
        piece: "wN",
        pieceHeight: 1.3,
      },
      {
        piece: "wB",
        pieceHeight: 1.4,
      },
      {
        piece: "wR",
        pieceHeight: 1.3,
      },
      {
        piece: "wQ",
        pieceHeight: 1.7,
      },
      {
        piece: "wK",
        pieceHeight: 1.8,
      },
    ];

    const pieceComponents: { [key: string]: React.FC<{ squareWidth: number }> } = {};

    pieces.forEach(({ piece, pieceHeight }) => {
      pieceComponents[piece] = ({ squareWidth }: { squareWidth: number }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingBottom: `${0.3 * squareWidth}px`,
          }}
        >
          <img
            src={`/3d-pieces/${piece}.webp`}
            alt={piece}
            style={{
              width: `${1.2 * squareWidth}px`,
              height: `${pieceHeight * 1 * squareWidth}px`,
              objectFit: "cover",
            }}
          />
        </div>
      );
    });

    return pieceComponents;
  }, []);

  // Frame dimensions
  const framePadding = 20;
  const frameBottom = 110;

  return (
    <div
      className="relative mx-auto"
      style={{
        width: `${boardWidth + framePadding * 2}px`,
        height: `${boardWidth + framePadding + frameBottom}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${framePadding}px`,
          left: `${framePadding}px`,
          width: `${boardWidth}px`,
          height: `${boardWidth}px`,
          zIndex: 5,
        }}
      >
        <Chessboard
          id="ThreeDimensionalBoard"
          position={position}
          boardWidth={boardWidth}
          boardOrientation={boardOrientation}
          animationDuration={100}
          customPieces={threeDPieces}
          customBoardStyle={{
            transform: "rotateX(27.5deg)",
            border: "0",
            margin: "0",
            padding: "0",
            background: "#e0c094",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          }}
          customLightSquareStyle={{
            backgroundColor: "#f0d9b5",
          }}
          customDarkSquareStyle={{
            backgroundColor: "#b58863",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: "5.5%",
          left: "-20%",
          width: "139%",
          height: "97%",
          pointerEvents: "none", // Allow clicking through to the board
        }}
      >
        <img
          src="/3d-pieces/chess.png"
          alt="Chess board frame"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill", // Changed from "cover" to maintain aspect ratio
            padding: "0",
            margin: "0",
          }}
        />
      </div>
    </div>
  );
};

export default CustomBoard;
