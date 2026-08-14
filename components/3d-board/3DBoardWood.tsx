/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useMemo } from "react";
import { Square } from "chess.js";

interface BoardWoodBoardProps {
  size: number | any;
  position: string;
  boardOrientation: "white" | "black";
}

const BoardWood: React.FC<BoardWoodBoardProps> = ({
  size,
  position,
  boardOrientation,
}) => {
  const [boardSize, setBoardSize] = useState<number | any>(700);
  useEffect(() => {
  }, [window?.innerWidth]);
  useEffect(() => {
    if (size) {
      setBoardSize(size);
    } else {
      handleResize();
    }
  }, [size]);
  const handleResize = () => {
    const width = window?.innerWidth;
    const height = window?.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize =
      window?.innerWidth < 1440
        ? window?.innerWidth / 2.5
        : window?.innerWidth / 4.2;
    console.log("Resizing board...", window?.innerWidth, isPortrait);

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
        pieceHeight: 1.2,
      },
      {
        piece: "wB",
        pieceHeight: 1.3,
      },
      {
        piece: "wR",
        pieceHeight: 1.2,
      },
      {
        piece: "wQ",
        pieceHeight: 1.4,
      },
      {
        piece: "wK",
        pieceHeight: 0.87,
      },
      {
        piece: "bP",
        pieceHeight: 1,
      },
      {
        piece: "bN",
        pieceHeight: 1.2,
      },
      {
        piece: "bB",
        pieceHeight: 1.3,
      },
      {
        piece: "bR",
        pieceHeight: 1.2,
      },
      {
        piece: "bQ",
        pieceHeight: 1.4,
      },
      {
        piece: "bK",
        pieceHeight: 0.8,
      },
    ];
    const pieceComponents: {
      [key: string]: ({
        squareWidth,
        square,
      }: {
        squareWidth: number;
        square: Square;
      }) => JSX.Element;
    } = {};
    pieces.forEach(({ piece, pieceHeight }, index) => {
      pieceComponents[piece] = ({ squareWidth, square }) => (
        <div
          key={index}
          style={{
            width: squareWidth * pieceHeight,
            height: squareWidth,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <img
            src={`/3d-pieces/${piece}.webp`}
            width={squareWidth * pieceHeight}
            height={squareWidth}
            style={{
              position: "absolute",
              bottom: `${0.2 * squareWidth}px`,
              objectFit: piece[1] === "K" ? "contain" : "cover",
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
          position: "absolute",
          top: `${framePadding}px`,
          left: `${framePadding}px`,
          width: `${boardSize}px`,
          height: `${boardSize}px`,
          zIndex: 5,
        }}
      >
        <Chessboard
          arePiecesDraggable={false}
          boardWidth={boardSize}
          id="Styled3DBoard"
          position={position}
          customBoardStyle={{
            width: boardSize + 24,
            height: boardSize + 32,
            transform: "rotateX(27.5deg)",
            transformOrigin: "center",
            border: "16px solid #b8836f",
            borderStyle: "outset",
            borderRightColor: " #b27c67",
            borderRadius: "4px",
            boxShadow: "rgba(0, 0, 0, 0.5) 2px 4px 24px 8px",
            borderRightWidth: "2px",
            borderLeftWidth: "2px",
            borderTopWidth: "0px",
            borderBottomWidth: "18px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            padding: "8px 8px 12px",
            background: "#e0c094",
            backgroundImage: 'url("wood-pattern.png")',
            backgroundSize: "contain",
          }}
          customPieces={threeDPieces}
          customLightSquareStyle={{
            backgroundColor: "#e0c094",
            backgroundImage: 'url("wood-pattern.png")',
            backgroundSize: "cover",
          }}
          customDarkSquareStyle={{
            backgroundColor: "#865745",
            backgroundImage: 'url("wood-pattern.png")',
            backgroundSize: "cover",
          }}
          animationDuration={100}
        />
      </div>
    </div>
  );
};

export default BoardWood;
