import React, { Key, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Chessboard } from "react-chessboard";
import { Square } from "chess.js";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";

interface Simple2DChessProps {
  position?: string;
  orientation?: BoardOrientation | undefined;
  onPieceDragBegin?: ((piece: string, sourceSquare: string) => any) | undefined;
  onPieceDragEnd?: ((piece: string, sourceSquare: string) => any) | undefined;
  onPieceDrop?: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => boolean;
  arePiecesDraggable?: boolean;
  onSquareClick?: (square: Square) => void;
  onSquareRightClick?: (square: Square) => void;
  onPromotionPieceSelect?: (
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => boolean;
  onPieceClick?: ((piece: string, sourceSquare: string) => any) | undefined;
  promotionToSquare?: Square | null;
  showPromotionDialog?: boolean;
  customSquareStyles?: Record<string, React.CSSProperties>;
  customArrows?: any;
  areArrowsAllowed?: boolean;
  arePremovesAllowed?: boolean;
  customArrowColor?: string;
  id?: number | any;
  keys?: Key;
  boardWidth?: number;
}

const Simple2DChess: React.FC<Simple2DChessProps> = ({
  position,
  orientation,
  onPieceDragBegin,
  onPieceDragEnd,
  onPieceDrop,
  arePiecesDraggable = true,
  onSquareClick,
  onSquareRightClick,
  onPromotionPieceSelect,
  promotionToSquare,
  showPromotionDialog,
  customSquareStyles,
  customArrows,
  areArrowsAllowed,
  customArrowColor,
  onPieceClick,
  arePremovesAllowed,
  id,
  keys,
}) => {
  const [boardSize, setBoardSize] = useState<number | undefined>(undefined);
  const { BoardChoosed, PieceChoosed } = useChessBoardThemeStore();

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (!ref.current) return;

      const containerWidth = ref.current.clientWidth;
      if (containerWidth && containerWidth > 0) {
        setBoardSize(containerWidth);
      }
    };

    const initialResize = () => {
      requestAnimationFrame(() => {
        handleResize();
      });
    };

    const timeoutId = setTimeout(initialResize, 0);

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener("resize", debouncedResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedResize);
      debouncedResize.cancel();
    };
  }, []);

  function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timeoutId: NodeJS.Timeout;
    const debounced = (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timeoutId);
    return debounced;
  }

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

    pieces.forEach(({ piece }, index) => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          key={index}
          style={{
            width: PieceChoosed == "wood" ? squareWidth * 0.8 : squareWidth,
            height: PieceChoosed == "wood" ? squareWidth * 0.85 : squareWidth,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <Image
            src={`/pieces/${PieceChoosed}/${piece}.png`}
            alt={`${piece} chess piece`}
            width={squareWidth}
            height={squareWidth}
            style={{
              position: "absolute",
              bottom:
                PieceChoosed == "wood"
                  ? `${-0.1 * squareWidth}px`
                  : PieceChoosed == "glass"
                  ? `${0.1 * squareWidth}px`
                  : `${0 * squareWidth}px`,
            }}
          />
        </div>
      );
    });

    return pieceComponents;
  }, []);

  // Don't render the chessboard until we have a proper board size
  if (!boardSize) {
    return (
      <div key={keys} id={id} className="relative w-full h-full" ref={ref}>
        <div className="w-full h-full flex items-center justify-center">
          {/* Optional loading state */}
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div key={keys} id={id} className="relative w-full h-full">
      <div className="absolute inset-0">
        <Image
          src={`/boards/${BoardChoosed}.png`}
          alt="wood board"
          width={boardSize}
          height={boardSize}
          priority
        />
      </div>

      <div
        className="relative w-full h-full"
        ref={ref}
        style={{ padding: Math.round(boardSize / 16.5) }}
      >
        <div className="w-full h-full">
          <Chessboard
            id={`board-${id}`}
            arePremovesAllowed={arePremovesAllowed}
            onPieceDrop={onPieceDrop}
            onPieceDragBegin={onPieceDragBegin}
            onPieceDragEnd={onPieceDragEnd}
            onPieceClick={onPieceClick}
            arePiecesDraggable={arePiecesDraggable}
            customArrowColor={customArrowColor}
            boardOrientation={orientation}
            position={position}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            onPromotionPieceSelect={onPromotionPieceSelect}
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
            promotionToSquare={promotionToSquare}
            showPromotionDialog={showPromotionDialog}
            animationDuration={100}
          />
        </div>
      </div>
    </div>
  );
};

export default Simple2DChess;
