import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CircuitBoardIcon as ChessBoardIcon, ArrowRight } from 'lucide-react'
import { CompleteButton } from '@/components/learn/chess-fundamentals/CompleteButton'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard' // Added missing import

const setupSteps = [
  {
    title: "Place the Board",
    description: "Ensure the bottom-right square is white for both players.",
    icon: <ChessBoardIcon className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Set Up the Back Rank",
    description: "Place rooks in corners, then knights, bishops, and royalty in the center.",
    icon: <ArrowRight className="w-6 h-6 text-green-500" />,
  },
  {
    title: "Position the Pawns",
    description: "Place all eight pawns on the second rank in front of the other pieces.",
    icon: <ArrowRight className="w-6 h-6 text-green-500" />,
  },
  {
    title: "Double-Check",
    description: "Ensure all pieces are correctly placed and facing the right direction.",
    icon: <ArrowRight className="w-6 h-6 text-green-500" />,
  },
]

export function BoardSetup() {
  const [game, setGame] = useState(new Chess())
  
  function onPieceDrop(sourceSquare: string, targetSquare: string) {
    try {
      const gameCopy = new Chess(game.fen())
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })
      if (move === null) return false
      setGame(gameCopy)
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Chess Board Setup</h2>
        <p className="text-lg text-gray-600 mb-6">
          Proper board setup is crucial for starting a chess game. Each piece has its designated 
          starting position, and understanding this layout is fundamental to playing chess.
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-800 font-semibold">Board Orientation</AlertTitle>
        <AlertDescription className="text-blue-700">
          Remember, the board should be set up so that each player has a white square in their bottom-right corner.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Board</h3>
            <p className="text-gray-600 mb-4">
              Explore the initial chess board setup. You can move pieces to see how they interact with the board.
            </p>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[400px] mx-auto">
                <Chessboard 
                  position={game.fen()} 
                  onPieceDrop={onPieceDrop}
                  boardWidth={400}
                  customDarkSquareStyle={{ backgroundColor: '#2563EB' }}
                  customLightSquareStyle={{ backgroundColor: '#DBEAFE' }}
                  showBoardNotation={true}
                  animationDuration={200}
                />
              </div>
              <div className="mt-4 flex justify-between w-full max-w-[400px] mx-auto">
                <Button 
                  onClick={() => setGame(new Chess())}
                  variant="outline"
                  className="w-[150px]"
                >
                  Reset Board
                </Button>
                <CompleteButton sectionId="board-setup" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Setup Steps</h3>
          <div className="space-y-4">
            {setupSteps.map((step, index) => (
              <Card key={index} className="bg-white border shadow-sm">
                <CardContent className="p-4 flex items-start space-x-4">
                  <div className="flex-shrink-0">{step.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Points to Remember</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>The board is an 8x8 grid, alternating between light and dark squares.</li>
          <li>Each player starts with 16 pieces: 1 king, 1 queen, 2 rooks, 2 knights, 2 bishops, and 8 pawns.</li>
          <li>The rooks start in the corners, with knights next to them, then bishops, and finally the royal couple in the center.</li>
          <li>Pawns form the front line of defense, occupying the entire second rank.</li>
          <li>White pieces are always set up on ranks 1 and 2, while black pieces are on ranks 7 and 8.</li>
          <li>The queen always starts on her own color (white queen on white square, black queen on black square).</li>
        </ul>
      </div>
    </div>
  )
}

