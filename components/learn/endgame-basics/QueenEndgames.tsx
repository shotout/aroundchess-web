"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, DiamondIcon as ChessQueen, ArrowLeftRight, Target } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const queenEndgameExamples = [
  {
    fen: "8/8/8/8/3k4/8/3P4/3QK3 w - - 0 1",
    title: "Queen and Pawn vs King",
    description: "A common queen endgame where one side tries to promote a pawn.",
    explanation: [
      "The side with the queen aims to support the pawn's advance",
      "The defending king tries to block the pawn and avoid checkmate",
      "The attacking king plays a crucial role in supporting the pawn",
      "This endgame is generally winning for the side with the queen and pawn",
    ],
  },
  {
    fen: "8/8/8/8/3k4/8/3P4/3K4 w - - 0 1",
    title: "Queen vs Pawn",
    description: "An endgame where the queen fights against a passed pawn.",
    explanation: [
      "The queen's goal is to stop the pawn from promoting",
      "The side with the pawn tries to advance it to promotion",
      "The kings play a crucial role in supporting or blocking the pawn",
      "This type of endgame often requires precise calculation and technique",
    ],
  },
  {
    fen: "8/8/8/8/3k4/8/3q4/3QK3 w - - 0 1",
    title: "Queen vs Queen",
    description: "A complex endgame where both sides have a queen.",
    explanation: [
      "Queen vs Queen endgames are often drawn due to the queens' power",
      "The side with the initiative can try to force a win",
      "King safety is crucial in these endgames",
      "Perpetual check is a common drawing technique",
    ],
  },
  {
    fen: "8/8/8/8/3k4/8/3Q4/3K4 w - - 0 1",
    title: "Queen vs King",
    description: "A basic checkmate pattern with a queen and king against a lone king.",
    explanation: [
      "The side with the queen aims to checkmate the opponent's king",
      "The queen and king must work together to restrict the enemy king's movement",
      "The defending king tries to stay in the center and avoid being pushed to the edge",
      "This checkmate should be executed quickly to avoid a draw by the 50-move rule",
    ],
  },
]

const queenEndgamePrinciples = [
  {
    title: "Queen Activity",
    icon: <ChessQueen className="h-6 w-6" />,
    points: [
      "Use the queen to control key squares",
      "Coordinate the queen with other pieces",
      "Be cautious of stalemate possibilities",
      "Use the queen to create threats and force weaknesses",
    ],
  },
  {
    title: "King Activity",
    icon: <ArrowLeftRight className="h-6 w-6" />,
    points: [
      "Activate your king in queen endgames",
      "Use the king to support pawn advances",
      "Keep your king safe from checks",
      "In defensive positions, use the king to block passed pawns",
    ],
  },
  {
    title: "Pawn Play",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Create and support passed pawns",
      "Use pawns to restrict enemy king movement",
      "Be cautious of creating pawn weaknesses",
      "In winning positions, advance pawns carefully",
    ],
  },
]

export function QueenEndgames() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % queenEndgameExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + queenEndgameExamples.length) % queenEndgameExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Queen Endgames</h2>
        <p className="text-gray-600 mb-6">
          Queen endgames are among the most complex and dynamic endgames in chess. The queen's power and versatility
          make these endgames rich in tactical possibilities and strategic depth.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          In queen endgames, the balance between aggression and caution is crucial. The queen's power can quickly turn
          the tables, but it also presents constant stalemate dangers. King safety and pawn structure are often decisive
          factors.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={queenEndgameExamples[currentExample].fen}
          initialFen={queenEndgameExamples[currentExample].fen}
          title={queenEndgameExamples[currentExample].title}
          description={queenEndgameExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {queenEndgameExamples[currentExample].explanation.map((point, index) => (
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
          <span className="text-sm text-muted-foreground">
            {currentExample + 1} of {queenEndgameExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Queen Endgame Principles</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {queenEndgamePrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Queen Triangulation</h3>
                <p className="text-gray-600 mb-4">
                  A technique used to gain the opposition or force the opponent's king to a worse square.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Involves moving the queen in a triangular pattern</li>
                  <li>Used to lose a move and force the opponent into zugzwang</li>
                  <li>Particularly useful in queen and pawn endgames</li>
                  <li>Requires careful calculation to avoid stalemate</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Queen vs Pawn on 7th Rank</h3>
                <p className="text-gray-600 mb-4">
                  A critical endgame where the queen fights against a pawn on the 7th rank.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>The queen must prevent the pawn from promoting</li>
                  <li>Key squares for the defending king determine the outcome</li>
                  <li>Understanding this endgame is crucial for both sides</li>
                  <li>Practice this endgame to improve your queen endgame technique</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Playing Queen Endgames</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be aware of stalemate possibilities</li>
          <li>Use your queen actively, but avoid premature attacks</li>
          <li>Coordinate your queen with your king for maximum effectiveness</li>
          <li>In queen vs queen endgames, fight for the initiative</li>
          <li>Practice basic checkmates like queen and king vs king</li>
          <li>Study classic queen endgames to improve your understanding and technique</li>
        </ul>
      </motion.div>
    </div>
  )
}

