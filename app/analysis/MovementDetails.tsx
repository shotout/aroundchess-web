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
import { useChessMoveStore } from "../store/chessMoveStore";
import { usePgnStore } from "../store/zustandStore";
interface MovementDetailsProps {
  next: () => void;
  prev: () => void;
}
const MovementDetails: React.FC<MovementDetailsProps> = (props) => {
  const { pgn: storePgn, dataAnalysis } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const { gameInfo, summary, movementDetails } = dataAnalysis ?? {};
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
        return "border border-[#27C2A3] text-[#0C7C65] bg-white";
      case "Excellent":
        return "border border-[#27C2A3] text-[#0C7C65] bg-white";
      case "Great":
        return "border border-[#BDD0F9] text-[#134472] bg-white";
      case "Good":
        return "border border-[#BDD0F9] text-[#134472] bg-white";
      case "Best":
        return "border border-[#80B64D] text-[#3A6211] bg-white";
      case "Miss":
        return "border border-[#FF7769] text-[#C23627] bg-white";
      case "Blunder":
        return "border border-[#FA402D] text-[#FA402D] bg-white ";
      case "Mistake":
        return "border border-[#FFA459] text-[#B08503] bg-white";
      case "Inaccuracy":
        return "border border-[#FFA459] text-[#B08503] bg-white";
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
      <div className="flex flex-col lg:max-h-[800px] lg:min-h-[800px] lg:overflow-auto p-4 ">
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
        <div className="flex flex-col mt-4 bg-white border border-[#BDD0F9] pb-2 rounded-sm">
          <div className="flex grid grid-cols-2 sm:grid-cols-[6%_47%_47%] text-center border-b border-b-[#BDD0F9] h-14 ">
            <div className="hidden sm:block sm:rounded-tl-sm bg-[#D7E3FB] border-r border-r-[#BDD0F9] py-2"></div>
            <span className="block text-sm font-bold rounded-tl-sm sm:rounded-none bg-[#D7E3FB] border-r border-r-[#BDD0F9]  py-2">
              White{" "}
              <span className="block text-xs sm:text-sm md:text-md lg:text-md xl:text-lg font-light">
                ({summary?.whiteSide?.profileInfo.username})
              </span>
            </span>
            <span className="block text-sm font-bold rounded-tr-sm bg-[#D7E3FB] py-2 ">
              Black{" "}
              <span className="block text-xs sm:text-sm md:text-md lg:text-md xl:text-lg font-light">
                ({summary?.blackSide?.profileInfo.username})
              </span>
            </span>
          </div>
          <div className="flex grid grid-cols-2 sm:grid-cols-[6%_47%_47%]">
            <div className="hidden sm:block bg-[#D7E3FB] border-r border-r-[#BDD0F9] py-2"></div>
            <div className="grid grid-cols-3 text-center border-b bg-[#D7E3FB]">
              {["Movement", "Advantage", "Classification"].map((header) => (
                <span
                  key={header}
                  className="text-[9px] sm:text-sm md:text-md lg:text-md xl:text-lg py-2 font-semibold border-r border-r-[#BDD0F9] "
                >
                  {header}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 text-center border-b bg-[#D7E3FB]">
              {["Movement", "Advantage", "Classification"].map((header) => (
                <span
                  key={header}
                  className="text-[9px] sm:text-sm md:text-md lg:text-md xl:text-lg py-2 font-semibold border-r border-r-[#BDD0F9] "
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
                index % 2 != 0 ? "bg-[#F6F9FF]" : "bg-white"
              }`}
            >
              <span className="hidden sm:block text-xs sm:text-sm md:text-md lg:text-lg text-center font-semibold py-2 border-b border-b-[#BDD0F9]">
                {index + 1}
              </span>
              <div className="grid grid-cols-3 flex items-center h-10 lg:h-14 border-b border-b-[#BDD0F9]  ">
                <Popover>
                  <PopoverContent
                    className="lg:hidden w-auto p-0"
                    align="start"
                  >
                    <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                      <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row items-center gap-2">
                          <span className="text-xs  sm:text-xs md:text-md lg:text-md xl:text-lg font-semibold">
                            {move.move}
                          </span>
                          <span
                            className={`rounded-2xl px-3 py-[4px] border border-input text-xs sm:text-xs md:text-md lg:text-md xl:text-lg text-center font-normal py-2 ${getScoreClass(
                              move.classification.toLowerCase()
                            )}`}
                          >
                            {move.evaluation}
                          </span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <span
                            className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-xs md:text-md lg:text-md xl:text-lg px-2 ${getBadgeClass(
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
                      <span className="text-xs font-normal py-1">
                        This move deviates from opening principles. Focus on
                        development and center control.
                      </span>
                      <div className="flex flex-row gap-1">
                        <InfoIcon size={16} color="#3871EC" />
                        <span className="text-xs">Type:</span>
                        <span className="text-xs font-semibold ">
                          {move.gamePhase}
                        </span>
                      </div>
                    </div>
                  </PopoverContent>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="rounded-none hover:bg-[#9BB8F5]"
                      onClick={() =>
                        handleOnClickMovement(move, index, "white")
                      }
                    >
                      <span className="text-xs sm:text-sm md:text-md lg:text-md xl:text-lg text-center font-semibold py-2">
                        {move.move}
                      </span>
                    </Button>
                  </PopoverTrigger>
                </Popover>

                <span
                  className={`text-xs sm:text-sm md:text-md lg:text-md xl:text-lg text-center font-normal py-2 ${getScoreClass(
                    move.classification
                  )}`}
                >
                  {move.evaluation}
                </span>
                <span
                  className={`mx-1 rounded-[4px] text-[11px] sm:text-sm md:text-md lg:text-md xl:text-lg ${getBadgeClass(
                    move.classification
                  )}`}
                >
                  {move.classification}
                </span>
              </div>
              <div className="grid grid-cols-3 flex items-center h-10 lg:h-14 border-b border-b-[#BDD0F9] ">
                <Popover>
                  <PopoverContent
                    className="lg:hidden w-auto p-0"
                    align="start"
                  >
                    <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                      <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row items-center gap-2">
                          <span className="text-xs  sm:text-xs md:text-md lg:text-md xl:text-lg font-semibold">
                            {movementDetails.black[index]?.move}
                          </span>
                          <span
                            className={`rounded-2xl px-3 py-[4px] border border-input text-xs sm:text-xs md:text-md lg:text-md xl:text-lg text-center font-normal py-2 ${getScoreClass(
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
                            className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-xs md:text-md lg:text-md xl:text-lg px-2 ${getBadgeClass(
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
                      <span className="text-xs font-normal py-1">
                        This move deviates from opening principles. Focus on
                        development and center control.
                      </span>
                      <div className="flex flex-row gap-1">
                        <InfoIcon size={16} color="#3871EC" />
                        <span className="text-xs">Type:</span>
                        <span className="text-xs font-semibold ">
                          {movementDetails.black[index]?.gamePhase}
                        </span>
                      </div>
                    </div>
                  </PopoverContent>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="rounded-none hover:bg-[#9BB8F5]"
                      onClick={() =>
                        handleOnClickMovement(
                          movementDetails.black[index],
                          index,
                          "black"
                        )
                      }
                    >
                      <span className="text-xs sm:text-sm md:text-md lg:text-lgtext-center font-semibold py-2">
                        {movementDetails.black[index]?.move}
                      </span>
                    </Button>
                  </PopoverTrigger>
                </Popover>

                <span
                  className={`text-xs sm:text-sm md:text-md lg:text-lgtext-center font-normal py-2 ${getScoreClass(
                    movementDetails.black[index]?.classification
                  )}`}
                >
                  {movementDetails.black[index]?.evaluation}
                </span>
                <span
                  className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-sm md:text-md lg:text-md xl:text-lg ${getBadgeClass(
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
        <Button
          onClick={props.prev}
          size="lg"
          variant="outline"
          className="flex w-full h-[48px] whitespace-nowrap rounded-sm"
        >
          <div className="flex flex-row items-center text-xs sm:text-sm md:text-md lg:text-lg text-black sm:py-4 md:py-6 lg:py-8">
            <ArrowLeft color="#000" className="mr-2 h-6 w-6" />
            Summary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Threats
            <ArrowRight color="#FFF" className="ml-2 h-6 w-6" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default MovementDetails;
