"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronDown,
  ChevronUp,
  InfoIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
import Link from "next/link";
const PreviousAnalysis: React.FC = () => {
  const [selectedMistakes, setSelectedMistakes] = useState<any>({});
  const [PreviousAnalysis, setPreviousAnalysis] = useState<any[]>([
    {
      id: 0,
      type: "Critical Mistakes",
      mistakes: [
        {
          id: 0,
          game_result: {
            opponent: "Hikaru",
            date: "03/03/25",
            status: "Won",
          },
          mistake: {
            type: "Critical Mistake",
            game_phase: "Middlegame",
            move: "5. e5",
            evaluation: "-1.50",
            classification: "Blunder",
          },
          analysis:
            "[EXPLAIN HOW IS IT CRITICAL MISTAKE MOVE AND WHAT THE IMPACT TO THE GAME]",
          recommended_training: {
            title: "Endgame Technique and Win the Game",
            link: "[Insert Training Link Here]",
          },
          resources: [
            {
              title: "Chess Principles - Chess.com",
              description: "Essential chess principles for beginners",
              link: "https://www.chess.com",
            },
            {
              title: "Middlegame Basics - Lichess",
              description: "Interactive lessons on middlegame fundamentals",
              link: "https://www.lichess.org",
            },
            {
              title: "Common Middlegame Mistakes",
              description: "Interactive lessons on middlegame fundamentals",
              link: "https://www.lichess.org",
            },
          ],
        },
        {
          id: 1,
          game_result: {
            opponent: "Hikaru",
            date: "03/03/25",
            status: "Won",
          },
          mistake: {
            type: "Critical Mistake",
            game_phase: "Middlegame",
            move: "5. e5",
            evaluation: "-1.50",
            classification: "Blunder",
          },
          analysis:
            "[EXPLAIN HOW IS IT CRITICAL MISTAKE MOVE AND WHAT THE IMPACT TO THE GAME]",
          recommended_training: {
            title: "Endgame Technique and Win the Game",
            link: "[Insert Training Link Here]",
          },
          resources: [],
        },
      ],
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
    <div className="flex flex-col w-full justify-center gap-4 bg-white lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
      {PreviousAnalysis.map((i: any, index: number) => {
        return (
          <div
            key={index}
            className="border border-t-4 border-[#221AE9] rounded-lg p-2 lg:p-4"
          >
            <div className="flex flex-row items-center gap-2 mb-4">
              <Image
                alt=""
                src={"/icons/alert-triangle.png"}
                width={1000}
                height={1000}
                className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
              />
              <span className="text-xs sm:text-lg">
                Mistake Type:
              </span>
              <span className="text-xs sm:text-lg font-bold">
                {i?.type}
              </span>
            </div>
            {i.mistakes.map((item: any, key: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 mt-4 cursor-pointer"
                  onClick={() => setSelectedMistakes(item)}
                >
                  <div className="flex flex-row gap-2 items-center">
                    <InfoIcon
                      className="w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                      color="#221AE9"
                    />
                    <span className="text-xs">Game Phase:</span>
                    <span className="text-sm font-bold">
                      {item?.mistake.game_phase}
                    </span>
                  </div>
                  <div
                    className={`border ${
                      selectedMistakes.id == item?.id
                        ? `border-[#221AE9] border-2`
                        : `border-input`
                    } rounded-md p-2 lg:p-4`}
                  >
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row items-center justify-between lg:justify-start gap-3">
                        <span className="flex items-center text-[12px] sm:text-sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1">
                          Move {item?.mistake.move}:{" "}
                          <span className="font-bold sm:text-sm md:text-md lg:text-md ">
                            {item?.mistake.move}
                          </span>
                        </span>
                        <span
                          className={`flex items-center rounded-full border border-input px-4 py-1 font-semibold text-xs sm:text-sm md:text-md lg:text-md  text-center font-normal ${getScoreClass(
                            item?.mistake.classification
                          )}`}
                        >
                          {item?.mistake.evaluation}
                        </span>
                        <span
                          className={`flex items-center min-w-[72px] text-center px-2 py-1 rounded-[4px] text-sm sm:text-sm md:text-md lg:text-md  ${getBadgeClass(
                            item?.mistake.classification
                          )}`}
                        >
                          {item?.mistake.classification}
                        </span>
                      </div>
                      <div className="rounded-lg bg-[#E6F7FE] border border-[#C6EEFE] py-2 px-3 items-center font-semibold">
                        <Bookmark className="w-6 h-6" color="#221AE9" />
                      </div>
                    </div>
                    <span className="text-xs sm:text-md md:text-md lg:text-lg font-normal">
                      <span className="font-bold">Analysis: </span>
                      {item?.analysis}
                    </span>
                    <div className="p-3 mt-2 rounded-lg border border-blue-300 bg-gradient-to-r from-blue-50 to-white flex items-center space-x-2">
                      <div className="flex flex-row items-center justify-start gap-2">
                        <Image
                          alt=""
                          src={"/icons/recommended-training-icon.png"}
                          width={1000}
                          height={1000}
                          className="w-6 h-6 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8"
                        />
                        <span className="font-normal text-xs sm:text-sm md:text-md lg:text-md xl:text-md font-normal text-primary">
                          Recommended Training Exercise:{" "}
                          <span className="font-bold">
                            {" " + item?.recommended_training.title}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                      {item?.resources.map((resource: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-col justify-between rounded-xs border border-input gap-2 p-2"
                          >
                            <span className="block my-1 font-bold text-xs sm:text-sm">
                              {resource.title}
                            </span>
                            <span className="block my-1 font-light text-xs sm:text-sm">
                              {resource.description}
                            </span>
                            <Link href={resource.link}>
                              <div
                                className="flex flex-row w-full justify-center my-2 sm:my-1 items-center px-4 py-2 rounded-full border border-[#C6EEFE] bg-[#E6F7FE]"
                                style={{
                                  boxShadow: `inset 0px -2px 2px #C6EEFE,
                                                       inset 0px 2px 0px #FFFFFF`, // Custom inner shadow
                                }}
                              >
                                <span className="text-center text-xs sm:text-sm text-primary font-medium">
                                  Visit{" "}
                                  {resource.link.replace("https://www.", "")}
                                </span>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PreviousAnalysis;
