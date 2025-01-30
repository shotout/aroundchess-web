"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Divide, Target, Shield } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const drawingTechniqueExamples = [
  {
    fen: "8/8/8/8/4k3/8/4P3/4K3 b - - 0 1",
    title: "The Philidor Position",
    description: "A classic drawing technique in rook endgames.",
    explanation: [
      "The defending king stays on the 6th rank until the attacking king reaches the 6th",
      "Then, the defender checks from behind and keeps the attacking king at bay",
      "This technique can hold a draw even when a pawn down",
      "Understanding this position is crucial for defending rook endgames",
    ],
  },
  {
    fen: "8/8/8/1k6/8/1K6/R7/8 w - - 0 1",
    title: "Rook vs Pawn Drawing Zone",
    description: "Positions where a rook can draw against a pawn.",
    explanation: [
      "The defending king stays in the 'drawing zone' in front of the pawn",
      "The rook gives checks from behind to prevent the king from escaping",
      "This technique works for pawns on the a, c, f, and h files",
      "Knowing these positions can save half points in practical play",
    ],
  },
  {
    fen: "8/8/8/8/8/k7/n7/K7 w - - 0 1",
    title: "Knight and Bishop Mate Defense",
    description: "Defending against a knight and bishop checkmate.",
    explanation: [
      "The defender aims to reach a corner that's the opposite color of the attacking bishop",
      "Proper defense can hold a draw against knight and bishop",
      "This endgame is theoretically won, but very difficult to win in practice",
      "Understanding this defense is crucial when facing this material imbalance",
    ],
  },
  {
    fen: "8/8/8/3k4/8/3K4/8/8 w - - 0 1",
    title: "King Opposition",
    description: "Using king opposition to prevent progress and secure a draw.",
    explanation: [
      "The kings are in direct opposition, one square apart",
      "The side to move often has a disadvantage in this position",
      "Using opposition can prevent the opponent's king from making progress",
      "This technique is fundamental in king and pawn endgames",
    ],
  },
]

const drawingTechniquePrinciples = [
  {
    title: "Stalemate Tricks",
    icon: <Divide className="h-6 w-6" />,
    points: [
      "Look for opportunities to sacrifice material for stalemate",
      "Force the opponent's king into a corner with no legal moves",
      "Use pawn promotions to create stalemate possibilities",
      "Be aware of stalemate patterns in various endgame scenarios",
    ],
  },
  {
    title: "Fortress Positions",
    icon: <Shield className="h-6 w-6" />,
    points: [
      "Create a position where the stronger side can't make progress",
      "Use pawns to block the opponent's pieces effectively",
      "Position your pieces to control key squares",
      "Understand common fortress positions in different material imbalances",
    ],
  },
  {
    title: "Perpetual Check",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Look for opportunities to give endless checks",
      "Use open lines and diagonals to your advantage",
      "Force the opponent's king into a confined area",
      "Be aware of potential perpetual check possibilities in various positions",
    ],
  },
]

export function DrawingTechniques() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % drawingTechniqueExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + drawingTechniqueExamples.length) % drawingTechniqueExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Drawing Techniques</h2>
        <p className="text-gray-600 mb-6">
          In chess, knowing how to secure a draw in inferior positions is just as important as knowing how to win. These
          drawing techniques can help you salvage half a point from seemingly lost positions and are crucial for
          improving your overall endgame play.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Drawing techniques often rely on deep understanding of endgame principles, piece coordination, and sometimes
          counterintuitive moves. Mastering these techniques can greatly improve your defensive skills.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={drawingTechniqueExamples[currentExample].fen}
          initialFen={drawingTechniqueExamples[currentExample].fen}
          title={drawingTechniqueExamples[currentExample].title}
          description={drawingTechniqueExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {drawingTechniqueExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {drawingTechniqueExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Drawing Principles</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {drawingTechniquePrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">The Fifty-Move Rule</h3>
                <p className="text-gray-600 mb-4">
                  Understanding and using the fifty-move rule can be crucial in long endgames.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>A draw can be claimed if no pawn has moved and no capture has been made in the last 50 moves</li>
                  <li>Keep track of the move count in long endgames</li>
                  <li>Use this rule to your advantage in theoretically won but practically difficult positions</li>
                  <li>
                    Be aware that some positions require more than 50 moves to win, making them drawn under this rule
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Blockade</h3>
                <p className="text-gray-600 mb-4">
                  Creating a blockade can be an effective way to draw an otherwise lost position.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Use your pieces to block enemy passed pawns</li>
                  <li>Create a fortress by positioning your pieces optimally</li>
                  <li>Understand key blockading positions in various endgames</li>
                  <li>Practice maintaining blockades under pressure</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Improving Your Drawing Techniques</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Study classic endgame positions and their drawing techniques</li>
          <li>Practice defending inferior positions against stronger players or chess engines</li>
          <li>Analyze your games to identify missed drawing opportunities</li>
          <li>Develop your calculation skills to spot drawing resources in complex positions</li>
          <li>Stay calm and look for creative defensive resources even in seemingly hopeless positions</li>
          <li>Remember that your opponent may not know the winning technique, so always play on in lost positions</li>
        </ul>
      </motion.div>
    </div>
  )
}

