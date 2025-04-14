"use client";

import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Eye, Check, ArrowRight, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useBoardVisionStore } from "./store/BoardvisionStore";
import SetupPopup from "./SetupPopup";
import Image from "next/image";

const DefaultPGN: React.FC = () => {
  const {
    currentPosition,
    gameQuestion,
    gameSelectedAnswer,
    gameShowFeedback,
    gameQuestionNumber,
    gameMaxQuestions,
    handleGameSelectAnswer,
    handleGameNextQuestion,
    loadDefaultPositions,
    highlightedSquares,
    arrows,
  } = useBoardVisionStore();

  const headerHeight = 97;
  const [showSetupPopup, setShowSetupPopup] = useState(true);

  useEffect(() => {
    loadDefaultPositions();
  }, [loadDefaultPositions]);

  if (!currentPosition || !gameQuestion) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Loading positions...</h2>
        </div>
      </div>
    );
  }

  const isCorrect = gameSelectedAnswer === gameQuestion.correctAnswer;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const leftPanelVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  const rightPanelVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  const feedbackVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

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
          <motion.div
            className="border border-gray-200 md:col-span-6 p-4 rounded-md flex items-center justify-center"
            variants={leftPanelVariants}
          >
            <div
              style={{ width: "100%", maxWidth: "750px" }}
              className="flex flex-col gap-y-4"
            >
              <Chessboard
                id="board-vision-board"
                boardWidth={700}
                position={currentPosition.fen}
                areArrowsAllowed={true}
                customSquareStyles={highlightedSquares}
                customArrows={
                  gameQuestion.text.includes("legal moves") ? [] : arrows
                }
              />

              <a
                href={currentPosition.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline text-xl text-center flex items-center justify-center"
              >
                {currentPosition.white} vs {currentPosition.black}
              </a>
            </div>
          </motion.div>

          <motion.div
            className="border border-gray-200 md:col-span-4 rounded-md"
            variants={rightPanelVariants}
          >
            <div
              className="flex flex-col h-full"
              style={{ minHeight: "600px" }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between border-b pb-4 p-6">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="font-bold text-xl">Board Vision</span>
                  </div>
                  <div className="text-indigo-600">
                    Question {gameQuestionNumber} of {gameMaxQuestions}
                  </div>
                </div>
              </div>

              <div className="flex-grow flex flex-col justify-center mb-12 p-6">
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
                  {gameQuestion.answers.map((answer, i) => (
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
              </div>

              <div className="mt-auto">
                <AnimatePresence mode="wait">
                  {gameShowFeedback ? (
                    <motion.div
                      className="space-y-4 p-6 border-t rounded-2xl"
                      key="feedback"
                      variants={feedbackVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {isCorrect ? (
                        <div className="relative bg-gradient-to-r from-[#1BC08C]/30 from-0% via-[#1BC08C] via-50% to-[#1BC08C]/30 to-100% border rounded-lg p-4 pl-10 flex items-center gap-2">
                          <Image
                            width={20}
                            height={20}
                            alt="check icon"
                            src={"/handbooks/check.png"}
                            className="h-5 w-5 text-green-500"
                          />
                          <h1 className="text-black font-medium">
                            Correct! The answer is {gameQuestion.correctAnswer}.
                          </h1>

                          <Image
                            width={200}
                            height={200}
                            alt="sparks"
                            src={"/handbooks/sparks.png"}
                            className="absolute top-0 right-12"
                          />
                        </div>
                      ) : (
                        <div className="relative bg-gradient-to-r from-[#fff]/30 from-0% via-[#C01B1B] via-50% to-[#fff]/30 to-100% border rounded-lg p-4 pl-10 flex items-center gap-2">
                          <Image
                            width={20}
                            height={20}
                            alt="x icon"
                            src={"/handbooks/check.png"}
                            className="h-5 w-5 text-red-500"
                          />
                          <h1 className="text-black font-medium">
                            Incorrect. The correct answer is{" "}
                            {gameQuestion.correctAnswer}.
                          </h1>

                          <Image
                            width={200}
                            height={200}
                            alt="sparks"
                            src={"/handbooks/sparks.png"}
                            className="absolute top-0 right-12"
                          />
                        </div>
                      )}

                      <Button
                        onClick={handleGameNextQuestion}
                        className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 py-5 text-lg"
                        variant="default"
                      >
                        Next Question
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="change-question"
                      variants={feedbackVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="p-6 border-t rounded-2xl"
                    >
                      <Button
                        onClick={() => setShowSetupPopup(true)}
                        className="w-full flex items-center justify-center py-5 text-lg"
                        variant="outline"
                      >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Enter Chess.com Username
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <SetupPopup
          isOpen={showSetupPopup}
          onClose={() => setShowSetupPopup(false)}
        />
      </main>
    </>
  );
};

export default DefaultPGN;
