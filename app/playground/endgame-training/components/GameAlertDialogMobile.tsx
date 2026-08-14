"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Chess } from "chess.js";
import Image from "next/image";

interface GameAlertDialogMobileProps {
  open: boolean;
  game: Chess;
  playerColor: "w" | "b";
  onRematch: () => void;
  onClose: () => void;
  navigateNext: () => void;
  handleShare: () => void;
  resetPosition: () => void;
}

type GameEndState = {
  title: string;
  message: string;
  description?: string;
  color: "green" | "red" | "blue" | "gray";
  image: string;
};

const GameAlertDialogMobile = ({
  open,
  game,
  playerColor,
  onClose,
  navigateNext,
  handleShare,
  resetPosition,
}: GameAlertDialogMobileProps) => {
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
            image: "Won-Checkmate",
          };
        } else {
          return {
            title: "Loss - Checkmate!",
            message: "Your game ended in Checkmate.",
            color: "red",
            image: "Loss",
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
          image: "Draw-Stalemate",
        };
      }

      if (game.isThreefoldRepetition()) {
        return {
          title: "Draw - Threefold Repetition",
          message: "Keep practicing, you'll get it!",
          description:
            "Why Draw? The threefold repetition rule states that if a game reaches the same position three times, a Draw can be Claimed.",
          color: "blue",
          image: "Draw-Threefold-Repetition",
        };
      }

      if (game.isInsufficientMaterial()) {
        return {
          title: "Draw - Insufficient Material",
          message: "Keep practicing, you'll get it!",
          description:
            "Why Draw? The 'Insufficient material' rule dictates that a game is automatically declared a Draw if there is no way to end the game in checkmate",
          color: "blue",
          image: "Draw-Insufficient-Material",
        };
      }

      if (game.isDraw()) {
        return {
          title: "Draw",
          message: "The game has ended in a draw.",
          description:
            "This may be due to the 50-move rule or another draw condition.",
          color: "blue",
          image: "Draw-Stalemate",
        };
      }
    } catch (error) {
      console.error("Error checking game status:", error);
    }

    return {
      title: "Game Over",
      message: "The game has ended.",
      color: "gray",
      image: "",
    };
  };

  const { title, message, description, color, image } = getGameEndState();

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
    <div className="md:hidden">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className="fixed bottom-0 left-0 right-0 z-50"
            >
              <div
                className={`${colorStyles.background} border-t-4 ${colorStyles.border} rounded-t-3xl md:mb-2 p-6 relative overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
              >
                {image && (
                  <div className="absolute right-0 top-0 opacity-20">
                    <Image
                      src={`/endgame-training/dialog/${image}.png`}
                      alt=""
                      width={120}
                      height={120}
                    />
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-[#0a142f] hover:text-black z-10"
                >
                  <X size={20} />
                </button>

                <div className="relative z-10">
                  <div className="mb-6">
                    <h1
                      className={`text-2xl font-bold ${colorStyles.text} mb-2`}
                    >
                      {title}
                    </h1>
                    <p className="text-base text-[#0a142f] font-medium mb-3">
                      {message}
                    </p>

                    {description && (
                      <p className="text-[14px] --sm text-[#0a142f] opacity-80 leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-x-1 w-full justify-between">
                    <button
                      className="flex flex-1 gap-x-1 bg-white text-[14px] --xs items-center justify-center px-3 py-2 text-blue-base rounded-full border border-primary-gray whitespace-nowrap flex-shrink-0"
                      onClick={(e) => {
                        handleShare();
                      }}
                    >
                      <Image
                        src={"/endgame-training/share.png"}
                        alt="download icon"
                        width={12}
                        height={12}
                      />
                      Share PGN/FEN
                    </button>

                    <button
                      onClick={(e) => {
                        resetPosition();
                      }}
                      className="flex gap-x-1 flex-1 items-center justify-center px-3 py-2 bg-white rounded-full btn-tertiary whitespace-nowrap flex-shrink-0"
                    >
                      <Image
                        src={"/endgame-training/rematch.png"}
                        alt="restart icon"
                        width={12}
                        height={12}
                      />
                      <span className="text-[11px] text-blue-base">
                        Rematch
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        navigateNext();
                      }}
                      className="flex gap-x-1 flex-1 items-center justify-center px-3 py-2 btn-primary rounded-full border whitespace-nowrap flex-shrink-0"
                    >
                      <span className="text-[11px]">Next Stage</span>
                      <Image
                        src={"/endgame-training/Union.png"}
                        alt="arrow right icon"
                        width={12}
                        height={12}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameAlertDialogMobile;
