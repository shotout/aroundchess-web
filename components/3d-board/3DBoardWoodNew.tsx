/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useMemo } from "react";
import { Square } from "chess.js";
import Image from "next/image";

interface ThreeDBoardWoodProps {
  size: number | any;
  position: string;
  boardOrientation: "white" | "black";
}

const ThreeDBoardWood: React.FC<ThreeDBoardWoodProps> = ({
  size,
  position,
  boardOrientation,
}) => {
  // Board size configuration
  const [boardSize, setBoardSize] = useState<number | any>(700); // Default size

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
    // const maxSize = window.innerWidth > 1300 ? window.innerWidth / 5 : 400;
    const maxSize = window?.innerWidth / 3;
    // window?.innerWidth < 1440
    // ? window?.innerWidth / 2.5
    // : window?.innerWidth / 4;
    console.log("Resizing board...", window?.innerWidth, isPortrait);

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
        pieceHeight: 1.4,
      },
      {
        piece: "wN",
        pieceHeight: 1.4,
      },
      {
        piece: "wB",
        pieceHeight: 1.4,
      },
      {
        piece: "wR",
        pieceHeight: 1.4,
      },
      {
        piece: "wQ",
        pieceHeight: 1.4,
      },
      {
        piece: "wK",
        pieceHeight: 1.4,
      },
      {
        piece: "bP",
        pieceHeight: 1.4,
      },
      {
        piece: "bN",
        pieceHeight: 1.4,
      },
      {
        piece: "bB",
        pieceHeight: 1.4,
      },
      {
        piece: "bR",
        pieceHeight: 1.4,
      },
      {
        piece: "bQ",
        pieceHeight: 1.4,
      },
      {
        piece: "bK",
        pieceHeight: 1.4,
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
            src={`/3d-pieces/wood/${piece}.png`}
            width={squareWidth * pieceHeight}
            height={squareWidth}
            style={{
              position: "absolute",
              bottom: `${0.12 * squareWidth}px`,
              // objectFit: piece[1] === "K" ? "contain" : "cover",
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, []);
  // Frame dimensions
  let paddingTop = size > 356 ? Math.round(size / 15) : Math.round(size / 22);
  let paddingLeft = size > 356 ? Math.round(size / 7.9) : Math.round(size / 9);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* <Image
        src="/boards/adjusted_8apr2025.png"
        alt="Chess board frame"
        width={1000}
        height={1000}
        className={`absolute z-2 w-[${size}px] h-[${size}px] object-contain`}
      /> */}
      <div
        style={{
          // width: size,
          // height: size,
          left: 60,
          top: 35,
        }}
        className={`z-10 absolute flex items-center justify-center`}
      >
        <Chessboard
          arePiecesDraggable={false}
          boardWidth={Math.round(size * 0.75)}
          id="Styled3DBoard"
          position={position}
          customBoardStyle={{
            transform: "rotateX(27.5deg)",
            transformOrigin: "center",
            // background:"black"
          }}
          customPieces={threeDPieces}
          customLightSquareStyle={{
            // backgroundColor: "transparent",
            backgroundColor: "#ff000080",
          }}
          customDarkSquareStyle={{
            // backgroundColor: "transparent",
            backgroundColor: "#0000ff80",
          }}
          animationDuration={100}
        />
      </div>
    </div>
  );
};

export default ThreeDBoardWood;
