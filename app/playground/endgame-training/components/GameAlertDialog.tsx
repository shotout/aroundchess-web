"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RotateCcw, X } from "lucide-react";
import { Chess } from "chess.js";

interface GameAlertDialogProps {
  open: boolean;
  game: Chess;
  playerColor: "w" | "b";
  onRematch: () => void;
  onClose: () => void;
}

type GameEndState = {
  title: string;
  message: string;
  description?: string;
  color: "green" | "red" | "blue" | "gray";
};

const GameAlertDialog = ({
  open,
  game,
  playerColor,
  onRematch,
  onClose,
}: GameAlertDialogProps) => {
  const getGameEndState = (): GameEndState => {
    try {
      if (game.isCheckmate()) {
        const winner = game.turn() === "w" ? "black" : "white";
        const isPlayerWinner =
          (winner === "white" && playerColor === "w") ||
          (winner === "black" && playerColor === "b");

        if (isPlayerWinner) {
          return {
            title: "Victory!",
            message: "You won this game by checkmate!",
            color: "green",
          };
        } else {
          return {
            title: "Defeat",
            message: "Your opponent won by checkmate.",
            color: "red",
          };
        }
      }

      if (game.isStalemate()) {
        return {
          title: "Draw - Stalemate",
          message: "The game ended in a draw by stalemate.",
          description:
            "Stalemate occurs when a player has no legal moves but their king is not in check.",
          color: "blue",
        };
      }

      if (game.isThreefoldRepetition()) {
        return {
          title: "Draw - Threefold Repetition",
          message: "The same position has occurred three times.",
          description:
            "The game is drawn when the same position occurs three times with the same player to move.",
          color: "blue",
        };
      }

      if (game.isInsufficientMaterial()) {
        return {
          title: "Draw - Insufficient Material",
          message: "Neither player has enough pieces to force a checkmate.",
          description:
            "This typically happens with king vs king, king+bishop vs king, or king+knight vs king.",
          color: "blue",
        };
      }

      if (game.isDraw()) {
        return {
          title: "Draw",
          message: "The game has ended in a draw.",
          description:
            "This may be due to the 50-move rule or another draw condition.",
          color: "blue",
        };
      }
    } catch (error) {
      console.error("Error checking game status:", error);
    }

    // Default case
    return {
      title: "Game Over",
      message: "The game has ended.",
      color: "gray",
    };
  };

  const { title, message, description, color } = getGameEndState();

  const getColorStyles = () => {
    switch (color) {
      case "green":
        return {
          background: "bg-[#edfaed]",
          border: "border-[#00a000]",
          text: "text-[#00a000]",
        };
      case "red":
        return {
          background: "bg-[#fdeded]",
          border: "border-[#d00000]",
          text: "text-[#d00000]",
        };
      case "blue":
        return {
          background: "bg-[#e5f3ff]",
          border: "border-[#2336f3]",
          text: "text-[#2336f3]",
        };
      default:
        return {
          background: "bg-[#f0f0f0]",
          border: "border-gray-400",
          text: "text-gray-700",
        };
    }
  };

  const colorStyles = getColorStyles();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 border-0 overflow-hidden bg-transparent sm:rounded-lg">
        <div
          className={`relative ${colorStyles.background} border-4 ${colorStyles.border} rounded-3xl p-8 pt-16 pb-12 w-full max-w-md mx-auto`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 text-[#0a142f] hover:text-black"
          >
            <X size={32} />
          </button>

          <div className="flex flex-col items-center text-center z-10 relative">
            <h1 className={`text-5xl font-bold ${colorStyles.text} mb-6`}>
              {title}
            </h1>
            <p className="text-2xl text-[#0a142f] font-medium mb-6">
              {message}
            </p>

            {description && (
              <p className="text-lg text-[#0a142f] opacity-80 mb-12">
                {description}
              </p>
            )}

            <div className="flex w-full mt-4 space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 bg-[#2336f3] text-white py-5 px-6 rounded-full text-xl font-bold hover:bg-[#1a29d1] transition-colors"
              >
                New Game
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRematch();
                  onClose();
                }}
                className="flex-1 bg-[#e5f3ff] text-[#2336f3] py-5 px-6 rounded-full text-xl font-bold border-2 border-[#d6e8fc] hover:bg-[#d6e8fc] transition-colors flex items-center justify-center"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Rematch
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameAlertDialog;
