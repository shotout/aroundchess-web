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
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { useApiClient } from "@/functions/api-client";

export default function MovementTable() {
  const { isLoading } = useApiClient();
  const {
    dataAnalysis,
    historyGame = [],
  } = usePgnStore();

  const { chessMove, setChessMove } = useChessMoveStore();
  const { tabFocus } = useTabFocusStore();
  const { PieceChoosed } = useChessBoardThemeStore();

  const {
    summary,
    movementDetails: movementDetailsData,
  } = dataAnalysis ?? {};

  const movementDetails = movementDetailsData || { white: [], black: [] };
  const whiteMoves = Array.isArray(movementDetails.white)
    ? movementDetails.white
    : [];
  const blackMoves = Array.isArray(movementDetails.black)
    ? movementDetails.black
    : [];

  const whitePlayer =
    summary?.whiteSide?.profileInfo?.username || "Player 1";
  const blackPlayer =
    summary?.blackSide?.profileInfo?.username || "Player 2";

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
    if (!move) return;
    move.index = index;
    move.type = type;
    setChessMove(move);
  };

  if (
    isLoading ||
    !movementDetails ||
    (whiteMoves.length === 0 && blackMoves.length === 0)
  ) {
    return null;
  }

  return (
    <div className="hidden xl:block bg-white border border-[#749BBF] pb-2 rounded-sm">
      <div className="max-h-[496px] overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-[6%_47%_47%] text-center border-b border-b-[#749BBF] h-14 ">
          <div className="hidden sm:block sm:rounded-tl-sm bg-[#BDD0F9] border-r border-r-[#749BBF] py-2"></div>
          <span className="block text-[14px] --xs font-bold rounded-tl-sm sm:rounded-none bg-[#BDD0F9] border-r border-r-[#749BBF]  py-2">
            White{" "}
            <span className="block text-[14px] --xs font-light">
              ({whitePlayer})
            </span>
          </span>
          <span className="block text-[14px] --xs font-bold rounded-tr-sm bg-[#BDD0F9] py-2 ">
            Black{" "}
            <span className="block text-[14px] --xs font-light">
              ({blackPlayer})
            </span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-[6%_47%_47%]">
          <div className="hidden sm:block bg-[#BDD0F9] border-r border-r-[#749BBF] py-2"></div>
          <div className="grid grid-cols-[30%_30%_40%]  text-center border-b bg-[#BDD0F9]">
            {["Movement", "Advantage", "Classification"].map((header) => (
              <span
                key={header}
                className="text-[14px] --sm lg:text-[8px] py-2 font-semibold border-r border-r-[#749BBF] "
              >
                {header}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-[30%_30%_40%]  text-center border-b bg-[#BDD0F9]">
            {["Movement", "Advantage", "Classification"].map((header) => (
              <span
                key={header}
                className="text-[14px] --sm lg:text-[8px]  py-2 font-semibold border-r border-r-[#749BBF] "
              >
                {header}
              </span>
            ))}
          </div>
        </div>
        {whiteMoves.map((move: any, index: number) => {
          const blackMove = blackMoves[index];
          const whiteHistoryItem = historyGame[index * 2];
          const blackHistoryItem = historyGame[index * 2 + 1];

          return (
            <div
              key={index}
              className={`grid grid-cols-2 sm:grid-cols-[6%_47%_47%] divide-x border-b text-center ${
                index % 2 !== 0 ? "bg-[#EEFAFE]" : "bg-white"
              }`}
            >
              <span className="hidden sm:block text-[14px] --sm text-center font-semibold py-2 border-b border-b-[#749BBF]">
                {index + 1}
              </span>

              <div
                className={`grid grid-cols-[30%_30%_40%]  items-center h-10 border-b border-b-[#749BBF] ${
                  chessMove.move === move?.move &&
                  chessMove.moveNumber === move?.moveNumber
                    ? "bg-[#81CFF3]"
                    : index % 2 !== 0
                    ? "bg-[#EEFAFE]"
                    : "bg-white"
                }`}
              >
                {tabFocus === "middlegame" || tabFocus === "endgame" ? (
                  <Button
                    variant={"ghost"}
                    className="rounded-none hover:bg-[#81CFF3]"
                    onClick={() => handleOnClickMovement(move, index, "white")}
                  >
                    {whiteHistoryItem?.captured && (
                      <Image
                        key={`white-${index}`}
                        src={`/pieces/${PieceChoosed}/${
                          "w" + whiteHistoryItem.captured.toUpperCase()
                        }.png`}
                        alt="icon"
                        width={1000}
                        height={1000}
                        className="w-[12px] h-[12px] object-contain inline-block mr-1"
                      />
                    )}
                    <span className="text-[11px] text-center font-semibold py-2">
                      {move?.move || ""}
                    </span>
                  </Button>
                ) : (
                  <Popover>
                    <PopoverContent
                      className="w-auto p-0 bg-white rounded-md"
                      align="start"
                    >
                      <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                        <div className="flex flex-row items-center justify-between gap-2">
                          <div className="flex flex-row items-center gap-2">
                            <span className="text-[14px] --sm font-semibold">
                              {move?.move || ""}
                            </span>
                            <span
                              className={`rounded-2xl px-3 py-[4px] border border-input text-[14px] --sm text-center font-normal  ${getScoreClass(
                                move?.classification?.toLowerCase() || ""
                              )}`}
                            >
                              {move?.evaluation > 0 ? '+' : ''}{move?.evaluation || 0}
                            </span>
                          </div>
                          <div className="flex flex-row items-center gap-2">
                            <span
                              className={`mx-1 py-1 rounded-[4px] px-2 ${getBadgeClass(
                                move?.classification || ""
                              )}`}
                            >
                              {move?.classification || ""}
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
                        {move?.analysis && (
                          <span className="text-[14px] --sm text-left lg:text-md font-normal py-1">
                            {move.analysis}
                          </span>
                        )}
                        <div className="flex flex-row gap-1">
                          <InfoIcon size={16} color="#221AE9" />
                          <span className="text-[14px] --sm ">Type:</span>
                          <span className="text-[14px] --sm font-semibold ">
                            {move?.gamePhase || ""}
                          </span>
                        </div>
                      </div>
                    </PopoverContent>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className="rounded-none hover:bg-[#81CFF3]"
                        onClick={() =>
                          handleOnClickMovement(move, index, "white")
                        }
                      >
                        {whiteHistoryItem?.captured && (
                          <Image
                            key={`white-${index}`}
                            src={`/pieces/${PieceChoosed}/${
                              "w" + whiteHistoryItem.captured.toUpperCase()
                            }.png`}
                            alt="icon"
                            width={1000}
                            height={1000}
                            className="w-[12px] h-[12px] object-contain inline-block mr-1"
                          />
                        )}
                        <span className="text-[11px] text-center font-semibold py-2">
                          {move?.move || ""}
                        </span>
                      </Button>
                    </PopoverTrigger>
                  </Popover>
                )}

                <span
                  className={`text-[14px] --xs text-center py-2 ${getScoreClass(
                    move?.classification || ""
                  )}`}
                >
                  {move?.evaluation || ""}
                </span>
                <span
                  className={`mx-1 rounded-[4px] text-[11px]  ${getBadgeClass(
                    move?.classification || ""
                  )}`}
                >
                  {move?.classification || ""}
                </span>
              </div>

              <div
                className={`grid grid-cols-[30%_30%_40%]  items-center h-10 border-b border-b-[#749BBF] ${
                  blackMove &&
                  chessMove.move === blackMove?.move &&
                  chessMove.moveNumber === blackMove?.moveNumber
                    ? "bg-[#81CFF3]"
                    : index % 2 !== 0
                    ? "bg-[#EEFAFE]"
                    : "bg-white"
                }`}
              >
                {blackMove ? (
                  <>
                    {tabFocus === "middlegame" || tabFocus === "endgame" ? (
                      <Button
                        variant={"ghost"}
                        className="rounded-none hover:bg-[#81CFF3]"
                        onClick={() =>
                          handleOnClickMovement(blackMove, index, "black")
                        }
                      >
                        {blackHistoryItem?.captured && (
                          <Image
                            key={`black-${index}`}
                            src={`/pieces/${PieceChoosed}/${
                              "b" + blackHistoryItem.captured.toUpperCase()
                            }.png`}
                            alt="icon"
                            width={1000}
                            height={1000}
                            className="w-[12px] h-[12px] object-contain inline-block mr-1"
                          />
                        )}
                        <span className="text-[11px] text-center font-semibold py-2">
                          {blackMove.move || ""}
                        </span>
                      </Button>
                    ) : (
                      <Popover>
                        <PopoverContent
                          className="w-auto p-0 bg-white rounded-md"
                          align="start"
                        >
                          <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                            <div className="flex flex-row items-center justify-between gap-2">
                              <div className="flex flex-row items-center gap-2">
                                <span className="text-[14px] --sm font-semibold">
                                  {blackMove.move || ""}
                                </span>
                                <span
                                  className={`rounded-2xl px-3 py-[4px] border border-input text-[14px] --sm text-center font-normal py-2 ${getScoreClass(
                                    blackMove.classification?.toLowerCase() || ""
                                  )}`}
                                >
                                  {blackMove.evaluation || ""}
                                </span>
                              </div>
                              <div className="flex flex-row items-center gap-2">
                                <span
                                  className={`mx-1 py-1 rounded-[4px] text-[14px] --xs px-2 ${getBadgeClass(
                                    blackMove.classification || ""
                                  )}`}
                                >
                                  {blackMove.classification || ""}
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
                            {blackMove.analysis && (
                              <span className="text-[14px] --sm text-left lg:text-md font-normal py-1">
                                {blackMove.analysis}
                              </span>
                            )}
                            <div className="flex flex-row items-center gap-1">
                              <InfoIcon size={16} color="#221AE9" />
                              <span className="text-[14px] --sm">Type:</span>
                              <span className="text-[14px] --sm font-semibold ">
                                {blackMove.gamePhase || ""}
                              </span>
                            </div>
                          </div>
                        </PopoverContent>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"ghost"}
                            className="rounded-none hover:bg-[#81CFF3]"
                            onClick={() =>
                              handleOnClickMovement(blackMove, index, "black")
                            }
                          >
                            {blackHistoryItem?.captured && (
                              <Image
                                key={`black-${index}`}
                                src={`/pieces/${PieceChoosed}/${
                                  "b" + blackHistoryItem.captured.toUpperCase()
                                }.png`}
                                alt="icon"
                                width={1000}
                                height={1000}
                                className="w-[12px] h-[12px] object-contain inline-block mr-1"
                              />
                            )}
                            <span className="text-[11px] text-center font-semibold py-2">
                              {blackMove.move || ""}
                            </span>
                          </Button>
                        </PopoverTrigger>
                      </Popover>
                    )}

                    <span
                      className={`text-[11px] text-center py-2 ${getScoreClass(
                        blackMove.classification || ""
                      )}`}
                    >
                      {blackMove.evaluation || ""}
                    </span>
                    <span
                      className={`mx-1 rounded-[4px] text-[11px] ${getBadgeClass(
                        blackMove.classification || ""
                      )}`}
                    >
                      {blackMove.classification || ""}
                    </span>
                  </>
                ) : (
                  <>
                    <span></span>
                    <span></span>
                    <span></span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}