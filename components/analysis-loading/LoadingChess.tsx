"use client";

import React, { useState, useEffect, useRef } from "react";
import { Chess, Square } from "chess.js";
import { usePgnStore } from "@/app/store/zustandStore";
import { motion } from "framer-motion";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import ThreeDBoard from "../chessboard/3d/ThreeDChessboard";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

interface ParsedMove {
  color: string;
  from: string;
  to: string;
  flags: string;
  piece: string;
  san: string;
  [key: string]: any;
}

const PgnPlayer: React.FC = () => {
  const {
    StyleChoosed,
    setStyleChoosed,
    BoardChoosed,
    setBoardChoosed,
    PieceChoosed,
    setPieceChoosed,
  } = useChessBoardThemeStore();
  const { pgn: storePgn, error: storeError } = usePgnStore();
  const [game, setGame] = useState<Chess>(new Chess());
  const [moveHistory, setMoveHistory] = useState<ParsedMove[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [boardOrientation] = useState<"white" | "black">("white");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [boardSize, setBoardSize] = useState(700); // Default size
  const [mounted, setMounted] = useState(false);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   let is3D = StyleChoosed == "3d" ? true : false;
  //   setIs3DMode(is3D);
  //   console.log("StyleChoosed", StyleChoosed);
  // }, [StyleChoosed]);

  const manuallyPlayPgn = (pgnText: string) => {
    try {
      const cleanedPgn = pgnText.replace(/\{[^}]*\}/g, "");
      const newGame = new Chess();
      const movesText = cleanedPgn.split(/\[\s*.*?\s*\]/g).pop() || "";
      const movePattern =
        /(?:(?:\d+\.+\s*)?([KQRBNP]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?|O-O(?:-O)?|0-0(?:-0)?)[+#]?)/g;

      const moves: string[] = [];
      let match;

      while ((match = movePattern.exec(movesText)) !== null) {
        const move = match[1]?.trim();
        if (move && move.length > 0) {
          moves.push(move);
        }
      }

      const filteredMoves = moves.filter(
        (m) => !["1-0", "0-1", "1/2-1/2"].includes(m)
      );
      const parsedMoves: ParsedMove[] = [];

      for (const moveText of filteredMoves) {
        try {
          const moveResult = newGame.move(moveText);
          if (moveResult) {
            parsedMoves.push(moveResult as ParsedMove);
          }
        } catch (moveError) {
          console.error(`Error applying move "${moveText}":`, moveError);
        }
      }

      if (parsedMoves.length === 0) {
        setError("No valid moves found in PGN");
        return false;
      }

      setGame(new Chess());
      setMoveHistory(parsedMoves);
      setCurrentMoveIndex(0);
      setError(null);

      return true;
    } catch (err: any) {
      setError(
        `Error parsing PGN: ${err instanceof Error ? err.message : String(err)}`
      );
      return false;
    }
  };

  const extractMovesFromPgn = (pgnText: string) => {
    try {
      const cleanedPgn = pgnText.replace(/\{[^}]*\}/g, "");

      const parts = cleanedPgn.split(/\n\n/);
      const movesSection = parts[parts.length - 1].trim();

      const movesOnly = movesSection
        .replace(/\d+\.\s*/g, "") // Remove move numbers like "1. "
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      const moves = movesOnly
        .split(" ")
        .filter((m) => m && !["1-0", "0-1", "1/2-1/2"].includes(m));

      console.log(
        `Extracted ${moves.length} moves using direct method. First 5:`,
        moves.slice(0, 5)
      );

      const newGame = new Chess();
      const parsedMoves: ParsedMove[] = [];

      for (const moveText of moves) {
        try {
          if (moveText && moveText.length > 0) {
            const moveResult = newGame.move(moveText);
            if (moveResult) {
              parsedMoves.push(moveResult as ParsedMove);
              console.log(`Applied move: ${moveText}`);
            }
          }
        } catch (moveError) {
          console.error(`Error applying move "${moveText}":`, moveError);
        }
      }

      if (parsedMoves.length === 0) {
        return false;
      }

      setGame(new Chess());
      setMoveHistory(parsedMoves);
      setCurrentMoveIndex(0);
      setError(null);

      return true;
    } catch (err) {
      console.error("Error in direct move extraction:", err);
      return false;
    }
  };

  useEffect(() => {
    if (!storePgn) {
      return;
    }

    setIsLoading(true);

    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    // Reset move index
    setCurrentMoveIndex(0);

    // Try to parse the PGN
    setTimeout(() => {
      // First try with our manual method
      let success = manuallyPlayPgn(storePgn);
      // If that fails, try with the direct move extraction method
      if (!success) {
        console.log("First parsing method failed, trying direct extraction");
        success = extractMovesFromPgn(storePgn);
      }

      if (!success) {
        // As a last resort, try letting chess.js handle it
        try {
          const tempGame = new Chess();
          tempGame.loadPgn(storePgn);

          if (tempGame.history().length > 0) {
            const history = tempGame.history({ verbose: true }) as ParsedMove[];
            setMoveHistory(history);
            setCurrentMoveIndex(0);
            setGame(new Chess());
            setError(null);
            success = true;
            console.log("Parsing successful with chess.js");
          }
        } catch (err) {
          console.error("All parsing methods failed:", err);
          setError("Failed to parse PGN. Please check the format.");
        }
      }

      setIsLoading(false);
    }, 500);
  }, [storePgn]);

  // Handle store errors
  useEffect(() => {
    if (storeError) {
      setError(storeError.message);
    }
  }, [storeError]);

  // Auto-play effect
  useEffect(() => {
    // console.log(currentMoveIndex, moveHistory.length)
    // Skip if we don't have moves or are at the end
    if (moveHistory.length === 0 || currentMoveIndex >= moveHistory.length) {
      return;
    } else if (currentMoveIndex == moveHistory.length - 1) {
      console.log("Reached end of moves");
      setCurrentMoveIndex(0);
      setGame(new Chess());
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    }

    // Clear existing timer
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }

    // Set timer for next move
    autoPlayTimerRef.current = setTimeout(() => {
      try {
        // Make a copy of the current game state
        const newGame = new Chess(game.fen());

        // Make the next move
        const moveData = moveHistory[currentMoveIndex];
        newGame.move(moveData);

        // Update game and move index
        setGame(newGame);
        setCurrentMoveIndex((prev) => prev + 1);

        // console.log(
        //   `Made move ${currentMoveIndex + 1}/${moveHistory.length}: ${
        //     moveData.san
        //   }`
        // );
      } catch (err) {
        console.error("Error making move:", err);
        setError(
          `Error making move: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    }, 150);

    // Cleanup function
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [game, moveHistory, currentMoveIndex]);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);
  // Clean up on unmount
  useEffect(() => {
    handleResize();
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, []);
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1440 ? window.innerWidth / 3 : 480;
    // const maxSize = window.innerWidth > 1300 ? 453 : window.innerWidth/1.5;
    console.log("Resizing board...", isPortrait, window.innerWidth);

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
  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-3 mx-auto">
        {!is3DMode && (
          <TwoDChessboard
            boardWidth={boardSize}
            orientation={boardOrientation}
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

        {is3DMode && (
          <div className="-mt-[40px]">
            <ThreeDBoard
              boardWidth={boardSize}
              orientation={boardOrientation}
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
          </div>
        )}
      </div>

      {/* <div className="text-center mt-4">
          <p>
            Move: {currentMoveIndex} / {moveHistory.length}
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div> */}

      {/* <div className="">
        <p className="text-sm md:text-md text-center">
          Move: {currentMoveIndex} / {moveHistory.length}
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div> */}
    </div>
  );
};

export default PgnPlayer;
