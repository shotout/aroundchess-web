"use client";

import { Bookmark, InfoIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import EmptyLog from "./EmptyLog";
import { useApiClient } from "@/functions/api-client";
import { useChessMoveStore } from "@/app/store/chessMoveStore";
import DotSpinner from "../game-history/Spinner";
import { Pagination } from "../pagination/pagination";
import { usePagination } from "../pagination/hook/usePagination";
import { sha256Hex } from "@/functions/sha256";
import { enrichMistakeLogsWithAnalyzeSections } from "./utils";

interface savedProps {
  onClickSeePrevious?: () => void;
}

const SavedMistakes: React.FC<savedProps> = ({ onClickSeePrevious }) => {
  const { chessMove, setChessMove } = useChessMoveStore();
  const {
    mistakeLogs,
    movementDetails,
    playerInfo,
    setPgn,
    titleGame,
    savedMistakes,
    setSavedMistakes,
    setPreviousAnalysesDetail,
  } = usePgnStore();
  
  const { unsaveMistakeLog, getAnalysisByPgnHash } = useApiClient();
  const { currentData } = usePagination(savedMistakes);
  const [loadingUnsave, setLoadingUnsave] = useState<boolean>(false);
  const [selectedMistakes, setSelectedMistakes] = useState<any>({});
  const [sectionsByHash, setSectionsByHash] = useState<Record<string, any>>({});

  useEffect(() => {
    if (savedMistakes.length > 0) {
      // Keep selectedMistakes consistently as an object with an id
      setSelectedMistakes(savedMistakes[0]?.mistakeLog);
    }
  }, [savedMistakes]);

  // Prefetch Analyze Game sections for items on current page
  useEffect(() => {
    const doFetch = async () => {
      try {
        const pgns = Array.from(
          new Set(currentData.map((it: any) => it.pgn).filter(Boolean))
        );
        const entries = await Promise.all(
          pgns.map(async (pgn: string) => {
            const hash = await sha256Hex(pgn);
            const res = await getAnalysisByPgnHash(hash);
            return [
              hash,
              {
                threats: res?.data?.threats || [],
                middleGame: res?.data?.middleGame || { badMoves: [] },
                endGame: res?.data?.endGame || { badMoves: [] },
              },
            ] as const;
          })
        );
        const map: Record<string, any> = {};
        entries.forEach(([h, s]) => (map[h] = s));
        setSectionsByHash(map);
      } catch {}
    };
    if (currentData.length > 0) {
      doFetch();
    }
  }, [currentData, getAnalysisByPgnHash]);

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
        return "text-[#E22B32]";
      case "Blunder":
        return "text-[#E22B32]";
      case "Mistake":
        return "text-[#E22B32]";
      default:
        return "text-[#E22B32]";
    }
  };

  const buildDisplayMistakeLog = (item: any) => {
    const moveItem = item?.mistakeLog;
    if (!moveItem) return null;
    // Hide Opening phase entirely
    if (moveItem?.gamePhase === "Opening") return null;
    const pgn = item?.pgn || "";
    const hash = (item as any).__hash as string | undefined;
    const sections =
      (hash && sectionsByHash[hash]) || undefined;
    if (!sections) return { ...moveItem, analysis: "-", recommendation: "-" };
    const enriched = enrichMistakeLogsWithAnalyzeSections(
      {
        criticalMistakes: [],
        weaknessIdentification: [],
        badMoves: moveItem?.type === "Threats" ? [] : [moveItem],
        threats: moveItem?.type === "Threats" ? [moveItem] : [],
      },
      sections
    );
    const merged =
      (enriched.threats && enriched.threats[0]) ||
      (enriched.badMoves && enriched.badMoves[0]) ||
      (enriched.criticalMistakes && enriched.criticalMistakes[0]) ||
      (enriched.weaknessIdentification && enriched.weaknessIdentification[0]) ||
      null;
    return merged;
  };

  // Attach hashes to current page items for quick lookup
  useEffect(() => {
    (async () => {
      const promises = currentData.map(async (it: any) => {
        if (!it.__hash) {
          it.__hash = await sha256Hex(it.pgn || "");
        }
      });
      await Promise.all(promises);
      setSectionsByHash((m) => ({ ...m }));
    })();
  }, [currentData]);

  const handleUnsaveLog = async (id: string) => {
    setLoadingUnsave(true);
    try {
      await unsaveMistakeLog({ mistakeLogId: id });
      const updatedData = savedMistakes.filter((item) => item.mistakeLog.id !== id);
      setSavedMistakes(updatedData);
    } catch (error) {
      
    } finally {
      setLoadingUnsave(false);
    }
  };

  const handleOnClickMovement = (move: any) => {
    if (move.move == chessMove.move) {
      setChessMove({});
      setSelectedMistakes({});
    } else {
      setChessMove(move);
      setSelectedMistakes(move);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full justify-center gap-4 rounded-[8px] bg-white lg:justify-start xl:min-h-[100px] xl:max-h-[1000px] lg:overflow-auto">
        {currentData.length == 0 && (
          <EmptyLog onClickSeePrevious={onClickSeePrevious} />
        )}

        {currentData.length > 0 &&
          currentData.map((item: any, index: number) => {
            const display = buildDisplayMistakeLog(item);
            if (!display) return null;
            return (
              <div
                key={index}
                className="flex flex-col gap-2 lg:mt-2 cursor-pointer"
                onClick={() => {
                  handleOnClickMovement(display);
                  setPreviousAnalysesDetail(item);
                  setPgn(item.pgn);
                }}
              >
                <div
                  className={`border ${
                    selectedMistakes.id == item.mistakeLog?.id
                      ? `border-[#221AE9] border-2 bg-[#221AE910]`
                      : `border-input`
                  } rounded-md p-2 lg:p-4`}
                >
                  <div className="flex flex-row justify-between items-center gap-2 mb-4">
                    <div className="flex rounded-full max-h-[28px] bg-[#25CEDA] lg:py-1 px-3 justify-center items-center font-medium text-xs lg:text-[14px]">
                      {item.title}
                    </div>
                    <div
                      onClick={() => handleUnsaveLog(item.mistakeLog.id)}
                      className="rounded-lg bg-[#E6F7FE] border border-[#C6EEFE] p-[10px] items-center font-semibold"
                    >
                      {loadingUnsave ? (
                        <DotSpinner size={5} />
                      ) : (
                        <BookmarkFilledIcon
                          className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                          color="#221AE9"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between gap-2 mb-1 lg:mb-4">
                    <div className="flex flex-row items-center gap-3 mb-2 sm:mb-0">
                      <div className="flex flex-row items-center gap-1">
                        <Image
                          alt=""
                          src={"/icons/alert-triangle.png"}
                          width={1000}
                          height={1000}
                          className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] lg:w-[18px] lg:h-[18px]"
                        />
                        <div className="flex flex-col">
                          <span className="text-[14px] --">Mistake Type:</span>
                          <span className="text-[14px] -- font-semibold">
                            {item?.mistakeLog.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-1">
                        <InfoIcon
                          className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] lg:w-[18px] lg:h-[18px]"
                          color="#221AE9"
                        />
                        <div className="flex flex-col">
                          <span className="text-[14px] --">Game Phase:</span>
                          <span className="text-[14px] -- font-semibold">
                            {item?.mistakeLog.gamePhase}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center lg:justify-start gap-3">
                      <span className="flex items-center text-[14px] -- font-normal min-h-[25px] sm:text-sm md:text-md lg:text-md font-normal border border-[#221AE9] rounded-[4px] py-[4px] px-[8px]">
                        Move {item?.mistakeLog.moveNumber} :{" "}
                        <span className="font-normal sm:text-sm md:text-md lg:text-md ">
                          {" "}
                          {item?.mistakeLog.move}
                        </span>
                      </span>
                      <span
                        className={`flex items-center rounded-full border border-[#DEDEDE] px-[8px] py-[4px] font-semibold text-xs sm:text-sm md:text-md lg:text-md text-center font-normal ${getScoreClass(
                          item?.mistakeLog.classification
                        )}`}
                      >
                        {item?.mistakeLog.evaluation}
                      </span>
                      <span
                        className={`flex items-center justify-center min-w-[72px] text-center px-[8px] py-[4px] rounded-[4px] text-sm sm:text-sm md:text-md lg:text-md  ${getBadgeClass(
                          item?.mistakeLog.classification
                        )}`}
                      >
                        {item?.mistakeLog.classification}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs sm:text-md md:text-md lg:text-[14px] font-normal">
                    <span className="font-semibold">Analysis: </span>
                    {display?.analysis ?? ""}
                  </span>
                  <div className="p-3 rounded-lg border border-blue-300 bg-gradient-to-r from-blue-50 to-white flex items-center space-x-2 mt-2">
                    <div className="flex flex-row items-center justify-start gap-2 w-full">
                      <Image
                        alt=""
                        src={"/icons/recommended-training-icon.png"}
                        width={1000}
                        height={1000}
                        className="w-6 h-6 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8"
                      />
                      <span className="text-xs sm:text-sm md:text-md lg:text-md xl:text-md font-normal text-[#221AE9] truncate whitespace-nowrap flex-1">
                        <span className="font-bold">
                          {display?.recommendation ?? ""}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {currentData.length > 0 && <Pagination data={currentData} />}
    </>
  );
};

export default SavedMistakes;