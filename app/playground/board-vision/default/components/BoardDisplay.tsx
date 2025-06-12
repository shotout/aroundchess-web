import React, { useEffect, useState } from "react";
import { BoardDisplayProps } from "../../types/default-pgn";
import { motion } from "framer-motion";
import Simple2DChess from "@/components/handbooks/components/Simple2DChess";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import { Square } from "chess.js";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

interface ExtendedBoardDisplayProps extends BoardDisplayProps {
  className?: string;
}

const BoardDisplay: React.FC<ExtendedBoardDisplayProps> = ({
  currentPosition,
  gameQuestion,
  highlightedSquares,
  arrows,
  leftPanelVariants,
  className = "",
}) => {
  const isValidPosition =
    currentPosition &&
    currentPosition.fen &&
    typeof currentPosition.fen === "string" &&
    currentPosition.fen.includes(" ");

  const [boardSize, setBoardSize] = useState<number | undefined>(1000);
  const [mounted, _] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();

    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted]);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1280 ? window.innerWidth / 3.2 : 480;

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
    } else {
      const availableHeight = height - minPadding * 2;
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
    }
  };

  if (!isValidPosition) {
    return (
      <motion.div
        className={`border border-gray-200 p-4 rounded-md flex items-center justify-center md:col-span-6 ${className}`}
        variants={leftPanelVariants}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Invalid position data</h2>
          <p>The chess position could not be displayed.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`xl:border border-gray-200 p-4 space-y-2 rounded-md flex flex-col md:col-span-6 ${className}`}
      variants={leftPanelVariants}
    >
      <div className="relative w-full flex justify-center items-center">
        <div className="aspect-square bg-white flex items-center justify-center  xl:p-12 overflow-hidden max-w-[750px] max-h-[700px]">
          <div className="w-full h-full flex justify-center items-center">
            <TwoDChessboard
              boardWidth={boardSize ?? 0}
              arePiecesClickable={false}
              arePiecesDraggable={false}
              position={currentPosition.fen}
              areArrowsAllowed={true}
              customSquareStyles={highlightedSquares}
              customArrowColor="#221AE980"
              customArrows={
                gameQuestion && gameQuestion.text.includes("legal moves")
                  ? []
                  : arrows
              }
              onPromotionPieceSelect={function (
                piece?: PromotionPieceOption,
                promoteFromSquare?: Square,
                promoteToSquare?: Square
              ): boolean {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
      </div>

      {currentPosition.white && currentPosition.black && (
        <a
          href={currentPosition.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:underline text-xl text-center flex items-center justify-center"
        >
          {currentPosition.white} vs {currentPosition.black}
        </a>
      )}
    </motion.div>
  );
};

export default BoardDisplay;
