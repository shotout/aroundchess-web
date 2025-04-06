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
import NoData from "@/components/NoData/NoData";
import { useChessBoardThemeStore } from "../store/chessBoardTheme";
interface MiddleGameProps {
  next: () => void;
  prev: () => void;
}
const MiddleGame: React.FC<MiddleGameProps> = (props) => {
  const { pgn: storePgn, dataAnalysis, capturedWhite } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const { PieceChoosed } = useChessBoardThemeStore();

  const { bestMoves, badMoves } = dataAnalysis?.middleGame;
  const [openBestMoves, setOpenBestMoves] = useState<boolean>(true);
  const [openBadMove, setopenBadMove] = useState<boolean>(true);
  useEffect(() => {
    console.log("dataAnalysis?.middleGame", dataAnalysis?.middleGame);
  }, []);
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
        return "border border-[#80B64D] text-[#FFA459]";
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
            <div className="flex flex-row items-center gap-2">
              <Image
                alt=""
                src={"/icons/check.png"}
                width={1000}
                height={1000}
                className="w-[18px] h-[18px] sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px]"
              />
              <span className="text-md sm:text-lg md:text-xl lg:text-xl  font-bold w-full">
                Best Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#221AE9" />
                <span className="text-xs sm:text-sm md:text-md lg:text-xs ">
                  Type:
                </span>
                <span className="text-xs sm:text-sm md:text-md lg:text-xs font-semibold ">
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
          {bestMoves && bestMoves.length == 0 && <NoData />}
          {openBestMoves &&
            bestMoves.map((item: any, index: number) => {
              return (
                <div key={index} className="flex flex-col gap-2 mt-2">
                  <div className="border border-input rounded-md p-4">
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row gap-2">
                        <span
                          onClick={() => handleOnClickMovement(item)}
                          className="cursor-pointer text-[10px] flex flex-row justify-center text-center sm:text-sm md:text-md lg:text-xs font-normal border border-primary rounded-[4px] p-1 gap-1"
                        >
                          Move {item?.moveNumber}:{" "}
                          {capturedWhite
                            .filter((wp) => wp.san == item?.move)
                            .map((item, index) => {
                              return (
                                <Image
                                  key={index}
                                  src={`/pieces/${PieceChoosed}/${item.captured}.png`}
                                  alt="icon"
                                  width={1000}
                                  height={1000}
                                  className="w-[12px] h-[12px] object-contain inline-block"
                                />
                              );
                            })}
                          <span className="font-bold">{item?.move}</span>
                        </span>
                        <span
                          className={`rounded-full border border-input px-4 py-1 font-semibold text-xs sm:text-sm md:text-md lg:text-xs  text-center font-normal ${getScoreClass(
                            item.classification
                          )}`}
                        >
                          {item.evaluation}
                        </span>
                      </div>
                      <span
                        className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-xs sm:text-sm md:text-md lg:text-xs  ${getBadgeClass(
                          item.classification
                        )}`}
                      >
                        {item.classification}
                      </span>
                    </div>
                    <span className="text-sm sm:text-md md:text-md lg:text-xs  font-normal">
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
                className="w-[18px] h-[18px] sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px]"
              />
              <span className="text-md sm:text-lg md:text-xl lg:text-xl  font-bold w-full">
                Bad Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#221AE9" />
                <span className="text-xs sm:text-sm md:text-md lg:text-xs ">
                  Type:
                </span>
                <span className="text-xs sm:text-sm md:text-md lg:text-xs font-semibold ">
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
          {badMoves && badMoves.length == 0 && <NoData />}
          {openBadMove &&
            badMoves.map((item: any, index: number) => {
              return (
                <div key={index} className="flex flex-col gap-2 mt-2">
                  <div className="border border-input rounded-md p-4">
                    <div className="flex flex-row justify-between gap-2 mb-4">
                      <div className="flex flex-row gap-2">
                        <span
                          onClick={() => handleOnClickMovement(item)}
                          className="cursor-pointer text-[10px] flex flex-row justify-center text-center sm:text-sm md:text-md lg:text-xs font-normal border border-primary rounded-[4px] p-1 gap-1"
                        >
                          Move {item?.moveNumber}:{" "}
                          {capturedWhite
                            .filter((wp) => wp.san == item?.move)
                            .map((item, index) => {
                              return (
                                <Image
                                  key={index}
                                  src={`/pieces/${PieceChoosed}/${item.captured}.png`}
                                  alt="icon"
                                  width={1000}
                                  height={1000}
                                  className="w-[12px] h-[12px] object-contain inline-block"
                                />
                              );
                            })}
                          <span className="font-bold">{item?.move}</span>
                        </span>
                        <span
                          className={`rounded-full border border-input px-4 py-1 font-semibold text-xs sm:text-sm md:text-md lg:text-xs text-center font-normal ${getScoreClass(
                            item.classification
                          )}`}
                        >
                          {item.evaluation}
                        </span>
                      </div>
                      <span
                        className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-xs sm:text-sm md:text-md lg:text-xs ${getBadgeClass(
                          item.classification
                        )}`}
                      >
                        {item.classification}
                      </span>
                    </div>
                    <span className="text-sm sm:text-sm md:text-md lg:text-xs font-normal">
                      <span className="font-bold">Analysis: </span>
                      {item.analysis}
                    </span>
                  </div>
                </div>
              );
            })}
          {/* {openBadMove && (
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
          )} */}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-2 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#000] text-xs sm:text-sm md:text-md lg:text-md ">
            <ArrowLeft color="#000" className="mr-2 h-4 w-4 sm:h-6 w-6" />
            Openings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-md ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Endgame
            <ArrowRight color="#FFF" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </>
  );
};

export default MiddleGame;
