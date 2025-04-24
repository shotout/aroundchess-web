"use client";

import React, { useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { BoardPosition } from "react-chessboard/dist/chessboard/types";

interface ChessboardWrapperProps {
  game: Chess;
  position: string | BoardPosition | undefined;
  optionSquares: Record<string, { background: string }>;
  moveSquares: Record<string, { background: string }>;
  moveFrom: string;
  setMoveFrom: React.Dispatch<React.SetStateAction<string>>;
  moveTo: Square | null;
  setMoveTo: React.Dispatch<React.SetStateAction<Square | null>>;
  setOptionSquares: React.Dispatch<
    React.SetStateAction<Record<string, { background: string }>>
  >;
  setMoveSquares: React.Dispatch<
    React.SetStateAction<Record<string, { background: string }>>
  >;
  showPromotionDialog: boolean;
  setShowPromotionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
  gameStatus: string;
  setMoveHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setPosition: React.Dispatch<React.SetStateAction<string | null>>;
  checkGameStatus: () => boolean;
  boardOrientation: "white" | "black"; // Added prop for board orientation
  playerColor: "w" | "b"; // Added prop for player color
}

export default function ChessboardWrapper({
  game,
  position,
  optionSquares,
  moveSquares,
  moveFrom,
  setMoveFrom,
  moveTo,
  setMoveTo,
  setOptionSquares,
  setMoveSquares,
  showPromotionDialog,
  setShowPromotionDialog,
  setShowHint,
  gameStatus,
  setMoveHistory,
  setPosition,
  checkGameStatus,
  boardOrientation, // Added prop
  playerColor, // Added prop
}: ChessboardWrapperProps) {
  // Handle getting valid move options for a square
  const getMoveOptions = useCallback(
    (square: Square) => {
      const moves = game.moves({
        square,
        verbose: true,
      });

      if (moves.length === 0) {
        setOptionSquares({});
        return false;
      }

      const newSquares: Record<string, { background: string }> = {};
      moves.forEach((move) => {
        newSquares[move.to] = {
          background:
            game.get(move.to) &&
            game.get(move.to)?.color !== game.get(square)?.color
              ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
              : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        };
      });

      newSquares[square] = {
        background: "rgba(255, 255, 0, 0.4)",
      };

      setOptionSquares(newSquares);
      return true;
    },
    [game, setOptionSquares]
  );

  // Handle clicking on a square
  const onSquareClick = useCallback(
    (square: Square) => {
      // Only allow interaction if it's player's turn and game is ongoing
      if (game.turn() !== playerColor || gameStatus !== "ongoing") return;

      // Clear any hint highlighting
      setShowHint(false);

      // First click - selecting a piece
      if (!moveFrom) {
        const piece = game.get(square);
        // Only allow selecting player's pieces
        if (piece && piece.color !== playerColor) return;

        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) {
          setMoveFrom(square);
        }
        return;
      }

      // Second click - making a move or selecting a different piece
      if (!moveTo) {
        const moves = game.moves({
          square: moveFrom as Square,
          verbose: true,
        });
        const foundMove = moves.find(
          (m) => m.from === moveFrom && m.to === square
        );

        // If clicking on an invalid destination
        if (!foundMove) {
          const piece = game.get(square);
          // If clicking on another of player's pieces, switch selection
          if (piece && piece.color === playerColor) {
            const hasMoveOptions = getMoveOptions(square);
            setMoveFrom(hasMoveOptions ? square : "");
          } else {
            // Otherwise clear selection
            setMoveFrom("");
            setOptionSquares({});
          }
          return;
        }

        setMoveTo(square);

        // Check for pawn promotion
        if (
          (foundMove.color === "w" &&
            foundMove.piece === "p" &&
            square[1] === "8") ||
          (foundMove.color === "b" &&
            foundMove.piece === "p" &&
            square[1] === "1")
        ) {
          setShowPromotionDialog(true);
          return;
        }

        // Execute the move
        const move = game.move({
          from: moveFrom,
          to: square,
        });

        if (move === null) {
          const hasMoveOptions = getMoveOptions(square);
          if (hasMoveOptions) setMoveFrom(square);
          return;
        }

        // Update game state after successful move
        setMoveHistory(game.history({ verbose: true }));
        setPosition(game.fen()); // This will trigger the StockfishEngine to make opponent's move

        // Highlight the move that was just made
        setMoveSquares({
          [moveFrom]: { background: "rgba(255, 255, 0, 0.4)" },
          [square]: { background: "rgba(255, 255, 0, 0.4)" },
        });

        // Reset selection state
        setMoveFrom("");
        setMoveTo(null);
        setOptionSquares({});

        // Check if game is over after the move
        checkGameStatus();

        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      moveFrom,
      moveTo,
      game,
      getMoveOptions,
      checkGameStatus,
      gameStatus,
      setMoveFrom,
      setMoveTo,
      setOptionSquares,
      setMoveSquares,
      setMoveHistory,
      setPosition,
      setShowHint,
      playerColor,
    ]
  );

  // Handle promoting a pawn
  const onPromotionPieceSelect = useCallback(
    (piece?: string, fromSquare?: Square, toSquare?: Square) => {
      if (!piece || !fromSquare || !toSquare) return false;

      const promotionPiece = piece?.charAt(1)?.toLowerCase() || "q";

      const move = game.move({
        from: fromSquare,
        to: toSquare,
        promotion: promotionPiece,
      });

      if (move) {
        setMoveHistory(game.history({ verbose: true }));
        setPosition(game.fen());
        checkGameStatus();
        setMoveSquares({
          [fromSquare]: { background: "rgba(255, 255, 0, 0.4)" },
          [toSquare]: { background: "rgba(255, 255, 0, 0.4)" },
        });
      }

      setMoveFrom("");
      setMoveTo(null);
      setShowPromotionDialog(false);
      setOptionSquares({});

      return true;
    },
    [
      game,
      checkGameStatus,
      setMoveHistory,
      setPosition,
      setMoveSquares,
      setMoveFrom,
      setMoveTo,
      setShowPromotionDialog,
      setOptionSquares,
    ]
  );

  // Handle drag and drop moves
  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      // Only allow moves when it's player's turn and game is ongoing
      if (game.turn() !== playerColor || gameStatus !== "ongoing") return false;

      setShowHint(false);

      try {
        console.log(
          `Attempting drag-drop move from ${sourceSquare} to ${targetSquare}`
        );

        // Check if this is a pawn promotion
        const piece = game.get(sourceSquare as Square);
        const isPromotion =
          piece?.type === "p" &&
          ((piece.color === "w" && targetSquare[1] === "8") ||
            (piece.color === "b" && targetSquare[1] === "1"));

        // Execute the move
        let move;
        if (isPromotion) {
          // Auto-promote to queen for simplicity
          move = game.move({
            from: sourceSquare as Square,
            to: targetSquare as Square,
            promotion: "q",
          });
        } else {
          move = game.move({
            from: sourceSquare as Square,
            to: targetSquare as Square,
          });
        }

        if (move === null) {
          console.log("Invalid move attempted");
          return false;
        }

        console.log("Move successful:", move);

        // Update game state after successful move
        setMoveHistory(game.history({ verbose: true }));
        setPosition(game.fen()); // This triggers StockfishEngine to make opponent's move

        // Highlight the move that was just made
        setMoveSquares({
          [sourceSquare]: { background: "rgba(255, 255, 0, 0.4)" },
          [targetSquare]: { background: "rgba(255, 255, 0, 0.4)" },
        });

        // Check if game is over after the move
        checkGameStatus();

        return true;
      } catch (e) {
        console.error("Move error:", e);
        return false;
      }
    },
    [
      game,
      checkGameStatus,
      gameStatus,
      setMoveHistory,
      setPosition,
      setMoveSquares,
      setShowHint,
      playerColor, // Added to dependency array
    ]
  );

  return (
    <div className="w-full h-full">
      <Chessboard
        position={position}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customSquareStyles={{
          ...optionSquares,
          ...moveSquares,
        }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
        boardOrientation={boardOrientation} // Set the board orientation
      />
    </div>
  );
}
