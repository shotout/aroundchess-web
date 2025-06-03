import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { Piece, Square } from "chess.js";
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
}

const TwoDChessboard: React.FC<TwoDChessboardProps> = ({
  position,
  boardWidth,
  orientation,
  onPieceDrop,
  onPieceDragBegin,
  onPieceDragEnd,
  arePiecesDraggable = true,
  arePiecesClickable = false,
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
}) => {
  const { BoardChoosed, PieceChoosed } = useChessBoardThemeStore();
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
    pieces.forEach(({ piece, pieceHeight }) => {
      pieceComponents[piece] = ({ squareWidth, square }) => (
        <div
          style={{
            width: PieceChoosed == "wood" ? squareWidth * 0.8 : squareWidth,
            height: PieceChoosed == "wood" ? squareWidth * 0.85 : squareWidth,
            position: "relative",
            zIndex: 100,
          }}
        >
          <img
            src={`/pieces/${PieceChoosed}/${piece}.png`}
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
              objectFit: "contain",
              zIndex: 100,
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, [PieceChoosed]);
  return (
    <div className="relative" style={{ width: boardWidth, height: boardWidth }}>
      {/* <span className="text-white bg-[red]">{boardWidth / 8}</span> */}
      <Image
        src={`/boards/${BoardChoosed}.png`}
        alt="wood"
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
          {arePiecesDraggable != true && arePiecesClickable == true ? (
            <Chessboard
              arePremovesAllowed={arePremovesAllowed}
              onPieceDrop={onPieceDrop}
              onPieceDragBegin={
                onPieceDragBegin
                  ? (piece, sourceSquare) =>
                      onPieceDragBegin(piece as string, sourceSquare as string)
                  : undefined
              }
              onPieceDragEnd={onPieceDragEnd}
              onPieceClick={onPieceClick}
              customArrowColor={customArrowColor}
              boardOrientation={orientation}
              boardWidth={Math.round(boardWidth - boardWidth / 8.2)}
              arePiecesDraggable={false}
              position={position}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              onPromotionPieceSelect={(
                piece,
                promoteFromSquare,
                promoteToSquare
              ) => {
                if (piece) {
                  return onPromotionPieceSelect(piece);
                }
                return false;
              }}
              customBoardStyle={{
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
              customPieces={twoDPieces}
              customLightSquareStyle={{
                // backgroundColor: "#ff00ff70",
                backgroundColor: "transparent",
              }}
              customDarkSquareStyle={{
                // backgroundColor: "#00ff0080",
                backgroundColor: "transparent",
              }}
              customArrows={customArrows}
              areArrowsAllowed={areArrowsAllowed}
              customSquareStyles={customSquareStyles}
              promotionToSquare={promotionToSquare as Square | null | undefined}
              showPromotionDialog={showPromotionDialog}
              animationDuration={200}
            />
          ) : (
            <Chessboard
              boardOrientation={orientation}
              boardWidth={Math.round(boardWidth - boardWidth / 8.2)}
              arePiecesDraggable={false}
              position={position}
              customPieces={twoDPieces}
              customBoardStyle={{
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
              customLightSquareStyle={{
                backgroundColor: "transparent",
              }}
              customDarkSquareStyle={{
                backgroundColor: "transparent",
              }}
              animationDuration={100}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default TwoDChessboard;
