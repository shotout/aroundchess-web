"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, ShieldCheck, Target, Crosshair } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const prophylaxisExamples = [
  {
    fen: "rnbqkb1r/ppp2ppp/3p1n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
    title: "Preventing a Knight Outpost",
    description: "White's knight on f3 prevents Black from establishing a strong knight outpost on g4.",
    explanation: [
      "Black's ...Ng4 would create a strong outpost, difficult for White to challenge.",
      "White's Nf3 controls the g4 square, preventing Black's knight from occupying it.",
      "This prophylactic move limits Black's options and strengthens White's control of the center.",
      "Prophylaxis often involves anticipating the opponent's plans and taking preventive measures.",
      "By preventing ...Ng4, White maintains a more solid position and restricts Black's piece activity.",
    ],
  },
  {
    fen: "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
    title: "Protecting Against Pawn Breaks",
    description: "White's knight on f3 protects against Black's potential pawn break ...d5.",
    explanation: [
      "Black's ...d5 pawn break could open the position and create attacking opportunities.",
      "White's Nf3 controls the d5 square, making the pawn break less effective.",
      "This prophylactic move strengthens White's center and limits Black's options.",
      "Prophylaxis can involve controlling key squares to prevent the opponent's plans.",
      "By controlling d5, White maintains a solid pawn structure and restricts Black's expansion.",
    ],
  },
]

const prophylaxisPrinciples = [
  {
    title: "Anticipation",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Anticipate your opponent's plans and potential threats.",
      "Consider their most likely moves and their impact on the position.",
      "Look for ways to disrupt their plans or prevent them from developing.",
      "Anticipation is a key element of prophylaxis and strategic thinking.",
    ],
  },
  {
    title: "Restriction",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Restrict your opponent's piece activity and mobility.",
      "Control key squares to limit their options.",
      "Create a strong pawn structure that confines their pieces.",
      "Restriction is a powerful way to gain a positional advantage.",
    ],
  },
  {
    title: "Proactive Play",
    icon: <ShieldCheck className="h-6 w-6" />,
    points: [
      "Make prophylactic moves that improve your own position while limiting your opponent's.",
      "Don't just react to threats; actively seek ways to prevent them.",
      "Proactive play is essential for maintaining control and creating opportunities.",
      "A strong prophylactic mindset can lead to a significant positional edge.",
    ],
  },
]

export function ProphylaxisConcepts() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % prophylaxisExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + prophylaxisExamples.length) % prophylaxisExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Prophylaxis Concepts</h2>
        <p className="text-gray-600 mb-6">
          Prophylaxis in chess refers to the art of anticipating and preventing your opponent's plans. It involves
          making moves that restrict their options, improve your own position, and control key squares before they
          become weaknesses. Mastering prophylaxis is crucial for developing a strong positional understanding and
          gaining an edge in your games.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Prophylaxis is not just about reacting to threats, but about actively seeking ways to prevent them. By
          anticipating your opponent's plans and taking preventive measures, you can maintain control of the game and
          create opportunities for your own attacks.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={prophylaxisExamples[currentExample].fen}
          initialFen={prophylaxisExamples[currentExample].fen}
          title={prophylaxisExamples[currentExample].title}
          description={prophylaxisExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {prophylaxisExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {prophylaxisExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Prophylaxis Principles</TabsTrigger>
          <TabsTrigger value="exercises">Practice Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {prophylaxisPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Prevent the Threat</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the most immediate threat for Black and find the best prophylactic
                  move for White.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 2"
                  title="Prophylaxis Exercise 1"
                  description="White to move. Prevent Black's threat."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Restrict Opponent's Options</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the best prophylactic move for Black to restrict White's piece activity and
                  pawn breaks.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2"
                  title="Prophylaxis Exercise 2"
                  description="Black to move. Restrict White's options."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Prophylaxis</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always consider your opponent's most likely plans and potential threats.</li>
          <li>Look for ways to restrict their piece activity and control key squares.</li>
          <li>Make prophylactic moves that improve your own position while limiting your opponent's.</li>
          <li>Practice anticipating your opponent's moves and developing a proactive mindset.</li>
          <li>Study master games to see how strong players utilize prophylaxis in various situations.</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="prophylaxis-concepts" />
      </div>
    </div>
  )
}

