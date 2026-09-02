"use client"

import { Button } from "@/components/ui/button"
import { useComputerChessStore } from "../store/computerChessStore"
import Link from "next/link"
import { ArrowLeft, Undo2, Redo2, RotateCcw } from "lucide-react"
import { ComputerPlayer, HumanPlayer } from "./computer-player"

export function ComputerControls() {
  const { undoMove, redoMove, resetGame } = useComputerChessStore((state) => state);
  
  const handleReset = () => {
    // Reset the game state
    resetGame();
    localStorage.removeItem("chess-store-computer");
    localStorage.removeItem("chess-store-computer-" + window.sessionStorage.getItem('chess-tab-id'));
    // Reset the player name
    localStorage.removeItem("computerPlayerName");
    // Dispatch event to notify the name component
    window.dispatchEvent(new CustomEvent('computerPlayerNameChange', { 
      detail: { name: "You" } 
    }));
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white/90 rounded-xl backdrop-blur-sm shadow-lg border border-blue-100/50">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4">
          <Link
            href="/playground"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <button
            onClick={() => undoMove()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 border border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Undo2 className="w-4 h-4" />
            <span>Undo</span>
          </button>
          <button
            onClick={() => redoMove()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 border border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Redo2 className="w-4 h-4" />
            <span>Redo</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 border border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
