"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, RocketIcon as ChessRook, ArrowLeftRight, Target } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const rookEndgameExamples = [
  {
    fen: "8/8/8/8/4k3/8/4P3/4K2R w - - 0 1",
    title: "Lucena Position",
    description: "A fundamental winning position in rook endgames.",
    explanation: [
      "White's goal is to create a bridge for the king to escape checks",
      "The key move is to advance the pawn to the 7th rank",
      "Use the rook to cut off the enemy king and support pawn promotion",
      "This position demonstrates the power of cooperation between king, rook, and pawn",
    ],
  },
  {
    fen: "7R/8/8/8/8/8/4pk2/4K3 w - - 0 1",
    title: "Philidor Position",
    description: "A classic defensive setup in rook endgames.",
    explanation: [
      "Black's goal is to keep the white king from reaching the 6th rank",
      "The defending rook should stay on the 3rd rank until the king reaches the 6th",
      "If executed correctly, this position is a theoretical draw",
      "Understanding this position is crucial for defending in rook endgames",
    ],
  },
  {
    fen: "8/8/8/8/5PK1/4k3/8/7r w - - 0 1",
    title: "Rook vs Pawn",
    description: "A common endgame where a rook fights against a passed pawn.",
    explanation: [
      "The rook's goal is to stop the pawn from promoting",
      "The king plays a crucial role in supporting the pawn's advance",
      "The rook should give checks from behind the pawn when possible",
      "This type of endgame often requires precise calculation and technique",
    ],
  },
  {
    fen: "8/8/8/8/3k4/8/3P4/3RK3 w - - 0 1",
    title: "Rook and Pawn vs Rook",
    description: "One of the most common and complex rook endgames.",
    explanation: [
      "The side with the pawn aims to promote, while the other side tries to draw",
      "Key defensive technique is to keep the king in front of the pawn",
      "The attacking side should use the rook to support the pawn's advance",
      "Many of these positions are theoretical draws, but practical play can be challenging",
    ],
  },
]

const rookEndgamePrinciples = [
  {
    title: "Rook Activity",
    icon: <ChessRook className="h-6 w-6" />,
    points: [
      "Keep your rook active and on open files",
      "Use the rook to cut off the enemy king",
      "Support pawn advances with your rook",
      "Give checks from behind passed pawns",
    ],
  },
  {
    title: "King Activity",
    icon: <ArrowLeftRight className="h-6 w-6" />,
    points: [
      "Activate your king in rook endgames",
      "Use the king to support pawn advances",
      "Protect your king from enemy rook checks",
      "In defensive positions, keep the king in front of passed pawns",
    ],
  },
  {
    title: "Pawn Play",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Create and support passed pawns",
      "Use pawns to restrict enemy rook movement",
      "Be cautious of creating pawn weaknesses",
      "In winning positions, advance pawns carefully",
    ],
  },
]

export function RookEndgames() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % rookEndgameExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + rookEndgameExamples.length) % rookEndgameExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rook Endgames</h2>
        <p className="text-gray-600 mb-6">
          Rook endgames are among the most common and complex endgames in chess. Mastering key positions and principles
          is essential for success in these endgames, which often require precise technique and calculation.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          In rook endgames, coordination between the rook, king, and pawns is crucial. The rook's long-range
          capabilities and the king's increased activity make these endgames both rich in possibilities and challenging
          to play.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={rookEndgameExamples[currentExample].fen}
          initialFen={rookEndgameExamples[currentExample].fen}
          title={rookEndgameExamples[currentExample].title}
          description={rookEndgameExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {rookEndgameExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {rookEndgameExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Rook Endgame Principles</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {rookEndgamePrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">The Bridge Building Technique</h3>
                <p className="text-gray-600 mb-4">
                  A key technique in the Lucena position to help the stronger side promote their pawn.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Used when the attacking king is cut off by checks from the defending rook</li>
                  <li>Involves moving the rook to the 4th rank to create a "bridge" for the king</li>
                  <li>Allows the king to escape checks and support the pawn's promotion</li>
                  <li>Practice this technique to convert winning rook and pawn vs rook endgames</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">The Short Side Defense</h3>
                <p className="text-gray-600 mb-4">A defensive technique used in rook and pawn vs rook endgames.</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Defend from the side of the board with fewer squares to the pawn</li>
                  <li>Reduces the space for the attacking king to maneuver</li>
                  <li>Aim to keep your rook active and giving checks from behind the pawn</li>
                  <li>Can often lead to a draw even in seemingly difficult positions</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Playing Rook Endgames</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Keep your rook active, controlling open files and cutting off the enemy king</li>
          <li>Use your king actively in rook endgames, it's a powerful piece in this phase</li>
          <li>When defending, try to keep your king in front of passed pawns</li>
          <li>Practice key positions like the Lucena and Philidor positions</li>
          <li>In rook and pawn vs rook endgames, know whether the position is theoretically won or drawn</li>
          <li>Be patient in rook endgames, they often require many moves to convert an advantage</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="rook-endgames" />
      </div>
    </div>
  )
}

