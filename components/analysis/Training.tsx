"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  InfoIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import NoData from "@/components/NoData/NoData";

interface TrainingProps {
  next: () => void;
  prev: () => void;
}

const Training: React.FC<TrainingProps> = (props) => {
  const { pgn: storePgn, dataAnalysis } = usePgnStore();
  const { chessMove, setChessMove } = useChessMoveStore();

  // Safe destructuring with defaults
  const trainingData = dataAnalysis?.training || {};
  const {
    criticalMistakes = { opening: [], middleGame: [], endGame: [] },
    weaknessIdentification = { opening: [], middleGame: [], endGame: [] },
  } = trainingData;

  const [openCriticalMistakes, setOpenCriticalMistakes] =
    useState<boolean>(true);
  const [openWeakness, setopenWeakness] = useState<boolean>(true);

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "Brilliant":
        return "border border-[#27C2A3] text-[#27C2A3] bg-white";
      case "Excellent":
        return "border border-[#27C2A3] text-[#27C2A3] bg-white";
      case "Great":
        return "border border-[#749BBF] text-[#134472] bg-white";
      case "Good":
        return "border border-[#749BBF] text-[#134472] bg-white";
      case "Best":
        return "border border-[#80B64D] text-[#80B64D] bg-white";
      case "Miss":
        return "border border-[#FF7769] text-[#FF7769] bg-white";
      case "Blunder":
        return "border border-[#FA402D] text-[#FA402D] bg-white ";
      case "Mistake":
        return "border border-[#FFA459] text-[#FFA459] bg-white";
      case "Inaccuracy":
        return "border border-[#FFA459] text-[#FFA459] bg-white";
      default:
        return "";
    }
  };

  const getScoreClass = (type: string) => {
    switch (type) {
      case "Brilliant":
        return "text-[#01A12E]";
      case "Great":
        return "text-[#364152]";
      case "Best":
        return "text-[#364152]";
      case "Miss":
        return "text-[#FD0000]";
      case "Blunder":
        return "text-[#FD0000]";
      case "Mistake":
        return "text-[#FD0000]";
      default:
        return "text-[#364152]";
    }
  };

  const handleOnClickMovement = (move: any) => {
    setChessMove(move);
  };

  const renderTrainingItem = (item: any, index: number, phase: string) => (
    <div
      key={index}
      className={`flex flex-col gap-2 mt-2 border ${
        chessMove.move == item.move ? `border-[#221AE9]` : `border-input`
      } rounded-md p-4`}
    >
      <div className="p-1">
        <div className="flex flex-row justify-between gap-2 mb-4">
          <div className="flex flex-row items-center gap-2">
            <span
              onClick={() => handleOnClickMovement(item)}
              className="cursor-pointer text-[14px] -- sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1"
            >
              Move {item.moveNumber}:{" "}
              <span className="font-bold">{item.move}</span>
            </span>

            <span
              className={`rounded-full border border-input px-4 py-1 font-semibold text-xs sm:text-sm md:text-md lg:text-md text-center font-normal ${getScoreClass(
                item.classification
              )}`}
            >
              {item.evaluation}
            </span>
            <span className="text-xs sm:text-sm md:text-md lg:text-md font-semibold ">
              {phase}
            </span>
          </div>
          <span
            className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-xs sm:text-sm md:text-md lg:text-md ${getBadgeClass(
              item.classification
            )}`}
          >
            {item.classification}
          </span>
        </div>
        <span className="text-sm sm:text-sm md:text-md lg:text-md font-normal">
          <span className="font-bold">Analysis: </span>
          {item.analysis}
        </span>
      </div>
      <div className="border-l-4 border-l-primary bg-[#F6F9FF] flex flex-col gap-3 justify-center border-primary rounded-md p-2 py-4 mt-2">
        <div className="flex flex-row items-center justify-start gap-2">
          <Image
            alt=""
            src={"/icons/recommended-training-icon.png"}
            width={1000}
            height={1000}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          />
          <span className="font-semibold text-xs sm:text-sm md:text-md lg:text-md xl:text-md font-normal text-[#254B9D]">
            {item.recommendedTrainingExercise}
          </span>
        </div>
        <Button
          onClick={props.next}
          size="lg"
          variant="default"
          className="btn-primary flex w-full h-[48px] whitespace-nowrap rounded-sm"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-md ">
            Go To Exercise
          </div>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col justify-center gap-4 bg-white px-4 lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        {/* Critical Mistakes  */}
        <div className="border border-primary border-t-4 rounded-md p-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-3">
              <Image
                alt=""
                src={"/icons/alert-triangle.png"}
                width={1000}
                height={1000}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
              />
              <span className="text-md sm:text-md md:text-lg lg:text-md  font-bold w-full">
                Critical Mistakes
              </span>
            </div>
            <div onClick={() => setOpenCriticalMistakes(!openCriticalMistakes)}>
              {openCriticalMistakes ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>

          {criticalMistakes.opening.length === 0 &&
            criticalMistakes.middleGame.length === 0 &&
            criticalMistakes.endGame.length === 0 && (
              <NoData>Critical Mistakes Empty</NoData>
            )}

          {openCriticalMistakes && (
            <>
              {criticalMistakes.opening.map((item: any, index: number) =>
                renderTrainingItem(item, index, "Opening")
              )}

              {criticalMistakes.middleGame.map((item: any, index: number) =>
                renderTrainingItem(item, index, "MiddleGame")
              )}

              {criticalMistakes.endGame.map((item: any, index: number) =>
                renderTrainingItem(item, index, "EndGame")
              )}
            </>
          )}
        </div>

        {/* Weakness Identification */}
        <div className="border border-primary border-t-4 rounded-md p-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Image
                alt=""
                src={"/icons/alert-triangle.png"}
                width={1000}
                height={1000}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
              />
              <span className="text-md sm:text-md md:text-lg lg:text-md font-bold w-full">
                Weakness Identification
              </span>
            </div>
            <div onClick={() => setopenWeakness(!openWeakness)}>
              {openWeakness ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>

          {weaknessIdentification.opening.length === 0 &&
            weaknessIdentification.middleGame.length === 0 &&
            weaknessIdentification.endGame.length === 0 && (
              <NoData>Weakness Identification Empty</NoData>
            )}

          {openWeakness && (
            <>
              {weaknessIdentification.opening.map((item: any, index: number) =>
                renderTrainingItem(item, index, "Opening")
              )}

              {weaknessIdentification.middleGame.map(
                (item: any, index: number) =>
                  renderTrainingItem(item, index, "MiddleGame")
              )}

              {weaknessIdentification.endGame.map((item: any, index: number) =>
                renderTrainingItem(item, index, "EndGame")
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-row justify-between mt-2 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#000] text-xs sm:text-sm md:text-md lg:text-md ">
            <ArrowLeft color="#000" className="mr-2 h-4 w-4 sm:h-6 w-6" />
            Improvement&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-md ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Start your Training
            <ArrowRight color="#FFF" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </>
  );
};

export default Training;
