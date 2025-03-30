import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { Square } from "chess.js";
import Image from "next/image";
import React, { useMemo } from "react";

import { Chessboard } from "react-chessboard";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";

interface TwoDChessboardProps {
  position: string;
  boardWidth: number;
  orientation: BoardOrientation | undefined;
  // onPieceDrop?: (
  //   sourceSquare: Square,
  //   targetSquare: Square,
  //   piece: string
  // ) => boolean;
  arePiecesDraggable: boolean;
  onSquareClick:  (square: Square) => void;
  onSquareRightClick:  (square: Square) => void;
  onPromotionPieceSelect: (piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean;
   
  promotionToSquare: Square | null;
  showPromotionDialog: boolean;
  customSquareStyles?: Record<string, React.CSSProperties>;
  customArrows:any
}

const TwoDChessboard: React.FC<TwoDChessboardProps> = ({
  position,
  boardWidth,
  orientation,
  // onPieceDrop,
  arePiecesDraggable,
  onSquareClick,
  onSquareRightClick,
  onPromotionPieceSelect, 
  promotionToSquare,
  showPromotionDialog,
  customSquareStyles,
  customArrows
}) => {
  const {
    StyleChoosed,
    setStyleChoosed,
    BoardChoosed,
    setBoardChoosed,
    PieceChoosed,
    setPieceChoosed,
  } = useChessBoardThemeStore();
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
            width: squareWidth * 0.8,
            height: squareWidth * 0.85,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <img
            src={`/pieces/${PieceChoosed}/${piece}.png`}
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
        <Chessboard
          // onPieceDrop={onPieceDrop}
          boardOrientation={orientation}
          boardWidth={Math.round(boardWidth - boardWidth / 8.5)}
          arePiecesDraggable={arePiecesDraggable}
          position={position}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          onPromotionPieceSelect={(piece, promoteFromSquare, promoteToSquare) => {
            if (piece) {
              return onPromotionPieceSelect(piece);
            }
            return false;
          }}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          customArrows={customArrows}
          customSquareStyles={customSquareStyles}
          promotionToSquare={promotionToSquare}
          showPromotionDialog={showPromotionDialog}
          animationDuration={200}
        />
      </div>
    </div>
  );
};
export default TwoDChessboard;
