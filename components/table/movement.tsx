"use client";

import { useChessMoveStore } from "@/app/store/chessMoveStore";
import { usePgnStore } from "@/app/store/zustandStore";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useTabFocusStore } from "@/app/store/tabAnalysisStore";

export default function MovementTable() {
  const { pgn: storePgn, dataAnalysis } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const { tabFocus, setTabFocus } = useTabFocusStore();

  const { gameInfo, summary, movementDetails } = dataAnalysis ?? {};

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
    <div className="mt-4 bg-white border border-[#BDD0F9] pb-2 rounded-sm">
      <div className="grid grid-cols-2 sm:grid-cols-[6%_47%_47%] text-center border-b border-b-[#BDD0F9] h-14 ">
        <div className="hidden sm:block sm:rounded-tl-sm bg-[#D7E3FB] border-r border-r-[#BDD0F9] py-2"></div>
        <span className="block text-sm font-bold rounded-tl-sm sm:rounded-none bg-[#D7E3FB] border-r border-r-[#BDD0F9]  py-2">
          White{" "}
          <span className="block text-sm sm:text-sm md:text-sm lg:text-sm font-light">
            ({summary?.whiteSide?.profileInfo.username})
          </span>
        </span>
        <span className="block text-sm font-bold rounded-tr-sm bg-[#D7E3FB] py-2 ">
          Black{" "}
          <span className="block text-sm sm:text-sm md:text-sm lg:text-sm font-light">
            ({summary?.blackSide?.profileInfo.username})
          </span>
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-[6%_47%_47%]">
        <div className="hidden sm:block bg-[#D7E3FB] border-r border-r-[#BDD0F9] py-2"></div>
        <div className="grid grid-cols-3 text-center border-b bg-[#D7E3FB]">
          {["Movement", "Advantage", "Classification"].map((header) => (
            <span
              key={header}
              className="text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] py-2 font-semibold border-r border-r-[#BDD0F9] "
            >
              {header}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 text-center border-b bg-[#D7E3FB]">
          {["Movement", "Advantage", "Classification"].map((header) => (
            <span
              key={header}
              className="text-[9px] sm:text-[11px] md:text-[11px] lg:text-[11px] py-2 font-semibold border-r border-r-[#BDD0F9] "
            >
              {header}
            </span>
          ))}
        </div>
      </div>
      <div className="max-h-[496px] overflow-auto">
        {movementDetails.white.map((move: any, index: number) => (
          <div
            key={index}
            className={`grid grid-cols-2 sm:grid-cols-[6%_47%_47%] divide-x border-b text-center ${
              tabFocus == (move.gamePhase.toLowerCase()).replace(/ /g, '')
                ? "bg-[#9BB8F5]"
                : index % 2 != 0
                ? "bg-[#F6F9FF]"
                : "bg-white"
            }`}
          >
            <span className="hidden sm:block text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px]text-center font-semibold py-2 border-b border-b-[#BDD0F9]">
              {index + 1}
            </span>
            <div className="grid grid-cols-3 flex items-center h-10 border-b border-b-[#BDD0F9] ">
              <Popover>
                <PopoverContent
                  className="w-auto p-0 bg-white rounded-md"
                  align="start"
                >
                  <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-[11px]  sm:text-[11px] md:text-[11px] lg:text-[11px] font-semibold">
                          {move.move}
                        </span>
                        <span
                          className={`rounded-2xl px-3 py-[4px] border border-input text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px] text-center font-normal py-2 ${getScoreClass(
                            move.classification.toLowerCase()
                          )}`}
                        >
                          {move.evaluation}
                        </span>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <span
                          className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px] px-2 ${getBadgeClass(
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
                    <span className="text-[11px] font-normal py-1">
                      This move deviates from opening principles. Focus on
                      development and center control.
                    </span>
                    <div className="flex flex-row gap-1">
                      <InfoIcon size={16} color="#3871EC" />
                      <span className="text-[11px]">Type:</span>
                      <span className="text-[11px] font-semibold ">
                        {move.gamePhase}
                      </span>
                    </div>
                  </div>
                </PopoverContent>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="rounded-none hover:bg-[#9BB8F5]"
                    onClick={() => handleOnClickMovement(move, index, "white")}
                  >
                    <span className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px] text-center font-semibold py-2">
                      {move.move}
                    </span>
                  </Button>
                </PopoverTrigger>
              </Popover>

              <span
                className={`text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px] text-center ${
                  tabFocus == (move.gamePhase.toLowerCase()).replace(/ /g, '')
                    ? "font-bold"
                    : "font-normal"
                } py-2 ${getScoreClass(move.classification)}`}
              >
                {move.evaluation}
              </span>
              <span
                className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px] ${getBadgeClass(
                  move.classification
                )}`}
              >
                {move.classification}
              </span>
            </div>
            <div className="grid grid-cols-3 flex items-center h-10 border-b border-b-[#BDD0F9] ">
              <Popover>
                <PopoverContent
                  className="w-auto p-0 bg-white rounded-md"
                  align="start"
                >
                  <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-[11px]  sm:text-[11px] md:text-[11px] lg:text-[11px] font-semibold">
                          {movementDetails.black[index]?.move}
                        </span>
                        <span
                          className={`rounded-2xl px-3 py-[4px] border border-input text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px] text-center font-normal py-2 ${getScoreClass(
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
                          className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px] px-2 ${getBadgeClass(
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
                    <span className="text-[11px] font-normal py-1">
                      This move deviates from opening principles. Focus on
                      development and center control.
                    </span>
                    <div className="flex flex-row gap-1">
                      <InfoIcon size={16} color="#3871EC" />
                      <span className="text-[11px]">Type:</span>
                      <span className="text-[11px] font-semibold ">
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
                    <span className="text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px]text-center font-semibold py-2">
                      {movementDetails.black[index]?.move}
                    </span>
                  </Button>
                </PopoverTrigger>
              </Popover>

              <span
                className={`text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px] text-center  ${
                  tabFocus == (move.gamePhase.toLowerCase()).replace(/ /g, '')
                    ? "font-bold"
                    : "font-normal"
                } py-2 ${getScoreClass(
                  movementDetails.black[index]?.classification
                )}`}
              >
                {movementDetails.black[index]?.evaluation}
              </span>
              <span
                className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-[11px] md:text-[11px] lg:text-[11px] ${getBadgeClass(
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
  );
}
