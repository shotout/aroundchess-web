"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, GitFork } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const forkExamples = [
  {
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 0 4",
    title: "Knight Fork",
    description: "A knight fork attacking two pieces simultaneously.",
    explanation: [
      "The knight on c3 can move to d5, forking the black queen and king",
      "This fork creates two threats that cannot be addressed in a single move",
      "Knight forks are particularly powerful due to the knight's unique movement",
      "Forks often lead to material gain or positional advantage",
    ],
  },
  {
    fen: "r1bqk1nr/pppp1ppp/8/2n1b3/3P4/8/PPP1PPPP/R3K2R b KQkq - 0 1",
    title: "Pawn Fork",
    description: "A pawn fork attacking two pieces at once.",
    explanation: [
      "White can play d4, forking the knight on c5 and the bishop on e5",
      "Pawn forks are often overlooked but can be very effective",
      "This fork forces Black to make a difficult decision",
      "Pawn forks can lead to material gain or positional pressure",
    ],
  },
]

const forkPrinciples = [
  {
    title: "Creating Forks",
    icon: <GitFork className="h-6 w-6" />,
    points: [
      "Look for opportunities to attack multiple pieces with a single move",
      "Knights are particularly good at creating forks",
      "Consider pawn moves that can attack two pieces simultaneously",
      "Create forks that target high-value pieces or undefended pieces",
    ],
  },
  {
    title: "Exploiting Forks",
    icon: <GitFork className="h-6 w-6" />,
    points: [
      "Use forks to gain material advantage",
      "Force unfavorable moves or exchanges with fork threats",
      "Combine forks with other tactical motifs for maximum effect",
      "Use forks to create positional pressure and limit opponent's options",
    ],
  },
  {
    title: "Defending Against Forks",
    icon: <GitFork className="h-6 w-6" />,
    points: [
      "Be aware of potential fork threats and try to avoid them",
      "When forked, look for counter-attacking possibilities",
      "Consider sacrificing the lesser piece to maintain overall position",
      "Use prophylactic moves to prevent forks before they happen",
    ],
  },
]

export function ForkTechniques() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % forkExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + forkExamples.length) % forkExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Fork Techniques</h2>
        <p className="text-gray-600 mb-6">
          A fork is a powerful tactical motif in chess where a single piece attacks two or more enemy pieces
          simultaneously. Mastering fork techniques can give you a significant advantage in your games, often leading to
          material gain or positional superiority.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Forks are most effective when they target high-value pieces or undefended pieces. Knights are particularly
          adept at creating forks due to their unique movement pattern, but any piece (including pawns) can create a
          fork.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={forkExamples[currentExample].fen}
          initialFen={forkExamples[currentExample].fen}
          title={forkExamples[currentExample].title}
          description={forkExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {forkExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {forkExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Fork Principles</TabsTrigger>
          <TabsTrigger value="exercises">Fork Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {forkPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify the Fork</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the best fork opportunity for White.
                </p>
                <ChessExample
                  initialFen="r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 4"
                  title="Fork Identification"
                  description="White to move. Find the best fork."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Create a Fork</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the move that creates a powerful fork for Black.
                </p>
                <ChessExample
                  initialFen="r1bqkb1r/pppp1ppp/2n5/4p3/2B1P1n1/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 4"
                  title="Creating a Fork"
                  description="Black to move. Create a strong fork."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Fork Tactics</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for fork opportunities in your games</li>
          <li>Practice creating forks in tactical puzzles and studies</li>
          <li>Pay attention to undefended pieces, as they are prime targets for forks</li>
          <li>Remember that pawns can create powerful forks, especially in endgames</li>
          <li>Combine fork threats with other tactical motifs for maximum effect</li>
          <li>Be aware of potential forks against your own pieces and take preventive measures</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="fork-techniques" />
      </div>
    </div>
  )
}

