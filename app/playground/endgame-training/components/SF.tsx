"use client";

import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from "react";
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
  playerColor: "w" | "b";
  depth?: number;
  isAutoSolution: boolean;
  onSolutionComplete?: () => void;
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
  playerColor,
  depth = 10,
  isAutoSolution,
  onSolutionComplete,
}: StockfishEngineProps) {
  const engine = useMemo(() => new Engine(), []);
  const [_, setPositionEvaluation] = useState<number>(0);
  const [, setPossibleMate] = useState<string>("");
  const solutionInProgress = useRef(false);
  const highDepth = 18;

  const findBestMove = useCallback(
    (customDepth = depth, moveDelay = 150) => {
      if (
        (!isAutoSolution && game.turn() === playerColor) ||
        game.isGameOver() ||
        gameStatus !== "ongoing"
      ) {
        return;
      }

      try {
        engine.evaluatePosition(game.fen(), customDepth);

        engine.onMessage(({ bestMove }) => {
          try {
            if (bestMove) {
              const move = game.move({
                from: bestMove.substring(0, 2) as Square,
                to: bestMove.substring(2, 4) as Square,
                promotion: bestMove.substring(4, 5) || undefined,
              });

              if (move) {
                setMoveHistory(game.history({ verbose: true }));
                setPosition(game.fen());

                setMoveSquares({
                  [bestMove.substring(0, 2)]: {
                    background: "rgba(255, 255, 0, 0.4)",
                  },
                  [bestMove.substring(2, 4)]: {
                    background: "rgba(255, 255, 0, 0.4)",
                  },
                });

                const isGameOver = checkGameStatus();

                if (
                  isAutoSolution &&
                  !isGameOver &&
                  solutionInProgress.current
                ) {
                  setTimeout(() => {
                    findBestMove(highDepth, 150);
                  }, moveDelay);
                } else if (isGameOver && onSolutionComplete) {
                  onSolutionComplete();
                }
              }
            }
          } catch (error) {
            // Silently catch and ignore errors
          }
        });
      } catch (error) {
        // Silently catch and ignore errors
      }
    },
    [
      game,
      engine,
      gameStatus,
      setMoveHistory,
      setPosition,
      setMoveSquares,
      checkGameStatus,
      playerColor,
      depth,
      isAutoSolution,
      onSolutionComplete,
    ]
  );

  const handleHint = useCallback(() => {
    if (!position || gameStatus !== "ongoing") return;

    setBestMove(null);
    try {
      engine.evaluatePosition(game.fen(), depth);
      engine.onMessage(
        ({
          positionEvaluation,
          possibleMate,
          pv,
          depth: responseDepth,
          bestMove,
        }) => {
          try {
            if (responseDepth && responseDepth < Math.floor(depth / 2)) return;

            if (positionEvaluation) {
              setPositionEvaluation(
                ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) /
                  100
              );
            }

            if (possibleMate) {
              setPossibleMate(possibleMate);
            }

            if (bestMove && game.turn() === playerColor) {
              setBestMove(bestMove);
              setMoveSquares({
                [bestMove.substring(0, 2)]: {
                  background: "rgba(0, 120, 255, 0.4)",
                },
                [bestMove.substring(2, 4)]: {
                  background: "rgba(0, 120, 255, 0.4)",
                },
              });
            }
          } catch (error) {
            // Silently catch and ignore errors
          }
        }
      );
    } catch (error) {
      // Silently catch and ignore errors
    }
  }, [
    position,
    game,
    engine,
    gameStatus,
    setBestMove,
    setMoveSquares,
    depth,
    playerColor,
  ]);

  useEffect(() => {
    if (
      position &&
      game.turn() !== playerColor &&
      gameStatus === "ongoing" &&
      !isAutoSolution
    ) {
      const timeoutId = setTimeout(() => {
        findBestMove();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [position, game, gameStatus, findBestMove, playerColor, isAutoSolution]);

  useEffect(() => {
    if (
      isAutoSolution &&
      position &&
      gameStatus === "ongoing" &&
      !game.isGameOver()
    ) {
      solutionInProgress.current = true;
      findBestMove(highDepth, 150);
    } else {
      solutionInProgress.current = false;
    }

    return () => {
      solutionInProgress.current = false;
    };
  }, [isAutoSolution, position, gameStatus, game, findBestMove]);

  useEffect(() => {
    if (showHint && position && gameStatus === "ongoing") {
      handleHint();
    }
  }, [showHint, position, handleHint, gameStatus]);

  return null;
}
