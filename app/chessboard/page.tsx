"use client";
import Navigation from "@/components/navigator/navigation";
import Engine from "@/components/playground/src/lib/stockfish";
import { Chess, Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";

import { CSSProperties } from "react";

const boardWrapper: CSSProperties = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: "3rem auto",
};
const buttonStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  margin: "10px 10px 0px 0px",
  borderRadius: "6px",
  backgroundColor: "#f0d9b5",
  border: "none",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
};

export default function ChessBoard() {
  const levels = {
    "Easy 🤓": 2,
    "Medium 🧐": 8,
    "Hard 😵": 18,
  };

  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [stockfishLevel, setStockfishLevel] = useState(2);
  const [boardSize, setBoardSize] = useState(700); // Default size

  const [gamePosition, setGamePosition] = useState(game.fen());
  useEffect(() => {
    handleResize();
  }, []);
  const handleResize = () => {
    const width = window?.innerWidth;
    const height = window?.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = 453;
    console.log("Resizing board...", isPortrait);

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
  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        // In latest chess.js versions you can just write ```game.move(bestMove)```
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5),
        });
        setGamePosition(game.fen());
      }
    });
  }
  function onDrop(sourceSquare: Square, targetSquare: Square, piece: string) {
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
    pieces.forEach(({ piece, pieceHeight }) => {
      pieceComponents[piece] = ({ squareWidth, square }) => (
        <div
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
  return (
    <div style={boardWrapper}>
      {Object.entries(levels).map(([level, depth]) => (
        <button
          key={depth}
          style={{
            ...buttonStyle,
            backgroundColor: depth === stockfishLevel ? "#B58863" : "#f0d9b5",
          }}
          onClick={() => setStockfishLevel(depth)}
        >
          {level}
        </button>
      ))}
      {/* </div> */}
      <div style={{ maxWidth: boardSize + 40 }}>
        <Chessboard
          boardWidth={boardSize}
          id="Styled3DBoard"
          position={gamePosition}
          onPieceDrop={onDrop}
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
          animationDuration={500}
          customSquareStyles={{
            [activeSquare]: {
              boxShadow: "inset 0 0 1px 6px rgba(255,255,255,0.75)",
            },
          }}
          onMouseOverSquare={(sq) => setActiveSquare(sq)}
          onMouseOutSquare={(sq) => setActiveSquare("")}
        />
      </div>
      <div className="mt-12">
        <button
          style={buttonStyle}
          onClick={() => {
            game.reset();
            setGamePosition(game.fen());
          }}
        >
          New game
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            game.undo();
            game.undo();
            setGamePosition(game.fen());
          }}
        >
          Undo
        </button>
      </div>
    </div>
  );
}
