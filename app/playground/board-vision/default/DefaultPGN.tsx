import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBoardVisionStore } from "../utils/BoardvisionStore";
import Popup from "../Popup";
import QuestionPanel from "../shared/QuestionPanel";
import GameResult from "../shared/GameResult";
import FeedbackPanel from "../shared/FeedbackPanel";
import LoadingState from "../shared/LoadingState";
import Image from "next/image";
import {
  containerVariants,
  leftPanelVariants,
  rightPanelVariants,
  feedbackVariants,
} from "../shared/animationVariant";
import BoardDisplay from "./components/BoardDisplay";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";
import { usePgnStore } from "@/app/store/zustandStore";

const DefaultPGN: React.FC = () => {
  const {
    defaultGame,
    gameMaxQuestions,
    handleDefaultGameSelectAnswer,
    handleDefaultGameNextQuestion,
    loadDefaultPositions,
    getDefaultRandomQuestion,
    isChangingQuestion,
    startDefaultGameAgain,
  } = useBoardVisionStore();

  const { isLoading } = usePgnStore();

  const {
    currentPosition,
    gameQuestion,
    gameSelectedAnswer,
    gameShowFeedback,
    gameQuestionNumber,
    gameCorrects,
    highlightedSquares,
    arrows,
  } = defaultGame;

  const [showSetupPopup, setShowSetupPopup] = useState<boolean>(false);

  const [openAccountConnected, setOpenAccountConnected] = useState(false);

  useEffect(() => {
    loadDefaultPositions();
  }, [loadDefaultPositions]);

  if (!currentPosition || !gameQuestion) {
    return (
      <>
        <LoadingState setShowSetupPopup={setShowSetupPopup} />
      </>
    );
  }

  const isGameEnd = gameQuestionNumber > gameMaxQuestions;

  return (
    <>
      <main className="w-full h-full p-4 xl:p-8">
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-10 min-h-full bg-white xl:gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <BoardDisplay
            currentPosition={currentPosition}
            gameQuestion={gameQuestion}
            highlightedSquares={highlightedSquares}
            arrows={arrows}
            leftPanelVariants={leftPanelVariants}
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
                    handleGameSelectAnswer={handleDefaultGameSelectAnswer}
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

              <div className="mt-auto">
                <FeedbackPanel
                  feedbackVariants={feedbackVariants}
                  gameShowFeedback={gameShowFeedback}
                  isGameEnd={isGameEnd}
                  gameQuestion={gameQuestion}
                  gameSelectedAnswer={gameSelectedAnswer}
                  handleGameNextQuestion={handleDefaultGameNextQuestion}
                  startGameAgain={startDefaultGameAgain}
                  setShowSetupPopup={setShowSetupPopup}
                  getRandomQuestion={getDefaultRandomQuestion}
                  isChangingQuestion={isChangingQuestion}
                  isUserPGN={false}
                  gameQuestionNumber={gameQuestionNumber}
                  gameMaxQuestions={gameMaxQuestions}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Popup isOpen={showSetupPopup} 
        onClose={() => setShowSetupPopup(false)} 
        handleUsernameClicked={() => {
          setShowSetupPopup(false);
          setOpenAccountConnected(true);
        }} />

      {openAccountConnected && (
        <ChessAccountSetup
          isLoading={isLoading} 
          open={openAccountConnected} 
          setOpen={setOpenAccountConnected} 
        />
      )}
    </>
  );
};

export default DefaultPGN;
