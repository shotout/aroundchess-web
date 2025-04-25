import React, { Key, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Chessboard } from "react-chessboard";

import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";

interface Simple2DChessProps {
  position?: string;
  arePiecesDraggable?: boolean;
  id?: number | any;
  keys?: Key;
}

const Simple2DChess: React.FC<Simple2DChessProps> = ({
  position,
  arePiecesDraggable,
  id,
  keys,
}) => {
  const { BoardChoosed, PieceChoosed } = useChessBoardThemeStore();
  const [boardSize, setBoardSize] = useState<number | undefined>(700); // Default size
  const [mounted, setMounted] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted]);
  const handleResize = () => {
    console.log("ref.current?.clientWidth", ref.current?.clientWidth);
    let boxW = ref.current?.clientWidth;
    setBoardSize(boxW);
  };
  const twoDPieces = useMemo(() => {
    const pieces = [
      {
        piece: "wP",
        pieceHeight: 1.2,
      },
      {
        piece: "wN",
        pieceHeight: 1.2,
      },
      {
        piece: "wB",
        pieceHeight: 1.2,
      },
      {
        piece: "wR",
        pieceHeight: 1.2,
      },
      {
        piece: "wQ",
        pieceHeight: 1.5,
      },
      {
        piece: "wK",
        pieceHeight: 1.6,
      },
      {
        piece: "bP",
        pieceHeight: 1.2,
      },
      {
        piece: "bN",
        pieceHeight: 1.2,
      },
      {
        piece: "bB",
        pieceHeight: 1.2,
      },
      {
        piece: "bR",
        pieceHeight: 1.2,
      },
      {
        piece: "bQ",
        pieceHeight: 1.5,
      },
      {
        piece: "bK",
        pieceHeight: 1.6,
      },
    ];
    const pieceComponents: {
      [key: string]: ({
        squareWidth,
        square,
      }: {
        squareWidth: number;
        square: string;
      }) => JSX.Element;
    } = {};
    pieces.forEach(({ piece }) => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth * 0.8,
            height: squareWidth * 0.85,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <Image
            alt={`${piece} chess piece`}
            src={`/pieces/wood/${piece}.png`}
            width={squareWidth}
            height={squareWidth}
            style={{
              position: "absolute",
              bottom: -1.5,
              objectFit: "contain",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, []);

  return (
    <div key={keys} id={id} className="relative w-full h-full">
      <div className="absolute inset-0">
        <Image
          src={`/boards/wood.png`}
          alt="wood board"
          width={boardSize}
          height={boardSize}
          objectFit="contain"
          priority
        />
      </div>

      <div
        className="relative w-full h-full"
        ref={ref}
        style={{ padding: boardSize && Math.round(boardSize / 16.5) }}
      >
        <div className="w-full h-full">
          <Chessboard
            id={`board-${id}`}
            arePiecesDraggable={arePiecesDraggable}
            position={position}
            customPieces={twoDPieces}
            customLightSquareStyle={{
              backgroundColor: "transparent",
            }}
            customDarkSquareStyle={{
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Simple2DChess;

// px-4 pb-24 pt-5 lg:p-[15px] xl:p-[23px] 2xl:p-[25px]
