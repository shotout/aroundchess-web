"use client";

import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import Image from "next/image";
import { ChessPiece } from "../utils/ChessPieceUtils";
import { Cat, Clock, Trophy } from "lucide-react";

interface GameOutcomeDisplayProps {
  game: Chess;
  playerColor: "w" | "b";
  moveHistory: any[];
  pieceConfig: any;
  subcategoryName: string;
  startTime?: number;
  endTime?: number;
  isGameOver: boolean;
  onNewGame?: () => void;
  onRematch?: () => void;
}

export default function GameOutcomeDisplay({
  game,
  playerColor,
  moveHistory,
  pieceConfig,
  subcategoryName,
  startTime,
  endTime,
  isGameOver,
  onNewGame,
  onRematch,
}: GameOutcomeDisplayProps) {
  const [elapsedTime, setElapsedTime] = useState<string>("0 minutes");
  const [outcomeState, setOutcomeState] = useState<{
    isWin: boolean;
    title: string;
    subtitle: string;
    color: string;
  } | null>(null);

  // Calculate elapsed time
  useEffect(() => {
    if (startTime) {
      const calculateTime = () => {
        const now = endTime || Date.now();
        const elapsedMs = now - startTime;
        const minutes = Math.floor(elapsedMs / 60000);

        if (minutes < 1) {
          setElapsedTime("< 1 minute");
        } else if (minutes === 1) {
          setElapsedTime("1 minute");
        } else {
          setElapsedTime(`${minutes} minutes`);
        }
      };

      calculateTime();

      // Only set up the interval if we don't have an endTime
      if (!endTime) {
        const interval = setInterval(calculateTime, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
      }
    }
  }, [startTime, endTime]);

  // Determine game outcome
  useEffect(() => {
    if (!isGameOver) {
      setOutcomeState(null);
      return;
    }

    try {
      if (game.isCheckmate()) {
        const winner = game.turn() === "w" ? "black" : "white";
        const isPlayerWinner =
          (winner === "white" && playerColor === "w") ||
          (winner === "black" && playerColor === "b");

        if (isPlayerWinner) {
          setOutcomeState({
            isWin: true,
            title: "Game Won",
            subtitle: "You have won by Checkmate!",
            color: "#edfaed",
          });
        } else {
          setOutcomeState({
            isWin: false,
            title: "Game Lost",
            subtitle: "You have lost by Checkmate!",
            color: "#fdeded",
          });
        }
      } else if (game.isDraw()) {
        let reason = "Draw";

        if (game.isStalemate()) {
          reason = "Stalemate";
        } else if (game.isThreefoldRepetition()) {
          reason = "Threefold Repetition";
        } else if (game.isInsufficientMaterial()) {
          reason = "Insufficient Material";
        }

        setOutcomeState({
          isWin: false,
          title: "Game Drawn",
          subtitle: `The game ended in a draw by ${reason}!`,
          color: "#e5f3ff",
        });
      }
    } catch (error) {
      console.error("Error determining game outcome:", error);
    }
  }, [game, playerColor, isGameOver]);

  if (!outcomeState) return null;

  return (
    <div className="flex flex-col">
      <div
        className="w-full rounded-lg p-3 relative overflow-hidden"
        style={{
          backgroundColor: outcomeState.color,
          border: `2px solid ${
            outcomeState.isWin
              ? "#00a000"
              : outcomeState.color === "#e5f3ff"
              ? "#2336f3"
              : "#d00000"
          }`,
        }}
      >
        {/* Background trophy watermark */}
        <div className="absolute -right-5 -bottom-5 opacity-10 pointer-events-none">
          {/* <Image
            src={
              outcomeState.isWin
                ? "/endgame-training/trophy-bg.png"
                : "/endgame-training/checkmate-bg.png"
            }
            alt="background"
            width={100}
            height={100}
          /> */}
        </div>

        <div className="flex flex-col">
          {/* Compact Header */}
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-400 mr-3 flex items-center justify-center">
              {/* <Image
                src={
                  outcomeState.isWin
                    ? "/endgame-training/trophy.png"
                    : "/endgame-training/checkmate-icon.png"
                }
                alt="outcome icon"
                width={25}
                height={25}
              /> */}
              <Trophy />
            </div>
            <div>
              <h2 className="text-lg font-bold">{outcomeState.title}</h2>
              <p className="text-sm">{outcomeState.subtitle}</p>
            </div>
          </div>

          {/* Game stats with pieces on left, stats stacked on right */}
          <div className="flex space-x-3">
            {/* Chess pieces display - LEFT */}
            <div className="w-1/2 bg-white rounded-md p-2 flex justify-center items-center">
              {pieceConfig && pieceConfig.pieces ? (
                <div className="flex items-center justify-center space-x-2">
                  {pieceConfig.pieces.map((piece: any, i: number) => (
                    <ChessPiece
                      key={i}
                      type={piece.type}
                      color={piece.color}
                      count={piece.count}
                      width={25}
                      height={25}
                      vsWidth={25}
                      vsHeight={25}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs">No piece configuration</p>
              )}
            </div>

            {/* Stats display - RIGHT (stacked vertically) */}
            <div className="w-1/2 flex flex-col space-y-1">
              {/* Elapsed time - TOP */}
              <div className="bg-blue-base text-white  rounded-md p-1.5 flex items-center">
                {/* <Image
                  src="/endgame-training/clock.png"
                  alt="time"
                  width={16}
                  height={16}
                  className="mr-2"
                /> */}
                <Clock />
                <span className="text-xs font-medium">{elapsedTime}</span>
              </div>

              {/* Moves count - MIDDLE */}
              <div className="p-1.5 flex items-center">
                {/* <Image
                  src="/endgame-training/moves.png"
                  alt="moves"
                  width={16}
                  height={16}
                  className="mr-2"
                /> */}
                <Cat />
                <span className="text-xs font-medium">
                  {moveHistory.length} Moves
                </span>
              </div>

              {/* Subcategory name - BOTTOM */}
              <div className="p-1.5 flex items-center">
                <span className="text-xs font-medium truncate">
                  {subcategoryName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
