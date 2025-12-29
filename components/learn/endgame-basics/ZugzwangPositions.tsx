"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Pause, Target, ArrowLeftRight } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const zugzwangExamples = [
  {
    fen: "8/8/p7/1p6/1P6/P7/8/k1K5 w - - 0 1",
    title: "Mutual Zugzwang",
    description: "A position where neither side wants to move, as any move worsens the position.",
    explanation: [
      "Both kings are in opposition",
      "The side to move will be forced to give way",
      "Moving any pawn creates weaknesses",
      "This position demonstrates the power of zugzwang in endgames",
    ],
  },
  {
    fen: "8/8/8/8/8/5k2/4p3/4K3 w - - 0 1",
    title: "King and Pawn Endgame Zugzwang",
    description: "A classic zugzwang position in king and pawn endgames.",
    explanation: [
      "White to move loses, as they must move away from the e1 square",
      "Black to move draws, as they can't make progress",
      "This position illustrates the importance of opposition",
      "Understanding such positions is crucial for playing king and pawn endgames",
    ],
  },
  {
    fen: "8/8/8/8/8/2k5/1p6/2K5 w - - 0 1",
    title: "Zugzwang in Pawn Endgames",
    description: "A zugzwang position that can occur in pawn endgames.",
    explanation: [
      "White to move must give way, allowing Black to queen the pawn",
      "Black to move can't make progress",
      "This position shows how zugzwang can be decisive in pawn endgames",
      "Recognizing such patterns is key to playing pawn endgames well",
    ],
  },
  {
    fen: "8/8/8/8/8/1KB5/2P5/1k6 w - - 0 1",
    title: "Zugzwang with Bishop",
    description: "A zugzwang position involving a bishop.",
    explanation: [
      "White to move loses, as moving the bishop or king allows Black to capture the pawn",
      "Moving the pawn allows Black to draw with perpetual check",
      "This position demonstrates how zugzwang can occur with minor pieces",
      "It shows the importance of piece coordination in endgames",
    ],
  },
]

const zugzwangPrinciples = [
  {
    title: "Recognizing Zugzwang",
    icon: <Pause className="h-6 w-6" />,
    points: [
      "Look for positions where any move worsens the position",
      "Be aware of zugzwang possibilities in endgames",
      "Understand how piece mobility affects zugzwang",
      "Recognize mutual zugzwang positions",
    ],
  },
  {
    title: "Creating Zugzwang",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Limit your opponent's piece mobility",
      "Force your opponent to move into unfavorable positions",
      "Use pawn moves to create zugzwang in endgames",
      "Coordinate your pieces to restrict opponent's options",
    ],
  },
  {
    title: "Avoiding Zugzwang",
    icon: <ArrowLeftRight className="h-6 w-6" />,
    points: [
      "Maintain piece mobility when possible",
      "Create escape squares for your king",
      "Avoid positions where you may be forced to move disadvantageously",
      "Understand how pawn structures affect zugzwang possibilities",
    ],
  },
]

export function ZugzwangPositions() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % zugzwangExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + zugzwangExamples.length) % zugzwangExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Zugzwang Positions</h2>
        <p className="text-gray-600 mb-6">
          Zugzwang is a situation in chess where one side is put at a disadvantage because they must make a move when
          they would prefer to pass and make no move. The fact that the player must move means that their position will
          become significantly weaker. Understanding zugzwang is crucial for mastering endgames and can often be the key
          to converting a drawn position into a win.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Zugzwang often occurs in endgames, particularly in king and pawn endings. Recognizing and creating zugzwang
          positions can give you a significant advantage in otherwise equal positions.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={zugzwangExamples[currentExample].fen}
          initialFen={zugzwangExamples[currentExample].fen}
          title={zugzwangExamples[currentExample].title}
          description={zugzwangExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {zugzwangExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {zugzwangExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Zugzwang Principles</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {zugzwangPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Zugzwang in Rook Endgames</h3>
                <p className="text-gray-600 mb-4">
                  Understanding zugzwang in rook endgames can be crucial for both attacking and defending.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Look for positions where the defending king is confined to the corner</li>
                  <li>Use your king to cut off escape squares</li>
                  <li>Force the opponent's rook into passive defense</li>
                  <li>Create threats that the opponent can't address without worsening their position</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Zugzwang</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Study classic zugzwang positions to improve your pattern recognition</li>
          <li>Practice creating zugzwang in your games, especially in endgames</li>
          <li>Analyze your games to identify missed zugzwang opportunities</li>
          <li>Be aware of potential zugzwang positions when simplifying to an endgame</li>
          <li>Remember that zugzwang can occur in all phases of the game, not just endgames</li>
          <li>Use zugzwang principles in your strategic planning, even in the middlegame</li>
        </ul>
      </motion.div>
    </div>
  )
}

