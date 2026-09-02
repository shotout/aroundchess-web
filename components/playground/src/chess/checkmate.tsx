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

export const CheckMate = (): ReactNode => {
  const { isCheckMate, currentPlayer, resetGame } = useChessStore((state) => state);
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

    // Handle custom name change events
    const handleNameChange = (e: CustomEvent<{ color: 'white' | 'black'; name: string }>) => {
      const { color, name } = e.detail
      if (color === 'white') {
        setWhiteName(name)
      } else {
        setBlackName(name)
      }
    }

    // Listen for both storage and custom events
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
    if (isCheckMate !== "noCheckMate") {
      setShowDialog(true);
      setTimeout(() => {
        const confetti = new JSConfetti();
        confetti.addConfetti({
          confettiColors: [
            "#9370DB", // Medium Purple
            "#48D1CC", // Turquoise
            "#FF69B4", // Hot Pink
            "#32CD32", // Lime Green
            "#FF4500", // Orange Red
            "#FFD700", // Gold for emphasis
            "#4169E1", // Royal Blue for emphasis
          ],
          confettiRadius: 6,
          confettiNumber: 500
        });
        // Add a second wave of confetti for more impact
        setTimeout(() => {
          confetti.addConfetti({
            confettiColors: [
              "#FFD700", // Gold
              "#4169E1", // Royal Blue
              "#FF69B4"  // Hot Pink
            ],
            confettiNumber: 200,
            confettiRadius: 8
          });
        }, 300);
      }, 500);
    }
  }, [isCheckMate]);

  if (!showDialog || isCheckMate === "noCheckMate") return null;

  const winningPlayer = currentPlayer === "white" ? blackName : whiteName;
  const score = currentPlayer === "white" ? "0 - 1" : "1 - 0";

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-100">
        <DialogHeader className="space-y-4">
          <DialogTitle>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                Checkmate!
              </span>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            </div>
          </DialogTitle>
          <DialogDescription className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-xl font-semibold text-gray-800"
            >
              {winningPlayer} wins by checkmate!
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-2xl font-bold text-blue-600"
            >
              {score}
            </motion.div>
          </DialogDescription>
          <div className="mt-6 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                resetGame();
                setShowDialog(false);
              }}
            >
              Play Again
            </motion.button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};