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
  const [boardSize, setBoardSize] = useState(700);
  const boardWidth = 600;

  useEffect(() => {
    handleResize();
  }, [window.innerWidth]);

  const handleResize = () => {
    const width = window?.innerWidth;
    const height = window?.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth / 3;
    console.log("Resizing board...", window.innerWidth, isPortrait);

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
      console.log(Math.min(maxSize, availableWidth * sizeFactor));
    } else {
      const availableHeight = height - minPadding * 2;
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

    pieces.forEach(({ piece, pieceHeight }, index) => {
      pieceComponents[piece] = ({ squareWidth }: { squareWidth: number }) => (
        <div
          key={index}
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
  const framePadding = 20;
  const frameBottom = 110;

  return (
    <div
      className="relative mx-auto"
      style={{
        width: `${boardSize + framePadding * 2}px`,
        height: `${boardSize + framePadding}px`,
      }}
    >
      <div
        style={{
          marginTop:"-40px",
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
    </div>
  );
};

export default CustomBoard;
