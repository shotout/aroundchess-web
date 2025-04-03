import Image from "next/image";
import React, { useMemo } from "react";

import { Chessboard } from "react-chessboard";

interface MetallicBoardProps {
  position: string;
  boardWidth: number;
}

const MetallicBoard: React.FC<MetallicBoardProps> = ({
  position,
  boardWidth,
}) => { 
   
  const twoDPieces = useMemo(() => {
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
        pieceHeight: 1,
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
    pieces.forEach(({ piece, pieceHeight }) => {
      pieceComponents[piece] = ({ squareWidth, square }) => (
        <div
          style={{
            width: squareWidth * 1,
            height: squareWidth * 0.95,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <img
            src={`/pieces/metallic/${piece}.png`}
            width={squareWidth}
            height={squareWidth}
            style={{
              position: "absolute",
              bottom: `${0 * squareWidth}px`,
              objectFit: "contain",
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, []);
  return (
    <div className="relative" style={{ width: boardWidth, height: boardWidth }}>
      {/* <span className="text-white bg-[red]">{boardWidth / 8}</span> */}
      <Image
        src={"/boards/metallic.png"}
        alt="metallic"
        width={1000}
        height={1000}
        className={`absolute z-2 w-[${boardWidth}] h-[${boardWidth}]`}
      />

      <div
        style={{
          width: boardWidth,
          height: boardWidth,
          padding: Math.round(boardWidth / 16.5),
        }}
        className={`z-10 flex`}
      >
        <Chessboard
          boardWidth={Math.round(boardWidth - boardWidth / 8.5)}
          arePiecesDraggable={false}
          position={position}
          customBoardStyle={{
            transformOrigin: "center",
          }}
          customPieces={twoDPieces}
          customLightSquareStyle={{
            // backgroundColor: "#ff000070",
            backgroundColor: "transparent",
          }}
          customDarkSquareStyle={{
            // backgroundColor: "#00ff0080",
            backgroundColor: "transparent",
          }}
          animationDuration={100}
        />
      </div>
    </div>
  );
};
export default MetallicBoard;
