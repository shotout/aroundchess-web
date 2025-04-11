"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, InfoIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import { usePgnStore } from "../../app/store/zustandStore";
import { useChessBoardThemeStore } from "../../app/store/chessBoardTheme";
interface MovementDetailsProps {
  next: () => void;
  prev: () => void;
}
const MovementDetails: React.FC<MovementDetailsProps> = (props) => {
  const {
    pgn: storePgn,
    dataAnalysis,
    capturedBlack,
    capturedWhite,
  } = usePgnStore(); // Get PGN from the Zustand store

  const { PieceChoosed } = useChessBoardThemeStore();
  const { chessMove, setChessMove } = useChessMoveStore();
  const { gameInfo, summary, movementDetails } = dataAnalysis ?? {};
  useEffect(() => {
    console.log("movementDetails", movementDetails);
  }, []);
  const moves = [
    {
      whiteMove: "d4",
      whiteAdv: "+0.20",
      whiteClass: "Brilliant",
      blackMove: "d4",
      blackAdv: "-0.10",
      blackClass: "Best",
    },
    {
      whiteMove: "e3",
      whiteAdv: "-0.05",
      whiteClass: "Miss",
      blackMove: "e3",
      blackAdv: "+1.25",
      blackClass: "Brilliant",
    },
    {
      whiteMove: "d3",
      whiteAdv: "+0.20",
      whiteClass: "Brilliant",
      blackMove: "g7",
      blackAdv: "-0.10",
      blackClass: "Great",
    },
    {
      whiteMove: "b3",
      whiteAdv: "+0.20",
      whiteClass: "Brilliant",
      blackMove: "b3",
      blackAdv: "-0.10",
      blackClass: "Miss",
    },
    {
      whiteMove: "c4",
      whiteAdv: "0.06",
      whiteClass: "Great",
      blackMove: "c4",
      blackAdv: "0.02",
      blackClass: "Mistake",
    },
    {
      whiteMove: "d2",
      whiteAdv: "+2.5",
      whiteClass: "Best",
      blackMove: "d2",
      blackAdv: "-1.50",
      blackClass: "Blunder",
    },
    {
      whiteMove: "f3",
      whiteAdv: "0.4",
      whiteClass: "Great",
      blackMove: "f3",
      blackAdv: "0",
      blackClass: "Best",
    },
    {
      whiteMove: "dcx5",
      whiteAdv: "0.10",
      whiteClass: "Best",
      blackMove: "dcx5",
      blackAdv: "0.05",
      blackClass: "Brilliant",
    },
    {
      whiteMove: "cxb5",
      whiteAdv: "0.5",
      whiteClass: "Great",
      blackMove: "cxb5",
      blackAdv: "0.01",
      blackClass: "Blunder",
    },
  ];

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
      case "Excellent":
        return "text-[#01A12E]";
      case "Great":
        return "text-[#364152]";
      case "Best":
        return "text-[#364152]";
      case "Good":
        return "text-[#364152]";
      case "Miss":
        return "text-[#FD0000]";
      case "Blunder":
        return "text-[#FD0000]";
      case "Mistake":
        return "text-[#FD0000]";
      case "Inaccuracy":
        return "text-[#FD0000]";
      default:
        return "text-[#364152]";
    }
  };
  const handleOnClickMovement = (move: any, index: number, type: string) => {
    move.index = index;
    move.type = type;
    console.log(move);
    setChessMove(move);
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-full xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto py-4 ">
        <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <div className="flex flex-row items-center gap-2 mb-2">
            <h2 className="text-sm font-light">
              White Opening:{" "}
              <span className="font-bold">{gameInfo?.openings.white.name}</span>
            </h2>
            {/* <Image
            alt=""
            src={"/icons/great-moves-icon.png"}
            width={20}
            height={20}
          /> */}
          </div>
          <div className="flex flex-row items-center gap-2 mb-2">
            <h2 className="text-sm font-light">
              Black Opening:{" "}
              <span className="font-bold text-decoration-underline">
                {gameInfo?.openings.black.name}
              </span>
            </h2>
            {/* <Image
            alt=""
            src={"/icons/brilliant-moves-icon.png"}
            width={20}
            height={20}
          /> */}
          </div>
        </div>
        <div className="flex flex-col mt-4 bg-white border border-[#749BBF] pb-2 rounded-sm">
          <div className="flex grid grid-cols-2 sm:grid-cols-[6%_47%_47%] text-center border-b border-b-[#749BBF] h-14 ">
            <div className="hidden sm:block sm:rounded-tl-sm bg-[#BDD0F9] border-r border-r-[#749BBF] py-2"></div>
            <span className="block text-sm font-bold rounded-tl-sm sm:rounded-none bg-[#BDD0F9] border-r border-r-[#749BBF]  py-2">
              White{" "}
              <span className="block text-xs sm:text-sm md:text-md lg:text-md xl:text-sm font-light">
                ({summary?.whiteSide?.profileInfo.username})
              </span>
            </span>
            <span className="block text-sm font-bold rounded-tr-sm bg-[#BDD0F9] py-2 ">
              Black{" "}
              <span className="block text-xs sm:text-sm md:text-md lg:text-md xl:text-sm font-light">
                ({summary?.blackSide?.profileInfo.username})
              </span>
            </span>
          </div>
          <div className="flex grid grid-cols-2 sm:grid-cols-[6%_47%_47%]">
            <div className="hidden sm:block bg-[#BDD0F9] border-r border-r-[#749BBF] py-2"></div>
            <div className="grid grid-cols-3 text-center border-b bg-[#BDD0F9]">
              {["Movement", "Advantage", "Classification"].map((header) => (
                <span
                  key={header}
                  className="text-[9px] sm:text-sm md:text-md lg:text-md xl:text-sm py-2 font-semibold border-r border-r-[#749BBF] "
                >
                  {header}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 text-center border-b bg-[#BDD0F9]">
              {["Movement", "Advantage", "Classification"].map((header) => (
                <span
                  key={header}
                  className="text-[9px] sm:text-sm md:text-md lg:text-md xl:text-sm py-2 font-semibold border-r border-r-[#749BBF] "
                >
                  {header}
                </span>
              ))}
            </div>
          </div>

          {movementDetails.white.map((move: any, index: number) => (
            <div
              key={index}
              className={`grid grid-cols-2 sm:grid-cols-[6%_47%_47%] divide-x border-b text-center ${
                index % 2 != 0 ? "bg-[#EEFAFE]" : "bg-white"
              }`}
            >
              <span className="hidden sm:block text-xs sm:text-sm md:text-md lg:text-md text-center font-semibold py-2 border-b border-b-[#749BBF]">
                {index + 1}
              </span>
              <div className="grid grid-cols-3 flex items-center h-10 lg:h-14 border-b border-b-[#749BBF] hover:bg-[#81CFF3] ">
                <Popover>
                  <PopoverContent
                    className="lg:hidden w-auto p-0"
                    align="start"
                  >
                    <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                      <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row items-center gap-2">
                          <span className="text-xs  sm:text-xs md:text-md lg:text-md xl:text-sm font-semibold">
                            {move.move}
                          </span>
                          <span
                            className={`rounded-2xl px-3 py-[4px] border border-input text-xs sm:text-xs md:text-md lg:text-md xl:text-sm text-center font-normal py-2 ${getScoreClass(
                              move.classification.toLowerCase()
                            )}`}
                          >
                            {move.evaluation}
                          </span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <span
                            className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-xs md:text-sm lg:text-md xl:text-sm px-2 ${getBadgeClass(
                              move.classification
                            )}`}
                          >
                            {move.classification}
                          </span>
                          <PopoverClose>
                            <Image
                              alt="close"
                              src={"/icons/close-icon.png"}
                              width={1000}
                              height={1000}
                              className="w-5 h-5"
                            />
                          </PopoverClose>
                        </div>
                      </div>
                      {move.analysis && (
                        <span className="text-xs font-normal py-1">
                          {move.analysis}
                        </span>
                      )}
                      <div className="flex flex-row gap-1">
                        <InfoIcon size={16} color="#221AE9" />
                        <span className="text-xs">Type:</span>
                        <span className="text-xs font-semibold ">
                          {move.gamePhase}
                        </span>
                      </div>
                    </div>
                  </PopoverContent>
                  <PopoverTrigger asChild>
                    <button
                      className="rounded-none"
                      onClick={() =>
                        handleOnClickMovement(move, index, "white")
                      }
                    >
                      {capturedWhite
                        .filter((wp) => wp.san == move?.move)
                        .map((item, index) => {
                          return (
                            <Image
                              key={index}
                              src={`/pieces/${PieceChoosed}/${item.captured}.png`}
                              alt="icon"
                              width={1000}
                              height={1000}
                              className="w-[16px] h-[16px] object-contain inline-block mr-1"
                            />
                          );
                        })}
                      <span className="text-xs sm:text-sm md:text-md lg:text-md xl:text-sm text-center font-semibold py-2">
                        {move.move}
                      </span>
                    </button>
                  </PopoverTrigger>
                </Popover>

                <span
                  className={`text-xs sm:text-sm md:text-md lg:text-md xl:text-sm text-center font-normal py-2 ${getScoreClass(
                    move.classification
                  )}`}
                >
                  {move.evaluation}
                </span>
                <span
                  className={`mx-1 rounded-[4px] text-[11px] sm:text-sm md:text-md lg:text-md xl:text-md ${getBadgeClass(
                    move.classification
                  )}`}
                >
                  {move.classification}
                </span>
              </div>
              <div className="grid grid-cols-3 flex items-center h-10 lg:h-14 border-b border-b-[#749BBF] hover:bg-[#81CFF3] ">
                <Popover>
                  <PopoverContent
                    className="lg:hidden w-auto p-0"
                    align="start"
                  >
                    <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                      <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row items-center gap-2">
                          <span className="text-xs  sm:text-xs md:text-md lg:text-md xl:text-sm font-semibold">
                            {movementDetails.black[index]?.move}
                          </span>
                          <span
                            className={`rounded-2xl px-3 py-[4px] border border-input text-xs sm:text-xs md:text-md lg:text-md xl:text-sm text-center font-normal py-2 ${getScoreClass(
                              movementDetails.black[
                                index
                              ]?.classification.toLowerCase()
                            )}`}
                          >
                            {movementDetails.black[index]?.evaluation}
                          </span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <span
                            className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-xs md:text-sm lg:text-md xl:text-sm px-2 ${getBadgeClass(
                              movementDetails.black[index]?.classification
                            )}`}
                          >
                            {movementDetails.black[index]?.classification}
                          </span>
                          <PopoverClose>
                            <Image
                              alt="close"
                              src={"/icons/close-icon.png"}
                              width={1000}
                              height={1000}
                              className="w-5 h-5"
                            />
                          </PopoverClose>
                        </div>
                      </div>
                      {move.analysis && (
                        <span className="text-xs font-normal py-1">
                          {move.analysis}
                        </span>
                      )}
                      <div className="flex flex-row gap-1">
                        <InfoIcon size={16} color="#221AE9" />
                        <span className="text-xs">Type:</span>
                        <span className="text-xs font-semibold ">
                          {movementDetails.black[index]?.gamePhase}
                        </span>
                      </div>
                    </div>
                  </PopoverContent>
                  <PopoverTrigger asChild>
                    <button
                      className="rounded-none"
                      onClick={() =>
                        handleOnClickMovement(
                          movementDetails.black[index],
                          index,
                          "black"
                        )
                      }
                    >
                      {capturedBlack
                        .filter(
                          (bp) => bp.san == movementDetails.black[index]?.move
                        )
                        .map((item, index) => {
                          return (
                            <Image
                              key={index}
                              src={`/pieces/${PieceChoosed}/${item.captured}.png`}
                              alt="icon"
                              width={1000}
                              height={1000}
                              className="w-[16px] h-[16px] object-contain inline-block mr-1"
                            />
                          );
                        })}
                      <span className="text-xs sm:text-sm md:text-md lg:text-mdtext-center font-semibold py-2">
                        {movementDetails.black[index]?.move}
                      </span>
                    </button>
                  </PopoverTrigger>
                </Popover>

                <span
                  className={`text-xs sm:text-sm md:text-md lg:text-mdtext-center font-normal py-2 ${getScoreClass(
                    movementDetails.black[index]?.classification
                  )}`}
                >
                  {movementDetails.black[index]?.evaluation}
                </span>
                <span
                  className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-sm md:text-md lg:text-md xl:text-md ${getBadgeClass(
                    movementDetails.black[index]?.classification
                  )}`}
                >
                  {movementDetails.black[index]?.classification}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row justify-between mt-4 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#000] text-xs sm:text-sm md:text-md lg:text-lg ">
            <ArrowLeft color="#000" className="mr-2 h-4 w-4 sm:h-6 w-6" />
            Summary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex justify-center w-full h-[48px] whitespace-nowrap rounded-sm sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center text-[#fff] text-xs sm:text-sm md:text-md lg:text-lg ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Threats
            <ArrowRight color="#FFF" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default MovementDetails;
