"use client";

import React, { useEffect } from "react";
import { Chessboard } from "react-chessboard";
import {
  Eye,
  Check,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Trophy,
  Medal,
  Frown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useBoardVisionStore } from "./store/BoardvisionStore";
import Image from "next/image";
import SetupPopup from "./SetupPopup";
import { toast } from "sonner";
import ReactCountryFlag from "react-country-flag";

const UserPGN: React.FC = () => {
  const {
    username,
    setAppState,
    currentPosition,
    gameQuestion,
    gameSelectedAnswer,
    gameShowFeedback,
    gameQuestionNumber,
    gameMaxQuestions,
    gameCorrects,
    handleGameSelectAnswer,
    handleGameNextQuestion,
    startGameAgain,
    highlightedSquares,
    arrows,
    loadingError,
  } = useBoardVisionStore();

  const [showSetupPopup, setShowSetupPopup] = React.useState(false);
  const headerHeight = 97;

  // Show toast when loading error occurs
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

  // Determine performance valuation
  const getPerformanceValuation = () => {
    if (gameCorrects >= 7) {
      return {
        label: "Amazing",
        description: "Your board vision skills are exceptional!",
        icon: <Trophy className="h-10 w-10 text-yellow-500" />,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
      };
    } else if (gameCorrects >= 4) {
      return {
        label: "Good",
        description: "You have solid board vision skills. Keep practicing!",
        icon: <Medal className="h-10 w-10 text-blue-500" />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      };
    } else {
      return {
        label: "Needs Improvement",
        description: "Keep practicing to enhance your board vision skills.",
        icon: <Frown className="h-10 w-10 text-gray-500" />,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
      };
    }
  };

  if (!currentPosition || !gameQuestion) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-4">No games loaded</h2>
          <p className="text-gray-600 mb-6">
            Please enter your Chess.com username to load your games.
          </p>
          <Button onClick={() => setShowSetupPopup(true)}>
            Load Chess.com Games
          </Button>
        </div>

        <SetupPopup
          isOpen={showSetupPopup}
          onClose={() => setShowSetupPopup(false)}
        />
      </div>
    );
  }

  const isGameEnd = gameQuestionNumber > gameMaxQuestions;
  const valuation = getPerformanceValuation();

  // Determine which player is current user
  const isWhiteUser = currentPosition.white === username;
  const userProfilePic = isWhiteUser
    ? currentPosition.whiteProfilePic
    : currentPosition.blackProfilePic;
  const opponentProfilePic = isWhiteUser
    ? currentPosition.blackProfilePic
    : currentPosition.whiteProfilePic;
  const opponentName = isWhiteUser
    ? currentPosition.black
    : currentPosition.white;

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
              {/* Player name on top */}

              <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-indigo-500">
                  <Image
                    src={userProfilePic || `/api/placeholder/48/48`}
                    alt={`${username}'s photo`}
                    width={48}
                    height={48}
                  />
                </div>
                <span className="text-gray-700 font-semibold">{username}</span>
                <ReactCountryFlag countryCode="US" className="ml-2" />
              </div>

              <Chessboard
                id="board-vision-board"
                boardWidth={600}
                position={currentPosition.fen}
                areArrowsAllowed={true}
                customSquareStyles={highlightedSquares}
                customArrows={
                  gameQuestion.text.includes("legal moves") ? [] : arrows
                }
              />

              <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-indigo-500">
                  <Image
                    src={opponentProfilePic || `/api/placeholder/48/48`}
                    alt={`${opponentName}'s photo`}
                    width={48}
                    height={48}
                  />
                </div>
                <span className="text-gray-700 font-semibold">
                  {opponentName}
                </span>
                <ReactCountryFlag countryCode="US" className="ml-2" />
              </div>
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
                    {isGameEnd
                      ? "The End"
                      : `Question ${gameQuestionNumber} of ${gameMaxQuestions}`}
                  </div>
                </div>
              </div>

              {!isGameEnd ? (
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
              ) : (
                <div className="flex-grow flex flex-col justify-center items-center p-6">
                  <div
                    className={`${valuation.bgColor} p-6 rounded-lg mb-6 w-full text-center`}
                  >
                    <div className="flex justify-center mb-2">
                      {valuation.icon}
                    </div>
                    <h2
                      className={`text-2xl font-bold mb-1 ${valuation.textColor}`}
                    >
                      {valuation.label}
                    </h2>
                    <p className={`mb-2 ${valuation.textColor}`}>
                      {valuation.description}
                    </p>
                  </div>

                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
                    <p className="text-lg">
                      You got{" "}
                      <span className="font-bold text-teal-600">
                        {gameCorrects}
                      </span>{" "}
                      out of{" "}
                      <span className="font-bold">{gameMaxQuestions}</span>{" "}
                      questions correct.
                    </p>
                  </div>
                </div>
              )}

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
                          gameSelectedAnswer === gameQuestion.correctAnswer
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
                          {gameSelectedAnswer === gameQuestion.correctAnswer
                            ? "Correct!"
                            : "Incorrect!"}{" "}
                          The answer is {gameQuestion.correctAnswer}.
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
                        Change Username
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
                        onClick={() => setAppState("default")}
                        className="w-full flex items-center justify-center py-5 text-lg"
                        variant="outline"
                      >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Try Default Questions
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <SetupPopup
        isOpen={showSetupPopup}
        onClose={() => setShowSetupPopup(false)}
      />
    </>
  );
};

export default UserPGN;
