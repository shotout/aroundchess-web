"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  BookXIcon,
  ChevronDown,
  ChevronUp,
  InfoIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import NoData from "@/components/NoData/NoData";
import { useChessBoardThemeStore } from "../../app/store/chessBoardTheme";

interface EndgameProps {
  next: () => void;
  prev: () => void;
}

const EndGame: React.FC<EndgameProps> = (props) => {
  const { pgn: storePgn, dataAnalysis, capturedWhite } = usePgnStore();
  const { chessMove, setChessMove } = useChessMoveStore();
  const { PieceChoosed } = useChessBoardThemeStore();

  // Safe destructuring with defaults
  const endGameData = dataAnalysis?.endGame || {};
  const { bestMoves = [], badMoves = [] } = endGameData;

  const [openBestMoves, setOpenBestMoves] = useState<boolean>(true);
  const [openBadMove, setopenBadMove] = useState<boolean>(true);
  const [showAllBestMoves, setShowAllBestMoves] = useState<boolean>(false);
  const [showAllBadMoves, setShowAllBadMoves] = useState<boolean>(false);
  const ITEMS_TO_SHOW = 5;
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

  return (
    <>
      <div className="flex flex-col justify-center gap-4 bg-white lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        {/* best moves  */}
        <div className="w-full border-t border-[#C0CED4] sm:border sm:border-primary sm:border-t-4 sm:rounded-md p-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Image
                alt=""
                src={"/icons/check.png"}
                width={1000}
                height={1000}
                className="w-[18px] h-[18px] sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px]"
              />
              <span className="text-md sm:text-lg md:text-xl lg:text-md  font-bold w-full">
                Best Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#221AE9" />
                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md ">
                  Type:
                </span>
                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md font-semibold ">
                  Endgame
                </span>
              </div>
            </div>
            <div
              className="hidden sm:block"
              onClick={() => setOpenBestMoves(!openBestMoves)}
            >
              {openBestMoves ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>
          {bestMoves && bestMoves.length === 0 && <NoData />}
          {openBestMoves && bestMoves && (
            <>
              {(showAllBestMoves ? bestMoves : bestMoves.slice(0, 5)).map(
                (item: any, index: number) => {
                  return (
                    <div key={index} className="flex flex-col gap-2 mt-2">
                      <div
                        className={`border ${
                          chessMove.move == item.move
                            ? `border-2 border-[#221AE9] bg-[#221AE910]`
                            : `border-input`
                        } rounded-md p-4`}
                      >
                        <div className="flex flex-row justify-between gap-2 mb-4">
                          <div className="flex flex-row gap-2">
                            <span
                              onClick={() => handleOnClickMovement(item)}
                              className="cursor-pointer text-[10px] flex flex-row justify-center text-center sm:text-[14px] --sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1 gap-1"
                            >
                              Move {item?.moveNumber}:{" "}
                              {capturedWhite &&
                                capturedWhite
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
                              className={`rounded-full border border-input px-4 py-1 font-semibold text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md text-center font-normal ${getScoreClass(
                                item.classification
                              )}`}
                            >
                              {item.evaluation}
                            </span>
                          </div>
                          <span
                            className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md ${getBadgeClass(
                              item.classification
                            )}`}
                          >
                            {item.classification}
                          </span>
                        </div>
                        <span className="text-[14px] --sm sm:text-[14px] --sm md:text-md lg:text-md font-normal">
                          <span className="font-bold">Analysis: </span>
                          {item.analysis}
                        </span>
                         {item.recommendation && (
                          <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                            <span className="text-[10px] sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal text-primary">
                              <span className="font-bold">
                                Recommendation:{" "}
                              </span>
                              {item.recommendation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </>
          )}
          {bestMoves.length > ITEMS_TO_SHOW && (
            <button
              onClick={() => setShowAllBestMoves(!showAllBestMoves)}
              className="w-full flex flex-row items-center justify-center mt-2 py-2 gap-[4px] h-[40px] bg-[#FAFDFF] rounded-[100px] border-[0.5px] border-[#C0CED4]"
            >
              <span className="text-center text-[14px] text-[#221AE9] font-medium">
                {showAllBestMoves
                  ? "See Less"
                  : `See More (${bestMoves.length - ITEMS_TO_SHOW})`}
              </span>
              <Image
                src="/icons/chevron-down.png"
                alt="arrow down"
                width={16}
                height={16}
                className={`ml-1 ${showAllBestMoves ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
        {/* critical mistakes moves  */}
        <div className="w-full border-t border-[#C0CED4] sm:border sm:border-primary sm:border-t-4 sm:rounded-md p-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Image
                alt=""
                src={"/icons/alert-triangle.png"}
                width={1000}
                height={1000}
                className="w-[18px] h-[18px] sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px]"
              />
              <span className="text-md sm:text-lg md:text-xl lg:text-md  font-bold w-full">
                Bad Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#221AE9" />
                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md ">
                  Type:
                </span>
                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md font-semibold ">
                  Endgame
                </span>
              </div>
            </div>
            <div
              className="hidden sm:block"
              onClick={() => setopenBadMove(!openBadMove)}
            >
              {openBadMove ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>
          {badMoves && badMoves.length === 0 && <NoData />}
          {openBadMove && badMoves && (
            <>
              {(showAllBadMoves ? badMoves : badMoves.slice(0, 5)).map(
                (item: any, index: number) => {
                  return (
                    <div key={index} className="flex flex-col gap-2 mt-2">
                      <div
                        className={`border ${
                          chessMove.move == item.move
                            ? `border-2 border-[#221AE9] bg-[#221AE910]`
                            : `border-input`
                        } rounded-md p-4`}
                      >
                        <div className="flex flex-row justify-between gap-2 mb-4">
                          <div className="flex flex-row gap-2">
                            <span
                              onClick={() => handleOnClickMovement(item)}
                              className="cursor-pointer text-[10px] flex flex-row justify-center text-center sm:text-[14px] --sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1 gap-1"
                            >
                              Move {item?.moveNumber}:{" "}
                              {capturedWhite &&
                                capturedWhite
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
                              className={`rounded-full border border-input px-4 py-1 font-semibold text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md text-center font-normal ${getScoreClass(
                                item.classification
                              )}`}
                            >
                              {item.evaluation}
                            </span>
                          </div>
                          <span
                            className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md ${getBadgeClass(
                              item.classification
                            )}`}
                          >
                            {item.classification}
                          </span>
                        </div>
                        <span className="text-[14px] --sm sm:text-[14px] --sm md:text-md lg:text-md font-normal">
                          <span className="font-bold">Analysis: </span>
                          {item.analysis}
                        </span>
                        {item.explanation && (
                          <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                            <span className="text-[10px] sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal text-primary">
                              <span className="font-bold">
                                Recommendation:{" "}
                              </span>
                              {item.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </>
          )}
          {badMoves.length > ITEMS_TO_SHOW && (
            <button
              onClick={() => setShowAllBadMoves(!showAllBadMoves)}
              className="w-full flex flex-row items-center justify-center mt-2 py-2 gap-[4px] h-[40px] bg-[#FAFDFF] rounded-[100px] border-[0.5px] border-[#C0CED4]"
            >
              <span className="text-center text-[14px] text-[#221AE9] font-medium">
                {showAllBadMoves
                  ? "See Less"
                  : `See More (${badMoves.length - ITEMS_TO_SHOW})`}
              </span>
              <Image
                src="/icons/chevron-down.png"
                alt="arrow down"
                width={16}
                height={16}
                className={`ml-1 ${showAllBadMoves ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-row justify-between mt-2 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#221AE9] font-medium text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            <ArrowLeft color="#221AE9" className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
            Back: Middlegame&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#e6f7fe] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next: Improvement
            <ArrowRight color="#e6f7fe" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </>
  );
};

export default EndGame;
