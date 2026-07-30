"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useBoardVisionStore } from "@/app/playground/board-vision/utils/BoardvisionStore";
import QuestionPanel from "@/app/playground/board-vision/shared/QuestionPanel";
import GameResult from "@/app/playground/board-vision/shared/GameResult";
import FeedbackPanel from "@/app/playground/board-vision/shared/FeedbackPanel";
import LoadingState from "@/app/playground/board-vision/shared/LoadingState";
import UserBoardDisplay from "@/app/playground/board-vision/user/components/UserBoardDisplay";
import {
  containerVariants,
  leftPanelVariants,
  rightPanelVariants,
  feedbackVariants,
} from "@/app/playground/board-vision/shared/animationVariant";
import Popup from "../../Popup";
import Image from "next/image";

const UserPGN: React.FC = () => {
  const router = useRouter();
  const {
    username,
    userGame,
    gameMaxQuestions,
    handleUserGameSelectAnswer,
    handleUserGameNextQuestion,
    getUserRandomQuestion,
    startUserGameAgain,
    isChangingQuestion,
    loadingError,
    _hasHydrated,
  } = useBoardVisionStore();

  const {
    currentPosition,
    gameQuestion,
    gameSelectedAnswer,
    gameShowFeedback,
    gameQuestionNumber,
    gameCorrects,
    highlightedSquares,
    arrows,
  } = userGame;

  const [showSetupPopup, setShowSetupPopup] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    if (loadingError) {
      toast.error("Error loading games", {
        description: loadingError,
        action: {
          label: "Try again",
          onClick: () => setShowSetupPopup(true),
        },
      });
    }
  }, [loadingError]);

  // Handle initialization after hydration
  useEffect(() => {
    if (_hasHydrated) {
      // Small delay to ensure all data is properly loaded
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [_hasHydrated]);

  // Each position carries the player's name for its game (game history can mix
  // chess.com, vs-AI and uploaded games); the store username is a fallback.
  const effectiveUsername = currentPosition?.username || username;

  const getUserInfo = () => {
    if (!currentPosition || !effectiveUsername)
      return {
        isWhiteUser: false,
        userProfilePic: null,
        opponentProfilePic: null,
        opponentName: "",
      };

    const isWhiteUser =
      currentPosition.white?.toLowerCase() === effectiveUsername.toLowerCase();
    const isBlackUser =
      currentPosition.black?.toLowerCase() === effectiveUsername.toLowerCase();

    // If username matches neither player, you might want to handle this case
    if (!isWhiteUser && !isBlackUser && !currentPosition.userColor) {
      console.warn("Username does not match either player in the position");
      // You could default to white or show an error
    }

    // The side resolved when the game was loaded (from the game record's colour)
    // wins: `username` alone mis-identifies the player whenever the record's
    // username isn't their name in that PGN.
    const actuallyWhiteUser = currentPosition.userColor
      ? currentPosition.userColor === "white"
      : isWhiteUser;

    return {
      isWhiteUser: actuallyWhiteUser,
      userProfilePic: actuallyWhiteUser
        ? currentPosition.whiteProfilePic
        : currentPosition.blackProfilePic,
      opponentProfilePic: actuallyWhiteUser
        ? currentPosition.blackProfilePic
        : currentPosition.whiteProfilePic,
      opponentName: actuallyWhiteUser
        ? currentPosition.black
        : currentPosition.white,
    };
  };

  const routeToDefault = () => {
    router.push("/playground/board-vision/default");
  };

  // Show loading while waiting for hydration
  if (!_hasHydrated || isInitializing) {
    return (
      <>
        <LoadingState
          setShowSetupPopup={setShowSetupPopup}
          message="Loading your game data..."
        />
        <Popup
          isOpen={showSetupPopup}
          onClose={() => setShowSetupPopup(false)}
        />
      </>
    );
  }

  // After hydration, check if we have game data
  if (!currentPosition || !gameQuestion) {
    return (
      <>
        <LoadingState
          setShowSetupPopup={setShowSetupPopup}
          message="Start a quiz to load your games."
        />
        <Popup
          isOpen={showSetupPopup}
          onClose={() => setShowSetupPopup(false)}
        />
      </>
    );
  }

  const isGameEnd = gameQuestionNumber > gameMaxQuestions;
  const { userProfilePic, opponentProfilePic, opponentName } = getUserInfo();

  return (
    <>
      <main className="w-full h-full p-4 xl:p-8">
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-10 min-h-full bg-white xl:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <UserBoardDisplay
            currentPosition={currentPosition}
            gameQuestion={gameQuestion}
            highlightedSquares={highlightedSquares}
            arrows={arrows}
            leftPanelVariants={leftPanelVariants}
            username={effectiveUsername}
            userProfilePic={userProfilePic}
            opponentProfilePic={opponentProfilePic}
            opponentName={opponentName}
          />

          <motion.div
            className="border border-[#E5E7EB] bg-white shadow-sm md:col-span-4 rounded-[16px] flex flex-col"
            variants={rightPanelVariants}
          >
            <div className="flex flex-col h-full">
              {!isGameEnd ? (
                <div className="flex flex-col h-full">
                  <QuestionPanel
                    gameQuestion={gameQuestion}
                    gameSelectedAnswer={gameSelectedAnswer}
                    gameShowFeedback={gameShowFeedback}
                    gameQuestionNumber={gameQuestionNumber}
                    gameMaxQuestions={gameMaxQuestions}
                    handleGameSelectAnswer={handleUserGameSelectAnswer}
                    isGameEnd={isGameEnd}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b pb-4 p-6">
                    <div className="flex items-center">
                      <Image
                        src={"/board-vision/board-vision.png"}
                        alt="board vision"
                        width={40}
                        height={40}
                        className="mr-2"
                      />
                      <span className="font-bold text-xl">Board Vision</span>
                    </div>
                    <div className="text-blue-base">The End</div>
                  </div>

                  <div className="flex-grow flex flex-col p-4 justify-center items-center w-full">
                    <GameResult
                      gameCorrects={gameCorrects}
                      gameMaxQuestions={gameMaxQuestions}
                      isGameEnd={isGameEnd}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-auto">
              <FeedbackPanel
                feedbackVariants={feedbackVariants}
                gameShowFeedback={gameShowFeedback}
                isGameEnd={isGameEnd}
                gameQuestion={gameQuestion}
                gameSelectedAnswer={gameSelectedAnswer}
                handleGameNextQuestion={handleUserGameNextQuestion}
                startGameAgain={startUserGameAgain}
                setShowSetupPopup={setShowSetupPopup}
                getRandomQuestion={getUserRandomQuestion}
                isChangingQuestion={isChangingQuestion}
                routeToDefault={routeToDefault}
                isUserPGN={true}
                gameQuestionNumber={gameQuestionNumber}
                gameMaxQuestions={gameMaxQuestions}
              />
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Popup
        isOpen={showSetupPopup}
        onClose={() => setShowSetupPopup(false)}
      />
    </>
  );
};

export default UserPGN;
