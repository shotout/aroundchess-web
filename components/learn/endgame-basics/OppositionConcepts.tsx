"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CastleIcon as ChessKing, ArrowLeftRight, Target } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const oppositionExamples = [
  {
    fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
    title: "Direct Opposition",
    description: "Kings facing each other with one square between them.",
    explanation: [
      "The kings are in direct opposition",
      "The side to move often has a disadvantage",
      "This concept is crucial in king and pawn endgames",
      "Understanding opposition helps in maneuvering the king effectively",
    ],
  },
  {
    fen: "4k3/8/8/8/8/4K3/8/8 w - - 0 1",
    title: "Distant Opposition",
    description: "Kings facing each other with an odd number of squares between them.",
    explanation: [
      "The kings are in distant opposition",
      "This concept is important when approaching key squares",
      "Understanding distant opposition helps in zugzwang positions",
      "It's often used to gain control of critical squares in pawn endgames",
    ],
  },
  {
    fen: "8/8/8/3k4/8/8/3K4/8 w - - 0 1",
    title: "Vertical Opposition",
    description: "Kings facing each other vertically with an odd number of squares between them.",
    explanation: [
      "The kings are in vertical opposition",
      "This type of opposition is less common but still important",
      "It can be crucial in some pawn endgames",
      "Understanding vertical opposition expands your endgame toolkit",
    ],
  },
  {
    fen: "8/8/8/8/3k4/8/5K2/8 w - - 0 1",
    title: "Diagonal Opposition",
    description: "Kings facing each other diagonally with an odd number of squares between them.",
    explanation: [
      "The kings are in diagonal opposition",
      "This type of opposition is important in some specific endgame positions",
      "It can be used to maneuver the king to a more advantageous square",
      "Understanding diagonal opposition adds depth to your endgame play",
    ],
  },
]

const oppositionPrinciples = [
  {
    title: "Recognizing Opposition",
    icon: <ChessKing className="h-6 w-6" />,
    points: [
      "Identify when kings are in opposition",
      "Understand the implications of having or not having the opposition",
      "Practice recognizing different types of opposition",
      "Learn how opposition affects king movement",
    ],
  },
  {
    title: "Using Opposition",
    icon: <ArrowLeftRight className="h-6 w-6" />,
    points: [
      "Use opposition to control key squares",
      "Force your opponent's king to move unfavorably",
      "Create zugzwang positions using opposition",
      "Combine opposition with other endgame principles",
    ],
  },
  {
    title: "Opposition in Pawn Endgames",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Understand how opposition affects pawn promotion",
      "Use opposition to support or block pawn advances",
      "Learn key positions where opposition is crucial",
      "Practice applying opposition in various pawn endgames",
    ],
  },
]

export function OppositionConcepts() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % oppositionExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + oppositionExamples.length) % oppositionExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Opposition Concepts</h2>
        <p className="text-gray-600 mb-6">
          Opposition is a fundamental concept in chess endgames, particularly in king and pawn endings. It refers to a
          situation where the kings face each other with one or more squares between them. Understanding and using
          opposition effectively can often be the key to winning or drawing an endgame.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          In most cases, the player who does not have the move has the opposition. This can be advantageous, as it often
          allows that player to control key squares or force the opponent's king to move unfavorably.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={oppositionExamples[currentExample].fen}
          initialFen={oppositionExamples[currentExample].fen}
          title={oppositionExamples[currentExample].title}
          description={oppositionExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {oppositionExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {oppositionExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Opposition Principles</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {oppositionPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Triangulation</h3>
                <p className="text-gray-600 mb-4">
                  A technique used to "lose a move" and force the opponent to move, often giving up the opposition.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Move the king in a triangular pattern to return to the starting square</li>
                  <li>Used to force the opponent's king to move to an unfavorable position</li>
                  <li>Particularly useful in king and pawn endgames</li>
                  <li>Can be the key to winning in seemingly drawn positions</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Corresponding Squares</h3>
                <p className="text-gray-600 mb-4">
                  A concept where certain squares on the board correspond to each other in terms of king position.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Understand which squares correspond to each other</li>
                  <li>Use this knowledge to maintain or gain the opposition</li>
                  <li>Particularly important in pawn endgames</li>
                  <li>Can be used to calculate long sequences of moves accurately</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Opposition</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Practice recognizing opposition in various positions</li>
          <li>Study classic endgame positions where opposition is crucial</li>
          <li>Analyze your own games to identify missed opportunities to use opposition</li>
          <li>Combine opposition with other endgame principles for maximum effect</li>
          <li>Remember that opposition is a tool, not an end in itself</li>
          <li>Practice endgame studies focusing on opposition to improve your skills</li>
        </ul>
      </motion.div>
    </div>
  )
}

