"use client";

import MovementTable from "@/components/table/movement";
import { Button } from "@/components/ui/button";
import { getStockfishService } from "@/lib/stockfish/stockfish-service";
import { Chess, Square } from "chess.js";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  InfoIcon,
  PauseIcon,
  PlayIcon,
  Settings,
  SkipBackIcon,
  SkipForwardIcon,
  SquareIcon,
  Watch,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useChessMoveStore } from "../store/chessMoveStore";
import { useTabFocusStore } from "../store/tabAnalysisStore";
import { usePgnStore } from "../store/zustandStore";
import BoardWood from "@/components/3d-board/3DBoardWood";
import BoardWoodNew from "@/components/3d-board/3DBoardWoodNew";

type CapturedPieces = {
  white: string[];
  black: string[];
};

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
  const { pgn: storePgn, dataAnalysis, hideDiv } = usePgnStore(); // Get PGN from the Zustand store
  const { chessMove, setChessMove } = useChessMoveStore();
  const { tabFocus, setTabFocus } = useTabFocusStore();
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
  const [game, setGame] = useState(new Chess());
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [boardSize, setBoardSize] = useState(700); // Default size
  const [mounted, setMounted] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showMovementContent, setShowMovementContent] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted]);

  useEffect(() => {
    let isOpen =
      tabFocus == "opening" ||
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
  const [, setErrorMessage] = useState<string>("");
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const threeDPieces = useMemo(() => {
    const pieces = [
      {
        piece: "wP",
        pieceHeight: 1,
      },
      {
        piece: "wN",
        pieceHeight: 1.2,
      },
      {
        piece: "wB",
        pieceHeight: 1.3,
      },
      {
        piece: "wR",
        pieceHeight: 1.2,
      },
      {
        piece: "wQ",
        pieceHeight: 1.4,
      },
      {
        piece: "wK",
        pieceHeight: 0.87,
      },
      {
        piece: "bP",
        pieceHeight: 1,
      },
      {
        piece: "bN",
        pieceHeight: 1.2,
      },
      {
        piece: "bB",
        pieceHeight: 1.3,
      },
      {
        piece: "bR",
        pieceHeight: 1.2,
      },
      {
        piece: "bQ",
        pieceHeight: 1.4,
      },
      {
        piece: "bK",
        pieceHeight: 0.8,
      },
    ];
    const pieceComponents: {
      [key: string]: ({
        squareWidth,
        square,
      }: {
        squareWidth: number;
        square: Square;
      }) => JSX.Element;
    } = {};
    pieces.forEach(({ piece, pieceHeight }) => {
      pieceComponents[piece] = ({ squareWidth, square }) => (
        <div
          style={{
            width: squareWidth * pieceHeight,
            height: squareWidth,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <img
            src={`/3d-pieces/${piece}.webp`}
            width={squareWidth * pieceHeight}
            height={squareWidth}
            style={{
              position: "absolute",
              bottom: `${0.2 * squareWidth}px`,
              objectFit: piece[1] === "K" ? "contain" : "cover",
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, []);
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

      // Determine board orientation based on the headers
      const headers = tempGame.header();
      if (headers.Black && headers.Black.toLowerCase() === "you") {
        setBoardOrientation("black");
      } else {
        setBoardOrientation("white");
      }
      console.log("history", history);
      // Reset the current game
      const newGame = new Chess();
      setGame(newGame);
      setParsedMoves(history);
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

  const toggleBoardMode = () => {
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
      animationDuration: 200,
    };

    if (is3DMode) {
      return {
        ...baseProps,
        customBoardStyle: {
          transform: "rotateX(27.5deg)",
          border: "0",
          margin: "0",
          padding: "0",
          background: "#e0c094",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        },
        customLightSquareStyle: {
          backgroundColor: "#f0d9b5",
        },
        customDarkSquareStyle: {
          backgroundColor: "#b58863",
        },
      };
    }

    return baseProps;
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "Brilliant":
        return "border border-[#27C2A3] text-[#27C2A3]";
      case "Great":
        return "border border-[#749BBF] text-[#134472]";
      case "Best":
        return "border border-[#80B64D] text-[#80B64D]";
      case "Miss":
        return "border border-[#FF7769] text-[#FF7769]";
      case "Blunder":
        return "border border-[#FA402D] text-[#FA402D]";
      case "Mistake":
        return "border border-[#FFA459] text-[#FFA459]";
      default:
        return "border border-[#80B64D] text-[#80B64D]";
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
    const maxSize = window.innerWidth > 1300 ? window.innerWidth / 4.5 : 453;
    // const maxSize = window.innerWidth > 1300 ? 453 : window.innerWidth/1.5;
    console.log("Resizing board...", isPortrait);

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
  const fetchStockfishData = async (fen: string) => {
    const stockfishService = getStockfishService();

    try {
      await stockfishService.waitReady();

      const bestMove = await stockfishService.getBestMove(fen, 20, 0.1);
      setBestMove(bestMove);

      const evaluation = await stockfishService.getEvaluation(fen, 20);
      setEvaluation(evaluation);
    } catch (error) {
      console.error("Error using StockfishService:", error);
    } finally {
      stockfishService.destroy();
    }
  };

  useEffect(() => {
    handleResize();
  }, [hideDiv, is3DMode]);

  useEffect(() => {
    // console.log("Best move:", bestMove);
    // console.log("Evaluation:", evaluation);
  }, [bestMove, evaluation]);

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
            <div className="border border-input p-1 rounded-md flex flex-row justify-between items-center gap-2">
              <div className="flex flex-row gap-2">
                <Image
                  alt="avatar"
                  src={summary?.blackSide?.profileInfo.photo}
                  className="w-10 h-10 rounded-full"
                  width={1000}
                  height={1000}
                />
                {/* <div className="w-10 h-10 rounded-full bg-gray-300"></div> */}
                <div className="flex flex-col line-clamp-1 ">
                  <div className="flex flex-row gap-2">
                    <span
                      className={`text-xs sm:text-sm md:text-md lg:text-md font-medium ${
                        gameInfo?.whiteWin ? "text-black" : "text-[#00B427]"
                      }`}
                    >
                      {summary?.blackSide?.profileInfo.username}
                    </span>
                    {/* <Image
                    src={"/icons/switzerland-flag.png"}
                    alt="flag"
                    width={1000}
                    height={1000}
                    className="w-5 h-3 sm:w-7 sm:h-5 lg:w-10 lg:h-7"
                  /> */}
                  </div>

                  <div className="flex flex-row gap-1">
                    <Image
                      src={"/icons/pawn-icon-alt-black.png"}
                      alt="pawn"
                      width={1000}
                      height={1000}
                      className="w-3 h-4 sm:w-5 sm:h-4 lg:w-7 lg:h-5"
                    />
                    <Image
                      src={"/icons/bishop-icon-alt-black.png"}
                      alt="bishop"
                      width={1000}
                      height={1000}
                      className="w-3 h-4 sm:w-5 sm:h-4 lg:w-7 lg:h-5"
                    />

                    <Image
                      src={"/icons/king-icon-alt-black.png"}
                      alt="king"
                      width={1000}
                      height={1000}
                      className="w-3 h-4 sm:w-5 sm:h-4 lg:w-7 lg:h-5"
                    />
                  </div>
                </div>
              </div>
              <div className="border border-input min-w-28 rounded-md p-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
                <Watch size={16} />
                <span className="text-xs sm:text-sm md:text-md lg:text-md font-medium">
                  {currentMoveBlack == 0 ? "0:10:00:0" : currentMoveBlack}
                </span>
              </div>
            </div>
          </motion.div>
          <motion.div
            animate={
              hideDiv ? { opacity: 0, display: "hidden" } : { opacity: 1 }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ display: !hideDiv ? "block" : "none" }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={toggleBoardMode}
              title={is3DMode ? "Switch to 2D Mode" : "Switch to 3D Mode"}
              className="p-2"
            >
              {is3DMode ? (
                <SquareIcon className="h-5 w-5" />
              ) : (
                <Settings className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
          <div className={`${is3DMode && "mb-8 xl:m-8"}`}>
            <motion.div
              animate={
                is3DMode ? { opacity: 0, display: "hidden" } : { opacity: 1 }
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ display: !is3DMode ? "block" : "none" }}
            >
              <Chessboard
                boardWidth={
                  hideDiv
                    ? boardSize - 80
                    : is3DMode
                    ? boardSize - 76
                    : boardSize
                }
                {...getBoardProps()}
                arePiecesDraggable={false}
              />
            </motion.div>
            {/* ) : ( */}
            <motion.div
              animate={
                !is3DMode ? { opacity: 0, display: "hidden" } : { opacity: 1 }
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ display: is3DMode ? "block" : "none", marginTop: -20 }}
            >
              {/* <BoardWood
                size={
                  hideDiv
                    ? boardSize - 80
                    : is3DMode
                    ? boardSize - 100
                    : boardSize
                }
                position={game.fen()}
                boardOrientation={boardOrientation}
              /> */}
               <BoardWoodNew
                size={
                 boardSize
                }
                position={game.fen()}
                boardOrientation={boardOrientation}
              />
            </motion.div>
            {/* )} */}
          </div>
          {/* Group Button */}
          <div className="flex flex-row justify-around gap-4">
            <button
              onClick={jumpToFirstMove}
              disabled={currentMoveIndex === 0}
              className="w-1/5 flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] p-1 "
            >
              <SkipBackIcon fill="black" size={boardSize / 24} color="black" />
            </button>

            <button
              onClick={jumpToPreviousMove}
              disabled={currentMoveIndex === 0}
              className="w-1/5 flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] p-1 "
            >
              <ChevronLeft size={boardSize / 24} color="black" />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-1/5 flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] p-1 "
            >
              {isPlaying ? (
                <PauseIcon size={boardSize / 24} fill="black" color="black" />
              ) : (
                <PlayIcon size={boardSize / 24} fill="black" color="black" />
              )}
            </button>

            <button
              onClick={jumpToNextMove}
              disabled={currentMoveIndex >= parsedMoves.length}
              className="w-1/5 flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] p-1 "
            >
              <ChevronRight size={boardSize / 24} color="black" />
            </button>
            <button
              onClick={jumpToLastMove}
              disabled={currentMoveIndex >= parsedMoves.length}
              className="w-1/5 flex justify-center items-center h-[32px] sm:h-[40px] border border-primary rounded-[4px] p-1 "
            >
              <SkipForwardIcon
                fill="black"
                size={boardSize / 24}
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
            <div className="border border-input p-1 rounded-md flex flex-row justify-between items-center gap-2">
              <div className="flex flex-row gap-2">
                <Image
                  alt="avatar"
                  src={summary?.whiteSide?.profileInfo.photo}
                  className="w-10 h-10 rounded-full"
                  width={1000}
                  height={1000}
                />
                {/* <div className="w-10 h-10 rounded-full bg-gray-300"></div> */}
                <div className="flex flex-col line-clamp-1 ">
                  <div className="flex flex-row gap-2">
                    <span
                      className={`text-xs sm:text-sm md:text-md lg:text-md font-medium ${
                        !gameInfo?.whiteWin ? "text-black" : "text-[#00B427]"
                      }`}
                    >
                      {summary?.whiteSide?.profileInfo.username}
                    </span>
                    {/* <Image
                    src={"/icons/switzerland-flag.png"}
                    alt="flag"
                    width={1000}
                    height={1000}
                    className="w-4 h-3 sm:w-5 sm:h-4 lg:w-7 lg:h-5"
                  /> */}
                  </div>

                  <div className="flex flex-row gap-1">
                    <Image
                      src={"/icons/pawn-icon-alt-white.png"}
                      alt="pawn"
                      width={1000}
                      height={1000}
                      className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6"
                    />
                    <Image
                      src={"/icons/rook-icon-alt-white.png"}
                      alt="rook"
                      width={1000}
                      height={1000}
                      className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6"
                    />

                    <Image
                      src={"/icons/queen-icon-alt-white.png"}
                      alt="queen"
                      width={1000}
                      height={1000}
                      className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6"
                    />
                  </div>
                </div>
              </div>
              <div className="border border-input min-w-28 rounded-md p-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
                <Watch size={16} />
                <span className="text-xs sm:text-sm md:text-md lg:text-md font-medium">
                  {currentMoveWhite == 0 ? "0:10:00:0" : currentMoveWhite}
                </span>
              </div>
            </div>
          </motion.div>

          {showTable && <MovementTable />}
          {showMovementContent && !showTable&& chessMove.move != null && (
            <div className="w-full p-0" style={{ maxWidth: boardSize }}>
              <div className="flex flex-col gap-2 p-4 border border-primary rounded-md border-l-4">
                <div className="flex flex-row items-center justify-between gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-xs  sm:text-sm md:text-md lg:text-md xl:text-lg font-semibold">
                      {chessMove.move}
                    </span>
                    <span
                      className={`rounded-2xl px-3 py-[4px] border border-input text-xs sm:text-sm md:text-md lg:text-md xl:text-lg text-center font-normal py-2 ${getScoreClass(
                        chessMove?.classification.toLowerCase()
                      )}`}
                    >
                      {chessMove.evaluation}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <span
                      className={`mx-1 py-1 rounded-[4px] text-[11px] sm:text-sm md:text-md lg:text-md xl:text-md px-2 ${getBadgeClass(
                        chessMove.classification
                      )}`}
                    >
                      {chessMove.classification}
                    </span>
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
                <span className="text-sm font-normal py-1">
                  This move deviates from opening principles. Focus on
                  development and center control.
                </span>
                <div className="flex flex-row gap-1">
                  <InfoIcon size={16} color="#221AE9" />
                  <span className="text-sm">Type:</span>
                  <span className="text-sm font-semibold ">
                    {chessMove.gamePhase}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
