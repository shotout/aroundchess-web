"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import pgnParser from "pgn-parser";
import { getStockfishService } from "@/lib/stockfish/stockfish-service";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  PauseIcon,
  Play,
  PlayIcon,
  Settings,
  SkipBackIcon,
  SkipForwardIcon,
  SquareIcon,
  Watch,
} from "lucide-react";
import Board from "./3DBoard";
import { usePgnStore } from "../store/zustandStore";
import { Button } from "@/components/ui/button";

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
  const [game, setGame] = useState(new Chess());
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [boardSize, setBoardSize] = useState(700); // Default size
  const [mounted, setMounted] = useState(true);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({
    white: [],
    black: [],
  });
  const [materialAdvantage, setMaterialAdvantage] = useState(0); // positive for white advantage
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  //jahitan
  const { pgn: storePgn } = usePgnStore(); // Get PGN from the Zustand store
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [, setPgn] = useState<string>("");
  const [parsedMoves, setParsedMoves] = useState<ParsedMove[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white"
  );
  const [, setErrorMessage] = useState<string>("");
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

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

      // Extract history of moves
      const history = tempGame.history({ verbose: true }) as ParsedMove[];

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
      setParsedMoves(history);
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
          return prevIndex + 1;
        } else {
          stopAutoPlay();
          return prevIndex;
        }
      });
    }, 400);
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
    setCurrentMoveIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const jumpToNextMove = () => {
    stopAutoPlay();
    setCurrentMoveIndex((prevIndex) =>
      Math.min(parsedMoves.length, prevIndex + 1)
    );
  };

  const jumpToFirstMove = () => {
    stopAutoPlay();
    setCurrentMoveIndex(0);
  };

  const jumpToLastMove = () => {
    stopAutoPlay();
    setCurrentMoveIndex(parsedMoves.length);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };

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

  const handleResize = () => {
    console.log("Resizing board...");
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = 700;

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

  // useEffect(() => {
  //   fetchStockfishData(currentFen);
  // }, [currentFen]);

  useEffect(() => {
    console.log("Best move:", bestMove);
    console.log("Evaluation:", evaluation);
  }, [bestMove, evaluation]);

  return (
    <div className="flex justify-center gap-4 bg-white pb-4">
      <div className="flex flex-col gap-4">
        <div className="md:hidden">
          <h2 className="text-md pt-4 text-center font-bold">
            Analysis Result from{" "}
            <span className="text-[#4E7838]">Chess.com</span>
          </h2>
        </div>
        <div className="border border-input p-1 rounded-md flex flex-row justify-between items-center gap-2">
          <div className="flex flex-row gap-2">
            {/* <Image 
            alt="avatar"
            src={"/images/icons/"}/> */}
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <span className="text-xs sm:text-sm md:text-md lg:text-lg font-medium text-[#00B427]">
                  Player name
                </span>
                <Image
                  src={"/icons/switzerland-flag.png"}
                  alt="flag"
                  width={1000}
                  height={1000}
                  className="w-5 h-3 sm:w-7 sm:h-5 lg:w-10 lg:h-7"
                />
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
          <div className="border border-input rounded-md p-2 flex flex-row items-center gap-2 sm:gap-4">
            <Watch size={16} />
            <span className="text-xs sm:text-sm md:text-md lg:text-lg font-medium">
              7:00
            </span>
          </div>
        </div>
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
        <Chessboard
          boardWidth={boardSize}
          {...getBoardProps()}
          arePiecesDraggable={false}
        />
        {/* Group Button */}
        <div className="flex flex-row justify-around gap-4">
          <button
            onClick={jumpToFirstMove}
            disabled={currentMoveIndex === 0}
            className="w-1/5 flex justify-center items-center sm:h-12 border border-primary rounded-[4px] p-1 "
          >
            <SkipBackIcon fill="black" size={boardSize / 24} color="black" />
          </button>

          <button
            onClick={jumpToPreviousMove}
            disabled={currentMoveIndex === 0}
            className="w-1/5 flex justify-center items-center sm:h-12 border border-primary rounded-[4px] p-1 "
          >
            <ChevronLeft size={boardSize / 24} color="black" />
          </button>
          <button
            onClick={togglePlayPause}
            className="w-1/5 flex justify-center items-center sm:h-12 border border-primary rounded-[4px] p-1 "
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
            className="w-1/5 flex justify-center items-center sm:h-12 border border-primary rounded-[4px] p-1 "
          >
            <ChevronRight size={boardSize / 24} color="black" />
          </button>
          <button
            onClick={jumpToLastMove}
            disabled={currentMoveIndex >= parsedMoves.length}
            className="w-1/5 flex justify-center items-center sm:h-12 border border-primary rounded-[4px] p-1 "
          >
            <SkipForwardIcon fill="black" size={boardSize / 24} color="black" />
          </button>
        </div>
        <div className="border border-input p-1 rounded-md flex flex-row justify-between items-center gap-2">
          <div className="flex flex-row gap-2">
            {/* <Image 
            alt="avatar"
            src={"/images/icons/"}/> */}
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <span className="text-xs sm:text-sm md:text-md lg:text-lg font-medium text-[#00B427]">
                  Player name
                </span>
                <Image
                  src={"/icons/switzerland-flag.png"}
                  alt="flag"
                  width={1000}
                  height={1000}
                  className="w-4 h-3 sm:w-5 sm:h-4 lg:w-7 lg:h-5"
                />
              </div>

              <div className="flex flex-row gap-1">
                <Image
                  src={"/icons/pawn-icon-alt-white.png"}
                  alt="pawn"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
                <Image
                  src={"/icons/rook-icon-alt-white.png"}
                  alt="rook"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />

                <Image
                  src={"/icons/queen-icon-alt-white.png"}
                  alt="queen"
                  width={1000}
                  height={1000}
                  className="w-3 h-4 sm:w-5 sm:h-4 lg:w-7 lg:h-5"
                />
              </div>
            </div>
          </div>
          <div className="border border-input rounded-md p-2 flex flex-row items-center gap-2 sm:gap-4">
            <Watch size={16} />
            <span className="text-xs sm:text-sm md:text-md lg:text-lg font-medium">
              7:00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
