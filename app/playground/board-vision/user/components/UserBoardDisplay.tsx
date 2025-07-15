import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PlayerInfo from "./PlayerInfo";
import { UserBoardDisplayProps } from "../../types/default-pgn";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import { Square } from "chess.js";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

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

  const [boardSize, setBoardSize] = useState<number | undefined>(600);
  const [mounted, _] = useState<boolean>(true);

  const isUserPlayingWhite =
    currentPosition?.white?.toLowerCase() === username?.toLowerCase();

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();

    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <PlayerInfo profilePic={opponentProfilePic} playerName={opponentName} />

      <div className="relative w-full flex justify-center items-center my-4">
        <div className="bg-white flex items-center justify-center overflow-hidden xl:max-w-[600px] 2xl:min-w-[600px] 2xl:max-w-[1000px]">
          <div className="w-full h-full flex justify-center items-center">
            <TwoDChessboard
              boardWidth={boardSize ?? 0}
              arePiecesDraggable={false}
              position={currentPosition.fen}
              orientation={isUserPlayingWhite ? "white" : "black"}
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
      <PlayerInfo profilePic={userProfilePic} playerName={username} />
    </motion.div>
  );
};

export default UserBoardDisplay;
