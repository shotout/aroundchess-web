"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, SquareIcon as EmptySquare, Target, Crosshair } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const squareControlExamples = [
  {
    fen: "rnbqkbnr/pppp1ppp/8/4p3/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 2",
    title: "Central Square Control",
    description: "White's knight controls the central d5 square, restricting Black's options.",
    explanation: [
      "The knight on f3 controls the d5 square, a key central square.",
      "Black's pieces are restricted in their movement due to the knight's presence.",
      "White can use this control to develop their pieces and build a strong center.",
      "This example demonstrates the importance of controlling central squares in chess.",
      "Controlling key squares can limit the opponent's options and create opportunities.",
    ],
  },
  {
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
    title: "Outpost Square Control",
    description: "White's knight occupies a strong outpost on d5, difficult for Black to challenge.",
    explanation: [
      "The knight on c3 can move to d5, creating a strong outpost.",
      "This outpost is supported by the pawn on e4 and difficult for Black to attack.",
      "From d5, the knight controls key squares and restricts Black's piece movement.",
      "This example demonstrates the power of knight outposts in positional chess.",
      "Outposts provide a stable base for pieces and can be used to launch attacks.",
    ],
  },
]

const squareControlPrinciples = [
  {
    title: "Central Squares",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Control of central squares (d4, e4, d5, e5) is crucial.",
      "Use pawns and pieces to occupy or influence these squares.",
      "Central control restricts opponent's piece mobility.",
      "A strong center provides a base for attacks on either flank.",
    ],
  },
  {
    title: "Key Squares",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Identify key squares that support your plans or restrict your opponent.",
      "Use pieces to control these squares and dictate the flow of the game.",
      "Key squares can change depending on the pawn structure and piece placement.",
      "Control of key squares can lead to positional advantages and tactical opportunities.",
    ],
  },
  {
    title: "Weak Squares",
    icon: <EmptySquare className="h-6 w-6" />,
    points: [
      "Identify weak squares in your opponent's position.",
      "Target these squares with your pieces to create pressure.",
      "A weak square is a square that is difficult for your opponent to defend.",
      "Exploiting weak squares can lead to material gain or positional dominance.",
    ],
  },
]

export function SquareControl() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % squareControlExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + squareControlExamples.length) % squareControlExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Square Control</h2>
        <p className="text-gray-600 mb-6">
          Controlling key squares is a fundamental principle of positional chess. By dominating important squares, you
          restrict your opponent's piece mobility, create weaknesses in their position, and generate opportunities for
          your own pieces.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          The concept of square control is closely related to piece activity and pawn structure. A well-placed piece
          controls more squares, and a strong pawn structure can help control key squares and create weaknesses in the
          opponent's position.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={squareControlExamples[currentExample].fen}
          initialFen={squareControlExamples[currentExample].fen}
          title={squareControlExamples[currentExample].title}
          description={squareControlExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {squareControlExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {squareControlExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Square Control Principles</TabsTrigger>
          <TabsTrigger value="exercises">Practice Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {squareControlPrinciples.map((principle, index) => (
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

        <TabsContent value="exercises">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify Key Squares</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the key squares and explain why they are important.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
                  title="Key Square Identification"
                  description="White to move. Identify the key squares."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Control Key Squares</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the best moves for White to control the key squares and restrict Black's
                  options.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 2"
                  title="Controlling Key Squares"
                  description="Black to move. White to find the best moves."
                />
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Square Control</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always consider the pawn structure when evaluating square control.</li>
          <li>Look for squares that are difficult for your opponent to defend.</li>
          <li>Use pieces to control key squares and restrict your opponent's piece mobility.</li>
          <li>Be aware of potential weak squares in your own position and take preventive measures.</li>
          <li>Practice identifying and controlling key squares in tactical puzzles and your own games.</li>
          <li>Study master games to see how strong players utilize square control in various situations.</li>
        </ul>
      </motion.div>
    </div>
  )
}

