"use client";

import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import Image from "next/image";
import { ChessPiece } from "../utils/ChessPieceUtils";
import { Cat, Clock, Trophy, X, Info } from "lucide-react";

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

type GameOutcomeState = {
  isWin: boolean;
  title: string;
  subtitle: string;
  description?: string;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  iconType: "trophy" | "checkmate" | "draw";
};

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
  const [outcomeState, setOutcomeState] = useState<GameOutcomeState | null>(
    null
  );
  const [showDescription, setShowDescription] = useState<boolean>(false);

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

      if (!endTime) {
        const interval = setInterval(calculateTime, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (!isGameOver) {
      setOutcomeState(null);
      return;
    }

    try {
      const winner = game.turn() === "w" ? "black" : "white";
      const isPlayerWinner =
        (winner === "white" && playerColor === "w") ||
        (winner === "black" && playerColor === "b");

      let outcome = null;

      switch (true) {
        case game.isCheckmate():
          outcome = isPlayerWinner
            ? {
                isWin: true,
                title: "Game Won",
                subtitle: "You have won by Checkmate!",
                bgClass: "bg-[#edfaed]",
                borderClass: "border-[#29A709]",
                iconBgClass: "bg-[#00a000]",
                iconType: "trophy",
              }
            : {
                isWin: false,
                title: "Game Lost",
                subtitle: "Your opponent won by Checkmate",
                bgClass: "bg-[#fdeded]",
                borderClass: "border-[#d00000]",
                iconBgClass: "bg-[#d00000]",
                iconType: "checkmate",
              };
          break;

        case game.isStalemate():
          outcome = {
            isWin: false,
            title: "Game Drawn",
            subtitle: "Draw by Stalemate",
            description:
              "Stalemate is a kind of Draw that happens when one side has no legal moves to make. If the King is not in check, but no piece can be moved without putting the king in check, then the Game will end with a Stalemate Draw.",
            bgClass: "bg-[#e5f3ff]",
            borderClass: "border-[#2336f3]",
            iconBgClass: "bg-[#2336f3]",
            iconType: "draw",
          };
          break;

        case game.isThreefoldRepetition():
          outcome = {
            isWin: false,
            title: "Game Drawn",
            subtitle: "Draw by Threefold Repetition",
            description:
              "The threefold repetition rule states that if a game reaches the same position three times, a Draw can be Claimed.",
            bgClass: "bg-[#e5f3ff]",
            borderClass: "border-[#2336f3]",
            iconBgClass: "bg-[#2336f3]",
            iconType: "draw",
          };
          break;

        case game.isInsufficientMaterial():
          outcome = {
            isWin: false,
            title: "Game Drawn",
            subtitle: "Draw by Insufficient Material",
            description:
              "The 'Insufficient material' rule dictates that a game is automatically declared a Draw if there is no way to end the game in checkmate.",
            bgClass: "bg-[#e5f3ff]",
            borderClass: "border-[#2336f3]",
            iconBgClass: "bg-[#2336f3]",
            iconType: "draw",
          };
          break;

        case game.isDraw():
          outcome = {
            isWin: false,
            title: "Game Drawn",
            subtitle: "Draw by Rule",
            description:
              "This may be due to the 50-move rule or another draw condition.",
            bgClass: "bg-[#e5f3ff]",
            borderClass: "border-[#2336f3]",
            iconBgClass: "bg-[#2336f3]",
            iconType: "draw",
          };
          break;

        default:
          outcome = {
            isWin: false,
            title: "Game Over",
            subtitle: "The game has ended",
            bgClass: "bg-[#f0f0f0]",
            borderClass: "border-gray-400",
            iconBgClass: "bg-gray-400",
            iconType: "draw",
          };
          break;
      }

      setOutcomeState(outcome);
    } catch (error) {
      console.error("Error determining game outcome:", error);
    }
  }, [game, playerColor, isGameOver]);

  if (!outcomeState) return null;

  return (
    <div className="flex flex-col">
      <div
        className={`w-full rounded-lg p-3 relative overflow-hidden ${outcomeState.bgClass} border-2 ${outcomeState.borderClass}`}
      >
        <div className="absolute -right-5 -bottom-5 opacity-10 pointer-events-none"></div>

        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <div
              className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${outcomeState.iconBgClass}`}
            >
              {outcomeState.iconType === "trophy" ? (
                <Trophy className="text-white" size={25} />
              ) : outcomeState.iconType === "checkmate" ? (
                <X className="text-white" size={25} />
              ) : (
                <Clock className="text-white" size={25} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{outcomeState.title}</h2>
              <p className="text-sm">{outcomeState.subtitle}</p>
            </div>

            {outcomeState.description && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="bg-white rounded-full p-1 hover:bg-gray-100"
              >
                <Info
                  size={16}
                  className={outcomeState.borderClass.replace(
                    "border-",
                    "text-"
                  )}
                />
              </button>
            )}
          </div>

          {showDescription && outcomeState.description && (
            <div className="mb-3 p-2 bg-white bg-opacity-50 rounded-md">
              <p className="text-xs text-gray-800">
                {outcomeState.description}
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <div
              className={`w-1/2 bg-white rounded-md p-2 flex justify-center items-center border-2 ${outcomeState.borderClass}`}
            >
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

            <div className="w-1/2 flex flex-col space-y-1">
              <div className="bg-blue-500 text-white rounded-md p-1.5 flex items-center">
                <Clock size={16} className="mr-2" />
                <span className="text-xs font-medium">{elapsedTime}</span>
              </div>

              <div className="p-1.5 flex items-center">
                <Cat size={16} className="mr-2" />
                <span className="text-xs font-medium">
                  {moveHistory.length} Moves
                </span>
              </div>

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
