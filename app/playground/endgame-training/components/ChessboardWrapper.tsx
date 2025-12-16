"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Square } from "chess.js";
import { motion } from "framer-motion";
import { MoveRightIcon } from "lucide-react";
import { ChessboardWrapperProps } from "../types/ChessboardWrapperType";
import ThreeDBoard from "@/components/chessboard/3d/ThreeDChessboard";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import { CustomChessArrows } from "@/components/game-history/components/CustomChessArrows";

interface ChessboardWrapperPropsWithSound extends ChessboardWrapperProps {
  onMovePlay?: (move: any) => void;
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
  boardOrientation,
  playerColor,
  bestMove,
  showHint,
  is3DMode,
  onMovePlay,
}: ChessboardWrapperPropsWithSound) {
  const [boardSize, setBoardSize] = useState<number | undefined>(800);
  const [mounted, _] = useState<boolean>(true);
  const [rightClickedSquares, setRightClickedSquares] = useState<
    Record<string, { backgroundColor: string }>
  >({});
  const [hintClicked, setHintClicked] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to detect if a move is a knight move (L-shaped)
  const isKnightMove = useCallback((from: string, to: string): boolean => {
    const fileFrom = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankFrom = parseInt(from[1]) - 1;
    const fileTo = to.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankTo = parseInt(to[1]) - 1;

    const fileDiff = Math.abs(fileTo - fileFrom);
    const rankDiff = Math.abs(rankTo - rankFrom);

    // Knight moves: 2 squares in one direction, 1 in perpendicular
    return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
  }, []);

  // Convert hint arrows to ArrowConfig format for CustomChessArrows
  const customArrowsConfig = useMemo(() => {
    if (!bestMove || !showHint || !hintClicked) {
      return [];
    }

    const from = bestMove.substring(0, 2);
    const to = bestMove.substring(2, 4);

    return [{
      from,
      to,
      color: "rgba(28, 22, 194, 0.7)", // Purple hint color with opacity
      isKnightMove: isKnightMove(from, to)
    }];
  }, [bestMove, showHint, hintClicked, isKnightMove]);


  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();

    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted]);

  useEffect(() => {
    setHintClicked(showHint ?? false);
  }, [showHint]);

   const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1280 ? window.innerWidth / 3.2 : 480;

    // Get the actual container width
    const containerWidth = containerRef.current?.offsetWidth || width;
    const maxBoardWidth = Math.min(containerWidth - 40, 800); // 40px for padding, max 600px

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20, maxBoardWidth));
    } else {
      const availableHeight = height - minPadding * 2;
      setBoardSize(Math.min(maxSize, availableHeight * 0.8, maxBoardWidth));
    }
  };

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
              ? "radial-gradient(circle, rgba(34,26,233) 30%, transparent 30%)"
              : "radial-gradient(circle, rgba(34,26,233) 25%, transparent 25%)",
        };
      });

      newSquares[square] = {
        background: "#F5F682",
      };

      setOptionSquares(newSquares);
      return true;
    },
    [game, setOptionSquares]
  );

  const onSquareRightClick = useCallback(
    (square: Square) => {
      const colour = "rgba(0, 0, 255, 0.4)";
      setRightClickedSquares({
        ...rightClickedSquares,
        [square]: {
          backgroundColor:
            rightClickedSquares[square]?.backgroundColor === colour
              ? ""
              : colour,
        },
      });
    },
    [rightClickedSquares]
  );

  const onSquareClick = useCallback(
    (square: Square) => {
      setRightClickedSquares({} as Record<string, { backgroundColor: string }>);

      if (hintClicked) {
        setHintClicked(false);
        setShowHint(false);
      }

      if (game.turn() !== playerColor || gameStatus !== "ongoing") return;

      if (!moveFrom) {
        const piece = game.get(square);
        if (piece && piece.color !== playerColor) return;

        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) {
          setMoveFrom(square);
        }
        return;
      }

      if (!moveTo) {
        const moves = game.moves({
          square: moveFrom as Square,
          verbose: true,
        });
        const foundMove = moves.find(
          (m) => m.from === moveFrom && m.to === square
        );

        if (!foundMove) {
          const piece = game.get(square);
          if (piece && piece.color === playerColor) {
            const hasMoveOptions = getMoveOptions(square);
            setMoveFrom(hasMoveOptions ? square : "");
          } else {
            setMoveFrom("");
            setOptionSquares({});
          }
          return;
        }

        setMoveTo(square);

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

        const move = game.move({
          from: moveFrom,
          to: square,
        });

        if (move === null) {
          const hasMoveOptions = getMoveOptions(square);
          if (hasMoveOptions) setMoveFrom(square);
          return;
        }

        if (onMovePlay) {
          onMovePlay(move);
        }

        setMoveHistory(game.history({ verbose: true }));
        setPosition(game.fen());

        setMoveSquares({
          [moveFrom]: { background: "rgba(255, 255, 0, 0.4)" },
          [square]: { background: "rgba(255, 255, 0, 0.4)" },
        });

        setMoveFrom("");
        setMoveTo(null);
        setOptionSquares({});

        checkGameStatus();

        return;
      }
    },
    [
      hintClicked,
      game,
      playerColor,
      gameStatus,
      moveFrom,
      moveTo,
      setShowHint,
      getMoveOptions,
      setMoveFrom,
      setMoveTo,
      setMoveHistory,
      setPosition,
      setMoveSquares,
      setOptionSquares,
      checkGameStatus,
      setShowPromotionDialog,
      onMovePlay,
    ]
  );

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
        if (onMovePlay) {
          onMovePlay(move);
        }

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
      onMovePlay,
    ]
  );

  const getCustomArrows = () => {
    if (bestMove && showHint) {
      return [
        [
          bestMove.substring(0, 2) as Square,
          bestMove.substring(2, 4) as Square,
        ],
      ];
    }
    return null;
  };

  const onPieceDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square, piece: string) => {
      if (game.turn() !== playerColor || gameStatus !== "ongoing") {
        return false;
      }

      const moves = game.moves({
        square: sourceSquare,
        verbose: true,
      });

      const foundMove = moves.find(
        (m) => m.from === sourceSquare && m.to === targetSquare
      );

      if (!foundMove) {
        return false;
      }

      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          targetSquare[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          targetSquare[1] === "1")
      ) {
        setMoveFrom(sourceSquare);
        setMoveTo(targetSquare);
        setShowPromotionDialog(true);
        return false;
      }

      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (move === null) {
        return false;
      }

      if (onMovePlay) {
        onMovePlay(move);
      }

      setMoveHistory(game.history({ verbose: true }));
      setPosition(game.fen());

      setMoveSquares({
        [sourceSquare]: { background: "rgba(255, 255, 0, 0.4)" },
        [targetSquare]: { background: "rgba(255, 255, 0, 0.4)" },
      });

      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});

      checkGameStatus();

      return true;
    },
    [
      game,
      playerColor,
      gameStatus,
      setMoveHistory,
      setPosition,
      setMoveSquares,
      setMoveFrom,
      setMoveTo,
      setOptionSquares,
      setShowPromotionDialog,
      checkGameStatus,
      onMovePlay,
    ]
  );

  return (
    <div ref={containerRef} className="flex flex-col justify-center items-center gap-3 mt-6 sm:mt-0">
      <motion.div
        initial={{ rotateX: 180 }}
        animate={
          !is3DMode
            ? { opacity: 0, display: "hidden" }
            : { opacity: 1, rotateX: !is3DMode ? 180 : 360 }
        }
        transition={{
          duration: 0.6,
          stiffness: 500,
          damping: 30,
          ease: [0.4, 0.0, 0.2, 1],
          type: "tween",
        }}
        className="max-w-full"
        style={{
          maxWidth: '100%',
          display: is3DMode ? "flex" : "none",
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        {is3DMode && (
          <ThreeDBoard
            arePiecesClickable={true}
            boardWidth={boardSize ?? 0}
            arePiecesDraggable={false}
            orientation={boardOrientation}
            position={position ?? undefined}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            onPromotionPieceSelect={onPromotionPieceSelect}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
              ...rightClickedSquares,
            }}
            areArrowsAllowed={true}
            customArrows={getCustomArrows()}
            customArrowColor={hintClicked ? "#1C16C2" : "transparent"}
            promotionToSquare={moveTo}
            showPromotionDialog={showPromotionDialog}
          />
        )}
      </motion.div>

      <motion.div
       className="max-w-full"
        style={{
          maxWidth: '100%',
          display: !is3DMode ? "flex" : "none",
          backfaceVisibility: "hidden",
          position: "relative",
        }}
      >
        {!is3DMode && (
          <>
            <TwoDChessboard
              arePiecesClickable={true}
              boardWidth={boardSize ?? 0}
              arePiecesDraggable={true}
              orientation={boardOrientation}
              position={position ?? undefined}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              onPromotionPieceSelect={onPromotionPieceSelect}
              onPieceDrop={onPieceDrop}
              customSquareStyles={{
                ...moveSquares,
                ...optionSquares,
                ...rightClickedSquares,
              }}
              areArrowsAllowed={false}
              promotionToSquare={moveTo}
              showPromotionDialog={showPromotionDialog}
              game={game}
              playerColor={playerColor}
              gameStatus={gameStatus}
              setOptionSquares={setOptionSquares}
            />
            {customArrowsConfig.length > 0 && (
              <CustomChessArrows
                arrows={customArrowsConfig}
                boardSize={boardSize ?? 0}
                orientation={boardOrientation}
              />
            )}
          </>
        )}
      </motion.div>

      <div className="flex flex-row flex-wrap items-center justify-center gap-2 mb-2">
        <div className="flex flex-row items-center justify-center gap-1">
          <div className="w-[14px] h-[14px] bg-[#B9CA43]" />
          <span className="h-[14px] font-normal text-[11px]">
            Previous Place
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <div className="w-[14px] h-[14px] bg-[#F5F682]" />
          <span className="h-[14px] font-normal text-[11px]">
            Current Place
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <div className="w-[14px] h-[14px] rounded-full bg-[#1C16C2]" />
          <span className="h-[14px] font-normal text-[11px]">
            Possible Move
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <MoveRightIcon color="#221AE950" size={16} />
          <span className="h-[14px] font-normal text-[11px]">
            Move Recommendation
          </span>
        </div>
      </div>
    </div>
  );
}
