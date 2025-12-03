"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Maximize2, Target, Crosshair } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const spaceAdvantageExamples = [
  {
    fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
    title: "Central Space Advantage",
    description: "White has more space in the center, giving their pieces greater mobility.",
    explanation: [
      "White's pawns on d4 and e4 control key central squares.",
      "Black's pieces are cramped and have limited movement options.",
      "White can use their space advantage to develop pieces more efficiently.",
      "This central space advantage can be a strong positional asset.",
    ],
  },
  {
    fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQkq - 0 5",
    title: "Queenside Space Advantage",
    description: "White has expanded on the queenside, creating more space for their pieces.",
    explanation: [
      "White's c4 pawn has created more space on the queenside.",
      "Black's pieces are restricted and lack queenside influence.",
      "White can use this space to maneuver pieces and create attacking opportunities.",
      "Queenside space advantages can be particularly effective in endgames.",
    ],
  },
]

const spaceAdvantagePrinciples = [
  {
    title: "Piece Mobility",
    icon: <Maximize2 className="h-6 w-6" />,
    points: [
      "More space allows for greater piece mobility.",
      "Active pieces can control more squares and create threats.",
      "Use your space advantage to improve piece placement and coordination.",
      "Restrict your opponent's piece mobility by limiting their space.",
    ],
  },
  {
    title: "Attacking Opportunities",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Space advantage can create attacking opportunities.",
      "Use your extra space to maneuver pieces and launch attacks.",
      "Force your opponent into a defensive posture by controlling more space.",
      "Open lines and diagonals can be exploited for attacks.",
    ],
  },
  {
    title: "Strategic Planning",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Use your space advantage to develop long-term strategic plans.",
      "Prepare pawn breaks and piece maneuvers to increase your space.",
      "Anticipate your opponent's attempts to gain space and take preventive measures.",
      "A strong space advantage can be a decisive factor in the endgame.",
    ],
  },
]

export function SpaceAdvantageUsage() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % spaceAdvantageExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + spaceAdvantageExamples.length) % spaceAdvantageExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Space Advantage Usage</h2>
        <p className="text-gray-600 mb-6">
          Understanding how to use space effectively is a crucial aspect of positional chess. A space advantage gives
          your pieces greater mobility, creates attacking opportunities, and restricts your opponent's options.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          While a space advantage can be powerful, it's important not to overextend. An overextended position can create
          weaknesses that your opponent can exploit. Always balance your space advantage with other positional factors.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={spaceAdvantageExamples[currentExample].fen}
          initialFen={spaceAdvantageExamples[currentExample].fen}
          title={spaceAdvantageExamples[currentExample].title}
          description={spaceAdvantageExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {spaceAdvantageExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {spaceAdvantageExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Space Advantage Principles</TabsTrigger>
          <TabsTrigger value="exercises">Practice Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {spaceAdvantagePrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Create Space</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, find the best way for White to create a space advantage.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                  title="Creating Space"
                  description="White to move. Create a space advantage."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Exploit Space</h3>
                <p className="text-gray-600 mb-4">
                  In this position, how can White best exploit their space advantage to create threats?
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/ppp2ppp/4p3/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3"
                  title="Exploiting Space"
                  description="White to move. Exploit the space advantage."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Utilizing Space Advantage</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Use your space advantage to improve piece placement and coordination.</li>
          <li>Look for opportunities to create weaknesses in your opponent's position.</li>
          <li>Be prepared to defend against counterplay in other areas of the board.</li>
          <li>Practice recognizing and creating space advantages in your games.</li>
          <li>Study master games to see how strong players utilize space advantage in various situations.</li>
        </ul>
      </motion.div>
    </div>
  )
}

