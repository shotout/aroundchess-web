import React from "react";
import { Chessboard } from "react-chessboard";
import { BoardDisplayProps } from "../../types/default-pgn";
import { motion } from "framer-motion";

// Update the interface to include className
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
      className={`xl:border border-gray-200 p-4 rounded-md flex flex-col md:col-span-6 ${className}`}
      variants={leftPanelVariants}
    >
      <div className="relative w-full flex justify-center items-center">
        <div className="aspect-square bg-white flex items-center justify-center w-full xl:p-12 overflow-hidden max-w-[750px] max-h-[700px]">
          <div className="w-full h-full">
            <Chessboard
              id="board-vision-board"
              position={currentPosition.fen}
              areArrowsAllowed={true}
              customSquareStyles={highlightedSquares}
              arePiecesDraggable={false}
              customArrowColor="rgba(34, 26, 233, 0.8)"
              customArrows={
                gameQuestion && gameQuestion.text.includes("legal moves")
                  ? []
                  : arrows
              }
            />
          </div>
        </div>
      </div>

      {currentPosition.white && currentPosition.black && (
        <a
          href={currentPosition.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:underline text-xl text-center flex items-center justify-center mt-4"
        >
          {currentPosition.white} vs {currentPosition.black}
        </a>
      )}
    </motion.div>
  );
};

export default BoardDisplay;
