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

  const getUserInfo = () => {
    if (!currentPosition || !username)
      return {
        isWhiteUser: false,
        userProfilePic: null,
        opponentProfilePic: null,
        opponentName: "",
      };

    const isWhiteUser = currentPosition.white === username;
    return {
      isWhiteUser,
      userProfilePic: isWhiteUser
        ? currentPosition.whiteProfilePic
        : currentPosition.blackProfilePic,
      opponentProfilePic: isWhiteUser
        ? currentPosition.blackProfilePic
        : currentPosition.whiteProfilePic,
      opponentName: isWhiteUser ? currentPosition.black : currentPosition.white,
    };
  };

  const routeToDefault = () => {
    router.push("/playground/board-vision/default");
  };

  if (!currentPosition || !gameQuestion) {
    return (
      <>
        <LoadingState
          setShowSetupPopup={setShowSetupPopup}
          message="Please enter your Chess.com username to load your games."
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
          className="grid grid-cols-1 xl:grid-cols-10 min-h-full bg-white xl:gap-5"
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
            username={username}
            userProfilePic={userProfilePic}
            opponentProfilePic={opponentProfilePic}
            opponentName={opponentName}
          />

          <motion.div
            className="border border-primary-gray md:col-span-4 rounded-md flex flex-col"
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

      <Popup isOpen={showSetupPopup} onClose={() => setShowSetupPopup(false)} />
    </>
  );
};

export default UserPGN;
