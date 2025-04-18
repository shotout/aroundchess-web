import React, { useEffect } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { RotateCcw, X } from "lucide-react";

interface GameAlertPopoverProps {
  open: boolean;
  gameStatus: "win" | "lose" | "draw" | string;
  alertMessage: string;
  onRematch: () => void;
  onClose: () => void;
}

const GameAlertPopover = ({
  open,
  gameStatus,
  alertMessage,
  onRematch,
  onClose,
}: GameAlertPopoverProps) => {
  if (!open) return null;

  const getContent = () => {
    switch (gameStatus) {
      case "win":
        return {
          title: "Checkmate!",
          message: "You won this Game by Checkmate.",
          color: "bg-green-300",
        };
      case "lose":
        return {
          title: "Loss - Checkmate!",
          message: "Your game ended in a Checkmate.",
          color: "bg-green-300",
        };
      case "draw":
        return {
          title: "Draw - Stalemate",
          message: "Keep Practicing, you'll get it!",
          description:
            "Why Draw? Stalemate is a kind of Draw that happens when one side has no legal moves to make. If the King is not in check, but no piece can be moved without putting the king in check, then the Game will end with a Stalemate Draw.",
          color: "bg-green-300",
        };
      default:
        return {
          title: "Game Over",
          message: alertMessage,
        };
    }
  };

  const { title, message } = getContent();

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="relative p-0 border-0 overflow-hidden bg-transparent">
        <div className="relative bg-[#edfaed] border-4 border-[#00a000] rounded-3xl p-8 pt-16 pb-12 w-full max-w-md">
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
            <h1 className="text-5xl font-bold text-[#00a000] mb-6">{title}</h1>
            <p className="text-2xl text-[#0a142f] font-medium mb-12">
              {message}
            </p>

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
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameAlertPopover;
