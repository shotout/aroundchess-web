"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Weight } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const overloadingExamples = [
  {
    fen: "r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1n4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 8",
    title: "Overloaded Queen",
    description: "A position where the queen is responsible for multiple defensive duties.",
    explanation: [
      "The black queen is overloaded, defending both the knight on d4 and the bishop on b4",
      "White can exploit this by playing Bxd4, forcing Black to choose between two bad options",
      "If Black recaptures with the queen, White wins the bishop on b4",
      "If Black doesn't recapture, White wins the knight and has a strong position",
    ],
  },
  {
    fen: "r3k2r/ppp2ppp/2n5/3q4/1b1P4/2N5/PPP2PPP/R1BQK2R b KQkq - 0 1",
    title: "Overloaded Rook",
    description: "A position where a rook is responsible for defending multiple pieces or squares.",
    explanation: [
      "The white rook on h1 is overloaded, defending both the e1 square and the h2 pawn",
      "Black can exploit this by playing Qe4+, forking the king and the h1 rook",
      "If White moves the king, Black wins the rook",
      "If White blocks with the queen, Black wins the pawn on h2",
    ],
  },
]

const overloadingPrinciples = [
  {
    title: "Identifying Overloaded Pieces",
    icon: <Weight className="h-6 w-6" />,
    points: [
      "Look for pieces that are defending multiple other pieces or squares",
      "Pay attention to pieces that are pinned and have other defensive duties",
      "Consider how removing one defender might affect the overall position",
      "Be aware of potential overloading in your own position",
    ],
  },
  {
    title: "Exploiting Overloaded Pieces",
    icon: <Weight className="h-6 w-6" />,
    points: [
      "Create threats that force the overloaded piece to 'choose' which duty to maintain",
      "Use tactics like forks, pins, or skewers to exploit the overloaded piece",
      "Consider sacrifices that might remove a key defender and overload another piece",
      "Look for ways to increase the pressure on the overloaded piece",
    ],
  },
  {
    title: "Preventing Overloading",
    icon: <Weight className="h-6 w-6" />,
    points: [
      "Distribute defensive duties among multiple pieces when possible",
      "Be cautious about relying too heavily on a single piece for defense",
      "Look for prophylactic moves that can prevent potential overloading",
      "Consider simplifying the position if you're at risk of being overloaded",
    ],
  },
]

export function OverloadingConcepts() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % overloadingExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + overloadingExamples.length) % overloadingExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overloading Concepts</h2>
        <p className="text-gray-600 mb-6">
          Overloading in chess occurs when a piece is burdened with multiple defensive duties, making it vulnerable to
          tactical exploitation. Understanding and recognizing overloaded pieces can lead to powerful tactical
          opportunities in your games.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          An overloaded piece is often a weak point in a position. By forcing an overloaded piece to "choose" between
          its duties, you can often gain a significant advantage. Always be on the lookout for pieces that are defending
          multiple targets.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={overloadingExamples[currentExample].fen}
          initialFen={overloadingExamples[currentExample].fen}
          title={overloadingExamples[currentExample].title}
          description={overloadingExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {overloadingExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {overloadingExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Overloading Principles</TabsTrigger>
          <TabsTrigger value="exercises">Overloading Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {overloadingPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify the Overloaded Piece</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the overloaded piece and how to exploit it.
                </p>
                <ChessExample
                  initialFen="r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1n4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 8"
                  title="Overloaded Piece Identification"
                  description="White to move. Find the overloaded piece and exploit it."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Create an Overload</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the move that creates an overload situation for your opponent.
                </p>
                <ChessExample
                  initialFen="r3k2r/ppp2ppp/2n5/3q4/1b1P4/2N5/PPP2PPP/R1BQK2R b KQkq - 0 1"
                  title="Creating an Overload"
                  description="Black to move. Create an overload situation."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Overloading Concepts</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for pieces that are defending multiple targets</li>
          <li>Practice identifying overloaded pieces in tactical puzzles and your own games</li>
          <li>Consider how removing one defender might affect the overall position</li>
          <li>Look for ways to increase the pressure on overloaded pieces</li>
          <li>Be aware of potential overloading in your own position and take preventive measures</li>
          <li>Combine overloading tactics with other motifs like pins, forks, or skewers for maximum effect</li>
        </ul>
      </motion.div>
    </div>
  )
}

