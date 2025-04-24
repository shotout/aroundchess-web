"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { Engine } from "@/components/playground/src/lib/stockfish";
import { Chess, Square } from "chess.js";

interface StockfishEngineProps {
  game: Chess;
  position: string | null;
  gameStatus: string;
  setMoveHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setPosition: React.Dispatch<React.SetStateAction<string | null>>;
  setMoveSquares: React.Dispatch<
    React.SetStateAction<Record<string, { background: string }>>
  >;
  checkGameStatus: () => boolean;
  setBestMove: React.Dispatch<React.SetStateAction<string | null>>;
  showHint: boolean;
  playerColor: "w" | "b"; // Added player color prop
}

export default function StockfishEngine({
  game,
  position,
  gameStatus,
  setMoveHistory,
  setPosition,
  setMoveSquares,
  checkGameStatus,
  setBestMove,
  showHint,
  playerColor, // Added player color
}: StockfishEngineProps) {
  const engine = useMemo(() => new Engine(), []);

  const findBestMove = useCallback(() => {
    // Computer should move when it's not player's turn
    if (
      game.turn() === playerColor ||
      game.isGameOver() ||
      gameStatus !== "ongoing"
    ) {
      return;
    }

    engine.evaluatePosition(game.fen(), 5);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        const move = game.move({
          from: bestMove.substring(0, 2) as Square,
          to: bestMove.substring(2, 4) as Square,
          promotion: bestMove.substring(4, 5) || undefined,
        });

        setMoveHistory(game.history({ verbose: true }));
        setPosition(game.fen());

        setMoveSquares({
          [bestMove.substring(0, 2)]: { background: "rgba(255, 255, 0, 0.4)" },
          [bestMove.substring(2, 4)]: { background: "rgba(255, 255, 0, 0.4)" },
        });

        checkGameStatus();
      }
    });
  }, [
    game,
    engine,
    gameStatus,
    setMoveHistory,
    setPosition,
    setMoveSquares,
    checkGameStatus,
    playerColor, // Added dependency
  ]);

  const handleHint = useCallback(() => {
    if (!position || gameStatus !== "ongoing") return;

    engine.evaluatePosition(game.fen(), 10);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        setBestMove(bestMove);
        setMoveSquares({
          [bestMove.substring(0, 2)]: { background: "rgba(0, 0, 255, 0.4)" },
          [bestMove.substring(2, 4)]: { background: "rgba(0, 0, 255, 0.4)" },
        });
      }
    });
  }, [position, game, engine, gameStatus, setBestMove, setMoveSquares]);

  useEffect(() => {
    // Computer should move when it's not player's turn
    if (position && game.turn() !== playerColor && gameStatus === "ongoing") {
      const timeoutId = setTimeout(() => {
        findBestMove();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [position, game, gameStatus, findBestMove, playerColor]); // Added playerColor dependency

  useEffect(() => {
    if (showHint && position && gameStatus === "ongoing") {
      handleHint();
    }
  }, [showHint, position, handleHint, gameStatus]);

  return null;
}
