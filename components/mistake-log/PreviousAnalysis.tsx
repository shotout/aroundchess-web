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
import EmptyLog from "./EmptyLog";
import { useChessMoveStore } from "@/app/store/chessMoveStore";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "../game-history/Spinner";
import { Pagination } from "../pagination/pagination";
import { usePagination } from "../pagination/hook/usePagination";
interface PreviousAnalysisProps {
  reFetch: () => void;
}

const PreviousAnalysis: React.FC<PreviousAnalysisProps> = ({ reFetch }) => {
  const { chessMove, setChessMove } = useChessMoveStore();

  const {
    username,
    mistakeLogs,
    setMistakeLogs,
    movementDetails,
    setMovementDetails,
    playerInfo,
    setPlayerInfo,
    setPgn,
    pgn,
    titleGame,
    setTitleGame,
    savedMistakes,
    setSavedMistakes,
    previousAnalyses,
    setPreviousAnalyses,
    previousAnalysesDetail,
    setPreviousAnalysesDetail,
  } = usePgnStore();
  const {
    saveMistakeLog,
    getMistakeSaved,
    getMistakePrevious,
    unsaveMistakeLog,
    isLoading,
  } = useApiClient();
  const { currentData } = usePagination(previousAnalyses);

  const [indexOpen, setIndexOpen] = useState<string>("Threats");
  const [selectedMistakes, setSelectedMistakes] = useState<any>({});
  const [PreviousAnalysis, setPreviousAnalysis] = useState<any>(mistakeLogs);
  useEffect(() => {
    if (previousAnalyses.length > 0) {
      setSelectedMistakes(previousAnalyses[0]);
    }
  }, [previousAnalyses]);
  const handleOnClickMovement = (move: any) => {
    console.log("move", move);
    setChessMove(move);
  };
  const handleSaveLog = async (id: string) => {
    saveMistakeLog({ mistakeLogId: id }).then(async (res) => {
      console.log("handleSaveLog", res);
      reFetch();
    });
  };
  const handleUnsaveLog = async (id: string) => {
    unsaveMistakeLog({ mistakeLogId: id }).then(async (res) => {
      console.log("handleUnsaveLog", res);
      reFetch();
    });
  };

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
        return "text-[#FD0000]";
    }
  };
  const scrollToTop = () => {
    const isBrowser = () => typeof window !== "undefined";
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PreviousAnalysisCard = (data: any[], Type: string) => {
    return (
      <div className="flex flex-col border border-t-[4px] border-[#221AE9] rounded-[16px] p-[12px] lg:p-[16px]">
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
            <span className="text-[20px] font-semibold">{Type}</span>
          </div>
          <div
            onClick={
              Type == indexOpen
                ? () => {
                    setIndexOpen("");
                    scrollToTop();
                  }
                : () => {
                    setIndexOpen(Type);
                    scrollToTop();
                  }
            }
          >
            {Type == indexOpen ? (
              <ChevronUp size={24} color="black" />
            ) : (
              <ChevronDown size={24} color="black" />
            )}
          </div>
        </div>
        {Type == indexOpen &&
          data.map((item: any, key: number) => {
            return (
              <div
                key={key}
                className="flex flex-col gap-2 mt-4 cursor-pointer"
                onClick={() => {
                  handleOnClickMovement(item);
                  setSelectedMistakes(item);
                }}
              >
                <div className="flex flex-row gap-2 items-center">
                  <InfoIcon
                    className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] lg:w-[16px] lg:h-[16px]"
                    color="#221AE9"
                  />
                  <span className="text-[14px]">Game Phase:</span>
                  <span className="text-[14px] font-semibold">
                    {item?.gamePhase}
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
                      <span className="flex items-center text-[12px] font-normal min-h-[25px] sm:text-sm md:text-md lg:text-md font-normal border border-[#221AE9] rounded-[4px] py-[4px] px-[8px]">
                        Move {item?.moveNumber} :{" "}
                        <span className="font-normal sm:text-sm md:text-md lg:text-md ">
                          {" "}
                          {item?.move}
                        </span>
                      </span>
                      <span
                        className={`flex items-center rounded-full border border-[#DEDEDE] px-[8px] py-[4px] font-semibold text-xs sm:text-sm md:text-md lg:text-md text-center font-normal ${getScoreClass(
                          item?.classification
                        )}`}
                      >
                        {item?.evaluation}
                      </span>
                      <span
                        className={`flex items-center justify-center min-w-[72px] text-center px-[8px] py-[4px] rounded-[4px] text-sm sm:text-sm md:text-md lg:text-md  ${getBadgeClass(
                          item?.classification
                        )}`}
                      >
                        {item?.classification}
                      </span>
                    </div>
                    <div className="rounded-lg bg-[#E6F7FE] border border-[#C6EEFE] p-[10px] items-center font-semibold">
                      {item?.saved ? (
                        <BookmarkFilledIcon
                          onClick={() => handleUnsaveLog(item?.id)}
                          className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                          color="#221AE9"
                        />
                      ) : (
                        <Bookmark
                          onClick={() => handleSaveLog(item?.id)}
                          className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                          color="#221AE9"
                        />
                      )}
                    </div>
                  </div>
                  <span className="text-xs sm:text-md md:text-md lg:text-[14px] font-normal">
                    <span className="font-semibold">Analysis: </span>
                    {item?.analysis}
                  </span>
                  <div className="p-3 rounded-lg border border-blue-300 bg-gradient-to-r from-blue-50 to-white flex items-center space-x-2 mt-2">
                    <div className="flex flex-row items-start justify-start gap-2">
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
                          {" " + item?.recommendation}
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
                          <span className="line-clamp-2 block my-1 text-[#364152] font-light text-xs sm:text-[11px]">
                            {resource.link}
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
                                Visit {resource.source}
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
  };

  if (isLoading) {
    return <DotSpinner />;
  } else if (!PreviousAnalysis) {
    return (
      <EmptyLog
        title="You have not yet Analyses"
        content="Analyze Game now"
        noButton={true}
      />
    );
  }
  return (
    <div className="flex flex-col w-full justify-center gap-4 rounded-[8px] bg-white lg:justify-start xl:min-h-[100px] xl:max-h-[1000px] lg:overflow-auto">
      {PreviousAnalysis?.criticalMistakes &&
        PreviousAnalysis?.criticalMistakes.length == 0 &&
        PreviousAnalysis?.badMoves.length == 0 &&
        PreviousAnalysis?.threats.length == 0 &&
        PreviousAnalysis?.weaknessIdentification.length == 0 && (
          <EmptyLog
            title="You have not yet Analyses"
            content="Analyze Game now"
            noButton={true}
          />
        )}

      {PreviousAnalysis &&
        PreviousAnalysis?.criticalMistakes != null &&
        PreviousAnalysis?.criticalMistakes.length > 0 &&
        PreviousAnalysisCard(
          PreviousAnalysis?.criticalMistakes,
          "Critical Mistakes"
        )}
      {PreviousAnalysis &&
        PreviousAnalysis?.badMoves != null &&
        PreviousAnalysis?.badMoves.length > 0 &&
        PreviousAnalysisCard(PreviousAnalysis?.badMoves, "Bad Moves")}
      {PreviousAnalysis &&
        PreviousAnalysis?.threats != null &&
        PreviousAnalysis?.threats.length > 0 &&
        PreviousAnalysisCard(PreviousAnalysis?.threats, "Threats")}
      {PreviousAnalysis &&
        PreviousAnalysis?.weaknessIdentification != null &&
        PreviousAnalysis?.weaknessIdentification.length > 0 &&
        PreviousAnalysisCard(
          PreviousAnalysis?.weaknessIdentification,
          "Weakness Identification"
        )}
    </div>
  );
};

export default PreviousAnalysis;
