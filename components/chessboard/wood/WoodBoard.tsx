import { Engine } from "@/components/playground/src/lib/stockfish";
import { Chess, Piece, Square } from "chess.js";
import Image from "next/image";
import React from "react";
import { SetStateAction, useMemo, useState } from "react";

import { CSSProperties } from "react";
import { Chessboard } from "react-chessboard";

interface WoodBoardProps {
  position: string;
  boardWidth: number;
}

const WoodBoard: React.FC<WoodBoardProps> = ({ position, boardWidth }) => {
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());
  function findBestMove() {
    engine.evaluatePosition(game.fen());
    engine.onMessage((message) => {
      const bestMove = message.bestMove;
      if (bestMove) {
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5),
        });
        setGamePosition(game.fen());
      }
    });
  }
  function onDrop(sourceSquare: Square, targetSquare: Square, piece: any) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGamePosition(game.fen());

    // illegal move
    if (move === null) return false;

    // exit if the game is over
    if (game.isGameOver() || game.isDraw()) return false;
    findBestMove();
    return true;
  }
  const [activeSquare, setActiveSquare] = useState("");
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
            width: squareWidth * 0.7,
            height: squareWidth * 0.8,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <img
            src={`/pieces/wood/${piece}.png`}
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
        src={"/boards/wood.png"}
        alt="wood"
        width={1000}
        height={1000}
        className={`absolute z-2 w-[${boardWidth}] h-[${boardWidth}]`}
      />

      <div
        style={{ width: boardWidth, height: boardWidth, padding:(Math.round(boardWidth/16.5)) }}
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
export default WoodBoard;
