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
  const [boardSize, setBoardSize] = useState<number | any>(700);
  const [scale, setScale] = useState<number | any>(0);

  useEffect(() => {
    console.log(size, "size in 3d board wood");
    console.log(window?.innerWidth, "widthC in 3d board wood");
    if (size) {
      let fixScale = size / 480;

      setScale(fixScale);
      let sz = size < 480 ? 480 : size;
      setBoardSize(size);
    } else {
      handleResize();
    }
  }, [size, window?.innerWidth]);
  const handleResize = () => {
    const width = window?.innerWidth;
    const height = window?.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window?.innerWidth / 3;
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
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, []);
  let paddingTop = 50;

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: boardSize,
        height: boardSize,
        transform: `scale(${scale + ``})`,
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 480,
          height: 480,
        }}
      >
        <Image
          src="/boards/11042025-14.png"
          alt="Chess board frame"
          width={1000}
          height={1000}
          className={`absolute z-2 w-[480px] h-[480px] object-contain`}
        />
        <div
          style={{
            marginTop: -paddingTop,
          }}
          className={`z-10 flex items-center justify-center`}
        >
          <Chessboard
            arePiecesDraggable={false}
            boardOrientation={boardOrientation}
            boardWidth={Math.round(480 * 0.779)}
            id="Styled3DBoard"
            customBoardStyle={{
              transform: "rotateX(27.5deg) scale(1)",
              transformOrigin: "center",
            }}
            customPieces={threeDPieces}
            customLightSquareStyle={{
              backgroundColor: "transparent",
            }}
            customDarkSquareStyle={{
              backgroundColor: "transparent",
            }}
            animationDuration={100}
          />
        </div>
      </div>
    </div>
  );
};

export default ThreeDBoardWood;
