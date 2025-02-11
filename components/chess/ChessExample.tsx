"use client"

import { useState, useEffect, useCallback } from "react"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ChessExampleProps {
  initialFen: string
  title: string
  description: string
}

export function ChessExample({ initialFen, title, description }: ChessExampleProps) {
  const [game, setGame] = useState<Chess>(new Chess(initialFen))
  const [currentPosition, setCurrentPosition] = useState(initialFen)

  useEffect(() => {
    setGame(new Chess(initialFen))
    setCurrentPosition(initialFen)
  }, [initialFen])

  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      try {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q", // always promote to queen for simplicity
        })

        if (move === null) return false // illegal move
        setCurrentPosition(game.fen())
        return true
      } catch (error) {
        return false
      }
    },
    [game],
  )

  const resetPosition = useCallback(() => {
    const newGame = new Chess(initialFen)
    setGame(newGame)
    setCurrentPosition(initialFen)
  }, [initialFen])

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full max-w-[300px]">
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl shadow-inner">
              <Chessboard 
                position={currentPosition} 
                onPieceDrop={onDrop} 
                boardWidth={300}
                customDarkSquareStyle={{ backgroundColor: "#B58863" }}
                customLightSquareStyle={{ backgroundColor: "#F0D9B5" }}
                customBoardStyle={{
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Current FEN:</p>
            <code className="text-xs bg-gray-100 p-2 rounded block mb-4">{currentPosition}</code>
            <Button variant="outline" onClick={resetPosition}>Reset Position</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

