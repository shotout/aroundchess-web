"use client";

import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import { SettingBoard } from "@/components/modal/SettingBoard";
import MovementTable from "@/components/table/movement";
import { changeNamePiece } from "@/functions/change-name-piece";
import { Chess, Square } from "chess.js";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  InfoIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Watch,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import ReactCountryFlag from "react-country-flag";
import { useChessBoardThemeStore } from "../../app/store/chessBoardTheme";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import { useTabFocusStore } from "../../app/store/tabAnalysisStore";
import { usePgnStore } from "../../app/store/zustandStore";
import ThreeDBoard from "../chessboard/3d/ThreeDChessboard";

interface ParsedMove {
  color: string;
  from: string;
  to: string;
  flags: string;
  piece: string;
  san: string;
  clock?: string;
  captured?: string;
  after?: string;
  [key: string]: any;
}

interface Comment {
  fen: string;
  comment: string;
}

const AnalysisResult: React.FC = () => {
  const {
    pgn: storePgn,
    dataAnalysis,
    hideDiv,
    capturedWhite,
    capturedBlack,
    historyGame,
    setHistoryGame,
    setCapturedBlack,
    setCapturedWhite,
    username,
  } = usePgnStore();
  const { chessMove, setChessMove } = useChessMoveStore();
  const { tabFocus } = useTabFocusStore();
  const { StyleChoosed, setStyleChoosed, PieceChoosed } =
    useChessBoardThemeStore();
  const { gameInfo, summary } = dataAnalysis ?? {};

  const blackCountry = summary?.blackSide?.profileInfo?.chessAccountInfo
    ?.country
    ? summary?.blackSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";

  const whiteCountry = summary?.whiteSide?.profileInfo?.chessAccountInfo
    ?.country
    ? summary?.whiteSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";

  const [game, setGame] = useState(new Chess());
  const [boardSize, setBoardSize] = useState(700);
  const [mounted, setMounted] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showMovementContent, setShowMovementContent] = useState<boolean>(true);
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [currentMoveWhite, setCurrentMoveWhite] = useState<string | number>(0);
  const [currentMoveBlack, setCurrentMoveBlack] = useState<string | number>(0);
  const [pgn, setPgn] = useState<string>("");
  const [parsedMoves, setParsedMoves] = useState<ParsedMove[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startTime, setStartTime] = useState("0:10:00:0");
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isUserWhite = summary?.whiteSide?.profileInfo.username === username;
  const defaultUserOrientation = isUserWhite ? "white" : "black";

  useEffect(() => {
    if (summary && username) {
      // Set default orientation to user's color so they start at bottom
      setOrientation(defaultUserOrientation);
    }
  }, [summary, username, defaultUserOrientation]);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();

    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted, hideDiv, is3DMode]);

  useEffect(() => {
    if (storePgn) {
      setPgn(storePgn);
      setIsLoading(true);
      setTimeout(() => {
        parsePgn(storePgn);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storePgn]);

  useEffect(() => {
    const isOpen =
      tabFocus == "opening" ||
      tabFocus == "threats" ||
      tabFocus == "middlegame" ||
      tabFocus == "endgame";
    setShowTable(isOpen);
  }, [tabFocus]);

  const parsePgn = (pgnText: string): boolean => {
    try {
      // console.log("parsePgn", pgnText);
      const tempGame = new Chess();
      tempGame.loadPgn(pgnText);

      if (tempGame.pgn() === "") {
        setErrorMessage("Invalid PGN format. Please check your input.");
        return false;
      }

      const comments = tempGame.getComments() as Comment[];
      const history = tempGame.history({ verbose: true }) as ParsedMove[];

      setParsedMoves(history);
      setHistoryGame(history);
      comments.forEach((c) => {
        const index = history.findIndex(({ after }) => after == c.fen);
        if (index !== -1) {
          history[index].clock = c.comment
            .replace("[%clk ", "")
            .replace("]", "");
        }
      });

      const capturedPiecesBlack: any[] = [];
      const capturedPiecesWhite: any[] = [];

      tempGame.history({ verbose: true }).forEach((move: any) => {
        if (move.captured) {
          if (move.color == "w") {
            capturedPiecesWhite.push({
              captured: "b" + changeNamePiece(move.captured ?? null),
              piece: changeNamePiece(move.piece),
              color: "white",
              from: move.from,
              to: move.to,
              lan: move.lan,
              san: move.san,
            });
          } else {
            capturedPiecesBlack.push({
              captured: "w" + changeNamePiece(move.captured ?? null),
              piece: changeNamePiece(move.piece),
              color: "black",
              from: move.from,
              to: move.to,
              lan: move.lan,
              san: move.san,
            });
          }
        }
      });

      setCapturedBlack(capturedPiecesBlack);
      setCapturedWhite(capturedPiecesWhite);

      if (comments.length > 0) {
        getStartTime(
          comments[0].comment.replace("[%clk ", "").replace("]", "")
        );
      }

      const headers = tempGame.header();
      if (headers.Black && headers.Black.toLowerCase() === "you") {
        setBoardOrientation("black");
      } else {
        setBoardOrientation("white");
      }

      const newGame = new Chess();
      setGame(newGame);
      setCurrentMoveWhite(0);
      setCurrentMoveBlack(0);
      setCurrentMoveIndex(0);
      setErrorMessage("");

      return true;
    } catch (error) {
      setErrorMessage(
        `Error parsing PGN: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return false;
    }
  };

  const getStartTime = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    if (seconds >= 30) {
      totalMinutes += 1;
    }
    const minuteFormat = totalMinutes <= 9 ? "0" + totalMinutes : totalMinutes;
    const result = "0:" + minuteFormat + ":00";
    setStartTime(result);
  };

  const toggleBoardMode = () => {
    setIs3DMode((prev) => !prev);
    const style = !is3DMode ? "3d" : "2d";
    setStyleChoosed(style);
  };

  useEffect(() => {
    const is3D = StyleChoosed == "3d" ? true : false;
    setIs3DMode(is3D);
  }, [StyleChoosed]);

  const startAutoPlay = () => {
    if (currentMoveIndex >= parsedMoves.length) {
      jumpToFirstMove();
    }

    setIsPlaying(true);
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentMoveIndex((prevIndex) => {
        if (prevIndex < parsedMoves.length) {
          setCurrentMove(prevIndex + 1);
          return prevIndex + 1;
        } else {
          stopAutoPlay();
          return prevIndex;
        }
      });
    }, 400);
  };

  const setCurrentMove = (index: number) => {
    if (index == 0) {
      setCurrentMoveBlack(0);
      setCurrentMoveWhite(0);
    } else if (parsedMoves[index] && parsedMoves[index].color == "w") {
      setCurrentMoveWhite(parsedMoves[index].clock || 0);
      if (parsedMoves[index + 1]) {
        setCurrentMoveBlack(parsedMoves[index + 1].clock || 0);
      } else {
        setCurrentMoveBlack(parsedMoves[index].clock || 0);
      }
    } else if (parsedMoves[index] && parsedMoves[index].color == "b") {
      setCurrentMoveBlack(parsedMoves[index].clock || 0);
      if (parsedMoves[index + 1]) {
        setCurrentMoveWhite(parsedMoves[index + 1].clock || 0);
      } else {
        setCurrentMoveWhite(parsedMoves[index].clock || 0);
      }
    }
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

  const jumpToPreviousMove = () => {
    stopAutoPlay();
    setCurrentMoveIndex((prevIndex) => {
      setCurrentMove(Math.max(0, prevIndex - 1));
      return Math.max(0, prevIndex - 1);
    });
  };

  const jumpToNextMove = () => {
    stopAutoPlay();

    setCurrentMoveIndex((prevIndex) => {
      setCurrentMove(Math.max(0, prevIndex + 1));
      return Math.min(parsedMoves.length, prevIndex + 1);
    });
  };

  const jumpToFirstMove = () => {
    stopAutoPlay();
    setCurrentMoveIndex(0);
    setCurrentMove(0);
    setChessMove({});
  };

  const jumpToLastMove = () => {
    stopAutoPlay();
    setCurrentMoveIndex(parsedMoves.length);
    setCurrentMove(parsedMoves.length - 1);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };

  useEffect(() => { /// INI DIPAHAMI
    if (chessMove.index != null) {
      const colorIndex = chessMove.type == "black" ? 1 : 0;
      let indexOf = chessMove.index * 2 + colorIndex;
      // console.log("indexOf", indexOf);
      const data = parsedMoves[indexOf];
      // console.log("parsedMoves", parsedMoves);
      // console.log("data move", data);
      if (data != null) {
        setCurrentMoveIndex(parsedMoves.indexOf(data) + 1);
        setCurrentMove(parsedMoves.indexOf(data) + 1);
      }
    } else {
      const color = chessMove.type == "black" ? "b" : "w";
      const data = parsedMoves.filter(
        (i) => i.san == chessMove.move && i.color == color
      );
      // console.log("parsedMoves", parsedMoves);
      // console.log("data move", data);
      if (data.length > 0) {
        setCurrentMoveIndex(parsedMoves.indexOf(data[0]) + 1);
        setCurrentMove(parsedMoves.indexOf(data[0]) + 1);
      }
    }
  }, [chessMove, parsedMoves]);

  useEffect(() => {
    const newGame = new Chess();

    for (let i = 0; i < currentMoveIndex; i++) {
      if (i < parsedMoves.length) {
        newGame.move(parsedMoves[i]);
      }
    }

    setGame(newGame);
  }, [currentMoveIndex, parsedMoves]);

  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
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

  const handleResize = () => {
    const width = window?.innerWidth;
    const height = window?.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const desktopSize =
      window.innerWidth - (window.innerWidth * 0.58 + window.innerWidth / 6);
    const maxSize = window.innerWidth >= 1280 ? desktopSize : 480;

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor));
    } else {
      const availableHeight = height - minPadding * 2;
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
    }
  };

  const renderBlackAvatar = () => {
    return (
      <div
        className={`w-full border ${
          gameInfo?.blackWin ? "border-[#00B427] bg-[#D3FFDD]" : "bg-white"
        } p-1 rounded-md flex flex-row justify-between items-center gap-2`}
      >
        <div className="flex flex-row items-center gap-2">
          {summary?.blackSide?.profileInfo.photo ? (
            <Image
              alt="avatar"
              src={summary.blackSide.profileInfo.photo}
              className="w-10 h-10 rounded-full object-cover"
              width={40}
              height={40}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-[14px] --sm font-semibold">
                {summary?.blackSide?.profileInfo.username?.charAt(0) || "?"}
              </span>
            </div>
          )}
          <div className="flex flex-col line-clamp-1">
            <div className="flex flex-row items-center gap-2">
              <span
                className={`text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[18px] font-medium ${
                  gameInfo?.whiteWin ? "text-black" : "text-[#00B427]"
                }`}
              >
                {summary?.blackSide?.profileInfo.username}
              </span>

              {blackCountry && blackCountry !== "XX" && (
                <ReactCountryFlag
                  countryCode={blackCountry}
                  svg
                  className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px]"
                  title={blackCountry}
                />
              )}
            </div>

            <div className="flex flex-row gap-1">
              {capturedBlack &&
                capturedBlack.length > 0 &&
                capturedBlack
                  .sort((a: any, b: any) =>
                    a.captured.localeCompare(b.captured)
                  )
                  .map((captured: any, index: number) => {
                    const icon = captured.captured;
                    const nextIcon = capturedBlack[index + 1]
                      ? capturedBlack[index + 1].captured
                      : "";
                    return (
                      <div
                        key={index}
                        className={`${icon == nextIcon ? "-mr-3" : ""}`}
                      >
                        {icon && (
                          <Image
                            src={`/pieces/${PieceChoosed}/${icon}.png`}
                            alt="icon"
                            width={1000}
                            height={1000}
                            className="w-3 h-4 sm:w-4 sm:h-5 lg:w-4 lg:h-5 object-contain inline-block"
                          />
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
        {game.getComments().length > 0 && (
          <div className="border border-input xl:min-w-28 rounded-md p-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
            <Watch size={16} />
            <span className="text-[14px] --xs xl:w-[80px] sm:text-[14px] --sm md:text-md lg:text-lg font-medium">
              {currentMoveBlack == 0 ? startTime : currentMoveBlack}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderWhiteAvatar = () => {
    return (
      <div
        className={`w-full border ${
          gameInfo?.whiteWin ? "border-[#00B427] bg-[#D3FFDD]" : "bg-white"
        } p-1 rounded-md flex flex-row justify-between items-center gap-2`}
      >
        <div className="flex flex-row items-center gap-2">
          {summary?.whiteSide?.profileInfo.photo ? (
            <Image
              alt="avatar"
              src={summary.whiteSide.profileInfo.photo}
              className="w-10 h-10 rounded-full object-cover"
              width={40}
              height={40}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-[14px] --sm font-semibold">
                {summary?.whiteSide?.profileInfo.username?.charAt(0) || "?"}
              </span>
            </div>
          )}
          <div className="flex flex-col line-clamp-1">
            <div className="flex flex-row items-center gap-2">
              <span
                className={`text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-[18px] font-medium ${
                  gameInfo?.blackWin ? "text-black" : "text-[#00B427]"
                }`}
              >
                {summary?.whiteSide?.profileInfo.username}
              </span>

              {whiteCountry && whiteCountry !== "XX" && (
                <ReactCountryFlag
                  countryCode={whiteCountry}
                  svg
                  className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px]"
                  title={whiteCountry}
                />
              )}
            </div>

            <div className="flex flex-row gap-1">
              {capturedWhite &&
                capturedWhite.length > 0 &&
                capturedWhite
                  .sort((a: any, b: any) =>
                    a.captured.localeCompare(b.captured)
                  )
                  .map((captured: any, index: number) => {
                    const icon = captured.captured;
                    const nextIcon = capturedWhite[index + 1]
                      ? capturedWhite[index + 1].captured
                      : "";
                    return (
                      <div
                        key={index}
                        className={`${icon == nextIcon ? "-mr-3" : ""}`}
                      >
                        {icon && (
                          <Image
                            src={`/pieces/${PieceChoosed}/${icon}.png`}
                            alt="icon"
                            width={1000}
                            height={1000}
                            className="w-3 h-4 sm:w-4 sm:h-5 lg:w-4 lg:h-5 object-contain inline-block"
                          />
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
        {game.getComments().length > 0 && (
          <div className="border border-input xl:min-w-28 rounded-md p-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
            <Watch size={16} />
            <span className="text-[14px] --xs xl:w-[80px] sm:text-[14px] --sm md:text-md lg:text-lg font-medium">
              {currentMoveWhite == 0 ? startTime : currentMoveWhite}
            </span>
          </div>
        )}
      </div>
    );
  };

  const handleSwitch = () => {
    setOrientation((prev) => {
      if (prev == "white") {
        return "black";
      } else {
        return "white";
      }
    });
  };

  const buttonBoard = () => {
    return (
      <div
        style={{ width: boardSize }}
        className="flex flex-row self-end sm:self-center justify-end items-center gap-3"
      >
        <button onClick={handleSwitch}>
          <Image
            src={"/images/play-vs-ai/switch.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] rounded-full object-contain"
          />
        </button>
        <SettingBoard />
        <button onClick={toggleBoardMode}>
          <Image
            src={`/icons/${!is3DMode ? `3d-icon` : `2d-icon`}.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[22px] h-[27px] object-contain"
          />
        </button>
      </div>
    );
  };

  const renderTopAvatar = () => {
    return orientation === "white" ? renderBlackAvatar() : renderWhiteAvatar();
  };

  const renderBottomAvatar = () => {
    return orientation === "white" ? renderWhiteAvatar() : renderBlackAvatar();
  };

  return (
    <div
      className={`flex justify-center gap-4 bg-white pb-4`}
      // className={`${
      //   hideDiv &&
      //   "fixed top-24 left-0 right-0 w-full z-10 border-b border-b-input"
      // } flex justify-center gap-4 bg-white pb-4`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <motion.div
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ display: "block" }}
          >
            {renderTopAvatar()}
          </motion.div>
          <motion.div
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ display: "flex", justifyContent: "end" }}
          >
            {buttonBoard()}
          </motion.div>
          <motion.div
            initial={{ rotateX: 180 }}
            animate={
              !is3DMode
                ? { opacity: 0, display: "hidden" }
                : { opacity: 1, rotateX: !is3DMode ? 180 : 360 }
            }
            transition={{
              duration: 0.6,
              stiffness: 500,
              damping: 30,
              ease: [0.4, 0.0, 0.2, 1],
              type: "tween",
            }}
            style={{
              width: boardSize,
              display: is3DMode ? "flex" : "none",
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            }}
          >
            {is3DMode && (
              <ThreeDBoard
                arePiecesClickable={false}
                arePiecesDraggable={false}
                boardWidth={
                  // hideDiv ? boardSize - 80 : 
                  is3DMode ? boardSize : boardSize
                }
                orientation={orientation}
                position={game.fen()}
                onSquareClick={function (square: Square): void {
                  throw new Error("Function not implemented.");
                }}
                onSquareRightClick={function (square: Square): void {
                  throw new Error("Function not implemented.");
                }}
                onPromotionPieceSelect={function (
                  piece?: PromotionPieceOption,
                  promoteFromSquare?: Square,
                  promoteToSquare?: Square
                ): boolean {
                  throw new Error("Function not implemented.");
                }}
                promotionToSquare={null}
                showPromotionDialog={false}
                customArrows={undefined}
                areArrowsAllowed={false}
                customArrowColor={""}
              />
            )}
          </motion.div>
          <motion.div
            initial={{ rotateX: 180 }}
            animate={
              is3DMode
                ? { opacity: 0, display: "none" }
                : { opacity: 1, rotateX: is3DMode ? 180 : 360 }
            }
            transition={{
              duration: 0.5,
              stiffness: 500,
              damping: 35,
              ease: [0.4, 0.0, 0.2, 1],
              type: "tween",
            }}
            style={{
              width: boardSize,
              display: !is3DMode ? "flex" : "none",
              backfaceVisibility: "hidden",
            }}
          >
            {!is3DMode && (
              <TwoDChessboard
                arePiecesClickable={false}
                boardWidth={
                  // hideDiv ? boardSize - 80 :
                   is3DMode ? boardSize : boardSize
                }
                arePiecesDraggable={false}
                orientation={orientation}
                position={game.fen()}
                onSquareClick={function (square: Square): void {
                  throw new Error("Function not implemented.");
                }}
                onSquareRightClick={function (square: Square): void {
                  throw new Error("Function not implemented.");
                }}
                onPromotionPieceSelect={function (
                  piece?: PromotionPieceOption,
                  promoteFromSquare?: Square,
                  promoteToSquare?: Square
                ): boolean {
                  throw new Error("Function not implemented.");
                }}
                promotionToSquare={null}
                showPromotionDialog={false}
                customArrows={undefined}
                areArrowsAllowed={false}
                customArrowColor={""}
              />
            )}
          </motion.div>
          <div className="flex flex-row justify-around gap-2">
            <button
              onClick={jumpToFirstMove}
              disabled={currentMoveIndex === 0}
              style={{ height: boardSize / 15, borderRadius: boardSize / 120 }}
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px]"
            >
              <SkipBackIcon fill="black" size={boardSize / 22} color="black" />
            </button>

            <button
              onClick={jumpToPreviousMove}
              disabled={currentMoveIndex === 0}
              style={{ height: boardSize / 15, borderRadius: boardSize / 120 }}
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px]"
            >
              <ChevronLeft size={boardSize / 22} color="black" />
            </button>
            <button
              onClick={togglePlayPause}
              style={{ height: boardSize / 15, borderRadius: boardSize / 120 }}
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px]"
            >
              {isPlaying ? (
                <PauseIcon size={boardSize / 22} fill="black" color="black" />
              ) : (
                <PlayIcon size={boardSize / 22} fill="black" color="black" />
              )}
            </button>

            <button
              onClick={jumpToNextMove}
              disabled={currentMoveIndex >= parsedMoves.length}
              style={{ height: boardSize / 15, borderRadius: boardSize / 120 }}
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px]"
            >
              <ChevronRight size={boardSize / 22} color="black" />
            </button>
            <button
              onClick={jumpToLastMove}
              disabled={currentMoveIndex >= parsedMoves.length}
              style={{ height: boardSize / 15, borderRadius: boardSize / 120 }}
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px]"
            >
              <SkipForwardIcon
                fill="black"
                size={boardSize / 22}
                color="black"
              />
            </button>
          </div>
          <motion.div
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ display: "block" }}
          >
            {renderBottomAvatar()}
          </motion.div>

         {showTable && <MovementTable />}
          {showMovementContent && !showTable && chessMove.move != null && (
            <div className="w-full p-0" style={{ maxWidth: boardSize }}>
              <div className="flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                <div className="flex flex-row items-center justify-between gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-lg font-semibold">
                      {chessMove.move}
                    </span>
                    {chessMove?.evaluation && (
                      <span
                        className={`rounded-2xl px-3 py-[4px] border border-input text-[14px] --xs sm:text-[14px] --sm md:text-md lg:text-md xl:text-lg text-center font-normal  ${getScoreClass(
                          chessMove?.classification?.toLowerCase() || ""
                        )}`}
                      >
                        {chessMove.evaluation > 0 ? '+' : ''}{chessMove.evaluation}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    {chessMove?.classification && (
                      <span
                        className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-[14px] --sm md:text-md lg:text-md xl:text-md px-2 ${getBadgeClass(
                          chessMove.classification
                        )}`}
                      >
                        {chessMove.classification}
                      </span>
                    )}
                    {chessMove?.type && (
                      <span
                        className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-[14px] --sm md:text-md lg:text-md xl:text-md px-2 ${getBadgeClass(
                          chessMove.type
                        )}`}
                      >
                        {chessMove.type}
                      </span>
                    )}
                    <button onClick={() => setChessMove({})}>
                      <Image
                        alt="close"
                        src={"/icons/close-icon.png"}
                        width={1000}
                        height={1000}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
                {chessMove?.analysis && (
                  <span className="text-[14px] --sm font-normal py-1">
                    {chessMove?.analysis}
                  </span>
                )}
                {chessMove?.solution && (
                  <span className="text-[14px] --sm font-normal py-1">
                    {chessMove?.solution}
                  </span>
                )}
                {chessMove?.gamePhase && (
                  <div className="flex flex-row gap-1">
                    <InfoIcon size={16} color="#221AE9" />
                    <span className="text-[14px] --sm">Type:</span>
                    <span className="text-[14px] --sm font-semibold">
                      {chessMove.gamePhase}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
