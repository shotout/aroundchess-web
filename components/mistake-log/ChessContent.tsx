"use client";

import { changeNamePiece } from "@/functions/change-name-piece";
import { Chess, Square } from "chess.js";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Watch,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useChessBoardThemeStore } from "../../app/store/chessBoardTheme";
import { useChessMoveStore } from "../../app/store/chessMoveStore";
import { usePgnStore } from "../../app/store/zustandStore";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import {
  BoardOrientation,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { SettingBoard } from "@/components/modal/SettingBoard";
import { useApiClient } from "@/functions/api-client";
import ThreeDBoard from "../chessboard/3d/ThreeDChessboard";
import MovementTable from "../table/movementFeedback";

interface ParsedMove {
  color: string;
  from: string;
  to: string;
  flags: string;
  piece: string;
  san: string;
  [key: string]: any;
}

const ChessContent: React.FC = () => {
  const {
    pgn: storePgn,
    capturedWhite,
    capturedBlack,
    setCapturedBlack,
    setCapturedWhite,
    playerInfo,
    previousAnalysesDetail,
    setHistoryGame,
  } = usePgnStore();
  const { chessMove, setChessMove } = useChessMoveStore();
  const { StyleChoosed, setStyleChoosed, PieceChoosed } =
    useChessBoardThemeStore();
  const { isLoading: loading } = useApiClient();

  const blackCountry = previousAnalysesDetail?.playerInfo?.black?.country
    ? previousAnalysesDetail.playerInfo.black.country.substr(-2)
    : "XX";

  const whiteCountry = previousAnalysesDetail?.playerInfo?.white?.country
    ? previousAnalysesDetail.playerInfo.white.country.substr(-2)
    : "XX";

  const [game, setGame] = useState(new Chess());
  const [boardSize, setBoardSize] = useState(700);
  const [mounted, setMounted] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [currentMoveWhite, setCurrentMoveWhite] = useState<string>("0:10:00");
  const [currentMoveBlack, setCurrentMoveBlack] = useState<string>("0:10:00");
  const [parsedMoves, setParsedMoves] = useState<ParsedMove[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white"
  );
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startTime, setStartTime] = useState("0:10:00");
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  useEffect(() => {
    let isOpen = storePgn != "" && storePgn != null;
    setShowTable(isOpen);
  }, [storePgn]);

  useEffect(() => {
    let is3D = StyleChoosed == "3d";
    setIs3DMode(is3D);
  }, [StyleChoosed]);

  // Reset chess state when PGN changes
  useEffect(() => {
    if (storePgn) {
      // Reset all chess-related state
      setIsPlaying(false);
      setCurrentMoveIndex(0);
      setCurrentMoveWhite("0:10:00");
      setCurrentMoveBlack("0:10:00");
      setParsedMoves([]);
      setGame(new Chess());
      setChessMove({});

      // Clear any auto-play timer
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }

      setIsLoading(true);
      setTimeout(() => {
        parsePgn(storePgn);
        setIsLoading(false);
      }, 100);
    } else {
      setIsLoading(false);
    }
  }, [storePgn]);

  const parsePgn = (pgnText: string): boolean => {
    try {
      const tempGame = new Chess();
      tempGame.loadPgn(pgnText);

      if (tempGame.pgn() === "") {
        console.error("Invalid PGN format");
        return false;
      }

      const comments = tempGame.getComments();
      const history = tempGame.history({ verbose: true }) as ParsedMove[];
      setHistoryGame(history);

      comments.forEach((c) => {
        let index = history.findIndex(({ after }) => after == c.fen);
        if (index !== -1) {
          history[index].clock = c.comment
            .replace("[%clk ", "")
            .replace("]", "");
        }
      });

      let capturedPiecesBlack: any[] = [];
      let capturedPiecesWhite: any[] = [];

      tempGame.history({ verbose: true }).forEach((move) => {
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

      // Reset game state
      const newGame = new Chess();
      setGame(newGame);
      setParsedMoves(history);
      setCurrentMoveWhite("0:10:00");
      setCurrentMoveBlack("0:10:00");
      setCurrentMoveIndex(0);

      return true;
    } catch (error) {
      console.error("Error parsing PGN:", error);
      return false;
    }
  };

  const getStartTime = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    if (seconds >= 30) {
      totalMinutes += 1;
    }
    let minuteFormat = totalMinutes <= 9 ? "0" + totalMinutes : totalMinutes;
    let result = "0:" + minuteFormat + ":00";
    setStartTime(result);
  };

  const toggleBoardMode = () => {
    setIs3DMode((prev) => !prev);
    let style = !is3DMode ? "3d" : "2d";
    setStyleChoosed(style);
  };

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
      setCurrentMoveBlack(startTime);
      setCurrentMoveWhite(startTime);
    } else if (parsedMoves[index - 1] && parsedMoves[index - 1].color == "w") {
      setCurrentMoveWhite(parsedMoves[index - 1].clock || startTime);
      if (parsedMoves[index]) {
        setCurrentMoveBlack(parsedMoves[index].clock || startTime);
      }
    } else if (parsedMoves[index - 1] && parsedMoves[index - 1].color == "b") {
      setCurrentMoveBlack(parsedMoves[index - 1].clock || startTime);
      if (parsedMoves[index]) {
        setCurrentMoveWhite(parsedMoves[index].clock || startTime);
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
      const newIndex = Math.max(0, prevIndex - 1);
      setCurrentMove(newIndex);
      return newIndex;
    });
  };

  const jumpToNextMove = () => {
    stopAutoPlay();
    setCurrentMoveIndex((prevIndex) => {
      const newIndex = Math.min(parsedMoves.length, prevIndex + 1);
      setCurrentMove(newIndex);
      return newIndex;
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
    const lastIndex = parsedMoves.length;
    setCurrentMoveIndex(lastIndex);
    setCurrentMove(lastIndex);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };

  useEffect(() => {
    if (chessMove.index != null) {
      const colorIndex = chessMove.type == "black" ? 1 : 0;
      let indexOf = chessMove.index * 2 + colorIndex;
      const data = parsedMoves[indexOf];
      if (data != null) {
        const moveIndex = parsedMoves.indexOf(data) + 1;
        setCurrentMoveIndex(moveIndex);
        setCurrentMove(moveIndex);
      }
    } else if (chessMove.move) {
      const color = chessMove.type == "black" ? "b" : "w";
      const data = parsedMoves.find(
        (i) => i.san == chessMove.move && i.color == color
      );
      if (data) {
        const moveIndex = parsedMoves.indexOf(data) + 1;
        setCurrentMoveIndex(moveIndex);
        setCurrentMove(moveIndex);
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
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    let desktopSize =
      window.innerWidth - (window.innerWidth * 0.58 + window.innerWidth / 6);
    const maxSize = window.innerWidth > 1280 ? desktopSize : 453;

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
    } else {
      const availableHeight = height - minPadding * 2;
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
    }
  };

  const renderBlackAvatar = () => {
    return (
      <div
        className={`w-full border ${
          previousAnalysesDetail?.blackWin
            ? "border-[#00B427] bg-[#D3FFDD]"
            : "bg-white"
        } p-1 rounded-md flex flex-row justify-between items-center gap-2`}
      >
        <div className="flex flex-row items-center gap-2">
          <Image
            alt="avatar"
            src={playerInfo?.black?.avatarUrl}
            className="w-10 h-10 rounded-full"
            width={1000}
            height={1000}
          />
          <div className="flex flex-col line-clamp-1 ">
            <div className="flex flex-row items-center gap-2">
              <span
                className={`text-xs line-clamp-1 sm:text-sm md:text-md lg:text-[18px] font-medium ${
                  previousAnalysesDetail?.blackWin && "text-[#00B427]"
                }`}
              >
                {playerInfo?.black?.username}
              </span>
              <ReactCountryFlag
                countryCode={blackCountry}
                svg
                className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px]"
                title={blackCountry}
              />
            </div>
            <div className="flex flex-row gap-1">
              {capturedBlack &&
                capturedBlack.length > 0 &&
                capturedBlack
                  .sort((a, b) => a.captured.localeCompare(b.captured))
                  .map((captured, index) => {
                    let icon = captured.captured;
                    let nextIcon = capturedBlack[index + 1]
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
        <div className="border border-input min-w-1/4 rounded-md p-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
          <Watch size={16} className="object-contain w-[16px] h-[16px]" />
          <span className="text-xs xl:w-[80px] sm:text-sm md:text-md lg:text-lg font-medium">
            {currentMoveBlack}
          </span>
        </div>
      </div>
    );
  };

  const renderWhiteAvatar = () => {
    return (
      <div
        className={`w-full border ${
          previousAnalysesDetail?.whiteWin
            ? "border-[#00B427] bg-[#D3FFDD]"
            : "bg-white"
        } p-1 rounded-md flex flex-row justify-between items-center gap-2`}
      >
        <div className="flex flex-row items-center gap-2">
          <Image
            alt="avatar"
            src={playerInfo?.white?.avatarUrl}
            className="w-10 h-10 rounded-full"
            width={1000}
            height={1000}
          />
          <div className="flex flex-col line-clamp-1 ">
            <div className="flex flex-row items-center gap-2">
              <span
                className={`text-xs line-clamp-1 sm:text-sm md:text-md lg:text-[18px] font-medium ${
                  previousAnalysesDetail?.whiteWin && "text-[#00B427]"
                }`}
              >
                {playerInfo?.white?.username}
              </span>
              <ReactCountryFlag
                countryCode={whiteCountry}
                svg
                className="w-[20px] h-[15px] sm:w-[24px] sm:h-[18px] lg:w-[28px] lg:h-[21px]"
                title={whiteCountry}
              />
            </div>
            <div className="flex flex-row gap-1">
              {capturedWhite &&
                capturedWhite.length > 0 &&
                capturedWhite
                  .sort((a, b) => a.captured.localeCompare(b.captured))
                  .map((captured, index) => {
                    let icon = captured.captured;
                    let nextIcon = capturedWhite[index + 1]
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
        <div className="border border-input min-w-1/4 rounded-md p-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
          <Watch size={16} className="object-contain w-[16px] h-[16px]" />
          <span className="text-xs xl:w-[80px] sm:text-sm md:text-md lg:text-lg font-medium">
            {currentMoveWhite}
          </span>
        </div>
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

  return (
    <div className="flex justify-center gap-4 bg-white pb-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <motion.div
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {orientation != "black" ? renderBlackAvatar() : renderWhiteAvatar()}
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
                boardWidth={boardSize}
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
                arePiecesDraggable={false}
                boardWidth={boardSize}
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

          <div className="flex flex-row justify-around gap-2 ">
            <button
              onClick={jumpToFirstMove}
              disabled={currentMoveIndex === 0}
              style={{ height: boardSize / 15, borderRadius: boardSize / 120 }}
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] "
            >
              <SkipBackIcon fill="black" size={boardSize / 22} color="black" />
            </button>

            <button
              onClick={jumpToPreviousMove}
              disabled={currentMoveIndex === 0}
              style={{ height: boardSize / 15, borderRadius: boardSize / 120 }}
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] "
            >
              <ChevronLeft size={boardSize / 22} color="black" />
            </button>

            <button
              onClick={togglePlayPause}
              style={{ height: boardSize / 15, borderRadius: boardSize / 120 }}
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] "
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
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] "
            >
              <ChevronRight size={boardSize / 22} color="black" />
            </button>

            <button
              onClick={jumpToLastMove}
              disabled={currentMoveIndex >= parsedMoves.length}
              style={{ height: boardSize / 15, borderRadius: boardSize / 120 }}
              className="w-1/5 bg-[#221AE904] flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] "
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
          >
            {orientation == "black" ? renderBlackAvatar() : renderWhiteAvatar()}
          </motion.div>

          {showTable && !loading && <MovementTable />}
        </div>
      </div>
    </div>
  );
};

export default ChessContent;
