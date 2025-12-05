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
    historyGame = [],
  } = usePgnStore();

  const { PieceChoosed } = useChessBoardThemeStore();
  const { chessMove, setChessMove } = useChessMoveStore();
  const {
    gameInfo,
    summary,
    movementDetails: movementDetailsData,
  } = dataAnalysis ?? {};

  // Safe access to movement details with defaults
  const movementDetails = movementDetailsData || { white: [], black: [] };

  // Canonical analysis sources: Middlegame/Endgame
  const middleGameBest =
    dataAnalysis?.middleGame?.bestMoves != null
      ? dataAnalysis?.middleGame?.bestMoves
      : [];
  const middleGameBad =
    dataAnalysis?.middleGame?.badMoves != null
      ? dataAnalysis?.middleGame?.badMoves
      : [];
  const endGameBest =
    dataAnalysis?.endGame?.bestMoves != null
      ? dataAnalysis?.endGame?.bestMoves
      : [];
  const endGameBad =
    dataAnalysis?.endGame?.badMoves != null
      ? dataAnalysis?.endGame?.badMoves
      : [];

  const getMoveInsight = (move: any) => {
    if (!move) return null;
    const candidates = [
      ...middleGameBest,
      ...middleGameBad,
      ...endGameBest,
      ...endGameBad,
    ];
    const found =
      candidates.find(
        (m: any) =>
          m?.moveNumber === move?.moveNumber && String(m?.move) === String(move?.move)
      ) || null;
    if (!found) return null;
    return {
      analysis: found.analysis,
      recommendation: found.recommendation,
      gamePhase: move?.gamePhase,
    };
  };

  useEffect(() => {
    console.log("movementDetails", movementDetails);
  }, [movementDetails]);

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
    // Enrich the selected move with analysis/recommendation from Middlegame/Endgame
    const insight = getMoveInsight(move);
    const enrichedMove = {
      ...move,
      ...(insight || {}),
      index,
      type,
    };
    setChessMove(enrichedMove);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-full xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto py-4 ">
        <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <div className="flex flex-row items-center gap-2 mb-2">
            <h2 className="text-[14px] --sm font-light">
              White Opening:{" "}
              <span className="font-bold">
                {gameInfo?.openings?.white?.name || "N/A"}
              </span>
            </h2>
          </div>
          <div className="flex flex-row items-center gap-2 mb-2">
            <h2 className="text-[14px] --sm font-light">
              Black Opening:{" "}
              <span className="font-bold text-decoration-underline">
                {gameInfo?.openings?.black?.name || "N/A"}
              </span>
            </h2>
          </div>
        </div>
        <div className="flex flex-col mt-4 bg-white border border-[#749BBF] pb-2 rounded-sm">
          <div className="flex grid grid-cols-2 sm:grid-cols-[6%_47%_47%] text-center border-b border-b-[#749BBF] h-14 ">
            <div className="hidden sm:block sm:rounded-tl-sm bg-[#BDD0F9] border-r border-r-[#749BBF] py-2"></div>
            <span className="block text-[14px] --sm font-bold rounded-tl-sm sm:rounded-none bg-[#BDD0F9] border-r border-r-[#749BBF]  py-2">
              White{" "}
              <span className="block text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-[14px] --sm font-light">
                ({summary?.whiteSide?.profileInfo?.username || "Player 1"})
              </span>
            </span>
            <span className="block text-[14px] --sm font-bold rounded-tr-sm bg-[#BDD0F9] py-2 ">
              Black{" "}
              <span className="block text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-[14px] --sm font-light">
                ({summary?.blackSide?.profileInfo?.username || "Player 2"})
              </span>
            </span>
          </div>
          <div className="flex grid grid-cols-2 sm:grid-cols-[6%_47%_47%]">
            <div className="hidden sm:block bg-[#BDD0F9] border-r border-r-[#749BBF] py-2"></div>
            <div className="grid grid-cols-3 text-center border-b bg-[#BDD0F9]">
              {["Movement", "Advantage", "Classification"].map((header) => (
                <span
                  key={header}
                  className="text-[9px] sm:text-[14px] --sm md:text-md lg:text-md xl:text-[14px] --sm py-2 font-semibold border-r border-r-[#749BBF] "
                >
                  {header}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 text-center border-b bg-[#BDD0F9]">
              {["Movement", "Advantage", "Classification"].map((header) => (
                <span
                  key={header}
                  className="text-[9px] sm:text-[14px] --sm md:text-md lg:text-md xl:text-[14px] --sm py-2 font-semibold border-r border-r-[#749BBF] "
                >
                  {header}
                </span>
              ))}
            </div>
          </div>

          {movementDetails.white &&
            movementDetails.white.map((move: any, index: number) => {
              const whiteInsight: any = getMoveInsight(move);
              const blackMove: any = movementDetails.black[index];
              const blackInsight: any = getMoveInsight(blackMove);
              const showWhiteTooltip =
                !!(whiteInsight && (whiteInsight.analysis || whiteInsight.recommendation));
              const showBlackTooltip =
                !!(blackInsight && (blackInsight.analysis || blackInsight.recommendation));
              return (
                <div
                  key={index}
                  className={`grid grid-cols-2 sm:grid-cols-[6%_47%_47%] divide-x border-b text-center ${
                    index % 2 != 0 ? "bg-[#EEFAFE]" : "bg-white"
                  }`}
                >
                  <span className="hidden sm:block text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md text-center font-semibold py-2 border-b border-b-[#749BBF]">
                    {index + 1}
                  </span>
                  <div
                    className={`grid grid-cols-3 flex items-center h-10 lg:h-14 border-b border-b-[#749BBF] hover:bg-[#81CFF390] ${
                      chessMove.move == move.move &&
                      chessMove.moveNumber == move.moveNumber &&
                      `bg-[#81CFF3] `
                    }`}
                  >
                    {showWhiteTooltip ? (
                      <Popover>
                        <PopoverContent
                          className="lg:hidden w-auto p-0"
                          align="start"
                        >
                          <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                            <div className="flex flex-row items-center justify-between gap-2">
                              <div className="flex flex-row items-center gap-2">
                                <span className="text-[14px] --xs  sm:text-[14px] --xs md:text-md lg:text-md xl:text-[14px] --sm font-semibold">
                                  {move.move}
                                </span>
                                <span
                                  className={`rounded-2xl px-3 py-[4px] border border-input text-[14px] --xs sm:text-[14px] --xs md:text-md lg:text-md xl:text-[14px] --sm text-center font-normal py-2 ${getScoreClass(
                                    move.classification?.toLowerCase() || ""
                                  )}`}
                                >
                                  {move.evaluation}
                                </span>
                              </div>
                              <div className="flex flex-row items-center gap-2">
                                <span
                                  className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-[14px] --xs md:text-[14px] --sm lg:text-md xl:text-[14px] --sm px-2 ${getBadgeClass(
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
                            {whiteInsight?.analysis && (
                              <span className="text-[14px] --xs font-normal py-1">
                                {whiteInsight.analysis}
                              </span>
                            )}
                            {whiteInsight?.recommendation && (
                              <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                                <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal text-primary">
                                  <span className="font-bold">Recommendation: </span>
                                  {whiteInsight.recommendation}
                                </span>
                              </div>
                            )}
                            <div className="flex flex-row gap-1">
                              <InfoIcon size={16} color="#221AE9" />
                              <span className="text-[14px] --xs">Type:</span>
                              <span className="text-[14px] --xs font-semibold ">
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
                            {historyGame[index * 2] &&
                              historyGame[index * 2].captured != null && (
                                <Image
                                  key={index}
                                  src={`/pieces/${PieceChoosed}/${
                                    "w" + historyGame[index * 2].captured.toUpperCase()
                                  }.png`}
                                  alt="icon"
                                  width={1000}
                                  height={1000}
                                  unoptimized
                                  className="w-[16px] h-[16px] object-contain inline-block mr-1"
                                />
                              )}
                            <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-[14px] --sm text-center font-semibold py-2">
                              {move.move}
                            </span>
                          </button>
                        </PopoverTrigger>
                      </Popover>
                    ) : (
                      <button
                        className="rounded-none"
                        onClick={() => handleOnClickMovement(move, index, "white")}
                      >
                        {historyGame[index * 2] &&
                          historyGame[index * 2].captured != null && (
                            <Image
                              key={index}
                              src={`/pieces/${PieceChoosed}/${
                                "w" + historyGame[index * 2].captured.toUpperCase()
                              }.png`}
                              alt="icon"
                              width={1000}
                              height={1000}
                              unoptimized
                              className="w-[16px] h-[16px] object-contain inline-block mr-1"
                            />
                          )}
                        <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-[14px] --sm text-center font-semibold py-2">
                          {move.move}
                        </span>
                      </button>
                    )}

                    <span
                      className={`text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-[14px] --sm text-center font-normal py-2 ${getScoreClass(
                        move.classification
                      )}`}
                    >
                      {move.evaluation}
                    </span>
                    <span
                      className={`mx-1 rounded-[4px] text-[11px] sm:text-[14px] --sm md:text-md lg:text-md xl:text-md ${getBadgeClass(
                        move.classification
                      )}`}
                    >
                      {move.classification}
                    </span>
                  </div>

                  {/* Black move column */}
                  <div
                    className={`grid grid-cols-3 flex items-center h-10 lg:h-14 border-b border-b-[#749BBF] hover:bg-[#81CFF390] ${
                      movementDetails.black[index] &&
                      chessMove.move == movementDetails.black[index]?.move &&
                      chessMove.moveNumber ==
                        movementDetails.black[index]?.moveNumber &&
                      `bg-[#81CFF3] `
                    }`}
                  >
                    {movementDetails.black[index] && (
                      <>
                        {showBlackTooltip ? (
                          <Popover>
                            <PopoverContent
                              className="lg:hidden w-auto p-0"
                              align="start"
                            >
                              <div className="max-w-[320px] flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                                <div className="flex flex-row items-center justify-between gap-2">
                                  <div className="flex flex-row items-center gap-2">
                                    <span className="text-[14px] --xs  sm:text-[14px] --xs md:text-md lg:text-md xl:text-[14px] --sm font-semibold">
                                      {movementDetails.black[index]?.move}
                                    </span>
                                    <span
                                      className={`rounded-2xl px-3 py-[4px] border border-input text-[14px] --xs sm:text-[14px] --xs md:text-md lg:text-md xl:text-[14px] --sm text-center font-normal py-2 ${getScoreClass(
                                        movementDetails.black[
                                          index
                                        ]?.classification?.toLowerCase() || ""
                                      )}`}
                                    >
                                      {movementDetails.black[index]?.evaluation}
                                    </span>
                                  </div>
                                  <div className="flex flex-row items-center gap-2">
                                    <span
                                      className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-[14px] --xs md:text-[14px] --sm lg:text-md xl:text-[14px] --sm px-2 ${getBadgeClass(
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
                                {blackInsight?.analysis && (
                                  <span className="text-[14px] --xs font-normal py-1">
                                    {blackInsight.analysis}
                                  </span>
                                )}
                                {blackInsight?.recommendation && (
                                  <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                                    <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal text-primary">
                                      <span className="font-bold">Recommendation: </span>
                                      {blackInsight.recommendation}
                                    </span>
                                  </div>
                                )}
                                <div className="flex flex-row gap-1">
                                  <InfoIcon size={16} color="#221AE9" />
                                  <span className="text-[14px] --xs">Type:</span>
                                  <span className="text-[14px] --xs font-semibold ">
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
                                {historyGame[index * 2 + 1] &&
                                  historyGame[index * 2 + 1].captured != null && (
                                    <Image
                                      key={index}
                                      src={`/pieces/${PieceChoosed}/${
                                        "b" + historyGame[index * 2 + 1].captured.toUpperCase()
                                      }.png`}
                                      alt="icon"
                                      width={1000}
                                      height={1000}
                                      unoptimized
                                      className="w-[16px] h-[16px] object-contain inline-block mr-1"
                                    />
                                  )}
                                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-mdtext-center font-semibold py-2">
                                  {movementDetails.black[index]?.move}
                                </span>
                              </button>
                            </PopoverTrigger>
                          </Popover>
                        ) : (
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
                            {historyGame[index * 2 + 1] &&
                              historyGame[index * 2 + 1].captured != null && (
                                <Image
                                  key={index}
                                  src={`/pieces/${PieceChoosed}/${
                                    "b" + historyGame[index * 2 + 1].captured.toUpperCase()
                                  }.png`}
                                  alt="icon"
                                  width={1000}
                                  height={1000}
                                  unoptimized
                                  className="w-[16px] h-[16px] object-contain inline-block mr-1"
                                />
                              )}
                            <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-mdtext-center font-semibold py-2">
                              {movementDetails.black[index]?.move}
                            </span>
                          </button>
                        )}

                        <span
                          className={`text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-mdtext-center font-normal py-2 ${getScoreClass(
                            movementDetails.black[index]?.classification
                          )}`}
                        >
                          {movementDetails.black[index]?.evaluation}
                        </span>
                        <span
                          className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-[14px] --sm md:text-md lg:text-md xl:text-md ${getBadgeClass(
                            movementDetails.black[index]?.classification
                          )}`}
                        >
                          {movementDetails.black[index]?.classification}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-[8px] md:gap-[16px] mt-4 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#221AE9] font-medium text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            <ArrowLeft color="#221AE9" className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
            Back: Summary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#e6f7fe] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next: Threats
            <ArrowRight color="#e6f7fe" className="ml-2 h-4 w-4 sm:h-6 w-6" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default MovementDetails;
