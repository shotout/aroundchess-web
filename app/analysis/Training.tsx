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
import { usePgnStore } from "../store/zustandStore";
import { useChessMoveStore } from "../store/chessMoveStore";
interface TrainingProps {
  next: () => void;
  prev: () => void;
}
const Training: React.FC<TrainingProps> = (props) => {
  const { pgn: storePgn, dataAnalysis } = usePgnStore(); // Get PGN from the Zustand store
  const { criticalMistakes, weaknessIdentification } =
    dataAnalysis?.training ?? {};
  const { chessMove, setChessMove } = useChessMoveStore();

  const [openCriticalMistakes, setOpenCriticalMistakes] =
    useState<boolean>(true);
  const [openWeakness, setopenWeakness] = useState<boolean>(true);
  const [criticalMoves, setCriticalMoves] = useState<any[]>([
    {
      number: 5,
      score: "+0.20",
      moves: "e4, c5",
      classification: "Brilliant",
      analysis:
        "Pieces before pawns.  The only Pawn moves that should be made in the opening are the pawns that help develop your pieces.  Now this weakens your light squares e8-f7-g6-h5",
    },
    {
      number: 2,
      score: "+0.20",
      moves: "f5, e5",
      classification: "Great",
      analysis:
        "Pieces before pawns.  The only Pawn moves that should be made in the opening are the pawns that help develop your pieces.  Now this weakens your light squares e8-f7-g6-h5",
    },
  ]);
   
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "Brilliant":
        return "border border-[#27C2A3] text-[#27C2A3]";
      case "Great":
        return "border border-[#749BBF] text-[#134472]";
      case "Best":
        return "border border-[#80B64D] text-[#80B64D]";
      case "Miss":
        return "border border-[#FF7769] text-[#FF7769]";
      case "Blunder":
        return "border border-[#FA402D] text-[#FA402D]";
      case "Mistake":
        return "border border-[#FFA459] text-[#FFA459]";
      default:
        return "border border-[#80B64D] text-[#80B64D]";
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
  return (
    <>
      <div className="flex flex-col justify-center gap-4 bg-white px-4 lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        {/* best moves  */}
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
          {openCriticalMistakes &&
            criticalMistakes &&
            criticalMistakes.opening.length > 0 &&
            criticalMistakes.opening.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 mt-2 border border-input rounded-md p-4"
                >
                  <div className="p-1">
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row items-center gap-2">
                        <span onClick={() => handleOnClickMovement(item)}
                          className="cursor-pointer text-[12px] sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1">
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
                          Opening
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
            })}
          {openCriticalMistakes &&
            criticalMistakes &&
            criticalMistakes.middleGame.length > 0 &&
            criticalMistakes.middleGame.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 mt-2 border border-input rounded-md p-4"
                >
                  <div className="p-1">
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row items-center gap-2">
                        <span onClick={() => handleOnClickMovement(item)}
                          className="cursor-pointer text-[12px] sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1">
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
                          MiddleGame
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
            })}
          {openCriticalMistakes &&
            criticalMistakes &&
            criticalMistakes.endGame.length > 0 &&
            criticalMistakes.endGame.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 mt-2 border border-input rounded-md p-4"
                >
                  <div className="p-1">
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row items-center gap-2">
                        <span onClick={() => handleOnClickMovement(item)}
                          className="cursor-pointer text-[12px] sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1">
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
                          EndGame
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
            })}
        </div>
        {/* critical mistakes moves  */}
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
          {openWeakness &&
            weaknessIdentification &&
            weaknessIdentification.opening.length > 0 &&
            weaknessIdentification.opening.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 mt-2 border border-input rounded-md p-4"
                >
                  <div className="p-1">
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row items-center gap-2">
                        <span onClick={() => handleOnClickMovement(item)}
                          className="cursor-pointer text-[12px] sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1">
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
                          Opening
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
                    <span className="text-sm sm:text-sm md:text-md lg:text-md  font-normal">
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
            })}
          {openWeakness &&
            weaknessIdentification &&
            weaknessIdentification.middleGame.length > 0 &&
            weaknessIdentification.middleGame.map(
              (item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-2 mt-2 border border-input rounded-md p-4"
                  >
                    <div className="p-1">
                      <div className="flex flex-row justify-between gap-2 mb-4">
                        <div className="flex flex-row items-center gap-2">
                          <span onClick={() => handleOnClickMovement(item)}
                          className="cursor-pointer text-[12px] sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1">
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
                            MiddleGame
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
                      <span className="text-sm sm:text-sm md:text-md lg:text-md  font-normal">
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
              }
            )}
          {openWeakness &&
            weaknessIdentification &&
            weaknessIdentification.endGame.length > 0 &&
            weaknessIdentification.endGame.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 mt-2 border border-input rounded-md p-4"
                >
                  <div className="p-1">
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row items-center gap-2">
                        <span onClick={() => handleOnClickMovement(item)}
                          className="cursor-pointer text-[12px] sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1">
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
                          EndGame
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
                    <span className="text-sm sm:text-sm md:text-md lg:text-md  font-normal">
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
            })}
        </div>
      </div>
     
           <div className="flex flex-row justify-between mt-2 mx-2 mb-2">
             <button
               onClick={props.prev}
               className="btn-secondary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
             >
               <div className="flex flex-row items-center text-[#000] text-xs sm:text-sm md:text-md lg:text-md ">
                 <ArrowLeft color="#000" className="mr-2 h-4 w-4 sm:h-6 w-6" />
                 Imporvement&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
