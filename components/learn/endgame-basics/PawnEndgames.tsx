"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, PianoIcon as ChessPawn, ArrowLeftRight, Crown } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pawnEndgameExamples = [
  {
    fen: "4k3/8/8/8/4P3/8/8/4K3 w - - 0 1",
    title: "King and Pawn vs King",
    description: "A fundamental pawn endgame where one side tries to promote their pawn.",
    explanation: [
      "The side with the pawn aims to advance it to promotion",
      "The defending king tries to block the pawn's advance",
      "The attacking king must support the pawn's advance",
      "Understanding key squares is crucial in this endgame",
    ],
  },
  {
    fen: "8/8/8/4P3/8/4K3/8/4k3 w - - 0 1",
    title: "Pawn Breakthrough",
    description: "A position where advancing the pawn leads to a winning advantage.",
    explanation: [
      "The pawn on the 5th rank creates a passed pawn",
      "The attacking king is well-placed to support the pawn",
      "The defending king is too far to stop the pawn's advance",
      "This position demonstrates the power of passed pawns in the endgame",
    ],
  },
  {
    fen: "4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1",
    title: "Connected Passed Pawns",
    description: "A position with connected passed pawns, which are very strong in the endgame.",
    explanation: [
      "Connected passed pawns are a powerful force in the endgame",
      "They support each other's advance",
      "The defending king struggles to stop both pawns",
      "Understanding how to create and utilize connected passed pawns is crucial",
    ],
  },
  {
    fen: "4k3/8/8/3P4/5P2/8/8/4K3 w - - 0 1",
    title: "Pawn Majority",
    description: "A position where one side has a pawn majority on one flank.",
    explanation: [
      "The side with more pawns on one flank has a pawn majority",
      "This majority can be used to create a passed pawn",
      "The key is to advance the pawns carefully and create a passed pawn",
      "Understanding pawn majorities is crucial for playing pawn endgames",
    ],
  },
]

const pawnEndgamePrinciples = [
  {
    title: "Pawn Promotion",
    icon: <Crown className="h-6 w-6" />,
    points: [
      "Advance pawns towards promotion",
      "Use your king to support pawn advancement",
      "Create passed pawns when possible",
      "Be aware of potential queening squares",
    ],
  },
  {
    title: "King Activity",
    icon: <ChessPawn className="h-6 w-6" />,
    points: [
      "Activate your king in pawn endgames",
      "Use the king to support pawn advances",
      "Block enemy pawns with your king",
      "Control key squares in front of pawns",
    ],
  },
  {
    title: "Pawn Structure",
    icon: <ArrowLeftRight className="h-6 w-6" />,
    points: [
      "Create and maintain a healthy pawn structure",
      "Avoid creating weaknesses in your pawn chain",
      "Try to create passed pawns",
      "Be aware of potential pawn breaks",
    ],
  },
]

export function PawnEndgames() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % pawnEndgameExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + pawnEndgameExamples.length) % pawnEndgameExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pawn Endgames</h2>
        <p className="text-gray-600 mb-6">
          Pawn endgames are among the most fundamental and important endgames in chess. Understanding pawn structures,
          king activity, and promotion strategies is crucial for success in these positions.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          In pawn endgames, the king becomes a powerful piece. Its ability to support pawn advances and block enemy
          pawns is often the deciding factor in these positions.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={pawnEndgameExamples[currentExample].fen}
          initialFen={pawnEndgameExamples[currentExample].fen}
          title={pawnEndgameExamples[currentExample].title}
          description={pawnEndgameExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {pawnEndgameExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {pawnEndgameExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Pawn Endgame Principles</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {pawnEndgamePrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Opposition</h3>
                <p className="text-gray-600 mb-4">
                  Opposition is a crucial concept in pawn endgames where kings face each other with one square in
                  between.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Direct opposition occurs when kings are on the same file with one square between them</li>
                  <li>The side that doesn't have to move often has an advantage</li>
                  <li>Use opposition to control key squares and support pawn advances</li>
                  <li>Practice recognizing and creating opposition in your games</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Triangulation</h3>
                <p className="text-gray-600 mb-4">
                  Triangulation is a technique used to lose a move and force the opponent into zugzwang.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Involves moving the king in a triangle to return to the starting square</li>
                  <li>Used to force the opponent's king to move away from a key square</li>
                  <li>Can be decisive in pawn endgames where tempo is crucial</li>
                  <li>Practice identifying positions where triangulation can be applied</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Playing Pawn Endgames</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Calculate pawn races carefully, considering potential queen promotions</li>
          <li>Use your king actively to support pawns and block enemy advances</li>
          <li>Create passed pawns whenever possible</li>
          <li>Be aware of potential stalemate traps in king and pawn vs king endgames</li>
          <li>Study classic pawn endgame positions to improve your understanding</li>
          <li>Practice endgame studies to sharpen your calculation skills</li>
        </ul>
      </motion.div>
    </div>
  )
}

