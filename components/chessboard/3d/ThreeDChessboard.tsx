import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { Square } from "chess.js";
import Image from "next/image";
import React, { useMemo } from "react";

import { Chessboard } from "react-chessboard";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

interface ThreeDChessboardProps {
  position: string;
  boardWidth: number;
  orientation: BoardOrientation | undefined;
  onPieceDrop: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => boolean;
}

const ThreeDChessboard: React.FC<ThreeDChessboardProps> = ({
  position,
  boardWidth,
  orientation,
  onPieceDrop,
}) => {
  const {
    StyleChoosed,
    setStyleChoosed,
    BoardChoosed,
    setBoardChoosed,
    PieceChoosed,
    setPieceChoosed,
  } = useChessBoardThemeStore();
  const twoDPieces = useMemo(() => {
    const pieces = [
      {
        piece: "wP",
        pieceHeight: 1.6,
      },
      {
        piece: "wN",
        pieceHeight: 1.6,
      },
      {
        piece: "wB",
        pieceHeight: 1.6,
      },
      {
        piece: "wR",
        pieceHeight: 1.6,
      },
      {
        piece: "wQ",
        pieceHeight: 1.6,
      },
      {
        piece: "wK",
        pieceHeight: 1.6,
      },
      {
        piece: "bP",
        pieceHeight: 1.6,
      },
      {
        piece: "bN",
        pieceHeight: 1.6,
      },
      {
        piece: "bB",
        pieceHeight: 1.6,
      },
      {
        piece: "bR",
        pieceHeight: 1.6,
      },
      {
        piece: "bQ",
        pieceHeight: 1.6,
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
    pieces.forEach(({ piece, pieceHeight }) => {
      pieceComponents[piece] = ({ squareWidth, square }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <img
            src={`/3d-pieces/wood/${piece}.png`}
            // src={`/pieces/${PieceChoosed}/${piece}.png`}
            width={squareWidth}
            height={squareWidth}
            style={{
              position: "absolute",
              bottom: `${0.2 * squareWidth}px`,
              objectFit: "contain",
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, [PieceChoosed]);
  return (
    <div className="relative" style={{ width: boardWidth, height: boardWidth }}>
      {/* <span className="text-white bg-[red]">{boardWidth / 8}</span> */}
      <Image
        src={`/boards/3d-${BoardChoosed}-board.png`}
        alt="wood"
        width={1000}
        height={1000}
        style={{ top: Math.round(boardWidth / 36) }}
        className={`absolute z-2 w-[${boardWidth}] h-[${boardWidth}] object-contain`}
      />

      <div
        style={{
          width: boardWidth,
          height: boardWidth,
          paddingLeft: Math.round(boardWidth / 7.7),
        }}
        className={`z-10 flex`}
      >
        <Chessboard
          onPieceDrop={onPieceDrop}
          boardOrientation={orientation}
          boardWidth={Math.round(boardWidth - boardWidth / 4.1)}
          arePiecesDraggable={false}
          position={position}
          customBoardStyle={{
            transform: "rotateX(27.5deg)",
            transformOrigin: "center",
          }}
          customPieces={twoDPieces}
          customLightSquareStyle={{
            backgroundColor: "#ff000070",
            // backgroundColor: "transparent",
          }}
          customDarkSquareStyle={{
            backgroundColor: "#00ff0080",
            // backgroundColor: "transparent",
          }}
          animationDuration={100}
        />
      </div>
    </div>
  );
};
export default ThreeDChessboard;
