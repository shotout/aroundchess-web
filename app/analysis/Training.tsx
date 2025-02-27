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
interface TrainingProps {
  next: () => void;
  prev: () => void;
}
const Training: React.FC<TrainingProps> = (props) => {
  const [openCriticalMistakes, setOpenCriticalMistakes] =
    useState<boolean>(false);
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
  const [weaknessIdentification, setweaknessIdentification] = useState<any[]>([
    {
      number: 1,
      score: "+0.20",
      moves: "e4, c5",
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
    <div className="flex flex-col justify-center gap-4 bg-white px-4">
      {/* best moves  */}
      <div className="border border-primary border-t-4 rounded-md p-3">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-3">
            <Image
              alt=""
              src={"/icons/alert-triangle.png"}
              width={1000}
              height={1000}
              className="w-5 h-5"
            />
            <span className="text-md font-bold w-full">Critical Mistakes</span>
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
          criticalMoves.map((item: any, index: number) => {
            return (
              <div key={index} className="flex flex-col gap-2 mt-2">
                <div className="border border-input rounded-md p-4">
                  <div className="flex flex-row justify-between gap-2 mb-4">
                    <div className="flex flex-row gap-2">
                      <span className="text-[12px] font-normal border border-primary rounded-[4px] p-1">
                        Move {item.number}:{" "}
                        <span className="font-bold">{item.moves}</span>
                      </span>
                      <span
                        className={`rounded-full border border-input px-4 py-1 font-semibold text-xs text-center font-normal ${getScoreClass(
                          item.classification
                        )}`}
                      >
                        {item.score}
                      </span>
                    </div>
                    <span
                      className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-xs ${getBadgeClass(
                        item.classification
                      )}`}
                    >
                      {item.classification}
                    </span>
                  </div>
                  <span className="text-sm font-normal">
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
              className="w-5 h-5"
            />
            <span className="text-md font-bold w-full">
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
          weaknessIdentification.map((item: any, index: number) => {
            return (
              <div key={index} className="flex flex-col gap-2 mt-2">
                <div className="border border-input rounded-md p-4">
                  <div className="flex flex-row justify-between gap-2 mb-4">
                    <div className="flex flex-row gap-2">
                      <span className="text-[12px] font-normal border border-primary rounded-[4px] p-1">
                        Move {item.number}:{" "}
                        <span className="font-bold">{item.moves}</span>
                      </span>
                      <span
                        className={`rounded-full border border-input px-4 py-1 font-semibold text-xs text-center font-normal ${getScoreClass(
                          item.classification
                        )}`}
                      >
                        {item.score}
                      </span>
                    </div>
                    <span
                      className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-xs ${getBadgeClass(
                        item.classification
                      )}`}
                    >
                      {item.classification}
                    </span>
                  </div>
                  <span className="text-sm font-normal">
                    <span className="font-bold">Analysis: </span>
                    {item.analysis}
                  </span>
                  <div className="border-l-4 border-l-primary bg-[#F6F9FF] flex flex-col gap-3 items-center border-primary rounded-md p-2 py-4 mt-2">
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        alt=""
                        src={"/icons/recommended-training-icon.png"}
                        width={1000}
                        height={1000}
                        className="w-8 h-8"
                      />
                      <span className="text-xs font-normal text-[#254B9D]">
                        Recommended Training Exercise:{" "}
                        <span className="font-semibold">
                          Endgame Technique and Win the Game
                        </span>
                      </span>
                    </div>
                    <Button
                      onClick={props.next}
                      size="lg"
                      variant="default"
                      className="flex w-full h-[48px] whitespace-nowrap rounded-sm"
                    >
                      <div className="flex flex-row items-center text-[#fff] text-xs">
                        Go To Exercise
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex flex-row justify-between mt-4">
        <Button
          onClick={props.prev}
          size="lg"
          variant="outline"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm"
        >
          <div className="flex flex-row items-center text-xs text-black">
            <ArrowLeft color="#000" className="mr-2 h-6 w-6" />
            Improvement&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </Button>
        <div className="w-8" />
        <Button
          onClick={props.next}
          size="lg"
          variant="default"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs">
            Start your Training
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Training;
