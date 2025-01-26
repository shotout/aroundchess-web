"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CastleIcon as ChessKnight, Target, Shield } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const knightOutpostExamples = [
  {
    fen: "r1bqkb1r/ppp2ppp/2np1n2/4p3/4P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 0 5",
    title: "Protected Outpost",
    description: "White's knight on f3 is a strong outpost, difficult for Black to attack.",
    explanation: [
      "The knight on f3 is supported by the pawn on e4 and difficult for Black to dislodge.",
      "It controls key squares in the center and restricts Black's piece movement.",
      "This outpost provides a stable base for White's knight and can be used to launch attacks.",
      "Establishing protected outposts is a key element of positional play.",
      "Strong outposts can significantly improve your piece activity and control of the board.",
    ],
  },
  {
    fen: "r1bqkb1r/ppp2ppp/2np1n2/4p3/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 1 5",
    title: "Attacking an Outpost",
    description: "Black has a potential knight outpost on d5, but White can challenge it.",
    explanation: [
      "Black's knight on f6 can move to d5, creating a potential outpost.",
      "However, White can challenge this outpost with moves like f3 or g4.",
      "Black must carefully consider the risks before establishing an outpost that can be attacked.",
      "Challenging opponent's outposts can disrupt their plans and improve your positional control.",
      "Understanding how to attack and defend outposts is crucial in positional play.",
    ],
  },
]

const knightOutpostPrinciples = [
  {
    title: "Establishing Outposts",
    icon: <ChessKnight className="h-6 w-6" />,
    points: [
      "Place your knights on squares that can't be attacked by enemy pawns.",
      "Ideally, outposts should be supported by your own pawns.",
      "Central squares and squares deep in enemy territory make strong outposts.",
      "Look for opportunities to create outposts through pawn moves or exchanges.",
    ],
  },
  {
    title: "Utilizing Outposts",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Use knights on outposts to control key squares and restrict your opponent's pieces.",
      "Support pawn breaks and attacks from your knight outposts.",
      "Knights on outposts can be very difficult to dislodge, creating a lasting positional advantage.",
      "Utilize your knight's influence to improve your piece coordination and control of the board.",
    ],
  },
  {
    title: "Defending Against Outposts",
    icon: <Shield className="h-6 w-6" />,
    points: [
      "Prevent your opponent from establishing strong outposts in your territory.",
      "Challenge enemy outposts by attacking them with pawns or pieces.",
      "Restrict their movement by controlling squares around the outpost.",
      "Consider exchanges that eliminate the outposted knight.",
    ],
  },
]

export function KnightOutpostPositions() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % knightOutpostExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + knightOutpostExamples.length) % knightOutpostExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Knight Outpost Positions</h2>
        <p className="text-gray-600 mb-6">
          A knight outpost is a powerful positional tool, particularly in the middlegame and endgame. It refers to a
          square occupied by a knight, typically supported by a pawn, that cannot be attacked by enemy pawns. Mastering
          the creation and utilization of knight outposts can give you a significant positional advantage.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Knights on outposts exert strong control over surrounding squares, restrict opponent's piece mobility, and
          provide a stable base for launching attacks. Understanding how to establish, utilize, and defend against
          outposts is crucial for improving your positional play.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={knightOutpostExamples[currentExample].fen}
          initialFen={knightOutpostExamples[currentExample].fen}
          title={knightOutpostExamples[currentExample].title}
          description={knightOutpostExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {knightOutpostExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {knightOutpostExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Knight Outpost Principles</TabsTrigger>
          <TabsTrigger value="exercises">Practice Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {knightOutpostPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Establish an Outpost</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, find the best way for White to establish a strong knight outpost.
                </p>
                <ChessExample
                  initialFen="rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3"
                  title="Outpost Establishment"
                  description="White to move. Establish a knight outpost."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Attack the Outpost</h3>
                <p className="text-gray-600 mb-4">
                  In this position, how can Black best attack White's knight outpost on d5?
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/ppp2ppp/3p4/3Np3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 1 3"
                  title="Attacking an Outpost"
                  description="Black to move. Attack White's outpost."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Knight Outposts</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for potential knight outposts in your games.</li>
          <li>Practice establishing and utilizing outposts in tactical puzzles and your own games.</li>
          <li>Prioritize establishing outposts that are difficult for your opponent to attack.</li>
          <li>Consider how outposts can enhance your piece coordination and control of the board.</li>
          <li>Be aware of potential enemy outposts and take measures to prevent or challenge them.</li>
          <li>Study master games to see how strong players utilize knight outposts in various situations.</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="knight-outpost-positions" />
      </div>
    </div>
  )
}

