"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  InfoIcon,
  Bookmark,
} from "lucide-react";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePgnStore } from "../../app/store/zustandStore";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import NoData from "@/components/NoData/NoData";
import { useChessBoardThemeStore } from "../../app/store/chessBoardTheme";
import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { useConfirmLogin } from "@/app/store/confirmLogin";
import DotSpinner from "../game-history/Spinner";
import { toast } from "sonner";

interface MiddleGameProps {
  next: () => void;
  prev: () => void;
}

const MiddleGame: React.FC<MiddleGameProps> = (props) => {
  const { dataAnalysis, capturedWhite, mistakeLogs, setSavedMistakes } = usePgnStore();
  const { chessMove, setChessMove } = useChessMoveStore();
  const { PieceChoosed } = useChessBoardThemeStore();
  const { sessionId } = useProfileStore();
  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();
  const { saveMistakeLog, unsaveMistakeLog, getMistakeSaved } = useApiClient();

  const [openBestMoves, setOpenBestMoves] = useState<boolean>(true);
  const [openBadMove, setopenBadMove] = useState<boolean>(true);
  const [showAllBestMoves, setShowAllBestMoves] = useState<boolean>(false);
  const [showAllBadMoves, setShowAllBadMoves] = useState<boolean>(false);
  const [loadingToggle, setLoadingToggle] = useState<string | null>(null);
  const [localBestMoves, setLocalBestMoves] = useState<any[]>([]);
  const [localBadMoves, setLocalBadMoves] = useState<any[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const ITEMS_TO_SHOW = 5;

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

  // Helper function to find ID from mistakeLogs
  const findIdFromMistakeLogs = (move: string, moveNumber: number, category: string) => {
    if (!mistakeLogs) return null;

    const categoryData = (mistakeLogs as any)[category];
    if (!categoryData) return null;

    const matchingItem = categoryData.find(
      (item: any) => item.move === move && item.moveNumber === moveNumber
    );

    return matchingItem?.id || matchingItem?.mistakeLogId || matchingItem?._id;
  };

  // Initialize local data from dataAnalysis and merge with mistakeLogs IDs
  useEffect(() => {
    if (dataAnalysis?.middleGame) {
      const middleGameData = dataAnalysis.middleGame;

      // Merge bestMoves
      if (middleGameData.bestMoves && Array.isArray(middleGameData.bestMoves)) {
        const mergedBestMoves = middleGameData.bestMoves.map((item: any) => {
          const id = findIdFromMistakeLogs(item.move, item.moveNumber, "bestMoves");
          const mistakeLogItem = mistakeLogs?.bestMoves?.find(
            (logItem: any) => logItem.move === item.move && logItem.moveNumber === item.moveNumber
          );

          return {
            ...item,
            id: id,
            saved: mistakeLogItem?.saved || false,
          };
        });
        setLocalBestMoves(mergedBestMoves);
      }

      // Merge badMoves
      if (middleGameData.badMoves && Array.isArray(middleGameData.badMoves)) {
        const mergedBadMoves = middleGameData.badMoves.map((item: any) => {
          const id = findIdFromMistakeLogs(item.move, item.moveNumber, "badMoves");
          const mistakeLogItem = mistakeLogs?.badMoves?.find(
            (logItem: any) => logItem.move === item.move && logItem.moveNumber === item.moveNumber
          );

          return {
            ...item,
            id: id,
            saved: mistakeLogItem?.saved || false,
          };
        });
        setLocalBadMoves(mergedBadMoves);
      }
    }
  }, [dataAnalysis, mistakeLogs]);

  // Handle save log
  const handleSaveLog = async (id: string, arrayType: 'bestMoves' | 'badMoves', index: number) => {
    if (loadingToggle) return;

    setLoadingToggle(id);
    try {
      const res = await saveMistakeLog({ mistakeLogId: id });

      if (arrayType === 'bestMoves') {
        setLocalBestMoves((prev: any[]) => {
          const newList = [...prev];
          newList[index] = {
            ...newList[index],
            saved: true,
            savedDate: res?.data?.savedDate || new Date().toString(),
          };
          return newList;
        });
      } else {
        setLocalBadMoves((prev: any[]) => {
          const newList = [...prev];
          newList[index] = {
            ...newList[index],
            saved: true,
            savedDate: res?.data?.savedDate || new Date().toString(),
          };
          return newList;
        });
      }

      // Refresh saved mistakes
      const savedData = await getMistakeSaved({ page: 1, limit: 10 });
      if (savedData?.data && Array.isArray(savedData.data)) {
        setSavedMistakes(savedData.data);
      }
      setLoadingToggle(null);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save bookmark");
      setLoadingToggle(null);
    }
  };

  // Handle unsave log
  const handleUnsaveLog = async (id: string, arrayType: 'bestMoves' | 'badMoves', index: number) => {
    if (loadingToggle) return;

    setLoadingToggle(id);
    try {
      const res = await unsaveMistakeLog({ mistakeLogId: id });

      if (arrayType === 'bestMoves') {
        setLocalBestMoves((prev: any[]) => {
          const newList = [...prev];
          newList[index] = {
            ...newList[index],
            saved: false,
            savedDate: null,
          };
          return newList;
        });
      } else {
        setLocalBadMoves((prev: any[]) => {
          const newList = [...prev];
          newList[index] = {
            ...newList[index],
            saved: false,
            savedDate: null,
          };
          return newList;
        });
      }

      // Refresh saved mistakes
      const savedData = await getMistakeSaved({ page: 1, limit: 10 });
      if (savedData?.data && Array.isArray(savedData.data)) {
        setSavedMistakes(savedData.data);
      }
      setLoadingToggle(null);
    } catch (e: any) {
      toast.error(e?.message || "Failed to remove bookmark");
      setLoadingToggle(null);
    }
  };

  // Use local data if available, fallback to dataAnalysis
  const bestMoves = localBestMoves.length > 0 ? localBestMoves : (dataAnalysis?.middleGame?.bestMoves ?? []);
  const badMoves = localBadMoves.length > 0 ? localBadMoves : (dataAnalysis?.middleGame?.badMoves ?? []);

  useEffect(() => {
    // Data analysis middleGame initialized
  }, [dataAnalysis]);

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
        return "text-[#364152]";
    }
  };

  const handleOnClickMovement = (move: any) => {
    // Determine player color based on moveNumber
    const movementDetails = dataAnalysis?.movementDetails;

    let playerType = "white"; // default

    if (movementDetails) {
      // Check if the move exists in white's moves
      const whiteMove = movementDetails.white?.find(
        (m: any) => m.moveNumber === move.moveNumber && m.move === move.move
      );

      // Check if the move exists in black's moves
      const blackMove = movementDetails.black?.find(
        (m: any) => m.moveNumber === move.moveNumber && m.move === move.move
      );

      if (blackMove) {
        playerType = "black";
      } else if (whiteMove) {
        playerType = "white";
      }
    }

    // Enrich the move object with the player type
    const enrichedMove = {
      ...move,
      type: playerType,
    };

    setChessMove(enrichedMove);
  };

  const renderMoveAnalysis = (item: any) => (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] --sm sm:text-md md:text-md lg:text-md font-normal">
        <span className="font-bold">Analysis: </span>
        {item.analysis}
      </span>
      {item.recommendation && (
        <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
          <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal text-primary">
            <span className="font-bold">Recommendation: </span>
            {item.recommendation}
          </span>
        </div>
      )}
      {item.explanation && (
        <div className="border-l border-l-4 bg-[#F6F9FF] flex items-center border-primary rounded-md p-2 py-4 mt-2">
          <span className="text-[14px] --10px sm:text-[14px] --sm md:text-md lg:text-[14px] --sm font-normal text-primary">
            <span className="font-bold">Recommendation: </span>
            {item.explanation}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="flex flex-col justify-center gap-4 bg-white lg:justify-start xl:max-h-[800px] xl:min-h-[800px] lg:overflow-auto">
        <div className="border-t border-[#C0CED4] sm:border sm:border-primary sm:border-t-4 sm:rounded-md md:p-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Image
                alt=""
                src={"/icons/check.png"}
                width={1000}
                height={1000}
                className="w-[18px] h-[18px] sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px]"
              />
              <span className="text-md sm:text-lg md:text-xl lg:text-xl font-bold w-full">
                Best Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#221AE9" />
                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md">
                  Type:
                </span>
                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md font-semibold">
                  Middlegame
                </span>
              </div>
            </div>
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
          {bestMoves && bestMoves.length === 0 && <NoData />}
          {openBestMoves && bestMoves && (
            <>
              {(showAllBestMoves
                ? bestMoves
                : bestMoves.slice(0, ITEMS_TO_SHOW)
              ).map((item: any, index: number) => {
                return (
                  <div key={index} className="flex flex-col gap-2 mt-2">
                    <div
                      className={`border ${
                        chessMove.move == item.move
                          ? `border-2 border-[#221AE9] bg-[#221AE910]`
                          : `border-input`
                      } rounded-md p-[8px] md:p-4`}
                    >
                      <div className="flex flex-row justify-between gap-2 mb-4">
                        <div className="flex flex-row gap-2 items-center">
                          <span
                            onClick={() => handleOnClickMovement(item)}
                            className="cursor-pointer text-[14px] --10px flex flex-row items-center text-center sm:text-[14px] --sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1 gap-1"
                          >
                            Move {item?.moveNumber}:{" "}
                            {capturedWhite &&
                              capturedWhite
                                .filter((wp) => wp.san == item?.move)
                                .map((item, index) => {
                                  return (
                                    <Image
                                      key={index}
                                      src={`/pieces/${PieceChoosed}/${item.captured}.png`}
                                      alt="icon"
                                      width={1000}
                                      height={1000}
                                      className="w-[12px] h-[12px] object-contain inline-block"
                                    />
                                  );
                                })}
                            <span className="font-bold">{item?.move}</span>
                          </span>
                          <span
                            className={`${item.evaluation >= 0 ? 'text-green-500 border-green-500' : 'text-[#FF7769] border-[#FF7769]'} border flex items-center justify-center rounded-full px-4 py-1 font-semibold text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md text-center`}
                          >
                            {item.evaluation > 0 ? '+' : ''}{item.evaluation}
                          </span>
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <span
                            className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md ${getBadgeClass(
                              item.classification
                            )}`}
                          >
                            {item.classification}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isSignedIn) {
                                setOpenConfirmLogin(true);
                                return;
                              }

                              const mistakeId = item?.id || item?.mistakeLogId || item?._id;

                              if (!mistakeId) {
                                toast.error("Cannot save: Mistake log ID not found");
                                return;
                              }

                              if (item?.saved) {
                                handleUnsaveLog(mistakeId, 'bestMoves', index);
                              } else {
                                handleSaveLog(mistakeId, 'bestMoves', index);
                              }
                            }}
                            className="relative w-[36px] h-[36px] flex items-center justify-center bg-[#E6F7FE] border border-[#C6EEFE] shadow-[0px_0px_1px_2px_rgba(230,247,254,.2)] rounded-[8px] before:content-[''] before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:absolute before:top-[1px] before:left-[1px] before:shadow-inset before:rounded-[6px] before:shadow-[0px_0px_0px_1px_rgba(255,255,255,1)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-[6px] after:shadow-[inset_0px_-2px_2px_0px_rgba(141,215,246,1)]"
                          >
                            {loadingToggle === (item?.id || item?.mistakeLogId || item?._id) ? (
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
                      {renderMoveAnalysis(item)}
                    </div>
                  </div>
                );
              })}
              {bestMoves.length > ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllBestMoves(!showAllBestMoves)}
                  className="w-full flex flex-row items-center justify-center mt-2 py-2 gap-[4px] h-[40px] bg-[#FAFDFF] rounded-[100px] border-[0.5px] border-[#C0CED4]"
                >
                  <span className="text-center text-[14px] text-[#221AE9] font-medium">
                    {showAllBestMoves
                      ? "See Less"
                      : `See More (${bestMoves.length - ITEMS_TO_SHOW})`}
                  </span>
                  <Image
                    src="/icons/chevron-down.png"
                    alt="arrow down"
                    width={16}
                    height={16}
                    className={`ml-1 ${showAllBestMoves ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </>
          )}
        </div>

        <div className="border-t border-[#C0CED4] sm:border sm:border-primary sm:border-t-4 sm:rounded-md md:p-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Image
                alt=""
                src={"/icons/alert-triangle.png"}
                width={1000}
                height={1000}
                className="w-[18px] h-[18px] sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px]"
              />
              <span className="text-md sm:text-lg md:text-xl lg:text-xl font-bold w-full">
                Bad Moves
              </span>
              <div className="flex flex-row items-center gap-1">
                <InfoIcon size={16} color="#221AE9" />
                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md">
                  Type:
                </span>
                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md font-semibold">
                  Middlegame
                </span>
              </div>
            </div>
            <div
              className="hidden sm:block"
              onClick={() => setopenBadMove(!openBadMove)}
            >
              {openBadMove ? (
                <ChevronUp size={24} color="black" />
              ) : (
                <ChevronDown size={24} color="black" />
              )}
            </div>
          </div>
          {badMoves && badMoves.length === 0 && <NoData />}
          {openBadMove && badMoves && (
            <>
              {(showAllBadMoves
                ? badMoves
                : badMoves.slice(0, ITEMS_TO_SHOW)
              ).map((item: any, index: number) => {
                return (
                  <div key={index} className="flex flex-col gap-2 mt-2">
                    <div
                      className={`border ${
                        chessMove.move == item.move
                          ? `border-2 border-[#221AE9] bg-[#221AE910]`
                          : `border-input`
                      } rounded-md p-[8px] md:p-4`}
                    >
                      <div className="flex flex-row justify-between gap-2 mb-4">
                        <div className="flex flex-row gap-2 items-center">
                          <span
                            onClick={() => handleOnClickMovement(item)}
                            className="cursor-pointer text-[14px] --10px flex flex-row items-center text-center sm:text-[14px] --sm md:text-md lg:text-md font-normal border border-primary rounded-[4px] p-1 gap-1"
                          >
                            Move {item?.moveNumber}:{" "}
                            {capturedWhite &&
                              capturedWhite
                                .filter((wp) => wp.san == item?.move)
                                .map((item, index) => {
                                  return (
                                    <Image
                                      key={index}
                                      src={`/pieces/${PieceChoosed}/${item.captured}.png`}
                                      alt="icon"
                                      width={1000}
                                      height={1000}
                                      className="w-[12px] h-[12px] object-contain inline-block"
                                    />
                                  );
                                })}
                            <span className="font-bold">{item?.move}</span>
                          </span>

                          <span
                            className={`${item.evaluation >= 0 ? 'text-green-500 border-green-500' : 'text-[#FF7769] border-[#FF7769]'} border flex items-center justify-center rounded-full px-4 py-1 font-semibold text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md text-center`}
                          >
                            {item.evaluation > 0 ? '+' : ''}{item.evaluation}
                          </span>
                        </div>

                        <div className="flex items-center gap-[10px]">
                          <span
                            className={`min-w-[72px] text-center px-2 py-1 rounded-[4px] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md ${getBadgeClass(
                              item.classification
                            )}`}
                          >
                            {item.classification}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isSignedIn) {
                                setOpenConfirmLogin(true);
                                return;
                              }

                              const mistakeId = item?.id || item?.mistakeLogId || item?._id;

                              if (!mistakeId) {
                                toast.error("Cannot save: Mistake log ID not found");
                                return;
                              }

                              if (item?.saved) {
                                handleUnsaveLog(mistakeId, 'badMoves', index);
                              } else {
                                handleSaveLog(mistakeId, 'badMoves', index);
                              }
                            }}
                            className="relative w-[36px] h-[36px] flex items-center justify-center bg-[#E6F7FE] border border-[#C6EEFE] shadow-[0px_0px_1px_2px_rgba(230,247,254,.2)] rounded-[8px] before:content-[''] before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:absolute before:top-[1px] before:left-[1px] before:shadow-inset before:rounded-[6px] before:shadow-[0px_0px_0px_1px_rgba(255,255,255,1)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-[6px] after:shadow-[inset_0px_-2px_2px_0px_rgba(141,215,246,1)]"
                          >
                            {loadingToggle === (item?.id || item?.mistakeLogId || item?._id) ? (
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
                      {renderMoveAnalysis(item)}
                    </div>
                  </div>
                );
              })}
              {badMoves.length > ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllBadMoves(!showAllBadMoves)}
                  className="w-full flex flex-row items-center justify-center mt-2 py-2 gap-[4px] h-[40px] bg-[#FAFDFF] rounded-[100px] border-[0.5px] border-[#C0CED4]"
                >
                  <span className="text-center text-[14px] text-[#221AE9] font-medium">
                    {showAllBadMoves
                      ? "See Less"
                      : `See More (${badMoves.length - ITEMS_TO_SHOW})`}
                  </span>
                  <Image
                    src="/icons/chevron-down.png"
                    alt="arrow down"
                    width={16}
                    height={16}
                    className={`ml-1 ${showAllBadMoves ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-[8px] md:gap-[16px] mt-2 mx-2 mb-2">
        <button
          onClick={props.prev}
          className="btn-secondary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#221AE9] font-medium text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px]">
            <ArrowLeft color="#221AE9" className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
            Back: Openings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </button>
        <div className="w-8" />
        <button
          onClick={props.next}
          className="btn-primary flex items-center justify-center w-full h-[48px] whitespace-nowrap rounded-[100px] sm:py-4 md:py-6 lg:py-8"
        >
          <div className="flex flex-row items-center justify-center text-[#e6f7fe] text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[16px]">
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next: Endgame
            <ArrowRight
              color="#e6f7fe"
              className="ml-2 h-4 w-4 sm:h-6 sm:w-6"
            />
          </div>
        </button>
      </div>
    </>
  );
};

export default MiddleGame;
