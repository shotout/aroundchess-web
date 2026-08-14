"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useComputerChessStore } from "../store/computerChessStore"
import { useEffect, useState } from "react"
import confetti from 'canvas-confetti'
import { motion } from "framer-motion"
import { Trophy, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function ComputerCheckMate() {
  const [open, setOpen] = useState(false)
  const { isCheckMate, computer, resetGame } = useComputerChessStore()
  const router = useRouter()
  
  useEffect(() => {
    if (isCheckMate !== "noCheckMate") {
      setOpen(true)
      
      const playerWins = computer === "black" ? isCheckMate === "white" : isCheckMate === "black"
      
      if (playerWins) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    } else {
      setOpen(false)
    }
  }, [isCheckMate, computer])

  const computerWins = computer === "black" ? isCheckMate === "black" : isCheckMate === "white"

  const handlePlayAgain = () => {
    resetGame()
    setOpen(false)
  }

  const handleRegister = () => {
    router.push('/register')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[520px] p-8 bg-white">
        <DialogTitle className="sr-only">
          {computerWins ? "Computer Victory" : "Player Victory"}
        </DialogTitle>

        <motion.div 
          className="flex flex-col items-center justify-center text-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-8 relative"
          >
            <motion.div
              className="absolute inset-0 bg-red-100 rounded-full"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <Trophy className="w-20 h-20 text-red-500 relative" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {computerWins 
                ? "Unfortunately, the Computer won!"
                : "Congratulations! You won!"}
            </h2>
            <p className="text-gray-600">
              {computerWins 
                ? "Keep practicing and try again!"
                : "Well played! You've beaten the computer!"}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-row gap-4 w-full justify-center"
          >
            <Button
              onClick={handlePlayAgain}
              className="min-w-[180px] h-11 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 hover:border-blue-700 hover:text-blue-700 transition-colors"
              variant="outline"
            >
              Play Again
            </Button>
            
            {computerWins && (
              <Button
                onClick={handleRegister}
                className="min-w-[180px] h-11 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Register to Improve
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
