"use client"

import { useChessStore } from "../store/playground/chess-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState, ReactNode } from "react"
import JSConfetti from "js-confetti"
import { motion } from "framer-motion"

export const GameResult = (): ReactNode => {
  const { winner, gameResult, resetGame } = useChessStore((state) => state);
  const [showDialog, setShowDialog] = useState(false);
  const [whiteName, setWhiteName] = useState("White")
  const [blackName, setBlackName] = useState("Black")

  useEffect(() => {
    const loadNames = () => {
      const savedWhiteName = localStorage.getItem("whitePlayerName")
      const savedBlackName = localStorage.getItem("blackPlayerName")
      if (savedWhiteName) setWhiteName(savedWhiteName)
      if (savedBlackName) setBlackName(savedBlackName)
    }

    loadNames()

    const handleNameChange = (e: CustomEvent<{ color: 'white' | 'black'; name: string }>) => {
      const { color, name } = e.detail
      if (color === 'white') {
        setWhiteName(name)
      } else {
        setBlackName(name)
      }
    }

    window.addEventListener('playerNameChange', handleNameChange as EventListener)
    window.addEventListener('storage', (e) => {
      if (e.key === "whitePlayerName" || e.key === "blackPlayerName") {
        loadNames()
      }
    })

    return () => {
      window.removeEventListener('playerNameChange', handleNameChange as EventListener)
      window.removeEventListener('storage', loadNames)
    }
  }, [])

  useEffect(() => {
    if (winner && gameResult) {
      setShowDialog(true);
      setTimeout(() => {
        const confetti = new JSConfetti();
        confetti.addConfetti({
          confettiColors: [
            "#9370DB",
            "#48D1CC",
            "#FF69B4",
            "#32CD32",
            "#FF4500",
            "#FFD700",
            "#4169E1",
          ],
          confettiRadius: 6,
          confettiNumber: 500
        });
      }, 500);
    }
  }, [winner, gameResult]);

  if (!showDialog || !winner || !gameResult) return null;

  const winningPlayer = winner === 'white' ? whiteName : blackName;
  const score = winner === 'white' ? "1 - 0" : "0 - 1";

  const handleClose = () => {
    setShowDialog(false);
    resetGame();
  };

  return (
    <Dialog open={showDialog} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-100">
        <DialogHeader className="space-y-4">
          <DialogTitle>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                Game Over!
              </span>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            </div>
          </DialogTitle>
          <div className="text-center space-y-4 text-gray-500">
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-xl font-semibold text-gray-800"
            >
              {winningPlayer} wins by {gameResult.reason}!
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-2xl font-bold text-blue-600"
            >
              {score}
            </motion.p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleClose}
            >
              Play Again
            </motion.button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}; 