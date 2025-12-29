"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, ChurchIcon as ChessBishop, CastleIcon as ChessKnight, ArrowLeftRight } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const minorPieceEndgameExamples = [
  {
    fen: "8/8/8/8/3k4/8/3P4/3KB3 w - - 0 1",
    title: "Bishop and Pawn vs King",
    description: "A common endgame where the bishop supports a pawn's promotion.",
    explanation: [
      "The key is to use the bishop to control the promotion square",
      "The king should support the pawn's advance",
      "Be careful of stalemate possibilities in the corner",
      "This endgame is generally winning for the side with the bishop and pawn",
    ],
  },
  {
    fen: "8/8/8/8/3k4/8/3P4/3KN3 w - - 0 1",
    title: "Knight and Pawn vs King",
    description: "An endgame where the knight supports a pawn's promotion.",
    explanation: [
      "The knight is less effective than the bishop in supporting a pawn",
      "The key is to use the knight to control key squares in front of the pawn",
      "The king plays a crucial role in supporting the pawn's advance",
      "This endgame can be drawn in some cases, especially with a rook's pawn",
    ],
  },
  {
    fen: "8/8/8/3k4/8/3B4/3BK3/8 w - - 0 1",
    title: "Two Bishops vs King",
    description: "A winning endgame where two bishops force checkmate against a lone king.",
    explanation: [
      "The two bishops work together to restrict the enemy king's movement",
      "The key is to gradually push the king to the corner of the board",
      "Be careful not to allow stalemate",
      "This endgame requires precise coordination between the bishops and king",
    ],
  },
  {
    fen: "8/8/8/3k4/8/3N4/3BK3/8 w - - 0 1",
    title: "Bishop and Knight vs King",
    description: "A complex endgame where bishop and knight work together to force checkmate.",
    explanation: [
      "This is one of the most difficult basic checkmates to execute",
      "The bishop and knight must work together to gradually restrict the king's movement",
      "The key is to force the enemy king to a corner of the same color as the bishop",
      "This endgame requires precise technique and can take up to 50 moves to checkmate",
    ],
  },
]

const minorPieceEndgamePrinciples = [
  {
    title: "Bishop Endgames",
    icon: <ChessBishop className="h-6 w-6" />,
    points: [
      "Bishops are strong in open positions",
      "Use the bishop to control key diagonals",
      "Keep pawns on opposite colors of your bishop",
      "In opposite-colored bishop endgames, place pawns on the color of your opponent's bishop",
    ],
  },
  {
    title: "Knight Endgames",
    icon: <ChessKnight className="h-6 w-6" />,
    points: [
      "Knights are strong in closed positions",
      "Use knights to create and exploit weaknesses",
      "Centralize your knight to maximize its influence",
      "Be aware of knight outposts protected by pawns",
    ],
  },
  {
    title: "Minor Piece Coordination",
    icon: <ArrowLeftRight className="h-6 w-6" />,
    points: [
      "Coordinate your minor pieces to control key squares",
      "Use your king actively in minor piece endgames",
      "Create and exploit pawn weaknesses",
      "Understand the strengths and weaknesses of each minor piece",
    ],
  },
]

export function MinorPieceEndgames() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % minorPieceEndgameExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + minorPieceEndgameExamples.length) % minorPieceEndgameExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Minor Piece Endgames</h2>
        <p className="text-gray-600 mb-6">
          Minor piece endgames, involving bishops and knights, are common and require a deep understanding of each
          piece's strengths and weaknesses. Mastering these endgames is crucial for improving your overall chess skill.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          In minor piece endgames, understanding the unique characteristics of bishops and knights is crucial. Bishops
          are strong in open positions and can control long diagonals, while knights excel in closed positions and can
          access all squares on the board.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={minorPieceEndgameExamples[currentExample].fen}
          initialFen={minorPieceEndgameExamples[currentExample].fen}
          title={minorPieceEndgameExamples[currentExample].title}
          description={minorPieceEndgameExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {minorPieceEndgameExamples[currentExample].explanation.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-gray-700"
              >
                {point}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <div className="flex justify-between mt-4">
          <Button onClick={previousExample} variant="outline" size="sm">
            Previous Example
          </Button>
          <span className="text-[14px] --sm text-muted-foreground">
            {currentExample + 1} of {minorPieceEndgameExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Minor Piece Endgame Principles</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {minorPieceEndgamePrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-blue-600">{principle.icon}</div>
                      <h3 className="text-lg font-semibold text-blue-600">{principle.title}</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2">
                      {principle.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-gray-600">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="techniques">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Opposite-Colored Bishops</h3>
                <p className="text-gray-600 mb-4">
                  Endgames with bishops of opposite colors have significant drawing tendencies.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>These endgames are often drawn even with an extra pawn</li>
                  <li>The defending side should place pawns on the color of the opponent's bishop</li>
                  <li>The attacking side should try to create passed pawns on both sides of the board</li>
                  <li>Understanding these positions is crucial for both attacking and defending</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Knight Outposts</h3>
                <p className="text-gray-600 mb-4">
                  Creating and utilizing strong knight outposts is a key technique in knight endgames.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>A knight outpost is an advanced square that can't be attacked by enemy pawns</li>
                  <li>Outposts are particularly strong when supported by pawns</li>
                  <li>Use outposts to control key squares and restrict enemy piece movement</li>
                  <li>Practice identifying and creating knight outposts in your games</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Playing Minor Piece Endgames</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Understand the strengths and weaknesses of bishops and knights in different pawn structures</li>
          <li>Practice basic checkmates like bishop and knight vs king</li>
          <li>In bishop endgames, try to place your pawns on opposite colors of your bishop</li>
          <li>In knight endgames, create and exploit pawn weaknesses</li>
          <li>Use your king actively in minor piece endgames</li>
          <li>Study classic minor piece endgames to improve your understanding and technique</li>
        </ul>
      </motion.div>
    </div>
  )
}
