import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBoardVisionStore } from "../utils/BoardvisionStore";
import Popup from "../Popup";
import QuestionPanel from "../shared/QuestionPanel";
import GameResult from "../shared/GameResult";
import FeedbackPanel from "../shared/FeedbackPanel";
import LoadingState from "../shared/LoadingState";
import {
  containerVariants,
  leftPanelVariants,
  rightPanelVariants,
  feedbackVariants,
} from "../shared/animationVariant";
import BoardDisplay from "./components/BoardDisplay";

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

  const headerHeight = 97;
  const [showSetupPopup, setShowSetupPopup] = useState<boolean>(true);

  useEffect(() => {
    loadDefaultPositions();
  }, [loadDefaultPositions]);

  if (!currentPosition || !gameQuestion) {
    return (
      <>
        <LoadingState setShowSetupPopup={setShowSetupPopup} />
        <Popup
          isOpen={showSetupPopup}
          onClose={() => setShowSetupPopup(false)}
        />
      </>
    );
  }

  const isGameEnd = gameQuestionNumber > gameMaxQuestions;

  return (
    <>
      <main
        className="w-full p-0 xl:p-8 xl:mt-8"
        style={{ height: `calc(100vh - ${headerHeight}px)` }}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-10 min-h-full bg-white gap-5"
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
            className="border border-gray-200 md:col-span-4 rounded-md flex flex-col"
            variants={rightPanelVariants}
            style={{ minHeight: "600px" }}
          >
            <QuestionPanel
              gameQuestion={gameQuestion}
              gameSelectedAnswer={gameSelectedAnswer}
              gameShowFeedback={gameShowFeedback}
              gameQuestionNumber={gameQuestionNumber}
              gameMaxQuestions={gameMaxQuestions}
              handleGameSelectAnswer={handleDefaultGameSelectAnswer}
              isGameEnd={isGameEnd}
            />

            {isGameEnd && (
              <GameResult
                gameCorrects={gameCorrects}
                gameMaxQuestions={gameMaxQuestions}
                isGameEnd={isGameEnd}
              />
            )}

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
            />
          </motion.div>
        </motion.div>
      </main>

      <Popup isOpen={showSetupPopup} onClose={() => setShowSetupPopup(false)} />
    </>
  );
};

export default DefaultPGN;
