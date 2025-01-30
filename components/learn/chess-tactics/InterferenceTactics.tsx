"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, BanIcon } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const interferenceExamples = [
  {
    fen: "r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1P4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 7",
    title: "Bishop Interference",
    description: "A tactic where a piece is placed between two enemy pieces, disrupting their coordination.",
    explanation: [
      "White can play Bb5, interfering with the connection between Black's queen and the b4 bishop",
      "This move creates a threat of capturing the bishop on b4",
      "If Black moves the bishop, White can play Bxc6+, forking the king and rook",
      "This example shows how interference can create multiple threats",
    ],
  },
  {
    fen: "r3k2r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R1BQK2R b KQkq - 0 1",
    title: "Rook Interference",
    description: "A tactic where a piece is placed between an enemy rook and king, preventing castling.",
    explanation: [
      "Black can play Qe4+, interfering with White's ability to castle kingside",
      "This move also attacks the unprotected pawn on e2",
      "White is forced to block with the queen or move the king, losing castling rights",
      "This interference tactic significantly weakens White's king safety",
    ],
  },
]

const interferencePrinciples = [
  {
    title: "Creating Interference",
    icon: <BanIcon className="h-6 w-6" />,
    points: [
      "Look for opportunities to disrupt the coordination between enemy pieces",
      "Consider how placing a piece can block important lines or diagonals",
      "Use interference to prevent defensive moves like castling",
      "Combine interference with other tactical motifs for maximum effect",
    ],
  },
  {
    title: "Exploiting Interference",
    icon: <BanIcon className="h-6 w-6" />,
    points: [
      "After creating interference, quickly capitalize on the resulting weaknesses",
      "Look for tactical motifs like forks, pins, or discovered attacks that arise from the interference",
      "Consider how the interference affects the overall position and piece coordination",
      "Be prepared to calculate deeply, as interference often involves multiple moves",
    ],
  },
  {
    title: "Defending Against Interference",
    icon: <BanIcon className="h-6 w-6" />,
    points: [
      "Be aware of potential interference tactics in your position",
      "Maintain good piece coordination to minimize vulnerability to interference",
      "Consider prophylactic moves that prevent potential interference",
      "When faced with interference, look for creative defensive resources",
    ],
  },
]

export function InterferenceTactics() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % interferenceExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + interferenceExamples.length) % interferenceExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interference Tactics</h2>
        <p className="text-gray-600 mb-6">
          Interference is a tactical motif in chess where a piece is placed between two enemy pieces, disrupting their
          coordination or blocking an important line. Understanding and utilizing interference tactics can create
          powerful opportunities in your games.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Interference tactics often work by disrupting the coordination between enemy pieces or blocking important
          defensive resources. By interfering with the opponent's piece coordination, you can create weaknesses and
          tactical opportunities.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={interferenceExamples[currentExample].fen}
          initialFen={interferenceExamples[currentExample].fen}
          title={interferenceExamples[currentExample].title}
          description={interferenceExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {interferenceExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {interferenceExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Interference Principles</TabsTrigger>
          <TabsTrigger value="exercises">Interference Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {interferencePrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify the Interference</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the best interference tactic for White.
                </p>
                <ChessExample
                  initialFen="r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1P4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 7"
                  title="Interference Identification"
                  description="White to move. Find the best interference tactic."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Create Interference</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the move that creates a powerful interference tactic for Black.
                </p>
                <ChessExample
                  initialFen="r3k2r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R1BQK2R b KQkq - 0 1"
                  title="Creating Interference"
                  description="Black to move. Create a strong interference tactic."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Interference Tactics</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for opportunities to disrupt your opponent's piece coordination</li>
          <li>Practice identifying and creating interference tactics in tactical puzzles</li>
          <li>Consider how placing a piece can block important lines or diagonals</li>
          <li>Look for ways to combine interference with other tactical motifs for maximum effect</li>
          <li>Be aware of potential interference tactics against your own pieces and take preventive measures</li>
          <li>
            When executing an interference tactic, be prepared to calculate deeply and consider all possible responses
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

