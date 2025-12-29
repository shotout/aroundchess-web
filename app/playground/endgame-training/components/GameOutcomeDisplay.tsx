"use client";

import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import Image from "next/image";
import { ChessPiece } from "../utils/ChessPieceUtils";
import { Clock, Info } from "lucide-react";

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
  iconType: "win" | "loss" | "draw";
  bgImage: string;
} | null;

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
                iconType: "win-icon.png",
                bgImage: "Won-Checkmate.png",
              }
            : {
                isWin: false,
                title: "Game Lost",
                subtitle: "Your opponent won by Checkmate",
                bgClass: "bg-[#fdeded]",
                borderClass: "border-[#d00000]",
                iconType: "loss-icon.png",
                bgImage: "Loss.png",
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
            iconType: "draw-icon.png",
            bgImage: "Draw-Stalemate.png",
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
            iconType: "draw-icon.png",
            bgImage: "Draw-Threefold-Repetition.png",
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
            iconType: "draw-icon.png",
            bgImage: "Draw-Insufficient-Material.png",
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
            iconType: "draw-icon.png",
            bgImage: "Draw-Stalemate.png",
          };
          break;

        default:
          outcome = {
            isWin: false,
            title: "Game Over",
            subtitle: "The game has ended",
            bgClass: "bg-[#f0f0f0]",
            borderClass: "border-gray-400",
            iconType: "draw-icon.png",
            bgImage: "Draw-Stalemate.png",
          };
          break;
      }

      setOutcomeState(outcome as any);
    } catch (error) {
      console.error("Error determining game outcome:", error);
    }
  }, [game, playerColor, isGameOver]);

  if (!outcomeState) return null;

  return (
    <div className="flex relative flex-col overflow-hidden">
      <div
        className={`w-full rounded-lg p-4 relative overflow-hidden ${outcomeState.bgClass} border-2 ${outcomeState.borderClass}`}
      >
        <div className="absolute -right-5 -bottom-5 opacity-10 pointer-events-none"></div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <div
              className={`w-auto h-auto rounded-full flex items-center justify-center mr-3`}
            >
              <Image
                src={`/endgame-training/${outcomeState.iconType}`}
                alt={`${outcomeState.iconType} icon`}
                width={50}
                height={50}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{outcomeState.title}</h2>
              <p className="text-[14px] --sm">{outcomeState.subtitle}</p>
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
            <div className="p-2 bg-white bg-opacity-50 rounded-md">
              <p className="text-[14px] --xs text-gray-800">
                {outcomeState.description}
              </p>
            </div>
          )}

          {/* <div className="flex">
            <div
              className={`w-1/2 bg-white rounded-md p-2 flex justify-center items-center border-2 ${outcomeState.borderClass} mr-3`}
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
                <p className="text-[14px] --xs">No piece configuration</p>
              )}
            </div>

            <div className="w-1/2 flex flex-col space-y-2">
              <div className="bg-blue-base w-[100px] gap-x-2 text-white rounded-md p-1 flex items-center">
                <Clock size={16} className="text-blue-base" fill="white" />
                <span className="text-[14px] --xs font-medium">{elapsedTime}</span>
              </div>

              <div className="flex items-center">
                <Image
                  src="/endgame-training/move-icon.png"
                  alt="move icon"
                  width={30}
                  height={30}
                  className="mr-2"
                />
                <span className="text-[14px] --sm font-medium">
                  {moveHistory.length} Moves
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-[14px] --sm font-medium truncate">
                  {subcategoryName}
                </span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <div className="absolute right-0 top-0 pointer-events-none">
        <Image
          src={`/endgame-training/dialog/${outcomeState.bgImage}`}
          alt="chess board"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
}
