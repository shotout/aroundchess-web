"use client"

import { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useComputerChessStore } from '../store/computerChessStore'
import { getStockfishService } from '@/lib/stockfish/stockfish-service'
import type { Square } from 'react-chessboard/dist/chessboard/types'

interface ComputerHintPopupProps {
  isOpen: boolean
  onClose: () => void
  onHintGenerated: (from: string, to: string) => void
}

export function ComputerHintPopup({ isOpen, onClose, onHintGenerated }: ComputerHintPopupProps) {
  const [elo, setElo] = useState(1500)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendedMove, setRecommendedMove] = useState<string>("")
  const { getFen, currentPlayer, playerColor } = useComputerChessStore((state) => state)
  const engine = getStockfishService()

  const handleShowHint = async () => {
    if (currentPlayer !== playerColor) {
      return
    }

    setIsAnalyzing(true)
    
    try {
      const currentFen = getFen()
      
      const randomness = Math.max(0, Math.min(1, (2800 - elo) / 1800))
      const depth = Math.max(1, Math.floor(elo / 200))
      
      const bestMove = await engine.getBestMove(currentFen, depth, randomness)
      
      if (bestMove && bestMove.length >= 4) {
        const from = bestMove.substring(0, 2).toLowerCase()
        const to = bestMove.substring(2, 4).toLowerCase()
        
        const formattedMove = `${from} → ${to}`
        setRecommendedMove(formattedMove)
        
        onHintGenerated(from, to)
      }
    } catch (error) {
      console.error('Error getting hint:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setIsAnalyzing(false)
      setRecommendedMove("")
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move Hint</DialogTitle>
          <DialogDescription>
            {currentPlayer === playerColor 
              ? "Select ELO level and get a recommended move for your turn"
              : "Hints are only available during your turn"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <span className="text-[14px] --sm">ELO: {elo}</span>
            <div className={currentPlayer !== playerColor ? "opacity-50 pointer-events-none" : ""}>
              <Slider
                value={[elo]}
                onValueChange={(value) => setElo(value[0])}
                min={1000}
                max={2800}
                step={100}
                className="w-[60%]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={handleShowHint}
              disabled={isAnalyzing || currentPlayer !== playerColor}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Show Hint"}
            </Button>
            {recommendedMove && !isAnalyzing && (
              <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-[14px] --sm text-green-800 font-medium">Recommended move:</p>
                <p className="text-lg font-mono text-center mt-2">{recommendedMove}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 