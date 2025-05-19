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
  const { pgn: storePgn, dataAnalysis, capturedWhite } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const { PieceChoosed } = useChessBoardThemeStore();

  const { bestMoves, badMoves } = dataAnalysis?.endGame;
  const [openBestMoves, setOpenBestMoves] = useState<boolean>(true);
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
              <span className="text-md sm:text-lg md:text-xl lg:text-md  font-bold w-full">
                Best Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#221AE9" />
                <span className="text-xs sm:text-sm md:text-md lg:text-md ">
                  Type:
                </span>
                <span className="text-xs sm:text-sm md:text-md lg:text-md font-semibold ">
                  Endgame
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
                          className={`rounded-full border border-input px-4 py-1 font-semibold text-xs sm:text-sm md:text-md lg:text-md  text-center font-normal ${getScoreClass(
                            item.classification
                          )}`}
                        >
                          {item.evaluation}
                        </span>
                      </div>
                      <span
                        className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-xs sm:text-sm md:text-md lg:text-md  ${getBadgeClass(
                          item.classification
                        )}`}
                      >
                        {item.classification}
                      </span>
                    </div>
                    <span className="text-sm sm:text-md md:text-md lg:text-md  font-normal">
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
              <span className="text-md sm:text-lg md:text-xl lg:text-md  font-bold w-full">
                Bad Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#221AE9" />
                <span className="text-xs sm:text-sm md:text-md lg:text-md ">
                  Type:
                </span>
                <span className="text-xs sm:text-sm md:text-md lg:text-md font-semibold ">
                  Endgame
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
                          className={`rounded-full border border-input px-4 py-1 font-semibold text-xs sm:text-sm md:text-md lg:text-md text-center font-normal ${getScoreClass(
                            item.classification
                          )}`}
                        >
                          {item.evaluation}
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
                </div>
              );
            })}
          {/* {openBadMove && badMoves&&badMoves.length > 0 && (
            <div className="flex flex-row bg-gradient mt-4 rounded-md p-2 sm:p-4 md:p-6 lg:p-8">
              <Image
                alt=""
                src={"/icons/info-banner-icon.png"}
                width={1000}
                height={1000}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
              />
              <span className="text-xs sm:text-md md:text-lg lg:text-lg font-normal text-primary ml-4">
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
          className="btn-secondary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#221AE9] font-medium text-xs sm:text-sm md:text-md lg:text-[16px] ">
            <ArrowLeft color="#221AE9" className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
            Back: Middlegame&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#e6f7fe] text-xs sm:text-sm md:text-md lg:text-[16px] ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next: Improvement
            <ArrowRight color="#e6f7fe" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </>
  );
};

export default EndGame;
