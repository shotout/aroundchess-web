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
  // Safety check for invalid FEN data
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
      className="border border-gray-200 md:col-span-6 p-4 rounded-md flex items-center justify-center"
      variants={leftPanelVariants}
    >
      <div
        style={{ width: "100%", maxWidth: "750px" }}
        className="flex flex-col gap-y-4"
      >
        <Chessboard
          id="board-vision-board"
          boardWidth={700}
          position={currentPosition.fen}
          areArrowsAllowed={true}
          customSquareStyles={highlightedSquares}
          customArrows={
            gameQuestion && gameQuestion.text.includes("legal moves")
              ? []
              : arrows
          }
        />

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
      </div>
    </motion.div>
  );
};

export default BoardDisplay;
