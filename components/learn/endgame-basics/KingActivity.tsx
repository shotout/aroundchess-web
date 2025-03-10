"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CastleIcon as ChessKing, ArrowLeftRight, Target } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const kingActivityExamples = [
  {
    fen: "8/8/8/4k3/3P4/4K3/8/8 w - - 0 1",
    title: "King Opposition",
    description: "A fundamental concept where kings face each other, controlling key squares.",
    explanation: [
      "The kings are in direct opposition, one square apart",
      "The side to move often has a disadvantage in this position",
      "Understanding opposition is crucial for king and pawn endgames",
      "Practice recognizing and creating opposition in your games",
    ],
  },
  {
    fen: "8/8/8/3k4/8/4P3/4K3/8 w - - 0 1",
    title: "King Centralization",
    description: "Demonstrating the importance of an active king in the endgame.",
    explanation: [
      "The centralized black king is more active and controls more squares",
      "White's king should aim to become more centralized",
      "An active king can support pawn advances and restrict the opponent's pieces",
      "King centralization is often a key goal in the transition to the endgame",
    ],
  },
  {
    fen: "8/8/8/8/4k3/3p4/3K4/8 w - - 0 1",
    title: "King in Front of Pawn",
    description: "A key defensive technique in pawn endgames.",
    explanation: [
      "White's king is ideally placed in front of the passed pawn",
      "This position is typically a draw, even with Black to move",
      "The defending king aims to stay in front of the pawn",
      "This technique is crucial for defending in pawn endgames",
    ],
  },
  {
    fen: "8/8/8/4P3/5K2/8/3k4/8 w - - 0 1",
    title: "Key Squares",
    description: "Demonstrating the concept of key squares in king and pawn endgames.",
    explanation: [
      "The squares d6, e6, and f6 are key squares for this pawn",
      "If White's king can occupy any of these squares, the pawn will promote",
      "Black's king is trying to reach these key squares to stop the pawn",
      "Understanding key squares is essential for playing king and pawn endgames",
    ],
  },
]

const kingActivityPrinciples = [
  {
    title: "Centralization",
    icon: <ChessKing className="h-6 w-6" />,
    points: [
      "Move your king to the center in the endgame",
      "A centralized king controls more squares",
      "Use your king to support pawn advances",
      "Prevent your opponent's king from centralizing",
    ],
  },
  {
    title: "Opposition",
    icon: <ArrowLeftRight className="h-6 w-6" />,
    points: [
      "Understand and use king opposition",
      "Direct opposition occurs with one square between kings",
      "Distant opposition can be crucial in pawn endgames",
      "Practice recognizing and creating opposition",
    ],
  },
  {
    title: "Pawn Support",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Use your king to support pawn advances",
      "Protect passed pawns with your king",
      "The king can help create passed pawns",
      "In pawn endgames, king activity often decides the game",
    ],
  },
]

export function KingActivity() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % kingActivityExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + kingActivityExamples.length) % kingActivityExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">King Activity in Endgames</h2>
        <p className="text-gray-600 mb-6">
          In the endgame, the king transforms from a piece that needs protection to a powerful attacking force.
          Understanding how to effectively use your king is crucial for success in many endgame positions.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          The king's activity in the endgame can often be the deciding factor. A centralized king can control important
          squares, support pawn advances, and restrict the opponent's pieces. Always look for ways to activate your king
          in the endgame.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={kingActivityExamples[currentExample].fen}
          initialFen={kingActivityExamples[currentExample].fen}
          title={kingActivityExamples[currentExample].title}
          description={kingActivityExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {kingActivityExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {kingActivityExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">King Activity Principles</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {kingActivityPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Triangulation</h3>
                <p className="text-gray-600 mb-4">
                  A technique used to gain the opposition or force the opponent's king to a worse square.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Involves moving the king in a triangular pattern</li>
                  <li>Used to lose a move and force the opponent into zugzwang</li>
                  <li>Particularly useful in king and pawn endgames</li>
                  <li>Requires careful calculation and understanding of the position</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Shouldering</h3>
                <p className="text-gray-600 mb-4">
                  A technique where the king pushes the opponent's king aside to clear a path.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Often used in pawn endgames to create a passed pawn</li>
                  <li>The attacking king "shoulders" the defending king aside</li>
                  <li>Can be decisive in breaking through the opponent's defenses</li>
                  <li>Requires good calculation and understanding of king movement</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Improving King Activity</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Practice recognizing opportunities to activate your king in the endgame</li>
          <li>Study classic endgame positions to understand the power of an active king</li>
          <li>In simplified positions, always consider how your king can become more active</li>
          <li>Remember that king safety is still important - don't activate your king prematurely</li>
          <li>Use your king to support passed pawns and create new passed pawns</li>
          <li>Practice endgame studies focusing on king activity to improve your skills</li>
        </ul>
      </motion.div>
    </div>
  )
}

