"use client";

import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import {
  Eye,
  Check,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useBoardVisionStore } from "./store/BoardvisionStore";
import { dummyGameData } from "./util/BoardVisionData";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";

const UserPGN: React.FC = () => {
  const { username, setAppState } = useBoardVisionStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Use username or default to "Player"
  const playerName = username || "Player";

  const headerHeight = 97;

  // Handle answer selection
  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  // Animation variants
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
          {/* Left Panel - Chessboard */}
          <motion.div
            className="border border-gray-200 md:col-span-6 p-4 rounded-md flex items-center justify-center "
            variants={leftPanelVariants}
          >
            <div
              style={{ width: "100%", maxWidth: "750px" }}
              className="flex flex-col gap-y-4"
            >
              <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-indigo-500">
                  <Image
                    src={`/api/placeholder/48/48`}
                    alt={`${playerName}'s photo`}
                    width={48}
                    height={48}
                  />
                </div>
                <span className="text-gray-700 font-semibold">
                  {playerName}
                </span>
                <ReactCountryFlag countryCode="US" className="ml-2" />
              </div>

              <Chessboard
                id="board-vision-board"
                boardWidth={600}
                position={dummyGameData.position}
                areArrowsAllowed={true}
                customSquareStyles={{}}
              />
              <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg mb-4">
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-indigo-500">
                  <Image
                    src={`/api/placeholder/48/48`}
                    alt={`${dummyGameData.opponentName}'s photo`}
                    width={48}
                    height={48}
                  />
                </div>
                <span className="text-gray-700 font-semibold">
                  {dummyGameData.opponentName}
                </span>
                <ReactCountryFlag countryCode="US" className="ml-2" />
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Question, Answers, and Buttons */}
          <motion.div
            className="border border-gray-200 md:col-span-4 rounded-md"
            variants={rightPanelVariants}
          >
            <div
              className="flex flex-col h-full"
              style={{ minHeight: "600px" }}
            >
              {/* Top Section - Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between border-b pb-4 p-6">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="font-bold text-xl">
                      Your Game Analysis
                    </span>
                  </div>
                  <div className="text-indigo-600">{dummyGameData.opening}</div>
                </div>
              </div>

              {/* Middle Section - Question and Answers */}
              <div className="flex-grow flex flex-col justify-center mb-12 p-6">
                {/* Question Card */}
                <Card className="mb-6 shadow-sm">
                  <CardContent className="p-0">
                    <div className="rounded-md overflow-hidden">
                      <div className="p-5 bg-gradient-to-r from-teal-400 to-teal-500">
                        <p className="text-white text-center font-medium text-lg">
                          {dummyGameData.question.text.replace(
                            "GrandMaster2000",
                            dummyGameData.opponentName
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Multiple Choice Answers */}
                <div className="grid grid-cols-2 gap-3">
                  {dummyGameData.question.answers.map((answer, i) => (
                    <motion.div
                      key={i}
                      className={`border rounded-md p-3 flex items-center justify-between cursor-pointer shadow-sm ${
                        selectedAnswer === answer
                          ? "bg-teal-400 text-white"
                          : "bg-white hover:bg-teal-50"
                      }`}
                      onClick={() =>
                        !showFeedback && handleSelectAnswer(answer)
                      }
                      whileHover={{ scale: !showFeedback ? 1.02 : 1 }}
                      whileTap={{ scale: !showFeedback ? 0.98 : 1 }}
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
                          selectedAnswer === answer
                            ? "bg-white text-teal-400"
                            : "border border-gray-300 bg-white"
                        } flex items-center justify-center`}
                      >
                        {selectedAnswer === answer && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom Section - Feedback and Buttons */}
              <div className="mt-auto">
                <AnimatePresence mode="wait">
                  {showFeedback ? (
                    <motion.div
                      className="space-y-4 p-6 border-t rounded-2xl"
                      key="feedback"
                      variants={feedbackVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="relative bg-gradient-to-r from-[#1BC08C]/30 from-0% via-[#1BC08C] via-50% to-[#1BC08C]/30 to-100% border rounded-lg p-4 pl-10 flex items-center gap-2">
                        <Image
                          width={20}
                          height={20}
                          alt="check icon"
                          src={"/handbooks/check.png"}
                          className="h-5 w-5 text-green-500"
                        />
                        <h1 className="text-black font-medium">
                          Correct! The answer is{" "}
                          {dummyGameData.question.correctAnswer}.
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
                        onClick={() => setAppState("default")}
                        className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 py-5 text-lg"
                        variant="default"
                      >
                        Try Default Questions
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
    </>
  );
};

export default UserPGN;
