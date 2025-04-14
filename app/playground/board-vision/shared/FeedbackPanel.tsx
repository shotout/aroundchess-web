import React from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FeedbackPanelProps } from "../types/default-pgn";

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  feedbackVariants,
  gameShowFeedback,
  isGameEnd,
  gameQuestion,
  gameSelectedAnswer,
  handleGameNextQuestion,
  startGameAgain,
  setShowSetupPopup,
  getRandomQuestion,
  isChangingQuestion,
  routeToDefault,
  isUserPGN = false,
}) => {
  const isCorrect =
    gameQuestion && gameSelectedAnswer === gameQuestion.correctAnswer;

  return (
    <div className="mt-auto">
      <AnimatePresence mode="wait">
        {gameShowFeedback && !isGameEnd ? (
          <motion.div
            className="space-y-4 p-6 border-t rounded-2xl"
            key="feedback"
            variants={feedbackVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className={`relative ${
                isCorrect
                  ? "bg-gradient-to-r from-[#1BC08C]/30 from-0% via-[#1BC08C] via-50% to-[#1BC08C]/30 to-100%"
                  : "bg-gradient-to-r from-[#fff]/30 from-0% via-[#C01B1B] via-50% to-[#fff]/30 to-100%"
              } border rounded-lg p-4 pl-10 flex items-center gap-2`}
            >
              <Image
                width={20}
                height={20}
                alt="check icon"
                src={"/handbooks/check.png"}
                className="h-5 w-5 text-green-500"
              />
              <h1 className="text-black font-medium">
                {isCorrect ? "Correct!" : "Incorrect!"} The answer is{" "}
                {gameQuestion?.correctAnswer}.
              </h1>

              <Image
                width={200}
                height={200}
                alt="sparks"
                src={"/handbooks/sparks.png"}
                className="absolute top-0 right-12"
              />
            </div>

            <Button
              onClick={handleGameNextQuestion}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 py-5 text-lg"
              variant="default"
            >
              Next Question
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        ) : isGameEnd ? (
          <motion.div
            className="space-y-4 p-6 border-t rounded-2xl"
            key="endgame"
            variants={feedbackVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Button
              onClick={startGameAgain}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 py-5 text-lg"
              variant="default"
            >
              Play Again
              <RefreshCw className="h-5 w-5 ml-2" />
            </Button>

            <Button
              onClick={() => setShowSetupPopup(true)}
              className="w-full flex items-center justify-center py-5 text-lg"
              variant="outline"
            >
              {isUserPGN ? "Change Username" : "Enter Chess.com Username"}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="change-question"
            variants={feedbackVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-6 border-t rounded-2xl space-y-3"
          >
            {/* Show Change Questions button for both DefaultPGN and UserPGN */}
            {getRandomQuestion && (
              <Button
                onClick={getRandomQuestion}
                disabled={isChangingQuestion}
                className="w-full flex items-center justify-center py-5 text-lg"
                variant="outline"
              >
                {isChangingQuestion ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Change Questions
                  </>
                )}
              </Button>
            )}

            {/* Only show Try Default Questions button for UserPGN */}
            {/* {isUserPGN && routeToDefault && (
              <Button
                onClick={routeToDefault}
                className="w-full flex items-center justify-center py-5 text-lg"
                variant="outline"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Default Questions
              </Button>
            )} */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackPanel;
