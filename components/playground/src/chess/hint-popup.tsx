"use client"

import { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useChessStore } from '../store/playground/chess-store'
import { getStockfishService } from '@/lib/stockfish/stockfish-service'
import type { Square } from 'react-chessboard/dist/chessboard/types'

interface HintPopupProps {
  isOpen: boolean
  onClose: () => void
  onHintGenerated: (from: string, to: string) => void
}

export function HintPopup({ isOpen, onClose, onHintGenerated }: HintPopupProps) {
  const [elo, setElo] = useState(1500)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendedMove, setRecommendedMove] = useState<string>("")
  const { getFen, currentPlayer, setHintArrow } = useChessStore((state) => state)
  const engine = getStockfishService()

  const handleShowHint = async () => {
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
        
        setHintArrow(from, to)
        
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
            Select ELO level and get a recommended move for {currentPlayer}'s turn
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <span className="text-[14px] --sm">ELO: {elo}</span>
            <Slider
              value={[elo]}
              onValueChange={(value) => setElo(value[0])}
              min={1000}
              max={2800}
              step={100}
              className="w-[60%]"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={handleShowHint}
              disabled={isAnalyzing}
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