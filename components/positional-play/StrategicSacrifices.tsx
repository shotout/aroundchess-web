"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, X, Target, Crosshair } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const strategicSacrificeExamples = [
  {
    fen: "rnbqkbnr/ppp2ppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    title: "Positional Sacrifice",
    description: "Black can consider sacrificing the d5 pawn to open the d-file and create attacking opportunities.",
    explanation: [
      "Sacrificing the d5 pawn opens the d-file for Black's rooks and queen.",
      "This can create attacking chances against White's king.",
      "The open d-file can also restrict White's piece mobility.",
      "Positional sacrifices often involve giving up material for long-term strategic gains.",
      "Careful evaluation is crucial before making such sacrifices.",
    ],
  },
  {
    fen: "rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
    title: "Initiative Sacrifice",
    description: "White can sacrifice the e4 pawn to gain the initiative and launch an attack.",
    explanation: [
      "Sacrificing the e4 pawn opens diagonals for White's bishops and queen.",
      "This can create a strong attack against Black's king.",
      "The initiative gained from the sacrifice can compensate for the lost material.",
      "Initiative sacrifices often involve giving up material for a temporary advantage in the attack.",
      "Accurate calculation and follow-up play are essential for successful initiative sacrifices.",
    ],
  },
]

const strategicSacrificePrinciples = [
  {
    title: "Evaluating Sacrifices",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Carefully analyze the resulting position before making a sacrifice.",
      "Consider the long-term strategic implications of the sacrifice.",
      "Ensure you have sufficient compensation for the sacrificed material.",
      "Look for tactical or positional advantages that outweigh the material loss.",
    ],
  },
  {
    title: "Types of Sacrifices",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Positional sacrifices aim for long-term strategic gains.",
      "Initiative sacrifices aim for a temporary advantage in the attack.",
      "Clearance sacrifices remove a piece to open lines or squares.",
      "Combination sacrifices are part of a tactical sequence.",
    ],
  },
  {
    title: "Executing Sacrifices",
    icon: <X className="h-6 w-6" />,
    points: [
      "Calculate variations deeply before committing to a sacrifice.",
      "Ensure you have a clear plan for exploiting the resulting position.",
      "Be prepared to follow up the sacrifice with aggressive play.",
      "Maintain flexibility and be ready to adjust your plan if necessary.",
    ],
  },
]

export function StrategicSacrifices() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % strategicSacrificeExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + strategicSacrificeExamples.length) % strategicSacrificeExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Strategic Sacrifices</h2>
        <p className="text-gray-600 mb-6">
          Strategic sacrifices are a powerful tool in positional chess. They involve giving up material, typically a
          pawn or a piece, to gain a positional advantage, such as opening lines, creating weaknesses, or gaining the
          initiative. Mastering the art of strategic sacrifices can significantly improve your chess strength.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Strategic sacrifices should not be made lightly. Careful evaluation is crucial before making such a sacrifice.
          Ensure you have a clear plan for exploiting the resulting position and sufficient compensation for the
          sacrificed material.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={strategicSacrificeExamples[currentExample].fen}
          initialFen={strategicSacrificeExamples[currentExample].fen}
          title={strategicSacrificeExamples[currentExample].title}
          description={strategicSacrificeExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {strategicSacrificeExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {strategicSacrificeExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Sacrifice Principles</TabsTrigger>
          <TabsTrigger value="exercises">Practice Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {strategicSacrificePrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Evaluate the Sacrifice</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, evaluate Black's potential sacrifice on d5. Is it sound, and what are the
                  resulting positional considerations?
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/ppp2ppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
                  title="Sacrifice Evaluation"
                  description="Black to move. Evaluate the d5 sacrifice."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Find the Sacrifice</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find a strategic sacrifice for White that can lead to a positional advantage.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3"
                  title="Finding a Sacrifice"
                  description="White to move. Find a strategic sacrifice."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Strategic Sacrifices</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always evaluate the resulting position carefully before making a sacrifice.</li>
          <li>Look for sacrifices that create weaknesses in your opponent's position.</li>
          <li>Consider how the sacrifice affects piece activity and coordination.</li>
          <li>Be prepared to follow up the sacrifice with aggressive play.</li>
          <li>Study master games to see how strong players utilize strategic sacrifices.</li>
          <li>Practice calculating variations deeply to assess the soundness of a sacrifice.</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="strategic-sacrifices" />
      </div>
    </div>
  )
}

