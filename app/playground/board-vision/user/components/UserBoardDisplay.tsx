import React from "react";
import { Chessboard } from "react-chessboard";
import { motion } from "framer-motion";
import PlayerInfo from "./PlayerInfo";
import { UserBoardDisplayProps } from "../../types/default-pgn";

const UserBoardDisplay: React.FC<UserBoardDisplayProps> = ({
  currentPosition,
  gameQuestion,
  highlightedSquares,
  arrows,
  leftPanelVariants,
  username,
  userProfilePic,
  opponentProfilePic,
  opponentName,
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
      className="xl:border border-gray-200 md:col-span-6 xl:p-4 p-0 mb-4 xl:mb-0 rounded-md flex flex-col justify-center"
      variants={leftPanelVariants}
    >
      <PlayerInfo profilePic={userProfilePic} playerName={username} />

      <div className="relative w-full flex justify-center items-center my-4">
        <div className="aspect-square bg-white flex items-center justify-center w-full overflow-hidden max-w-[600px] max-h-[700px]">
          <div className="w-full h-full">
            <Chessboard
              id="board-vision-board"
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
            />
          </div>
        </div>
      </div>

      <PlayerInfo profilePic={opponentProfilePic} playerName={opponentName} />
    </motion.div>
  );
};

export default UserBoardDisplay;
