import React from "react";
import { Eye, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { QuestionPanelProps } from "../types/default-pgn";

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
      <div className="flex-grow flex flex-col justify-center mb-12 p-6">
        <p>No question available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between border-b pb-4 p-6">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="font-bold text-xl">Board Vision</span>
          </div>
          <div className="text-indigo-600">
            {isGameEnd
              ? "The End"
              : `Question ${gameQuestionNumber} of ${gameMaxQuestions}`}
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center mb-12 p-6">
        {!isGameEnd ? (
          <>
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-0">
                <div className="rounded-md overflow-hidden">
                  <div className="p-5 bg-gradient-to-r from-teal-400 to-teal-500">
                    <p className="text-white text-center font-medium text-lg">
                      {gameQuestion.text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {gameQuestion.answers &&
                gameQuestion.answers.map((answer, i) => (
                  <motion.div
                    key={i}
                    className={`border rounded-md p-3 flex items-center justify-between cursor-pointer shadow-sm ${
                      gameSelectedAnswer === answer
                        ? "bg-teal-400 text-white"
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
                    <span className="text-lg">{answer}</span>
                    <div
                      className={`h-5 w-5 rounded-full ${
                        gameSelectedAnswer === answer
                          ? "bg-white text-teal-400"
                          : "border border-gray-300 bg-white"
                      } flex items-center justify-center`}
                    >
                      {gameSelectedAnswer === answer && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default QuestionPanel;
