"use client";

import { useConfirmLogin } from "@/app/store/confirmLogin";
import { useProfileStore } from "@/app/store/profile";
import { FamousGameCard } from "@/components/famous-game-button";
import { CardPlayer } from "@/components/player/CardPlayer";
import { ArrowRight, ChevronDown, ChevronUp, Bookmark } from "lucide-react";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import { usePgnStore } from "../../app/store/zustandStore";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "../game-history/Spinner";
import { toast } from "sonner";

interface SummaryProps {
  next: () => void;
}

const Summary: React.FC<SummaryProps> = (props) => {
  const {
    pgn: storePgn,
    dataAnalysis,
    capturedWhite,
    capturedBlack,
    setSavedMistakes,
    mistakeLogs,
  } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();
  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();
  const { saveMistakeLog, unsaveMistakeLog, getMistakeSaved } = useApiClient();

  const [loadingToggle, setLoadingToggle] = useState<boolean>(false);
  const [localSummaryData, setLocalSummaryData] = useState<any>(null);

  useEffect(() => {
    const checkSession = () => {
      if (sessionId != "") {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    checkSession();
  }, [sessionId, isSignedIn]);

  // Helper function to find ID from mistakeLogs by matching move
  const findIdFromMistakeLogs = (move: string, moveNumber: number, category: string) => {
    if (!mistakeLogs || !mistakeLogs[category]) return null;

    const matchingItem = mistakeLogs[category].find(
      (item: any) => item.move === move && item.moveNumber === moveNumber
    );

    return matchingItem?.id || matchingItem?.mistakeLogId || matchingItem?._id;
  };

  // Initialize local data from dataAnalysis and merge with mistakeLogs IDs
  useEffect(() => {
    if (dataAnalysis?.summary) {
      const mergedData = { ...dataAnalysis.summary };

      // Merge criticalMistakes with IDs from mistakeLogs
      if (mergedData.criticalMistakes && Array.isArray(mergedData.criticalMistakes)) {
        mergedData.criticalMistakes = mergedData.criticalMistakes.map((item: any) => {
          const id = findIdFromMistakeLogs(item.move, item.moveNumber, "criticalMistakes");
          const mistakeLogItem = mistakeLogs?.criticalMistakes?.find(
            (logItem: any) => logItem.move === item.move && logItem.moveNumber === item.moveNumber
          );

          return {
            ...item,
            id: id,
            saved: mistakeLogItem?.saved || false,
          };
        });
      }

      // Merge bestMoves.middleGame with IDs from mistakeLogs
      if (mergedData.bestMoves?.middleGame && Array.isArray(mergedData.bestMoves.middleGame)) {
        mergedData.bestMoves.middleGame = mergedData.bestMoves.middleGame.map((item: any) => {
          // Check both in bestMoves and threats categories
          let id = findIdFromMistakeLogs(item.move, item.moveNumber, "bestMoves");
          if (!id) {
            id = findIdFromMistakeLogs(item.move, item.moveNumber, "threats");
          }

          const mistakeLogItem = mistakeLogs?.threats?.find(
            (logItem: any) => logItem.move === item.move && logItem.moveNumber === item.moveNumber
          );

          return {
            ...item,
            id: id,
            saved: mistakeLogItem?.saved || false,
          };
        });
      }

      setLocalSummaryData(mergedData);
    }
  }, [dataAnalysis, mistakeLogs]);

  const {
    whiteSide,
    blackSide,
    overallGameAssessment,
  } = dataAnalysis?.summary ?? {};

  // Use local state if available, fallback to dataAnalysis
  const bestMoves = localSummaryData?.bestMoves ?? dataAnalysis?.summary?.bestMoves;
  const criticalMistakes = localSummaryData?.criticalMistakes ?? dataAnalysis?.summary?.criticalMistakes;

  const { whiteWin, blackWin } = dataAnalysis?.gameInfo ?? {};
  const blackCountry = blackSide?.profileInfo?.chessAccountInfo?.country
    ? blackSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";

  const whiteCountry = whiteSide?.profileInfo?.chessAccountInfo?.country
    ? whiteSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";
  const [openBestMoves, setOpenBestMoves] = useState<boolean>(true);
  const [openCriticalMoves, setOpenCriticalMoves] = useState<boolean>(true);

  // Handle save log
  const handleSaveLog = async (id: string, arrayKey: string, index: number) => {
    setLoadingToggle(true);
    try {
      const res = await saveMistakeLog({ mistakeLogId: id });

      setLocalSummaryData((prev: any) => {
        if (!prev) return prev;

        // Handle nested keys like "bestMoves.middleGame"
        if (arrayKey.includes(".")) {
          const keys = arrayKey.split(".");
          const parentKey = keys[0];
          const childKey = keys[1];

          const prevList: any[] = Array.isArray(prev[parentKey]?.[childKey])
            ? prev[parentKey][childKey]
            : [];
          const updatedItem = {
            ...prevList[index],
            saved: true,
            savedDate: res?.data?.savedDate || new Date().toString(),
          };
          const newList = [...prevList];
          newList[index] = updatedItem;

          return {
            ...prev,
            [parentKey]: {
              ...prev[parentKey],
              [childKey]: newList,
            },
          };
        }

        // Handle direct keys like "criticalMistakes"
        const prevList: any[] = Array.isArray(prev[arrayKey]) ? prev[arrayKey] : [];
        const updatedItem = {
          ...prevList[index],
          saved: true,
          savedDate: res?.data?.savedDate || new Date().toString(),
        };
        const newList = [...prevList];
        newList[index] = updatedItem;
        return { ...prev, [arrayKey]: newList };
      });

      // Refresh saved mistakes
      const savedData = await getMistakeSaved({ page: 1, limit: 10 });
      setSavedMistakes(savedData.data);
      setLoadingToggle(false);
    } catch (e) {
      console.error(e);
      setLoadingToggle(false);
    }
  };

  // Handle unsave log
  const handleUnsaveLog = async (id: string, arrayKey: string, index: number) => {
    setLoadingToggle(true);
    try {
      const res = await unsaveMistakeLog({ mistakeLogId: id });

      setLocalSummaryData((prev: any) => {
        if (!prev) return prev;

        // Handle nested keys like "bestMoves.middleGame"
        if (arrayKey.includes(".")) {
          const keys = arrayKey.split(".");
          const parentKey = keys[0];
          const childKey = keys[1];

          const prevList: any[] = Array.isArray(prev[parentKey]?.[childKey])
            ? prev[parentKey][childKey]
            : [];
          const updatedItem = {
            ...prevList[index],
            saved: false,
            savedDate: null,
          };
          const newList = [...prevList];
          newList[index] = updatedItem;

          return {
            ...prev,
            [parentKey]: {
              ...prev[parentKey],
              [childKey]: newList,
            },
          };
        }

        // Handle direct keys like "criticalMistakes"
        const prevList: any[] = Array.isArray(prev[arrayKey]) ? prev[arrayKey] : [];
        const updatedItem = {
          ...prevList[index],
          saved: false,
          savedDate: null,
        };
        const newList = [...prevList];
        newList[index] = updatedItem;
        return { ...prev, [arrayKey]: newList };
      });

      // Refresh saved mistakes
      const savedData = await getMistakeSaved({ page: 1, limit: 10 });
      setSavedMistakes(savedData.data);
      setLoadingToggle(false);
    } catch (e) {
      console.error(e);
      setLoadingToggle(false);
    }
  };

  const handleOnClickMovement = (move: any) => {
    setChessMove(move);
  };
  return (
    <>
      <div className="flex flex-col justify-center gap-4 bg-white lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        <div className="flex flex-col gap-2 w-full py-2 border-b border-b-input">
          <span className="text-[14px] --xs sm:hidden text-center line-clamp-1">
            <span
              className={`text-[14px] --xs ${
                whiteWin ? `text-[#00B427]` : `text-black`
              } `}
            >
              {whiteSide?.profileInfo.username}
            </span>{" "}
            (White) vs{" "}
            <span
              className={`text-[14px] --xs ${
                blackWin ? `text-[#00B427]` : `text-black`
              }`}
            >
              {blackSide?.profileInfo.username}{" "}
            </span>
            (Black)
          </span>
          {isSignedIn ? (
            <div className="hidden sm:flex flex-row items-center justify-between gap-4">
              <CardPlayer
                isWin={whiteWin}
                profilePhoto={whiteSide?.profileInfo.photo}
                username={whiteSide?.profileInfo.username}
                country={whiteCountry}
                capturedPieces={capturedWhite}
              />

              <CardPlayer
                isWin={blackWin}
                profilePhoto={blackSide?.profileInfo.photo}
                username={blackSide?.profileInfo.username}
                country={blackCountry}
                capturedPieces={capturedBlack}
              />
            </div>
          ) : (
            <FamousGameCard />
          )}

          <div className="flex flex-row items-center justify-start py-2">
            <div
              className={`w-full xl:pr-3 rounded-md flex flex-row justify-end items-center`}
            >
              <div className="flex flex-col items-end justify-around gap-2">
                <div className="flex flex-row items-center justify-center min-w-[80px] xl:min-w-[132px] gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-semibold p-1">
                    Accuracy:
                  </span>
                  <span className="text-[14px] --xs min-w-[50px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-primary border border-primary rounded-sm p-1">
                    {whiteSide?.analysis?.accuracy}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-center min-w-[80px] xl:min-w-[132px] gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[182px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-semibold p-1">
                    Game Rating:
                  </span>
                  <span className="text-[14px] --xs min-w-[50px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#F65240] border border-[#F65240] bg-[#FFE5E2] rounded-sm p-1">
                    {whiteSide?.profileInfo.gameRating}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`w-full pl-2 flex flex-row justify-between items-center `}
            >
              <div className="flex flex-col items-start justify-center gap-2">
                <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-primary border border-primary rounded-sm p-1">
                  {blackSide?.analysis?.accuracy}
                </span>
                <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#F65240] border border-[#F65240] bg-[#FFE5E2] rounded-sm p-1">
                  {blackSide?.profileInfo.gameRating}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* move quality */}
        <div className="flex flex-col gap-2 w-full border-b border-b-input pb-2">
          <span className="text-[14px] --sm sm:text-[14px] --sm md:text-md lg:text-md font-semibold text-center">
            Move Quality
          </span>
          <div className="flex flex-row items-center justify-start py-2">
            <div
              className={`w-full pr-3 rounded-md flex flex-row justify-end items-center`}
            >
              <div className="flex flex-col items-end justify-around gap-2">
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-normal p-1">
                    Brilliant:
                  </span>
                  <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#27C2A3] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.brilliant}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-normal p-1">
                    Great:
                  </span>
                  <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#749BBF] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.great}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-normal p-1">
                    Best:
                  </span>
                  <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#80B64D] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.best}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-normal p-1">
                    Mistake:
                  </span>
                  <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#FFA459] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.mistake}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-normal p-1">
                    Miss:
                  </span>
                  <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#FF7769] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.miss}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-around gap-2 ">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-normal p-1">
                    Blunder:
                  </span>

                  <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#FF7769] p-1 min-w-[32px]">
                    {whiteSide?.analysis?.moveQuality.blunder}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 mt-1 sm:gap-3 sm:-mt-[8px] w-[40px]">
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/brilliant-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/great-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/best-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/mistake-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/miss-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  alt=""
                  src={"/icons/blunder-moves-icon.png"}
                  width={1000}
                  height={1000}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
            </div>
            <div className={`w-full pl-2 flex flex-row items-center`}>
              <div className="flex flex-col items-start justify-center gap-2">
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#27C2A3] p-1 min-w-[32px]">
                    {blackSide?.analysis?.moveQuality.brilliant}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <div className="flex flex-row items-center justify-around gap-2">
                    <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#749BBF] p-1 min-w-[32px]">
                      {blackSide?.analysis?.moveQuality.great}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <div className="flex flex-row items-center justify-around gap-2">
                    <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#80B64D] p-1 min-w-[32px]">
                      {blackSide?.analysis?.moveQuality.best}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-around gap-2">
                  <div className="flex flex-row items-center justify-around gap-2">
                    <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#FFA459] p-1 min-w-[32px]">
                      {blackSide?.analysis?.moveQuality.mistake}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-around gap-2">
                  <div className="flex flex-row items-center justify-around gap-2">
                    <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#FF7769] p-1 min-w-[32px]">
                      {blackSide?.analysis?.moveQuality.miss}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[44px] sm:text-[14px] --sm md:text-md lg:text-md text-center text-[#FF7769] p-1 min-w-[32px]">
                    {blackSide?.analysis?.moveQuality.blunder}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full border-b border-b-input pb-2">
          <div className="flex flex-row items-center justify-center gap-4">
            <div
              className={`w-full pr-3 rounded-md flex flex-row justify-end items-center`}
            >
              <div className="flex flex-col items-end justify-around gap-2 ">
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] text-center sm:text-[14px] --sm md:text-md lg:text-md text-right font-normal p-1 ">
                    Opening:
                  </span>
                  <div className="flex max-w-[44px] flex-col items-center w-16">
                    {whiteSide?.analysis?.opening && (
                      <Image
                        alt=""
                        src={`/icons/${whiteSide?.analysis?.opening.toLowerCase()}-moves-icon.png`}
                        width={1000}
                        height={1000}
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                      />
                    )}
                    <span className="text-[11px]  font-normal sm:text-[14px] --sm md:text-md lg:text-md text-center p-1">
                      {whiteSide?.analysis?.opening}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-normal p-1 ">
                    Middlegame:
                  </span>
                  <div className="flex max-w-[44px] flex-col items-center w-16">
                    {whiteSide?.analysis?.middleGame && (
                      <Image
                        alt=""
                        src={`/icons/${whiteSide?.analysis?.middleGame.toLowerCase()}-moves-icon.png`}
                        width={1000}
                        height={1000}
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                      />
                    )}
                    <span className="text-[11px]  font-normal sm:text-[14px] --sm md:text-md lg:text-md text-center p-1">
                      {whiteSide?.analysis?.middleGame}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-around gap-2">
                  <span className="text-[14px] --xs min-w-[40px] xl:min-w-[194px] sm:text-[14px] --sm md:text-md lg:text-md text-right font-normal p-1 ">
                    Endgame:
                  </span>
                  <div className="flex max-w-[44px] flex-col items-center w-16">
                    {whiteSide?.analysis?.endGame && (
                      <Image
                        alt=""
                        src={`/icons/${whiteSide?.analysis?.endGame.toLowerCase()}-moves-icon.png`}
                        width={1000}
                        height={1000}
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                      />
                    )}

                    <span className="text-[11px] font-normal sm:text-[14px] --sm md:text-md lg:text-md text-center p-1">
                      {whiteSide?.analysis?.endGame}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`w-full pl-2 flex flex-col items-start gap-2`}>
              <div className="flex flex-row items-center justify-around gap-2">
                <div className="flex max-w-[44px] flex-col items-center w-16">
                  {blackSide?.analysis?.opening && (
                    <Image
                      alt=""
                      src={`/icons/${blackSide?.analysis?.opening.toLowerCase()}-moves-icon.png`}
                      width={1000}
                      height={1000}
                      className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                    />
                  )}
                  <span className="text-[11px] font-normal sm:text-[14px] --sm md:text-md lg:text-md text-center p-1">
                    {blackSide?.analysis?.opening}
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-around gap-2">
                <div className="flex max-w-[44px] flex-col items-center w-16">
                  {blackSide?.analysis?.middleGame && (
                    <Image
                      alt=""
                      src={`/icons/${blackSide?.analysis?.middleGame.toLowerCase()}-moves-icon.png`}
                      width={1000}
                      height={1000}
                      className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                    />
                  )}
                  <span className="text-[11px] font-normal sm:text-[14px] --sm md:text-md lg:text-md text-center p-1">
                    {blackSide?.analysis?.middleGame}
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-around gap-2">
                <div className="flex max-w-[44px] flex-col items-center w-16">
                  {blackSide?.analysis?.endGame && (
                    <Image
                      alt=""
                      src={`/icons/${blackSide?.analysis?.endGame.toLowerCase()}-moves-icon.png`}
                      width={1000}
                      height={1000}
                      className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                    />
                  )}
                  <span className="text-[11px] font-normal sm:text-[14px] --sm md:text-md lg:text-md text-center p-1">
                    {blackSide?.analysis?.endGame}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* overall assessment */}
        <div className="border border-input sm:border-primary sm:border-t-4 rounded-md p-4">
          <span className="text-md sm:text-md md:text-lg lg:text-xl font-bold">
            Overall Game Assessment
          </span>
          <div className="flex items-center flex-row gap-2 mt-2">
            <Image
              alt=""
              src={"/icons/target.png"}
              width={1000}
              height={1000}
              className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
            />
            <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md font-light">
              Game Accuracy:
            </span>
            <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md font-bold">
              {overallGameAssessment?.gameAccuracy}
            </span>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal">
              {overallGameAssessment?.analysis}
            </span>
          </div>
        </div>
        
        {/* critical mistakes moves  */}
        <div className="border-t border-[#C0CED4] sm:border sm:border-primary sm:border-t-4 sm:rounded-md p-3">
          <div className="flex flex-row items-center gap-2">
            <Image
              alt=""
              src={"/icons/alert-triangle.png"}
              width={1000}
              height={1000}
              className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
            />
            <span className="text-md sm:text-md md:text-lg lg:text-xl font-bold w-full">
              Critical Mistakes
            </span>
            <div
              className="hidden sm:block"
              onClick={() => setOpenCriticalMoves(!openCriticalMoves)}
            >
              {openCriticalMoves ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>
          {openCriticalMoves &&
            criticalMistakes &&
            criticalMistakes.length > 0 &&
            criticalMistakes.slice(0, 5).map((item: any, index: number) => {
              return (
                <div className="flex flex-col gap-2 mt-2" key={index}>
                  <div
                    className={`border ${
                      chessMove.move == item.move
                        ? `border-2 border-[#221AE9] bg-[#221AE910]`
                        : `border-input`
                    } rounded-md p-4`}
                  >
                    <div className="flex flex-row justify-between gap-2 mb-2">
                      <span
                        onClick={() => handleOnClickMovement(item)}
                        className="flex items-center justify-center cursor-pointer text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] py-1 px-[14px]"
                      >
                        Move {item.moveNumber}: <span className="font-bold ml-1">{item.move}</span>
                      </span>

                      <div className="flex gap-[10px]">
                        <span className="flex items-center justify-center text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal text-[#FFA459] border border-[#FFA459] rounded-[4px] py-1 px-[14px]">
                          {item.type}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const mistakeId = item?.id || item?.mistakeLogId || item?._id;

                            if (!mistakeId) {
                              toast.error("Cannot save: Mistake log ID not found");
                              return;
                            }

                            if (item?.saved) {
                              handleUnsaveLog(mistakeId, "criticalMistakes", index);
                            } else {
                              handleSaveLog(mistakeId, "criticalMistakes", index);
                            }
                          }}
                          className="relative w-[36px] h-[36px] flex items-center justify-center bg-[#E6F7FE] border border-[#C6EEFE] shadow-[0px_0px_1px_2px_rgba(230,247,254,.2)] rounded-[8px] before:content-[''] before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:absolute before:top-[1px] before:left-[1px] before:shadow-inset before:rounded-[6px] before:shadow-[0px_0px_0px_1px_rgba(255,255,255,1)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-[6px] after:shadow-[inset_0px_-2px_2px_0px_rgba(141,215,246,1)]"
                        >
                          {loadingToggle ? (
                            <DotSpinner size={5} />
                          ) : item?.saved ? (
                            <BookmarkFilledIcon
                              className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                              color="#221AE9"
                            />
                          ) : (
                            <Bookmark
                              className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                              color="#221AE9"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                    {item.analysis && (
                      <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal">
                        {item.analysis}
                      </span>
                    )}
                    {item.solution && (
                      <div className="border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                        <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal text-primary">
                          <span className="font-bold">Recommendation: </span>
                          {item.solution}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* best moves  */}
        <div className="border-t border-[#C0CED4] sm:border sm:border-primary sm:border-t-4 sm:rounded-md p-3">
          <div className="flex flex-row items-center gap-2">
            <Image
              alt=""
              src={"/icons/check.png"}
              width={1000}
              height={1000}
              className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 lg:w-7 lg:h-7 object-contain"
            />
            <span className="text-md sm:text-md md:text-lg lg:text-xl font-bold w-full">
              Best Moves
            </span>

            <div
              className="hidden sm:block"
              onClick={() => setOpenBestMoves(!openBestMoves)}
            >
              {openBestMoves ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>
          {openBestMoves && (
            <div className="flex flex-col gap-2 mt-2">
              {bestMoves != null &&
                bestMoves.middleGame &&
                bestMoves.middleGame
                  .slice(0, 5)
                  .map((middle: any, i: number) => {
                    return (
                      <div
                        className={`border ${
                          chessMove.move == middle.move
                            ? `border-2 border-[#221AE9] bg-[#221AE910]`
                            : `border-input`
                        } rounded-md p-4`}
                        key={i}
                      >
                        <div className="flex flex-row justify-between gap-2 mb-2">
                          <span
                            onClick={() => handleOnClickMovement(middle)}
                            className="flex items-center justify-center cursor-pointer text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] py-1 px-[14px]"
                          >
                            Move {middle.moveNumber}: <span className="font-bold ml-1">{middle.move}</span>
                          </span>
                          <div className="flex gap-[10px]">
                            <span className="flex items-center justify-center text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal text-[#FFA459] border border-[#FFA459] rounded-[4px] py-1 px-[14px]">
                              {middle.classification}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const mistakeId = middle?.id || middle?.mistakeLogId || middle?._id;

                                if (!mistakeId) {
                                  console.error("No ID found for this item:", middle);
                                  return;
                                }

                                if (middle?.saved) {
                                  handleUnsaveLog(mistakeId, "bestMoves.middleGame", i);
                                } else {
                                  handleSaveLog(mistakeId, "bestMoves.middleGame", i);
                                }
                              }}
                              className="relative w-[36px] h-[36px] flex items-center justify-center bg-[#E6F7FE] border border-[#C6EEFE] shadow-[0px_0px_1px_2px_rgba(230,247,254,.2)] rounded-[8px] before:content-[''] before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:absolute before:top-[1px] before:left-[1px] before:shadow-inset before:rounded-[6px] before:shadow-[0px_0px_0px_1px_rgba(255,255,255,1)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-[6px] after:shadow-[inset_0px_-2px_2px_0px_rgba(141,215,246,1)]"
                            >
                              {loadingToggle ? (
                                <DotSpinner size={5} />
                              ) : middle?.saved ? (
                                <BookmarkFilledIcon
                                  className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                                  color="#221AE9"
                                />
                              ) : (
                                <Bookmark
                                  className="w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                                  color="#221AE9"
                                />
                              )}
                            </button>
                          </div>
                        </div>
                        <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-md font-normal">
                          {middle.analysis}
                        </span>
                        {middle.recommendation && (
                          <div className="border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
                            <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal text-primary">
                              <span className="font-bold">
                                Recommendation:{" "}
                              </span>
                              {middle.recommendation}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
            </div>
          )}
        </div>
        
      </div>

      <button
        onClick={isSignedIn ? props.next : () => setOpenConfirmLogin(true)}
        className="btn-primary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
      >
        <div className="flex flex-row items-center justify-center text-[#e6f7fe] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px] ">
          &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next: Movement Details
          <ArrowRight color="#e6f7fe" className="ml-2 h-4 sm:h-6 w-6" />
        </div>
      </button>
    </>
  );
};

export default Summary;
