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
import { usePgnStore } from "../../app/store/zustandStore";
import Link from "next/link";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
const PreviousAnalysis: React.FC = () => {
  const [indexOpen, setIndexOpen] = useState<number | undefined>(0);
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
  return (
    <div className="flex flex-col w-full justify-center gap-4 bg-white lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
      {PreviousAnalysis.map((i: any, index: number) => {
        return (
          <div
            key={index}
            className="border border-t-[4px] border-[#221AE9] rounded-[16px] p-[12px] lg:p-[16px]"
          >
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <Image
                  alt=""
                  src={"/icons/alert-triangle.png"}
                  width={1000}
                  height={1000}
                  className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] lg:w-[24px] lg:h-[24px]"
                />
                <span className="text-[20px]">Mistake Type:</span>
                <span className="text-[20px] font-semibold">{i?.type}</span>
              </div>
              <div
                onClick={
                  index == indexOpen
                    ? () => setIndexOpen(undefined)
                    : () => setIndexOpen(index)
                }
              >
                {index == indexOpen ? (
                  <ChevronUp size={24} color="black" />
                ) : (
                  <ChevronDown size={24} color="black" />
                )}
              </div>
            </div>
            {indexOpen == index &&
              i.mistakes.map((item: any, key: number) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-2 mt-4 cursor-pointer"
                    onClick={() => setSelectedMistakes(item)}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <InfoIcon
                        className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px]"
                        color="#221AE9"
                      />
                      <span className="text-[14px]">Game Phase:</span>
                      <span className="text-[14px] font-semibold">
                        {item?.mistake.game_phase}
                      </span>
                    </div>
                    <div
                      className={`border ${
                        selectedMistakes.id == item?.id
                          ? `border-[#221AE9] border-1`
                          : `border-[#DEDEDE]`
                      } rounded-[8px] p-[8px] lg:p-[12px]`}
                    >
                      <div className="flex flex-row justify-between gap-2 mb-4">
                        <div className="flex flex-row items-center justify-between lg:justify-start gap-3">
                          <span className="flex items-center text-[12px] font-normal max-h-[25px] sm:text-sm md:text-md lg:text-md font-normal border border-[#221AE9] rounded-[4px] py-[4px] px-[8px]">
                            Move {item?.mistake.move}:{" "}
                            <span className="font-normal sm:text-sm md:text-md lg:text-md ">
                              {item?.mistake.move}
                            </span>
                          </span>
                          <span
                            className={`flex items-center rounded-full border border-[#DEDEDE] px-[8px] py-[4px] font-semibold text-xs sm:text-sm md:text-md lg:text-md text-center font-normal ${getScoreClass(
                              item?.mistake.classification
                            )}`}
                          >
                            {item?.mistake.evaluation}
                          </span>
                          <span
                            className={`flex items-center justify-center min-w-[72px] text-center px-[8px] py-[4px] rounded-[4px] text-sm sm:text-sm md:text-md lg:text-md  ${getBadgeClass(
                              item?.mistake.classification
                            )}`}
                          >
                            {item?.mistake.classification}
                          </span>
                        </div>
                        <div className="rounded-lg bg-[#E6F7FE] border border-[#C6EEFE] p-[10px] items-center font-semibold">
                          <BookmarkFilledIcon
                            className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                            color="#221AE9"
                          />
                        </div>
                        {/* <div className="rounded-lg bg-[#E6F7FE] border border-[#C6EEFE] p-[10px] items-center font-semibold">
                          <Bookmark
                            className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                            color="#221AE9"
                          />
                        </div> */}
                      </div>
                      <span className="text-xs sm:text-md md:text-md lg:text-[14px] font-normal">
                        <span className="font-semibold">Analysis: </span>
                        {item?.analysis}
                      </span>
                      <div className="p-3 rounded-lg border border-blue-300 bg-gradient-to-r from-blue-50 to-white flex items-center space-x-2">
                        <div className="flex flex-row items-center justify-start gap-2">
                          <Image
                            alt=""
                            src={"/icons/recommended-training-icon.png"}
                            width={1000}
                            height={1000}
                            className="w-6 h-6 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8"
                          />
                          <span className="font-normal text-xs sm:text-sm md:text-md lg:text-md xl:text-md font-normal text-[#221AE9]">
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
                              className="rounded-[4px] flex flex-col justify-between border border-input p-[12px]"
                            >
                              <span className="block my-1 font-semibold text-xs sm:text-[12px] text-black">
                                {resource.title}
                              </span>
                              <span className="block my-1 text-[#364152] font-light text-xs sm:text-[11px]">
                                {resource.description}
                              </span>
                              <Link href={resource.link}>
                                <div
                                  className="btn-tertiary rounded-full flex items-center justify-center"
                                  style={{
                                    boxShadow: `inset 0px -2px 2px #C6EEFE,
                                         inset 0px 2px 0px #FFFFFF`, // Custom inner shadow
                                  }}
                                >
                                  <span className="text-center text-xs sm:text-[14px] text-[#221AE9] font-medium">
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
