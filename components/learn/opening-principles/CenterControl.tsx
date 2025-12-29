'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button'
import { Info, ChevronRight, ChevronLeft } from 'lucide-react'
import { Chessboard } from 'react-chessboard'

const centerControlStrategies = [
  {
    title: "Pawn to e4 or d4",
    description: "Opening with e4 or d4 immediately stakes a claim in the center and opens lines for bishops and queens.",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    analysis: "This is one of the most common opening moves. It controls a central square and opens lines for the queen and king's bishop."
  },
  {
    title: "Double Pawn Push",
    description: "Advancing both central pawns creates a strong pawn center, controlling four key central squares.",
    fen: "rnbqkbnr/pppppppp/8/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 1",
    analysis: "This setup, common in openings like the Queen's Gambit, controls e5 and d5, creating a strong pawn center. However, it can be vulnerable to counterattacks on the pawns."
  },
  {
    title: "Fianchetto",
    description: "Developing the bishop to g2 or b2 exerts diagonal pressure on the center without directly occupying it with pawns.",
    fen: "rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1",
    analysis: "This strategy, used in openings like the King's Indian Defense, controls the center indirectly. The fianchettoed bishop exerts pressure along the long diagonal."
  },
  {
    title: "Knight to f3 or c3",
    description: "Developing knights to f3 or c3 supports central pawns and prepares for central pawn pushes.",
    fen: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 0 1",
    analysis: "This move develops a piece, controls central squares, and prepares for a potential e4 push. It's a flexible move that doesn't commit to a specific pawn structure yet."
  },
  {
    title: "Hypermodern Approach",
    description: "Allow opponent to occupy the center with pawns, then attack it with pieces from the flanks.",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    analysis: "Hypermodern openings like the Alekhine Defense invite the opponent to occupy the center, with the plan of undermining it later. This approach challenges traditional center control ideas."
  }
]

export function CenterControl() {
  const [currentStrategy, setCurrentStrategy] = useState(0)

  const nextStrategy = () => {
    setCurrentStrategy((prev) => (prev + 1) % centerControlStrategies.length)
  }

  const prevStrategy = () => {
    setCurrentStrategy((prev) => (prev - 1 + centerControlStrategies.length) % centerControlStrategies.length)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Center Control Strategies</h2>
        <p className="text-gray-600 mb-6">
          Controlling the center is a fundamental principle in chess openings. A strong center provides 
          more space for your pieces, limits your opponent's options, and creates a platform for attacks 
          on either side of the board. Let's explore various strategies for center control.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          The center in chess typically refers to the four central squares: e4, d4, e5, and d5. 
          Controlling these squares, either with pawns or pieces, is crucial for gaining a spatial 
          advantage and creating attacking opportunities.
        </AlertDescription>
      </Alert>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-blue-600">
                {centerControlStrategies[currentStrategy].title}
              </h3>
              <p className="text-gray-600">
                {centerControlStrategies[currentStrategy].description}
              </p>
              <div className="text-[14px] --sm text-gray-500 italic">
                {centerControlStrategies[currentStrategy].analysis}
              </div>
            </div>
            <div className="bg-gray-100 p-4 flex items-center justify-center">
              <div className="w-full max-w-[300px]">
                <Chessboard 
                  position={centerControlStrategies[currentStrategy].fen}
                  boardWidth={300}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button onClick={prevStrategy} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={nextStrategy} variant="outline">
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Applying Center Control in Your Games</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Start by considering how you want to control the center in your opening repertoire.</li>
          <li>Be prepared to adjust your center control strategy based on your opponent's moves.</li>
          <li>Remember that controlling the center is not just about pawns - pieces play a crucial role too.</li>
          <li>Don't neglect development while fighting for the center - a harmonious balance is key.</li>
          <li>Study master games to see how top players handle center control in different openings.</li>
        </ul>
      </div>

      <Alert variant="default" className="mt-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Advanced Concept</AlertTitle>
        <AlertDescription>
          As you progress, you'll encounter positions where the center is closed or where controlling the center 
          is less critical. In such cases, focus on other strategic elements like pawn breaks, piece activity, 
          or flank attacks.
        </AlertDescription>
      </Alert>
    </div>
  )
}
