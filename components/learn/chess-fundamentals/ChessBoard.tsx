'use client'

import { useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'

export function ChessBoard({ initialPosition = 'start' }) {
  const [game, setGame] = useState(new Chess(initialPosition === 'start' ? undefined : initialPosition))

  function makeAMove(move: any) {
    try {
      const gameCopy = new Chess(game.fen())
      const result = gameCopy.move(move)
      setGame(gameCopy)
      return result
    } catch (error) {
      console.error('Invalid move:', error)
      return null
    }
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    try {
      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })

      if (move === null) return false
      return true
    } catch (error) {
      console.error('Invalid move:', error)
      return false
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Rules & Piece Movements</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            Chess is a strategic board game played between two players on a board of 64 squares. 
            The game simulates a battle between two armies, with each player commanding 16 pieces 
            at the start. Understanding how each piece moves is fundamental to playing chess.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Piece Movements</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Basic Pieces</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Pawn:</strong> Moves forward one square at a time, captures diagonally. Can move two squares on its first move.</li>
                <li><strong>Rook:</strong> Moves any number of squares horizontally or vertically.</li>
                <li><strong>Knight:</strong> Moves in an L-shape (two squares in one direction, then one square perpendicular). Can jump over other pieces.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Power Pieces</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Bishop:</strong> Moves any number of squares diagonally.</li>
                <li><strong>Queen:</strong> Combines the movements of a rook and bishop. Most powerful piece.</li>
                <li><strong>King:</strong> Moves one square in any direction. Must be protected at all costs.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Interactive Board</AlertTitle>
        <AlertDescription>
          Try moving the pieces on the board below to practice and understand how each piece moves.
          Experiment with different moves to see what's allowed and what isn't.
        </AlertDescription>
      </Alert>

      <Card className="bg-white border shadow-sm p-6">
        <CardContent className="flex flex-col items-center">
          <div className="w-full max-w-[480px]">
            <Chessboard 
              position={game.fen()} 
              onPieceDrop={onDrop}
              boardWidth={480}
              customDarkSquareStyle={{ backgroundColor: '#2563EB' }}
              customLightSquareStyle={{ backgroundColor: '#DBEAFE' }}
              showBoardNotation={true}
              animationDuration={200}
            />
            <div className="mt-4 flex justify-between items-center">
              <Button 
                onClick={() => setGame(new Chess())}
                variant="outline"
              >
                Reset Board
              </Button>
              <CompleteButton sectionId="rules" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Rules to Remember</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Check and Checkmate</h4>
            <p className="text-gray-600 text-sm">
              When a king is under attack, it is in "check." The player must then move their king to safety, 
              block the attack, or capture the attacking piece. If there's no legal move to escape check, 
              it's "checkmate" and the game is over.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Stalemate and Draws</h4>
            <p className="text-gray-600 text-sm">
              A game can end in a draw through stalemate (when a player has no legal moves but is not in check), 
              mutual agreement, threefold repetition, or the fifty-move rule.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

