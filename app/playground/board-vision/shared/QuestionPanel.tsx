import React from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { QuestionPanelProps } from "../types/default-pgn";
import Image from "next/image";

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  gameQuestion,
  gameSelectedAnswer,
  gameShowFeedback,
  gameQuestionNumber,
  gameMaxQuestions,
  handleGameSelectAnswer,
  isGameEnd,
}) => {
  if (!gameQuestion) {
    return (
      <div className="p-6">
        <p>No question available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between border-b pb-4 p-6">
          <div className="flex items-center">
            {" "}
            <Image
              src={"/board-vision/board-vision.png"}
              alt="board vision"
              width={40}
              height={40}
              className="w-7 h-7 xl:w-10 xl:h-10 mr-2"
            />
            <span className="font-bold text-base xl:text-xl">Board Vision</span>
          </div>
          <div className="text-blue-base text-sm xl:text-base">
            {`Question ${gameQuestionNumber} of ${gameMaxQuestions}`}
          </div>
        </div>
      </div>

      <div className="flex-grow flex justify-center items-center w-full xl:p-4 2xl:px-6">
        {!isGameEnd ? (
          <>
            <div className="xl:border p-4 xl:border-primary-gray rounded-md w-full">
              <Card className="mb-6 shadow-sm">
                <CardContent className="p-0">
                  <div className="rounded-md overflow-hidden">
                    {" "}
                    <div className="p-3 xl:p-5 bg-gradient-to-b from-[#25CEDA] to-[#146E74]">
                      <p className="text-white text-center font-medium text-base xl:text-lg">
                        {gameQuestion.text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-2 xl:gap-3">
                {gameQuestion.answers &&
                  gameQuestion.answers.map((answer, i) => {
                    const isSelected = gameSelectedAnswer === answer;
                    const isCorrectAnswer =
                      answer === gameQuestion.correctAnswer;
                    const isIncorrect =
                      gameShowFeedback && isSelected && !isCorrectAnswer;
                    const shouldHighlightCorrect =
                      gameShowFeedback &&
                      isCorrectAnswer &&
                      gameSelectedAnswer !== gameQuestion.correctAnswer;

                    return (
                      <motion.div
                        key={i}
                        className={`border rounded-md p-2 xl:p-3 flex items-center justify-between cursor-pointer shadow-sm ${
                          isSelected
                            ? isIncorrect
                              ? "bg-[#FD0000] text-primary-white" // Wrong answer styling
                              : "bg-turqouise-base text-white" // Correct or not yet evaluated
                            : shouldHighlightCorrect
                            ? "bg-turqouise-base text-white" // Highlight correct answer when user chose wrong
                            : "bg-white hover:bg-teal-50"
                        }`}
                        onClick={() =>
                          !gameShowFeedback && handleGameSelectAnswer(answer)
                        }
                        whileHover={{ scale: !gameShowFeedback ? 1.02 : 1 }}
                        whileTap={{ scale: !gameShowFeedback ? 0.98 : 1 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.1 * i, duration: 0.3 },
                        }}
                      >
                        <span className="text-base xl:text-lg">{answer}</span>
                        <div
                          className={`h-5 w-5 rounded-full bg-white flex items-center justify-center ${
                            !isSelected && !shouldHighlightCorrect
                              ? "border border-gray-300"
                              : ""
                          }`}
                        >
                          {(isSelected || shouldHighlightCorrect) &&
                            (isIncorrect ? (
                              <X className="h-4 w-4 text-[#FD0000]" />
                            ) : (
                              <Check className="h-4 w-4 text-turqouise-base" />
                            ))}
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default QuestionPanel;
