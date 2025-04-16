import React from "react";
import { Chessboard } from "react-chessboard";
import { motion } from "framer-motion";
import { BoardDisplayProps } from "../../types/default-pgn";

const BoardDisplay: React.FC<BoardDisplayProps> = ({
  currentPosition,
  gameQuestion,
  highlightedSquares,
  arrows,
  leftPanelVariants,
}) => {
  const isValidPosition =
    currentPosition &&
    currentPosition.fen &&
    typeof currentPosition.fen === "string" &&
    currentPosition.fen.includes(" ");

  if (!isValidPosition) {
    return (
      <motion.div
        className="border border-gray-200 md:col-span-6 p-4 rounded-md flex items-center justify-center"
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
      className="xl:border xl:border-gray-200 md:col-span-6 p-4 rounded-md flex flex-col"
      variants={leftPanelVariants}
    >
      <div className="relative w-full flex justify-center items-center">
        <div className="aspect-square bg-white flex items-center justify-center w-full overflow-hidden max-w-[750px] max-h-[700px]">
          <div className="w-full h-full px-1 lg:p-2 2xl:p-5">
            <Chessboard
              id="board-vision-board"
              position={currentPosition.fen}
              areArrowsAllowed={true}
              customSquareStyles={highlightedSquares}
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
