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
  [key: string]: any;
}

const AnalysisResult: React.FC = () => {
  const {
    pgn: storePgn,
    dataAnalysis,
    hideDiv,
    capturedWhite,
    capturedBlack,
    setCapturedBlack,
    setCapturedWhite,
  } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const { tabFocus, setTabFocus } = useTabFocusStore();
  const {
    StyleChoosed,
    setStyleChoosed,
    BoardChoosed,
    setBoardChoosed,
    PieceChoosed,
    setPieceChoosed,
  } = useChessBoardThemeStore();
  const {
    gameInfo,
    summary,
    movementDetails,
    opening,
    middleGame,
    endGame,
    improvementRecommendation,
    training,
  } = dataAnalysis ?? {};
  const blackCountry = summary?.blackSide?.profileInfo?.chessAccountInfo
    ?.country
    ? summary?.blackSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";

  const whiteCountry = summary?.whiteSide?.profileInfo?.chessAccountInfo
    ?.country
    ? summary?.whiteSide?.profileInfo?.chessAccountInfo?.country.substr(-2)
    : "XX";
  const [game, setGame] = useState(new Chess());
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [boardSize, setBoardSize] = useState(700); // Default size
  const [mounted, setMounted] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showMovementContent, setShowMovementContent] = useState<boolean>(true);
  const [orientation, setOrientation] = useState<BoardOrientation>("white"); // Default size

  useEffect(() => {
    let isOpen =
      tabFocus == "opening" ||
      tabFocus == "threats" ||
      tabFocus == "middlegame" ||
      tabFocus == "endgame";
    setShowTable(isOpen);
  }, [tabFocus]);

  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [currentMoveWhite, setCurrentMoveWhite] = useState<number>(0);
  const [currentMoveBlack, setCurrentMoveBlack] = useState<number>(0);
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

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted, hideDiv, is3DMode]);
  useEffect(() => {
    let is3D = StyleChoosed == "3d" ? true : false;
    setIs3DMode(is3D);
  }, [StyleChoosed]);

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
  }, [storePgn]);

  // Parse PGN and extract moves
  const parsePgn = (pgnText: string): boolean => {
    try {
      const tempGame = new Chess();
      tempGame.loadPgn(pgnText);
      // Check if the PGN was loaded successfully
      if (tempGame.pgn() === "") {
        setErrorMessage("Invalid PGN format. Please check your input.");
        return false;
      }
      const comments = tempGame.getComments();
      console.log("tempGame.getComments()", comments);

      // Extract history of moves
      const history = tempGame.history({ verbose: true }) as ParsedMove[];

      console.log("history", history);
      setParsedMoves(history);
      comments.forEach((c) => {
        let index = history.findIndex(({ after }) => after == c.fen);
        // console.log( index);
        if (index === -1) {
          // history.push(o);
        } else {
          history[index].clock = c.comment
            .replace("[%clk ", "")
            .replace("]", "");
        }
      });
      let capturedPiecesBlack: {
        captured: string | null;
        piece: string | null;
        color: string;
        from: Square;
        to: Square;
        lan: string;
        san: string;
      }[] = [];
      let capturedPiecesWhite: {
        captured: string | null;
        piece: string | null;
        color: string;
        from: Square;
        to: Square;
        lan: string;
        san: string;
      }[] = [];
      // Replay moves and check for captures
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
      console.log("capturedPiecesWhite", capturedPiecesWhite);
      console.log("capturedPiecesBlack", capturedPiecesBlack);

      getStartTime(comments[0].comment.replace("[%clk ", "").replace("]", ""));
      // Determine board orientation based on the headers
      const headers = tempGame.header();
      if (headers.Black && headers.Black.toLowerCase() === "you") {
        setBoardOrientation("black");
      } else {
        setBoardOrientation("white");
      }
      // Reset the current game
      const newGame = new Chess();
      setGame(newGame);
      setCurrentMoveWhite(0);
      setCurrentMoveBlack(0);
      setCurrentMoveIndex(0);
      setErrorMessage("");

      return true;
    } catch (error) {
      console.error("Error parsing PGN:", error);
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
    let minuteFormat = totalMinutes <= 9 ? "0" + totalMinutes : totalMinutes;
    let result = "0:" + minuteFormat + ":00";
    setStartTime(result);
  };
  const toggleBoardMode = () => {
    console.log("is3DMode", is3DMode);
    setIs3DMode((prev) => !prev);
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
      setCurrentMoveBlack(0);
      setCurrentMoveWhite(0);
    } else if (parsedMoves[index] && parsedMoves[index].color == "w") {
      setCurrentMoveWhite(parsedMoves[index].clock);
      if (parsedMoves[index + 1]) {
        setCurrentMoveBlack(parsedMoves[index + 1].clock);
      } else {
        setCurrentMoveBlack(parsedMoves[index].clock);
      }
    } else if (parsedMoves[index] && parsedMoves[index].color == "b") {
      setCurrentMoveBlack(parsedMoves[index].clock);
      if (parsedMoves[index + 1]) {
        setCurrentMoveWhite(parsedMoves[index + 1].clock);
      } else {
        setCurrentMoveWhite(parsedMoves[index].clock);
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

  useEffect(() => {
    let color = chessMove.type == "black" ? "b" : "w";
    let data = [];

    data = parsedMoves.filter(
      (i) => i.san == chessMove.move && i.color == color
    );
    setCurrentMoveIndex(parsedMoves.indexOf(data[0]) + 1);
    setCurrentMove(parsedMoves.indexOf(data[0]) + 1);
    console.log("storePgn", storePgn);

    console.log("masuk");
  }, [chessMove]);

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

  const getBoardProps = () => {
    const baseProps = {
      position: game.fen(),
      boardOrientation,
      animationDuration: 1000,
    };
    return baseProps;
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
        return "text-[#364152]";
    }
  };
  const handleResize = () => {
    const width = window?.innerWidth;
    const height = window?.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    // const maxSize = window?.innerWidth *0.25;
    let desktopSize = window.innerWidth - (window.innerWidth * 0.54 + 256);
    const maxSize = window.innerWidth >= 1280 ? desktopSize : 480;
    // const maxSize = window.innerWidth > 1300 ? 453 : window.innerWidth/1.5;

    if (isPortrait) {
      // In portrait mode, use screen width as the primary constraint
      const availableWidth = width - minPadding * 2;
      // Use 85% of available width for mobile, 90% for tablets
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
      console.log(Math.min(maxSize, availableWidth * sizeFactor));
    } else {
      // In landscape, use height as the primary constraint
      const availableHeight = height - minPadding * 2;
      // Use 80% of available height
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
      console.log("size board...", Math.min(maxSize, availableHeight * 0.8));
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
          <Image
            alt="avatar"
            src={summary?.blackSide?.profileInfo.photo}
            className="w-10 h-10 rounded-full"
            width={1000}
            height={1000}
          />
          {/* <div className="w-10 h-10 rounded-full bg-gray-300"></div> */}
          <div className="flex flex-col line-clamp-1 ">
            <div className="flex flex-row items-center gap-2">
              <span
                className={`text-xs sm:text-sm md:text-md lg:text-[18px] font-medium ${
                  gameInfo?.whiteWin ? "text-black" : "text-[#00B427]"
                }`}
              >
                {summary?.blackSide?.profileInfo.username}
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
        {game.getComments().length > 0 && (
          <div className="border border-input xl:min-w-28 rounded-md p-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
            <Watch size={16} />
            <span className="text-xs xl:w-[80px] sm:text-sm md:text-md lg:text-lg font-medium">
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
          <Image
            alt="avatar"
            src={summary?.whiteSide?.profileInfo.photo}
            className="w-10 h-10 rounded-full"
            width={1000}
            height={1000}
          />
          {/* <div className="w-10 h-10 rounded-full bg-gray-300"></div> */}
          <div className="flex flex-col line-clamp-1 ">
            <div className="flex flex-row items-center gap-2">
              <span
                className={`text-xs sm:text-sm md:text-md lg:text-[18px] font-medium ${
                  gameInfo?.blackWin ? "text-black" : "text-[#00B427]"
                }`}
              >
                {summary?.whiteSide?.profileInfo.username}
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
        {game.getComments().length > 0 && (
          <div className="border border-input xl:min-w-28 rounded-md p-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
            <Watch size={16} />
            <span className="text-xs xl:w-[80px] sm:text-sm md:text-md lg:text-lg font-medium">
              {currentMoveWhite == 0 ? startTime : currentMoveWhite}
            </span>
          </div>
        )}
      </div>
    );
  };
  useEffect(() => {
    // console.log("Best move:", bestMove);
    // console.log("Evaluation:", evaluation);
  }, [bestMove, evaluation]);
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
    <div
      className={`${
        hideDiv &&
        "fixed top-24 left-0 right-0 w-full z-10 border-b border-b-input"
      } flex justify-center gap-4 bg-white pb-4`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <motion.div
            animate={
              hideDiv ? { opacity: 0, display: "hidden" } : { opacity: 1 }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ display: !hideDiv ? "block" : "none" }}
          >
            {orientation != "black" ? renderBlackAvatar() : renderWhiteAvatar()}
          </motion.div>
          <motion.div
            animate={
              hideDiv ? { opacity: 0, display: "hidden" } : { opacity: 1 }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              display: !hideDiv ? "flex" : "none",
              justifyContent: "end",
            }}
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
                boardWidth={
                  hideDiv ? boardSize - 80 : is3DMode ? boardSize : boardSize
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
                boardWidth={
                  hideDiv ? boardSize - 80 : is3DMode ? boardSize : boardSize
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
          {/* Group Button */}
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
            animate={
              hideDiv ? { opacity: 0, display: "hidden" } : { opacity: 1 }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ display: !hideDiv ? "block" : "none" }}
          >
            {orientation == "black" ? renderBlackAvatar() : renderWhiteAvatar()}
          </motion.div>

          {showTable && <MovementTable />}
          {showMovementContent && !showTable && chessMove.move != null && (
            <div className="w-full p-0" style={{ maxWidth: boardSize }}>
              <div className="flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                <div className="flex flex-row items-center justify-between gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-xs  sm:text-sm md:text-md lg:text-md xl:text-lg font-semibold">
                      {chessMove.move}
                    </span>
                    {chessMove?.evaluation && (
                      <span
                        className={`rounded-2xl px-3 py-[4px] border border-input text-xs sm:text-sm md:text-md lg:text-md xl:text-lg text-center font-normal py-2 ${getScoreClass(
                          chessMove?.classification.toLowerCase()
                        )}`}
                      >
                        {chessMove.evaluation}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    {chessMove?.classification && (
                      <span
                        className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-sm md:text-md lg:text-md xl:text-md px-2 ${getBadgeClass(
                          chessMove.classification
                        )}`}
                      >
                        {chessMove.classification}
                      </span>
                    )}
                    {chessMove?.type && (
                      <span
                        className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-sm md:text-md lg:text-md xl:text-md px-2 ${getBadgeClass(
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
                  <span className="text-sm font-normal py-1">
                    {chessMove?.analysis}
                  </span>
                )}
                {chessMove?.solution && (
                  <span className="text-sm font-normal py-1">
                    {chessMove?.solution}
                  </span>
                )}
                {chessMove?.gamePhase && (
                  <div className="flex flex-row gap-1">
                    <InfoIcon size={16} color="#221AE9" />
                    <span className="text-sm">Type:</span>
                    <span className="text-sm font-semibold ">
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
