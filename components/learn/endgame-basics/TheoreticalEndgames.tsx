"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, BookOpen, Target, ArrowLeftRight } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const theoreticalEndgameExamples = [
  {
    fen: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
    title: "King and Pawn vs King",
    description: "A fundamental endgame where proper technique is crucial.",
    explanation: [
      "The side with the pawn tries to promote",
      "The defending side aims to reach a drawn position",
      "Understanding key squares is essential",
      "This endgame forms the basis for many more complex positions",
    ],
  },
  {
    fen: "8/8/8/8/8/k7/p7/K7 w - - 0 1",
    title: "Rook Pawn Endgame",
    description: "A special case of king and pawn vs king with a rook pawn.",
    explanation: [
      "This position is a theoretical draw",
      "The defending king must reach the corner square",
      "If the attacking king reaches b7 or b8, it's a win",
      "Understanding this position is crucial for practical play",
    ],
  },
  {
    fen: "8/8/8/8/8/5k2/5p2/5K2 w - - 0 1",
    title: "Lucena Position",
    description: "A winning endgame position for the side with the pawn.",
    explanation: [
      "White can win this position with correct technique",
      "The key is to build a 'bridge' for the king",
      "This position often arises from rook endgames",
      "Mastering this technique is essential for converting advantages",
    ],
  },
  {
    fen: "8/8/8/8/5PK1/8/5k2/8 b - - 0 1",
    title: "Philidor Position",
    description: "A drawing technique in rook endgames.",
    explanation: [
      "This is a theoretical draw with correct defense",
      "The defending rook cuts off the enemy king",
      "Understanding this position helps in practical defense",
      "It's crucial to know when to transition to this position",
    ],
  },
]

const theoreticalEndgamePrinciples = [
  {
    title: "Opposition",
    icon: <ArrowLeftRight className="h-6 w-6" />,
    points: [
      "Understand direct and distant opposition",
      "Use opposition to control key squares",
      "Apply opposition concepts in pawn endgames",
      "Practice recognizing opposition in various positions",
    ],
  },
  {
    title: "Key Squares",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Identify key squares in pawn endgames",
      "Understand the concept of corresponding squares",
      "Use key squares to guide your endgame strategy",
      "Practice reaching and controlling key squares",
    ],
  },
  {
    title: "Zugzwang",
    icon: <BookOpen className="h-6 w-6" />,
    points: [
      "Recognize zugzwang positions",
      "Create zugzwang to gain an advantage",
      "Understand mutual zugzwang",
      "Apply zugzwang principles in various endgames",
    ],
  },
]

export function TheoreticalEndgames() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % theoreticalEndgameExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + theoreticalEndgameExamples.length) % theoreticalEndgameExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Theoretical Endgames</h2>
        <p className="text-gray-600 mb-6">
          Theoretical endgames are fundamental positions that every chess player should know. These positions form the
          building blocks for understanding more complex endgames and are crucial for improving your overall endgame
          play.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Mastering theoretical endgames is essential for improving your chess. These positions often arise from
          simplification of more complex endgames, and understanding them can help you make better decisions throughout
          the game.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={theoreticalEndgameExamples[currentExample].fen}
          initialFen={theoreticalEndgameExamples[currentExample].fen}
          title={theoreticalEndgameExamples[currentExample].title}
          description={theoreticalEndgameExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {theoreticalEndgameExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {theoreticalEndgameExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Endgame Principles</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {theoreticalEndgamePrinciples.map((principle, index) => (
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
                  A technique used to "lose a move" and force the opponent into zugzwang.
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Theoretical Endgames</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Study and memorize key theoretical positions</li>
          <li>Practice playing these positions against a strong opponent or chess engine</li>
          <li>Analyze your games to identify opportunities to apply theoretical knowledge</li>
          <li>Solve endgame studies to improve your calculation and understanding</li>
          <li>Regularly review and reinforce your knowledge of theoretical endgames</li>
          <li>Apply the principles learned in theoretical endgames to more complex positions</li>
        </ul>
      </motion.div>
    </div>
  )
}

