import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { Square } from "chess.js";
import Image from "next/image";
import React, { useMemo } from "react";

import { Chessboard } from "react-chessboard";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { motion } from "framer-motion";

interface TwoDChessboardProps {
  position?: string;
  boardWidth: number;
  orientation?: BoardOrientation | undefined;
  onPieceDragBegin?: ((piece: string, sourceSquare: string) => any) | undefined;
  onPieceDragEnd?: ((piece: string, sourceSquare: string) => any) | undefined;
  onPieceDrop?: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => boolean;
  arePiecesDraggable?: boolean;
  arePiecesClickable?: boolean;
  onSquareClick?: (square: Square) => void;
  onSquareRightClick?: (square: Square) => void;
  onPromotionPieceSelect: (
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => boolean;
  onPieceClick?: ((piece: string, sourceSquare: string) => any) | undefined;
  promotionToSquare?: Square | null | string;
  showPromotionDialog?: boolean;
  customSquareStyles?: Record<string, React.CSSProperties>;
  customArrows?: any;
  areArrowsAllowed?: boolean;
  arePremovesAllowed?: boolean;
  customArrowColor?: string;
  game?: any;
  playerColor?: "w" | "b";
  gameStatus?: string;
  setOptionSquares?: (squares: Record<string, { background: string }>) => void;
}

const TwoDChessboard: React.FC<TwoDChessboardProps> = ({
  position,
  boardWidth,
  orientation,
  onPieceDrop,
  onPieceDragBegin,
  onPieceDragEnd,
  arePiecesDraggable = true,
  onSquareClick,
  onSquareRightClick,
  onPromotionPieceSelect,
  onPieceClick,
  promotionToSquare,
  showPromotionDialog,
  customSquareStyles,
  customArrows,
  areArrowsAllowed,
  customArrowColor,
  arePremovesAllowed,
  game,
  playerColor,
  gameStatus,
  setOptionSquares,
}) => {
  const { BoardChoosed, PieceChoosed } = useChessBoardThemeStore();

  const boardImageSrc = useMemo(() => {
    const isPlayingAsBlack = playerColor === "b" || orientation === "black";
    const boardSuffix = isPlayingAsBlack ? "-flipped" : "";
    return `/boards/${BoardChoosed}${boardSuffix}.png`;
  }, [BoardChoosed, orientation, playerColor]);

  const handlePieceDragBegin = (piece: string, sourceSquare: string) => {
    if (onPieceDragBegin) {
      onPieceDragBegin(piece, sourceSquare);
    }

    if (game && setOptionSquares && gameStatus === "ongoing") {
      const moves = game.moves({
        square: sourceSquare as Square,
        verbose: true,
      });

      if (moves.length > 0) {
        const newSquares: Record<string, { background: string }> = {};

        moves.forEach((move: any) => {
          newSquares[move.to] = {
            background:
              game.get(move.to) &&
              game.get(move.to)?.color !==
                game.get(sourceSquare as Square)?.color
                ? "radial-gradient(circle, rgba(34,26,233) 30%, transparent 30%)"
                : "radial-gradient(circle, rgba(34,26,233) 25%, transparent 25%)",
          };
        });

        newSquares[sourceSquare] = {
          background: "#F5F682",
        };

        setOptionSquares(newSquares);
      }
    }
  };

  const handlePieceDragEnd = (piece: string, sourceSquare: string) => {
    if (onPieceDragEnd) {
      onPieceDragEnd(piece, sourceSquare);
    }

    if (setOptionSquares) {
      setOptionSquares({});
    }
  };

  const handlePieceDrop = (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => {
    if (setOptionSquares) {
      setOptionSquares({});
    }

    if (onPieceDrop) {
      return onPieceDrop(sourceSquare, targetSquare, piece);
    }

    return false;
  };

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
        isDragging,
      }: {
        squareWidth: number;
        square: string;
        isDragging?: boolean;
      }) => JSX.Element;
    } = {};
    pieces.forEach(({ piece, pieceHeight }) => {
      pieceComponents[piece] = ({ squareWidth, square, isDragging }) => (
        <div
          style={{
            width: PieceChoosed == "wood" ? squareWidth * 0.8 : squareWidth,
            height: PieceChoosed == "wood" ? squareWidth * 0.85 : squareWidth,
            position: "relative",
            cursor: arePiecesDraggable ? "grab" : "pointer",
          }}
        >
          <Image
            src={`/pieces/${PieceChoosed}/${piece}.png`}
            width={squareWidth}
            height={squareWidth}
            alt={piece}
            style={{
              position: "absolute",
              bottom:
                PieceChoosed == "wood"
                  ? `${-0.1 * squareWidth}px`
                  : PieceChoosed == "glass"
                  ? `${0.1 * squareWidth}px`
                  : `${0 * squareWidth}px`,
              objectFit: "contain",
              zIndex: isDragging ? 1000 : 100,
              pointerEvents: "none",
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, [PieceChoosed, arePiecesDraggable]);

  return (
    <div className="relative" style={{ width: boardWidth, height: boardWidth }}>
      <Image
        src={boardImageSrc}
        alt="chessboard"
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
        <motion.div
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeIn" }}
          style={{
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Chessboard
            arePremovesAllowed={arePremovesAllowed}
            onPieceDrop={handlePieceDrop}
            onPieceDragBegin={handlePieceDragBegin}
            onPieceDragEnd={handlePieceDragEnd}
            onPieceClick={onPieceClick}
            customArrowColor={customArrowColor}
            boardOrientation={orientation}
            boardWidth={Math.round(boardWidth - boardWidth / 8.2)}
            arePiecesDraggable={arePiecesDraggable}
            position={position}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            onPromotionPieceSelect={(
              piece,
              promoteFromSquare,
              promoteToSquare
            ) => {
              if (piece) {
                return onPromotionPieceSelect(
                  piece,
                  promoteFromSquare,
                  promoteToSquare
                );
              }
              return false;
            }}
            customBoardStyle={{
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customPieces={twoDPieces}
            customLightSquareStyle={{
              backgroundColor: "transparent",
            }}
            customDarkSquareStyle={{
              backgroundColor: "transparent",
            }}
            customArrows={customArrows}
            areArrowsAllowed={areArrowsAllowed}
            customSquareStyles={customSquareStyles}
            promotionToSquare={promotionToSquare as Square | null | undefined}
            showPromotionDialog={showPromotionDialog}
            animationDuration={200}
            snapToCursor
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TwoDChessboard;
