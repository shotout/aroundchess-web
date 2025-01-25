"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Magnet } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pinExamples = [
  {
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    title: "Absolute Pin",
    description: "A pin where the pinned piece cannot legally move because it would expose the king to check.",
    explanation: [
      "The bishop on c4 is pinning the f7 pawn to the black king",
      "The f7 pawn cannot move as it would expose the king to check",
      "This is an absolute pin because moving the pinned piece would be illegal",
      "Absolute pins are very strong as they completely immobilize the pinned piece",
    ],
  },
  {
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 3",
    title: "Relative Pin",
    description: "A pin where the pinned piece can legally move, but doing so would result in material loss.",
    explanation: [
      "The bishop on c4 is pinning the f7 pawn to the black queen",
      "The f7 pawn can legally move, but doing so would expose the queen to capture",
      "This is a relative pin because moving the pinned piece is legal but disadvantageous",
      "Relative pins can be powerful, but the pinned piece still retains some mobility",
    ],
  },
]

const pinPrinciples = [
  {
    title: "Creating Pins",
    icon: <Magnet className="h-6 w-6" />,
    points: [
      "Look for opportunities to align your long-range pieces with enemy pieces",
      "Target pieces that are protecting more valuable pieces",
      "Use pins to restrict your opponent's piece mobility",
      "Create pins that lead to material gain or positional advantage",
    ],
  },
  {
    title: "Exploiting Pins",
    icon: <Magnet className="h-6 w-6" />,
    points: [
      "Increase pressure on pinned pieces by attacking them",
      "Use pinned pieces as targets for other tactical motifs",
      "Force unfavorable moves or exchanges by threatening pinned pieces",
      "Create multiple threats that the pinned piece cannot address",
    ],
  },
  {
    title: "Defending Against Pins",
    icon: <Magnet className="h-6 w-6" />,
    points: [
      "Be aware of potential pins and try to avoid them",
      "Break pins by moving the pinned piece or the piece behind it",
      "Counter-attack to create threats that outweigh the pin",
      "Use tactical motifs like deflection to remove the pinning piece",
    ],
  },
]

export function PinMechanisms() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % pinExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + pinExamples.length) % pinExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pin Mechanisms</h2>
        <p className="text-gray-600 mb-6">
          Pins are powerful tactical motifs in chess where a piece is prevented from moving because doing so would
          expose a more valuable piece to capture. Understanding and utilizing pins effectively can give you a
          significant advantage in your games.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          There are two types of pins: absolute pins (where moving the pinned piece would be illegal) and relative pins
          (where moving the pinned piece would result in material loss). Both can be powerful tactical weapons.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={pinExamples[currentExample].fen}
          initialFen={pinExamples[currentExample].fen}
          title={pinExamples[currentExample].title}
          description={pinExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {pinExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {pinExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Pin Principles</TabsTrigger>
          <TabsTrigger value="exercises">Pin Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {pinPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify the Pin</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the pin and determine whether it's an absolute or relative pin.
                </p>
                <ChessExample
                  initialFen="r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4"
                  title="Pin Identification"
                  description="White to move. Identify the pin in this position."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Exploit the Pin</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the best move to exploit the pin and gain a material advantage.
                </p>
                <ChessExample
                  initialFen="r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6"
                  title="Exploiting a Pin"
                  description="White to move. Find the best move to exploit the pin."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Pin Tactics</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for potential pins in your games</li>
          <li>Practice creating and exploiting pins in tactical puzzles</li>
          <li>Study master games to see how strong players use pins effectively</li>
          <li>Remember that pins can be used both offensively and defensively</li>
          <li>Combine pin tactics with other tactical motifs for maximum effect</li>
          <li>Be aware of your own pieces' alignments to avoid falling victim to pins</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="pin-mechanisms" />
      </div>
    </div>
  )
}

