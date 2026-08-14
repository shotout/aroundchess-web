'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chess, Square } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  MinusCircle, 
  PlusCircle 
} from 'lucide-react'

interface InteractiveBoardProps {
  fen?: string
  onMove?: (move: { from: Square; to: Square }) => void
  showHints?: boolean
  allowMoves?: boolean
  size?: number
  highlightSquares?: string[]
  selectedPiece?: string
  orientation?: 'white' | 'black'
  zoomLevel?: number
  position?: string
  from?: string
  to?: string[]
}

export function InteractiveBoard({
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  onMove,
  showHints = true,
  allowMoves = true,
  size = 400,
  highlightSquares = [],
  selectedPiece,
  orientation = 'white',
  zoomLevel = 1,
  position,
  from,
  to = []
}: InteractiveBoardProps) {
  const [currentFen, setCurrentFen] = useState(position || fen)
  const [game, setGame] = useState(() => {
    try {
      return new Chess(position || fen);
    } catch (error) {
      console.error('Invalid FEN:', error);
      return new Chess();
    }
  });
  const [boardSize, setBoardSize] = useState(size * zoomLevel)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [legalMoves, setLegalMoves] = useState<Square[]>([])

  useEffect(() => {
    setBoardSize(size * zoomLevel)
  }, [size, zoomLevel])

  useEffect(() => {
    if (position) {
      setCurrentFen(position)
      setGame(new Chess(position))
    }
  }, [position])

  const handleSquareClick = (square: Square) => {
    if (!allowMoves) return

    if (selectedSquare === null) {
      const moves = game.moves({ square, verbose: true })
      if (moves.length > 0) {
        setSelectedSquare(square)
        setLegalMoves(moves.map(move => move.to as Square))
      }
    } else {
      const move = {
        from: selectedSquare,
        to: square,
        promotion: 'q'
      }

      try {
        const result = game.move(move)
        if (result) {
          const newGame = new Chess(game.fen())
          setGame(newGame)
          setCurrentFen(newGame.fen())
          onMove?.(move)
        }
      } catch (e) {
      }

      setSelectedSquare(null)
      setLegalMoves([])
    }
  }

  const resetBoard = () => {
    const newGame = new Chess(position || fen)
    setGame(newGame)
    setCurrentFen(position || fen)
    setSelectedSquare(null)
    setLegalMoves([])
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div style={{ width: boardSize, height: boardSize }}>
        <Chessboard
          position={currentFen}
          onSquareClick={handleSquareClick}
          boardOrientation={orientation}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: 'none'
          }}
          customDarkSquareStyle={{ backgroundColor: '#b58863' }}
          customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
          customSquareStyles={{
            ...(selectedSquare && { [selectedSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' } }),
            ...(legalMoves.reduce((obj, square) => ({
              ...obj,
              [square]: { backgroundColor: 'rgba(0, 255, 0, 0.2)' }
            }), {})),
            ...(from ? { [from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' } } : {}),
            ...(to ? to.reduce((obj, square) => ({
              ...obj,
              [square]: { backgroundColor: 'rgba(0, 255, 0, 0.2)' }
            }), {}) : {})
          }}
        />
      </div>
    </div>
  )
}
