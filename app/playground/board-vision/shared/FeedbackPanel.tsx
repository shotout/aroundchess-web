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
  getRandomQuestion,
  isChangingQuestion,
  gameQuestionNumber,
  gameMaxQuestions,
}) => {
  const isCorrect =
    gameQuestion && gameSelectedAnswer === gameQuestion.correctAnswer;

  // Check if current question is the last one
  const isLastQuestion = gameQuestionNumber === gameMaxQuestions;

  return (
    <div className="mt-auto ">
      <div className="relative w-full">
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
                    ? "bg-gradient-to-r border-2 border-dashed border-[#1BC08C] from-[#1BC08C]/30 from-0% via-[#1BC08C] via-50% to-[#1BC08C]/30 to-100%"
                    : "bg-gradient-to-r border-2 border-dashed border-[#C01B1B] from-[#C01B1B]/30 from-0% via-[#C01B1B] via-50% to-[#C01B1B]/30 to-100%"
                } rounded-lg p-4 pl-10 flex items-center gap-2`}
              >
                <Image
                  width={20}
                  height={20}
                  alt="check icon"
                  src={
                    isCorrect
                      ? "/handbooks/check.png"
                      : "/board-vision/cross.png"
                  }
                  className="h-5 w-5 text-green-500"
                />
                <h1 className="text-black font-medium">
                  {isCorrect ? "Correct!" : "Incorrect!"} The answer is{" "}
                  {gameQuestion?.correctAnswer}.
                </h1>

                {isCorrect ? (
                  <Image
                    width={200}
                    height={200}
                    alt="sparks"
                    src={"/handbooks/sparks.png"}
                    className="absolute top-0 right-12"
                  />
                ) : (
                  <Image
                    width={200}
                    height={200}
                    alt="sparks"
                    src={"/board-vision/wrong.png"}
                    className="absolute top-0 right-12"
                  />
                )}
              </div>

              <Button
                onClick={handleGameNextQuestion}
                className="w-full flex items-center justify-center bg-blue-base py-5 text-lg hover:bg-blue-base"
                variant="default"
              >
                {isLastQuestion ? "Finish Quiz" : "Next Question"}
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
              <button
                onClick={startGameAgain}
                className="w-full flex text-white items-center rounded-full justify-center bg-blue-base py-3 text-lg"
              >
                New Quiz
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="change-question"
              variants={feedbackVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6 border-t rounded-2xl space-y-3 bg-light-10"
            >
              {getRandomQuestion && (
                <Button
                  onClick={getRandomQuestion}
                  disabled={isChangingQuestion}
                  className="w-full flex items-center justify-center py-5 text-lg bg-white"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeedbackPanel;
