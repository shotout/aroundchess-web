"use client";

import { Bookmark, ChevronDown, ChevronUp, InfoIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import EmptyLog from "./EmptyLog";
import { useChessMoveStore } from "@/app/store/chessMoveStore";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "../game-history/Spinner";
import NoData from "../NoData/NoData";

const PreviousAnalysis: React.FC = () => {
  const { chessMove, setChessMove } = useChessMoveStore();
  const { mistakeLogs, previousAnalyses } = usePgnStore();
  const { saveMistakeLog, unsaveMistakeLog } = useApiClient();

  const [loadingToggle, setLoadingToggle] = useState<boolean>(false);
  const [indexOpen, setIndexOpen] = useState<string[]>(["Critical Mistakes"]);
  const [selectedMistakes, setSelectedMistakes] = useState<any>({});
  const [PreviousAnalysis, setPreviousAnalysis] = useState<any>(mistakeLogs);

  useEffect(() => {
    setPreviousAnalysis(mistakeLogs);
  }, [mistakeLogs]);

  useEffect(() => {
    const openSections: string[] = [];
    if (PreviousAnalysis["criticalMistakes"]?.length > 0) {
      openSections.push("Critical Mistakes");
    }
    if (PreviousAnalysis["badMoves"]?.length > 0) {
      openSections.push("Bad Moves");
    }
    if (PreviousAnalysis["threats"]?.length > 0) {
      openSections.push("Threats");
    }
    if (PreviousAnalysis["weaknessIdentification"]?.length > 0) {
      openSections.push("Weakness Identification");
    }

    if (openSections.length > 0) {
      setIndexOpen(openSections);
    }

    if (previousAnalyses.length > 0) {
      setSelectedMistakes(previousAnalyses[0]);
    }
  }, [previousAnalyses, chessMove]);

  const handleOnClickMovement = (move: any) => {
    if (move.move == chessMove.move) {
      setChessMove({});
      setSelectedMistakes({});
    } else {
      setChessMove(move);
      setSelectedMistakes(move);
    }
  };

  const handleSaveLog = async (id: string, key: string) => {
    setLoadingToggle(true);
    try {
      const res = await saveMistakeLog({ mistakeLogId: id });
      let dataPrev = PreviousAnalysis;
      let newData = dataPrev[key].filter((item: any) => item.id != id);
      newData.push(res.data);
      dataPrev[key] = newData;
      setPreviousAnalysis(dataPrev);
    } catch (e) {
      
    } finally {
      setLoadingToggle(false);
    }
  };

  const handleUnsaveLog = async (id: string, key: string) => {
    setLoadingToggle(true);
    try {
      const res = await unsaveMistakeLog({ mistakeLogId: id });
      let dataPrev = PreviousAnalysis;
      let newData = dataPrev[key].filter((item: any) => item.id != id);
      newData.push(res.data);
      dataPrev[key] = newData;
      setPreviousAnalysis(dataPrev);
    } catch (e) {
      
    } finally {
      setLoadingToggle(false);
    }
  };

  const toggleSection = (type: string) => {
    if (indexOpen.includes(type)) {
      setIndexOpen(indexOpen.filter((section) => section !== type));
    } else {
      setIndexOpen([...indexOpen, type]);
    }
    scrollToTop();
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

  const PreviousAnalysisCard = (data: any[], Type: string, keyObj: string) => {
    return (
      <div className="flex flex-col border border-t-[4px] border-[#221AE9] rounded-[16px] p-[12px] lg:p-[16px]">
        <div
          onClick={() => toggleSection(Type)}
          className="cursor-pointer flex flex-row justify-between items-center gap-2"
        >
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
          <div onClick={() => toggleSection(Type)}>
            {indexOpen.includes(Type) ? (
              <ChevronUp size={24} color="black" />
            ) : (
              <ChevronDown size={24} color="black" />
            )}
          </div>
        </div>
        {indexOpen.includes(Type) && data.length == 0 ? (
          <NoData />
        ) : (
          indexOpen.includes(Type) &&
          data.map((item: any, key: number) => {
            return (
              <div
                key={key}
                className="flex flex-col gap-2 mt-4 cursor-pointer"
                onClick={() => {
                  handleOnClickMovement(item);
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
                      ? `border-[#221AE9] border-2 bg-[#221AE910]`
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
                      {loadingToggle ? (
                        <DotSpinner size={5} />
                      ) : (
                        <>
                          {item?.saved ? (
                            <BookmarkFilledIcon
                              onClick={() => handleUnsaveLog(item?.id, keyObj)}
                              className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                              color="#221AE9"
                            />
                          ) : (
                            <Bookmark
                              onClick={() => handleSaveLog(item?.id, keyObj)}
                              className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                              color="#221AE9"
                            />
                          )}
                        </>
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
                      <span className="font-normal text-xs sm:text-sm md:text-md lg:text-md xl:text-md  text-[#221AE9]">
                        <span className="font-bold">
                          {item?.recommendation}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  if (previousAnalyses.length==0) {
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
        PreviousAnalysisCard(
          PreviousAnalysis?.criticalMistakes,
          "Critical Mistakes",
          "criticalMistakes"
        )}
      {PreviousAnalysis &&
        PreviousAnalysis?.badMoves != null &&
        PreviousAnalysisCard(
          PreviousAnalysis?.badMoves,
          "Bad Moves",
          "badMoves"
        )}
      {PreviousAnalysis &&
        PreviousAnalysis?.threats != null &&
        PreviousAnalysisCard(PreviousAnalysis?.threats, "Threats", "threats")}
      {PreviousAnalysis &&
        PreviousAnalysis?.weaknessIdentification != null &&
        PreviousAnalysisCard(
          PreviousAnalysis?.weaknessIdentification,
          "Weakness Identification",
          "weaknessIdentification"
        )}
    </div>
  );
};

export default PreviousAnalysis;