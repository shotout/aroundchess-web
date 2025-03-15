/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
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
  const [boardSize, setBoardSize] = useState(700); // Default size
  const boardWidth = 600;
  useEffect(() => {
    handleResize();
  }, [window.innerWidth]);
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize =  window.innerWidth /3;
    console.log("Resizing board...", window.innerWidth,isPortrait);

    if (isPortrait) {
      // In portrait mode, use screen width as the primary constraint
      const availableWidth = width - minPadding * 2;
      // Use 85% of available width for mobile, 90% for tablets
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
      console.log(Math.min(maxSize, availableWidth * sizeFactor));
    } else {
      // In landscape, use height as the primary constraint
      const availableHeight = height - minPadding * 2;
      // Use 80% of available height
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
      console.log("size board...", Math.min(maxSize, availableHeight * 0.8));
    }
  };
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

    const pieceComponents: {
      [key: string]: React.FC<{ squareWidth: number }>;
    } = {};

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
        width: `${boardSize + framePadding * 2}px`,
        height: `${boardSize + framePadding }px`,
        // height: `${boardSize + framePadding + frameBottom}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${framePadding}px`,
          left: `${framePadding}px`,
          width: `${boardSize}px`,
          height: `${boardSize}px`,
          zIndex: 5,
        }}
      >
        <Chessboard
          id="ThreeDimensionalBoard"
          position={position}
          boardWidth={boardSize}
          boardOrientation={boardOrientation}
          animationDuration={100}
          // customPieces={threeDPieces}
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
      {/* <div
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
      </div> */}
    </div>
  );
};

export default CustomBoard;
