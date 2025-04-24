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
  const { BoardChoosed, PieceChoosed } = useChessBoardThemeStore();
  const [boardSize, setBoardSize] = useState<number | undefined>(700);
  const [mounted, _] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();

    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted]);

  const handleResize = () => {
    const boxW = ref.current?.clientWidth;
    setBoardSize(boxW);
  };

  const twoDPieces = useMemo(() => {
    const pieces = [
      { piece: "wP", pieceHeight: 1.2 },
      { piece: "wN", pieceHeight: 1.2 },
      { piece: "wB", pieceHeight: 1.2 },
      { piece: "wR", pieceHeight: 1.2 },
      { piece: "wQ", pieceHeight: 1.5 },
      { piece: "wK", pieceHeight: 1.6 },
      { piece: "bP", pieceHeight: 1.2 },
      { piece: "bN", pieceHeight: 1.2 },
      { piece: "bB", pieceHeight: 1.2 },
      { piece: "bR", pieceHeight: 1.2 },
      { piece: "bQ", pieceHeight: 1.5 },
      { piece: "bK", pieceHeight: 1.6 },
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

    pieces.forEach(({ piece, pieceHeight }, index) => {
      pieceComponents[piece] = ({ squareWidth, square }) => (
        <div
          key={index}
          style={{
            width: squareWidth * 0.8,
            height: squareWidth * 0.85,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <Image
            src={`/pieces/wood/${piece}.png`}
            alt={`${piece} chess piece`}
            width={squareWidth}
            height={squareWidth}
            style={{
              position: "absolute",
              bottom: 0,
              objectFit: "contain",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      );
    });

    return pieceComponents;
  }, []);

  return (
    <div key={keys} id={id} className="relative w-full h-full">
      <div className="absolute inset-0">
        <Image
          src={`/boards/wood.png`}
          alt="wood board"
          width={boardSize}
          height={boardSize}
          priority
        />
      </div>

      <div
        className="relative w-full h-full"
        ref={ref}
        style={{ padding: boardSize && Math.round(boardSize / 16.5) }}
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
