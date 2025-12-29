"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Church, Target, Crosshair } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const bishopPairExamples = [
  {
    fen: "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4",
    title: "Open Diagonals",
    description: "White's bishop pair controls key diagonals, putting pressure on Black's position.",
    explanation: [
      "White's bishops control long diagonals, restricting Black's pieces.",
      "The bishop on c4 attacks the weak f7 pawn.",
      "The bishop on f1 supports the e4 pawn and can target the kingside.",
      "Black's pieces are less active and lack coordination.",
      "This example showcases how the bishop pair can dominate open positions.",
    ],
  },
  {
    fen: "rnbqk1nr/pppp1ppp/8/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3",
    title: "Closed Positions",
    description: "Even in closed positions, the bishop pair can exert influence and create opportunities.",
    explanation: [
      "White's bishops control important diagonals, restricting Black's pieces.",
      "The bishop on c4 is ready to support a pawn break on d5.",
      "The bishop on f1 can target the kingside if the position opens.",
      "Black's pieces are less flexible and lack White's long-range control.",
      "This example demonstrates that the bishop pair can be valuable even in closed games.",
    ],
  },
]

const bishopPairPrinciples = [
  {
    title: "Open Diagonals",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Bishops excel on open diagonals.",
      "Use pawn breaks to clear diagonals for your bishops.",
      "Place your pawns on squares of the opposite color complex from your bishops.",
      "Target weak squares and pawns along open diagonals.",
    ],
  },
  {
    title: "Coordination",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Coordinate your bishops to control different areas of the board.",
      "Avoid blocking your bishops with your own pawns or pieces.",
      "Use your bishops to support each other and create multiple threats.",
      "Well-coordinated bishops can exert significant pressure on the opponent's position.",
    ],
  },
  {
    title: "Long-Range Influence",
    icon: <Church className="h-6 w-6" />,
    points: [
      "Bishops can control squares from a distance.",
      "Use this influence to restrict your opponent's piece mobility.",
      "Support your pawns and pieces from afar with your bishops.",
      "Long-range control can be crucial in both attack and defense.",
    ],
  },
]

export function BishopPairUtilization() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % bishopPairExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + bishopPairExamples.length) % bishopPairExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bishop Pair Utilization</h2>
        <p className="text-gray-600 mb-6">
          The bishop pair is a valuable asset in chess, offering long-range control over both light and dark squares.
          Understanding how to effectively utilize the bishop pair can give you a significant positional advantage in
          your games.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          The bishop pair is particularly powerful in open positions with clear diagonals. However, even in closed
          positions, they can exert influence and create opportunities. Learning to maximize their potential is crucial
          for improving your positional play.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={bishopPairExamples[currentExample].fen}
          initialFen={bishopPairExamples[currentExample].fen}
          title={bishopPairExamples[currentExample].title}
          description={bishopPairExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {bishopPairExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {bishopPairExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Bishop Pair Principles</TabsTrigger>
          <TabsTrigger value="exercises">Practice Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {bishopPairPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Open Diagonals</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, find the best way for White to open diagonals for their bishop pair.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3"
                  title="Open Diagonal Exercise"
                  description="White to move. Open diagonals for the bishop pair."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Bishop Coordination</h3>
                <p className="text-gray-600 mb-4">
                  In this position, how can White best coordinate their bishop pair to create threats and control key
                  squares?
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppp1ppp/8/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3"
                  title="Bishop Coordination Exercise"
                  description="White to move. Coordinate the bishop pair."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Utilizing the Bishop Pair</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for opportunities to improve your bishop placement.</li>
          <li>Practice identifying open and closed diagonals and their impact on bishop activity.</li>
          <li>Coordinate your bishops to control key squares and diagonals.</li>
          <li>Consider pawn breaks that can create or exploit open diagonals.</li>
          <li>Be aware of your opponent's bishop pair and take measures to neutralize their influence.</li>
          <li>Study master games to see how strong players utilize the bishop pair in various situations.</li>
        </ul>
      </motion.div>
    </div>
  )
}

