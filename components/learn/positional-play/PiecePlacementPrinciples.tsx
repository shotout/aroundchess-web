"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, ListTodo, Target, Crosshair } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const piecePlacementExamples = [
  {
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    title: "Center Control",
    description: "White's pieces are actively placed, controlling the center and creating threats.",
    explanation: [
      "White's pawn on e4 controls key central squares.",
      "The knight on f3 supports the e4 pawn and controls d5.",
      "White's pieces are developed towards the center, ready for action.",
      "Black's pieces are less active and lack central influence.",
      "This demonstrates the importance of centralizing pieces in the opening and middlegame.",
    ],
  },
  {
    fen: "rnbqk1nr/pppp1ppp/8/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3",
    title: "Piece Coordination",
    description: "White's pieces are well-coordinated, supporting each other and creating attacking potential.",
    explanation: [
      "White's bishop pair controls key diagonals.",
      "The knights support the center and prepare for a kingside attack.",
      "The queen is ready to join the attack when the opportunity arises.",
      "Black's pieces are less coordinated and lack a clear plan.",
      "This demonstrates the power of coordinated piece play in creating attacking chances.",
    ],
  },
  {
    fen: "rnbqkb1r/ppp2ppp/3p1n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
    title: "King Safety",
    description: "White's king is safely castled, while Black's king is still in the center.",
    explanation: [
      "White's king is castled kingside, protected by pawns and pieces.",
      "Black's king is still in the center, vulnerable to attacks.",
      "White's pieces are developed and ready to attack, while Black's pieces are less active.",
      "This demonstrates the importance of castling early to ensure king safety.",
      "A safe king allows for more aggressive piece play and strategic planning.",
    ],
  },
  {
    fen: "r2qkb1r/ppp2ppp/2np1n2/4p3/2B1P1b1/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6",
    title: "Exploiting Weaknesses",
    description: "White's pieces are targeting weaknesses in Black's position.",
    explanation: [
      "White's bishop on c4 is attacking the weak f7 pawn.",
      "The knight on d3 is eyeing the e5 square, creating a potential fork.",
      "Black's pieces are passively placed and lack coordination.",
      "This demonstrates how to exploit weaknesses in the opponent's position.",
      "Targeting weak squares and pieces can lead to material gain or positional advantages.",
    ],
  },
]

const piecePlacementPrinciples = [
  {
    title: "Centralization",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Place pieces towards the center to control key squares.",
      "Knights and pawns are particularly effective in the center.",
      "Centralization increases piece mobility and influence.",
      "Control of the center restricts your opponent's options.",
    ],
  },
  {
    title: "Coordination",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Ensure your pieces work together harmoniously.",
      "Avoid placing pieces where they block each other.",
      "Coordinate pieces to create multiple threats.",
      "Well-coordinated pieces are more powerful than isolated ones.",
    ],
  },
  {
    title: "Development",
    icon: <ListTodo className="h-6 w-6" />,
    points: [
      "Develop your pieces quickly and efficiently.",
      "Bring pieces into play where they can influence the game.",
      "Avoid moving the same piece multiple times in the opening.",
      "Rapid development creates a strong foundation for the middlegame.",
    ],
  },
]

export function PiecePlacementPrinciples() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % piecePlacementExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + piecePlacementExamples.length) % piecePlacementExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Piece Placement Principles</h2>
        <p className="text-gray-600 mb-6">
          Effective piece placement is a cornerstone of positional chess. Understanding where to place your pieces to
          maximize their influence and control the board is crucial for creating strong positions and converting
          advantages into victories.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Piece placement is not just about individual pieces, but about how they work together. A well-coordinated army
          of pieces, even if slightly less active individually, can be more powerful than a few highly active pieces
          that don't support each other.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={piecePlacementExamples[currentExample].fen}
          initialFen={piecePlacementExamples[currentExample].fen}
          title={piecePlacementExamples[currentExample].title}
          description={piecePlacementExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {piecePlacementExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {piecePlacementExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Placement Principles</TabsTrigger>
          <TabsTrigger value="exercises">Practice Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {piecePlacementPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Improve Piece Placement</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the best squares for White's pieces to improve their placement and
                  coordination.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
                  title="Piece Placement Exercise"
                  description="White to move. Improve White's piece placement."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Exploit Poor Placement</h3>
                <p className="text-gray-600 mb-4">
                  In this position, identify weaknesses in Black's piece placement and find the best move for White to
                  exploit them.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 2"
                  title="Exploiting Weaknesses"
                  description="Black to move. White to find the best move."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Effective Piece Placement</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always consider the pawn structure when placing your pieces.</li>
          <li>Look for squares where your pieces control important squares and restrict your opponent's options.</li>
          <li>Coordinate your pieces to create multiple threats and support each other.</li>
          <li>Avoid placing pieces where they can be easily attacked or exchanged for less valuable pieces.</li>
          <li>Practice visualizing different piece placements and their potential impact on the position.</li>
          <li>Study master games to see how strong players place their pieces in various situations.</li>
        </ul>
      </motion.div>
    </div>
  )
}

