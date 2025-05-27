/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useMemo } from "react";
import { Square } from "chess.js";
import Image from "next/image";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import DotSpinner from "@/components/game-history/Spinner";
import { motion } from "framer-motion";

interface ThreeDBoardProps {
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
  onSquareClick?: (square: Square) => void;
  onSquareRightClick?: (square: Square) => void;
  onPromotionPieceSelect: (
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => boolean;
  onPieceClick?: ((piece: string, sourceSquare: string) => any) | undefined;
  promotionToSquare?: string | null | undefined;
  showPromotionDialog?: boolean;
  customSquareStyles?: Record<string, React.CSSProperties>;
  customArrows?: any;
  areArrowsAllowed?: boolean;
  arePremovesAllowed?: boolean;
  customArrowColor?: string;
}

const ThreeDBoard: React.FC<ThreeDBoardProps> = ({
  position,
  boardWidth,
  orientation,
  onPieceDrop,
  onPieceDragEnd,
  onPieceDragBegin,
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
}) => {
  const {
    StyleChoosed,
    setStyleChoosed,
    BoardChoosed,
    setBoardChoosed,
    PieceChoosed,
    setPieceChoosed,
    trigger,
  } = useChessBoardThemeStore();
  // Board boardWidth configuration
  const [boardSize, setBoardSize] = useState<number | any>(700); // Default boardWidth
  const [scale, setScale] = useState<number | any>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log(boardWidth, "boardWidth in 3d board wood");
    console.log(window?.innerWidth, "widthC in 3d board wood");
    if (boardWidth) {
      let fixScale = boardWidth / 480;

      setScale(fixScale);
      let sz = boardWidth < 480 ? 480 : boardWidth;
      setBoardSize(boardWidth);
    } else {
      handleResize();
    }
  }, [boardWidth, window?.innerWidth]);
  const handleResize = () => {
    const width = window?.innerWidth;
    const height = window?.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window?.innerWidth / 3;
    console.log("Resizing board...", window?.innerWidth, isPortrait);

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
      console.log(
        "boardWidth board...",
        Math.min(maxSize, availableHeight * 0.8)
      );
    }
  };
  const threeDPieces = useMemo(() => {
    const pieces = [
      {
        piece: "wP",
        pieceHeight: 2,
      },
      {
        piece: "wN",
        pieceHeight: 2,
      },
      {
        piece: "wB",
        pieceHeight: 2,
      },
      {
        piece: "wR",
        pieceHeight: 2,
      },
      {
        piece: "wQ",
        pieceHeight: 2,
      },
      {
        piece: "wK",
        pieceHeight: 2,
      },
      {
        piece: "bP",
        pieceHeight: 2,
      },
      {
        piece: "bN",
        pieceHeight: 2,
      },
      {
        piece: "bB",
        pieceHeight: 2,
      },
      {
        piece: "bR",
        pieceHeight: 2,
      },
      {
        piece: "bQ",
        pieceHeight: 2,
      },
      {
        piece: "bK",
        pieceHeight: 2,
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
    pieces.forEach(({ piece, pieceHeight }, index) => {
      pieceComponents[piece] = ({ squareWidth, square }) => (
        <div
          key={index}
          style={{
            width: squareWidth * pieceHeight,
            height: squareWidth,
            position: "relative",
            transform: "rotateY(27.5deg)",
            // boxShadow: "rgba(0, 0, 0, 0.1) 2px 4px 24px 8px",
            borderRadius: "8px",
          }}
        >
          <img
            src={`/3d-pieces/${PieceChoosed}/${piece}.png`}
            alt="Chess board pieces"
            width={squareWidth * pieceHeight}
            height={squareWidth}
            style={{
              position: "absolute",
              bottom: `${0.05 * squareWidth}px`,
              objectFit: "contain",
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, [PieceChoosed]);
  // Frame dimensions
  let paddingTop = 48;
  if (loading) return <DotSpinner />;
  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        width: boardWidth,
        height: boardWidth,
      }}
    >
      <div
        className="relative flex items-center justify-center "
        style={{
          width: 480,
          height: 480,

          transform: `scale(${scale + ``})`,
        }}
      >
        <Image
          src={`/boards/3d-${BoardChoosed}-board.png`}
          alt="Chess board frame"
          width={1000}
          height={1000}
          className={`absolute z-2 w-[480px] h-[480px] object-contain `}
          priority
        />
        <div
          style={{
            marginTop: -48,
          }}
          className={`z-10 flex items-center justify-center `}
        >
          <motion.div
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              display: "flex",
              justifyContent: "start",
            }}
          >
            {arePiecesDraggable != null ? (
              <Chessboard
                arePremovesAllowed={arePremovesAllowed}
                onPieceDrop={onPieceDrop}
                onPieceDragBegin={
                  onPieceDragBegin
                    ? (piece, sourceSquare) =>
                        onPieceDragBegin(
                          piece as string,
                          sourceSquare as string
                        )
                    : undefined
                }
                onPieceDragEnd={onPieceDragEnd}
                onPieceClick={onPieceClick}
                arePiecesDraggable={false}
                customArrowColor={customArrowColor}
                boardOrientation={orientation}
                boardWidth={Math.round(480 * 0.78)}
                id="3DBoard"
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
                  boxShadow: "rgba(0, 0, 0, 0.1) 2px 4px 24px 8px",
                  transform: "rotateX(27.5deg) scale(1) perspective(0px)",
                  transformStyle: "preserve-3d",
                  transformOrigin: "center",
                }}
                customPieces={threeDPieces}
                customLightSquareStyle={{
                  backgroundColor: "transparent",
                  // backgroundColor: "#FFFFFF80",
                }}
                customDarkSquareStyle={{
                  backgroundColor: "transparent",
                  // backgroundColor: "#FFFFFF70",
                }}
                customArrows={customArrows}
                areArrowsAllowed={areArrowsAllowed}
                customSquareStyles={customSquareStyles}
                promotionToSquare={
                  promotionToSquare as Square | null | undefined
                }
                showPromotionDialog={showPromotionDialog}
                animationDuration={100}
              />
            ) : (
              <Chessboard
                arePiecesDraggable={false}
                boardOrientation={orientation}
                boardWidth={Math.round(480 * 0.779)}
                id="Styled3DBoard"
                position={position}
                customBoardStyle={{
                  boxShadow: "rgba(0, 0, 0, 0.5) 2px 4px 24px 8px",

                  transform: "rotateX(27.5deg) scale(1)",
                  transformOrigin: "center",
                  // background:"black"
                }}
                customPieces={threeDPieces}
                customLightSquareStyle={{
                  backgroundColor: "transparent",
                  // backgroundColor: "#00000080",
                }}
                customDarkSquareStyle={{
                  backgroundColor: "transparent",
                  // backgroundColor: "#00000070",
                }}
                animationDuration={100}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDBoard;
