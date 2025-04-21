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
            title: "Checkmate!",
            message: "You won this game by checkmate!",
            color: "green",
          };
        } else {
          return {
            title: "Loss - Checkmate!",
            message: "Your game ended in Checkmate.",
            color: "red",
          };
        }
      }

      if (game.isStalemate()) {
        return {
          title: "Draw - Stalemate",
          message: "Keep practicing, you'll get it!",
          description:
            "Why Draw? Stalemate is a kind of Draw that happens when one side has no legal moves to make. If the King is not in check, but no piece can be moved without putting the king in check, then the Game will end with a Stalemate Draw.",
          color: "blue",
        };
      }

      if (game.isThreefoldRepetition()) {
        return {
          title: "Draw - Threefold Repetition",
          message: "Keep practicing, you'll get it!",
          description:
            "Why Draw? The threefold repetition rule states that if a game reaches the same position three times, a Draw can be Claimed.",
          color: "blue",
        };
      }

      if (game.isInsufficientMaterial()) {
        return {
          title: "Draw - Insufficient Material",
          message: "Keep practicing, you'll get it!",
          description:
            "Why Draw? The 'Insufficient material' rule dictates that a game is automatically declared a Draw if there is no way to end the game in checkmate",
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
      <DialogContent className="p-2 max-w-[343px] max-h-[140px] border-none shadow-none bg-transparent sm:rounded-lg [&>button]:hidden">
        <div
          className={`relative ${colorStyles.background} border-2 ${colorStyles.border} rounded-xl w-full mx-auto p-4`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-1 right-1 text-[#0a142f] hover:text-black"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col items-start z-10 relative">
            <h1
              className={`text-lg font-bold ${colorStyles.text} mb-1 text-left w-full`}
            >
              {title}
            </h1>
            <p className="text-sm text-[#0a142f] font-medium mb-1 text-left w-full">
              {message}
            </p>

            {description && (
              <p className="text-xs text-[#0a142f] opacity-80 mb-2 text-left w-full">
                {description}
              </p>
            )}

            <div className="flex w-full mt-1 space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 bg-[#2336f3] text-white py-1 px-2 rounded-full text-xs font-bold hover:bg-[#1a29d1] transition-colors"
              >
                New Game
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRematch();
                  onClose();
                }}
                className="flex-1 bg-[#e5f3ff] text-[#2336f3] py-1 px-2 rounded-full text-xs font-bold border border-[#d6e8fc] hover:bg-[#d6e8fc] transition-colors flex items-center justify-center"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
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
