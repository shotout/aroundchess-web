"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, MoveRight } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const deflectionExamples = [
  {
    fen: "r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1P4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 7",
    title: "Queen Deflection",
    description: "A tactic where the queen is forced away from a key defensive square.",
    explanation: [
      "White can play Bxf7+, deflecting the black queen from defending the e7 square",
      "If Black captures with Kxf7, White can play Qd5+ forking the king and rook",
      "If Black doesn't capture, White gains a significant material advantage",
      "This example shows how deflection can lead to multiple threats",
    ],
  },
  {
    fen: "r3k2r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R3K2R w KQkq - 0 1",
    title: "Rook Deflection",
    description: "A tactic where a rook is forced away from a key defensive file.",
    explanation: [
      "White can play Qh5+, deflecting the black rook from the e-file",
      "After Black blocks with g6, White can play Qe5+, winning the rook",
      "This deflection tactic exploits the alignment of Black's pieces",
      "It demonstrates how forcing moves can create tactical opportunities",
    ],
  },
]

const deflectionPrinciples = [
  {
    title: "Creating Deflections",
    icon: <MoveRight className="h-6 w-6" />,
    points: [
      "Look for pieces that are overloaded with defensive duties",
      "Use forcing moves like checks or captures to create deflections",
      "Consider sacrifices that force the opponent to move a key defensive piece",
      "Look for ways to exploit the resulting weaknesses after a deflection",
    ],
  },
  {
    title: "Exploiting Deflections",
    icon: <MoveRight className="h-6 w-6" />,
    points: [
      "After a successful deflection, quickly capitalize on the new weaknesses",
      "Look for tactical motifs like forks, pins, or discovered attacks",
      "Consider how the deflection affects the overall position",
      "Be prepared to calculate deeply, as deflections often involve multiple moves",
    ],
  },
  {
    title: "Defending Against Deflections",
    icon: <MoveRight className="h-6 w-6" />,
    points: [
      "Be aware of your pieces that have multiple defensive duties",
      "Look for prophylactic moves that prevent potential deflections",
      "Consider reinforcing key defensive pieces",
      "Sometimes, allowing a deflection but finding a strong defensive resource is best",
    ],
  },
]

export function DeflectionTactics() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % deflectionExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + deflectionExamples.length) % deflectionExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Deflection Tactics</h2>
        <p className="text-gray-600 mb-6">
          Deflection is a powerful tactical motif in chess where a piece is forced away from its defensive duties,
          creating weaknesses that can be exploited. Understanding and utilizing deflection tactics can give you a
          significant advantage in your games.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Deflection tactics often involve sacrifices or forcing moves that compel the opponent to move a key defensive
          piece. The success of a deflection tactic relies on quickly exploiting the resulting weaknesses.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={deflectionExamples[currentExample].fen}
          initialFen={deflectionExamples[currentExample].fen}
          title={deflectionExamples[currentExample].title}
          description={deflectionExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {deflectionExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {deflectionExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Deflection Principles</TabsTrigger>
          <TabsTrigger value="exercises">Deflection Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {deflectionPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify the Deflection</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the best deflection tactic for White.
                </p>
                <ChessExample
                  initialFen="r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1P4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 7"
                  title="Deflection Identification"
                  description="White to move. Find the best deflection tactic."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Create a Deflection</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the move that creates a powerful deflection tactic for Black.
                </p>
                <ChessExample
                  initialFen="r3k2r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R3K2R b KQkq - 0 1"
                  title="Creating a Deflection"
                  description="Black to move. Create a strong deflection tactic."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Deflection Tactics</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for pieces that have multiple defensive duties</li>
          <li>Practice identifying and creating deflection tactics in tactical puzzles</li>
          <li>Consider how forcing moves like checks or captures can create deflection opportunities</li>
          <li>Look for ways to combine deflection with other tactical motifs for maximum effect</li>
          <li>Be aware of potential deflection tactics against your own pieces and take preventive measures</li>
          <li>
            When executing a deflection tactic, be prepared to calculate deeply and consider all possible responses
          </li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="deflection-tactics" />
      </div>
    </div>
  )
}

