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
interface MiddleGameProps {
  next: () => void;
  prev: () => void;
}
const MiddleGame: React.FC<MiddleGameProps> = (props) => {
  const { pgn: storePgn, dataAnalysis } = usePgnStore(); // Get PGN from the Zustand store

  const { bestMoves, badMoves } = dataAnalysis?.middleGame;
  const [openBestMoves, setOpenBestMoves] = useState<boolean>(false);
  const [openBadMove, setopenBadMove] = useState<boolean>(true);
  const [bestmoves, setBestMoves] = useState<any[]>([
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
  const [badMove, setBadMove] = useState<any[]>([
    {
      number: 1,
      score: "+0.20",
      moves: "e4, c5",
      classification: "Miss",
      analysis:
        "Pieces before pawns.  The only Pawn moves that should be made in the opening are the pawns that help develop your pieces.  Now this weakens your light squares e8-f7-g6-h5",
    },
    {
      number: 7,
      score: "+0.20",
      moves: "f5, e5",
      classification: "Miss",
      analysis:
        "Pieces before pawns.  The only Pawn moves that should be made in the opening are the pawns that help develop your pieces.  Now this weakens your light squares e8-f7-g6-h5",
    },
  ]);
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "Brilliant":
        return "border border-[#27C2A3] text-[#0C7C65]";
      case "Great":
        return "border border-[#BDD0F9] text-[#134472]";
      case "Best":
        return "border border-[#80B64D] text-[#3A6211]";
      case "Miss":
        return "border border-[#FF7769] text-[#C23627]";
      case "Blunder":
        return "border border-[#FA402D] text-[#FA402D]";
      case "Mistake":
        return "border border-[#FFA459] text-[#B08503]";
      default:
        return "border border-[#80B64D] text-[#3A6211]";
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
  return (
    <>
      <div className="flex flex-col justify-center gap-4 bg-white px-4 lg:justify-start lg:max-h-[800px] lg:overflow-auto">
        {/* best moves  */}
        <div className="border border-primary border-t-4 rounded-md p-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Image
                alt=""
                src={"/icons/check.png"}
                width={1000}
                height={1000}
                className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
              />
              <span className="text-md sm:text-lg md:text-xl lg:text-xl  font-bold w-full">
                Best Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#3871EC" />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg ">
                  Type:
                </span>
                <span className="text-xs sm:text-sm md:text-md lg:text-lg font-semibold ">
                  Middlegame
                </span>
              </div>
            </div>
            <div onClick={() => setOpenBestMoves(!openBestMoves)}>
              {openBestMoves ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>
          {openBestMoves &&
            bestMoves.map((item: any, index: number) => {
              return (
                <div key={index} className="flex flex-col gap-2 mt-2">
                  <div className="border border-input rounded-md p-4">
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row gap-2">
                        <span className="text-[12px] sm:text-sm md:text-md lg:text-lg  font-normal border border-primary rounded-[4px] p-1">
                          Move {item.moveNumber}:{" "}
                          <span className="font-bold sm:text-sm md:text-md lg:text-lg ">
                            {item.moves}
                          </span>
                        </span>
                        <span
                          className={`rounded-full border border-input px-4 py-1 font-semibold text-xs sm:text-sm md:text-md lg:text-lg  text-center font-normal ${getScoreClass(
                            item.classification
                          )}`}
                        >
                          {item.evaluation}
                        </span>
                      </div>
                      <span
                        className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-xs sm:text-sm md:text-md lg:text-lg  ${getBadgeClass(
                          item.classification
                        )}`}
                      >
                        {item.classification}
                      </span>
                    </div>
                    <span className="text-sm sm:text-md md:text-md lg:text-lg  font-normal">
                      <span className="font-bold">Analysis: </span>
                      {item.analysis}
                    </span>
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
                className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
              />
              <span className="text-md sm:text-lg md:text-xl lg:text-xl  font-bold w-full">
                Bad Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#3871EC" />
                <span className="text-xs sm:text-sm md:text-md lg:text-lg ">
                  Type:
                </span>
                <span className="text-xs sm:text-sm md:text-md lg:text-lg font-semibold ">
                  Middlegame
                </span>
              </div>
            </div>
            <div onClick={() => setopenBadMove(!openBadMove)}>
              {openBadMove ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>
          {openBadMove &&
            badMoves.map((item: any, index: number) => {
              return (
                <div key={index} className="flex flex-col gap-2 mt-2">
                  <div className="border border-input rounded-md p-4">
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row gap-2">
                        <span className="text-[12px] sm:text-sm md:text-md lg:text-lg font-normal border border-primary rounded-[4px] p-1">
                          Move {item.moveNumber}:{" "}
                          <span className="font-bold">{item.moves}</span>
                        </span>
                        <span
                          className={`rounded-full border border-input px-4 py-1 font-semibold text-xs sm:text-sm md:text-md lg:text-lg text-center font-normal ${getScoreClass(
                            item.classification
                          )}`}
                        >
                          {item.evaluation}
                        </span>
                      </div>
                      <span
                        className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-xs sm:text-sm md:text-md lg:text-lg ${getBadgeClass(
                          item.classification
                        )}`}
                      >
                        {item.classification}
                      </span>
                    </div>
                    <span className="text-sm sm:text-sm md:text-md lg:text-lg font-normal">
                      <span className="font-bold">Analysis: </span>
                      {item.analysis}
                    </span>
                  </div>
                </div>
              );
            })}
          {openBadMove && (
            <div className="flex flex-row bg-gradient mt-4 rounded-md p-2 sm:p-4 md:p-6 lg:p-8">
              <Image
                alt=""
                src={"/icons/info-banner-icon.png"}
                width={1000}
                height={1000}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
              />
              <span className="text-xs sm:text-md md:text-lg lg:text-xl font-normal text-primary ml-4">
                We have added Exercises to your Training Plan to improve your
                Strategy for the analyzed weaknesses.
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4">
        <Button
          onClick={props.prev}
          size="lg"
          variant="outline"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-xs sm:text-sm md:text-md lg:text-lg text-black">
            <ArrowLeft color="#000" className="mr-2 h-6 w-6" />
            Openings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </Button>
        <div className="w-8" />
        <Button
          onClick={props.next}
          size="lg"
          variant="default"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-lg ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Endgame
            <ArrowRight color="#FFF" className="ml-2 h-6 w-6" />
          </div>
        </Button>
      </div>
    </>
  );
};

export default MiddleGame;
