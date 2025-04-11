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
import { useEffect } from "react";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import DotSpinner from "../game-history/Spinner";
import { useApiClient } from "@/functions/api-client";
import PlayerInfo from "@/app/components/puzzle/PlayerInfo";

export default function MovementTable() {
  const { isLoading } = useApiClient();
  const {
    pgn: storePgn,
    dataAnalysis,
    capturedBlack,
    capturedWhite,
    movementDetails: logMovement,
    playerInfo,
  } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const { tabFocus, setTabFocus } = useTabFocusStore();
  const { PieceChoosed } = useChessBoardThemeStore();
  const { gameInfo, summary, movementDetails } = dataAnalysis ?? {};
  let blackPlayer =
    summary?.blackSide != null
      ? summary?.blackSide?.profileInfo
      : playerInfo?.black;
  let whitePlayer =
    summary?.whiteSide != null
      ? summary?.whiteSide?.profileInfo
      : playerInfo?.white;
  let dataMovement = movementDetails != null ? movementDetails : logMovement;
  useEffect(() => {
    console.log("movementDetails", movementDetails);
    console.log("logMovement", logMovement);
  }, []);
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
        return "border border-[#FFA459] text-[#B08503] bg-white";
      case "Mistake":
        return "border border-[#FFA459] text-[#B08503] bg-white";
      case "Inaccuracy":
        return "border border-[#FFA459] text-[#B08503] bg-white";
      default:
        return "border border-[#FFA459] text-[#B08503] bg-[white]";
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
  useEffect(() => {},[])
  if (isLoading|| dataMovement == null || blackPlayer==null ||whitePlayer == null) {
    return null;
  }
  return (
    <div className="hidden xl:block bg-white border border-[#749BBF] pb-2 rounded-sm">
      <div className="max-h-[496px] overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-[6%_47%_47%] text-center border-b border-b-[#749BBF] h-14 ">
          <div className="hidden sm:block sm:rounded-tl-sm bg-[#BDD0F9] border-r border-r-[#749BBF] py-2"></div>
          <span className="block text-xs font-bold rounded-tl-sm sm:rounded-none bg-[#BDD0F9] border-r border-r-[#749BBF]  py-2">
            White{" "}
            <span className="block text-xs font-light">
              ({whitePlayer.username})
            </span>
          </span>
          <span className="block text-xs font-bold rounded-tr-sm bg-[#BDD0F9] py-2 ">
            Black{" "}
            <span className="block text-xs font-light">
              ({blackPlayer.username})
            </span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-[6%_47%_47%]">
          <div className="hidden sm:block bg-[#BDD0F9] border-r border-r-[#749BBF] py-2"></div>
          <div className="grid grid-cols-[30%_30%_40%]  text-center border-b bg-[#BDD0F9]">
            {["Movement", "Advantage", "Classification"].map((header) => (
              <span
                key={header}
                className="text-sm lg:text-[8px] py-2 font-semibold border-r border-r-[#749BBF] "
              >
                {header}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-[30%_30%_40%]  text-center border-b bg-[#BDD0F9]">
            {["Movement", "Advantage", "Classification"].map((header) => (
              <span
                key={header}
                className="text-sm lg:text-[8px]  py-2 font-semibold border-r border-r-[#749BBF] "
              >
                {header}
              </span>
            ))}
          </div>
        </div>
        {dataMovement.white.map((move: any, index: number) => (
          <div
            key={index}
            className={`grid grid-cols-2 sm:grid-cols-[6%_47%_47%] divide-x border-b text-center ${
              index % 2 != 0 ? "bg-[#EEFAFE]" : "bg-white"
            }`}
          >
            <span className="hidden sm:block text-sm text-center font-semibold py-2 border-b border-b-[#749BBF]">
              {index + 1}
            </span>
            <div
              className={`grid grid-cols-[30%_30%_40%] flex items-center h-10 border-b border-b-[#749BBF] ${
                tabFocus == move.gamePhase.toLowerCase().replace(/ /g, "") ||
                chessMove.move == move.move
                  ? "bg-[#81CFF3]"
                  : index % 2 != 0
                  ? "bg-[#81]"
                  : "bg-white"
              }`}
            >
              <Popover>
                <PopoverContent
                  className="w-auto p-0 bg-white rounded-md"
                  align="start"
                >
                  <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-sm font-semibold">
                          {move.move}
                        </span>
                        <span
                          className={`rounded-2xl px-3 py-[4px] border border-input text-sm text-center font-normal py-2 ${getScoreClass(
                            move.classification.toLowerCase()
                          )}`}
                        >
                          {move.evaluation}
                        </span>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <span
                          className={`mx-1 py-1 rounded-[4px] px-2 ${getBadgeClass(
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
                      <span className="text-sm text-left lg:text-md font-normal py-1">
                        {move.analysis}
                      </span>
                    )}
                    <div className="flex flex-row gap-1">
                      <InfoIcon size={16} color="#221AE9" />
                      <span className="text-sm ">Type:</span>
                      <span className="text-sm font-semibold ">
                        {move.gamePhase}
                      </span>
                    </div>
                  </div>
                </PopoverContent>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="rounded-none hover:bg-[#81CFF3]"
                    onClick={() => handleOnClickMovement(move, index, "white")}
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
                            className="w-[12px] h-[12px] object-contain inline-block mr-[1px]"
                          />
                        );
                      })}
                    <span className="text-[11px] text-center font-semibold py-2">
                      {move.move}
                    </span>
                  </Button>
                </PopoverTrigger>
              </Popover>

              <span
                className={`text-xs text-center ${
                  tabFocus == move.gamePhase.toLowerCase().replace(/ /g, "") ||
                  chessMove.move == move.move
                    ? "font-bold"
                    : "font-normal"
                } py-2 ${getScoreClass(move.classification)}`}
              >
                {move.evaluation}
              </span>
              <span
                className={`mx-1 rounded-[4px] text-[11px]  ${getBadgeClass(
                  move.classification
                )}`}
              >
                {move.classification}
              </span>
            </div>
            <div
              className={`grid grid-cols-[30%_30%_40%] flex items-center h-10 border-b border-b-[#749BBF] ${
                tabFocus == move.gamePhase.toLowerCase().replace(/ /g, "") ||
                chessMove.move == dataMovement.black[index]?.move
                  ? "bg-[#81CFF3]"
                  : index % 2 != 0
                  ? "bg-[#81]"
                  : "bg-white"
              }`}
            >
              <Popover>
                <PopoverContent
                  className="w-auto p-0 bg-white rounded-md"
                  align="start"
                >
                  <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-[7px]  lg:text-[8px] font-semibold">
                          {dataMovement.black[index]?.move}
                        </span>
                        <span
                          className={`rounded-2xl px-3 py-[4px] border border-input text-sm text-center font-normal py-2 ${getScoreClass(
                            dataMovement.black[
                              index
                            ]?.classification.toLowerCase()
                          )}`}
                        >
                          {dataMovement.black[index]?.evaluation}
                        </span>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <span
                          className={`mx-1 py-1 rounded-[4px] text-xs px-2 ${getBadgeClass(
                            dataMovement.black[index]?.classification
                          )}`}
                        >
                          {dataMovement.black[index]?.classification}
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
                    {dataMovement.black[index]?.analysis && (
                      <span className="text-[7px] font-normal py-1">
                        {dataMovement.black[index]?.analysis}
                      </span>
                    )}
                    <div className="flex flex-row gap-1">
                      <InfoIcon size={16} color="#221AE9" />
                      <span className="text-[7px]">Type:</span>
                      <span className="text-[7px] font-semibold ">
                        {dataMovement.black[index]?.gamePhase}
                      </span>
                    </div>
                  </div>
                </PopoverContent>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="rounded-none hover:bg-[#81CFF3]"
                    onClick={() =>
                      handleOnClickMovement(
                        dataMovement.black[index],
                        index,
                        "black"
                      )
                    }
                  >
                    {capturedBlack
                      .filter((bp) => bp.san == dataMovement.black[index]?.move)
                      .map((item, index) => {
                        return (
                          <Image
                            key={index}
                            src={`/pieces/${PieceChoosed}/${item.captured}.png`}
                            alt="icon"
                            width={1000}
                            height={1000}
                            className="w-[12px] h-[12px] object-contain inline-block mr-[1px]"
                          />
                        );
                      })}
                    <span className="text-[11px] text-center font-semibold py-2">
                      {dataMovement.black[index]?.move}
                    </span>
                  </Button>
                </PopoverTrigger>
              </Popover>

              <span
                className={`text-[11px] text-center  ${
                  tabFocus == move.gamePhase.toLowerCase().replace(/ /g, "") ||
                  chessMove.move == move.move
                    ? "font-bold"
                    : "font-normal"
                } py-2 ${getScoreClass(
                  dataMovement.black[index]?.classification
                )}`}
              >
                {dataMovement.black[index]?.evaluation}
              </span>
              <span
                className={`mx-1 rounded-[4px] text-[11px] ${getBadgeClass(
                  dataMovement.black[index]?.classification
                )}`}
              >
                {dataMovement.black[index]?.classification}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
