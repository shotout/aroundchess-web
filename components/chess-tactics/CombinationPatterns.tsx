"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Combine } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const combinationExamples = [
  {
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6",
    title: "The Greek Gift Sacrifice",
    description: "A classic combination involving a bishop sacrifice on h7 (or h2 for Black).",
    explanation: [
      "White can play Bxh7+, sacrificing the bishop to expose the black king",
      "If the king captures, White follows up with Ng5+, forking the king and queen",
      "This combination often leads to a powerful attack or material gain",
      "The Greek Gift demonstrates how sacrifices can dramatically change the position",
    ],
  },
  {
    fen: "r1bq1rk1/ppp2ppp/2n2n2/2bpp3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7",
    title: "Fried Liver Attack",
    description: "An aggressive combination in the Two Knights Defense.",
    explanation: [
      "White can play Ng5, threatening the f7 pawn and setting up a powerful attack",
      "If Black defends f7, White can follow up with Nxf7, sacrificing the knight",
      "After Kxf7, White plays Qf3+, forking the king and rook",
      "This combination showcases how multiple tactical motifs can be combined for a strong attack",
    ],
  },
]

const combinationPrinciples = [
  {
    title: "Pattern Recognition",
    icon: <Combine className="h-6 w-6" />,
    points: [
      "Study classic combinations to recognize similar patterns in your games",
      "Look for piece configurations that resemble known combinations",
      "Consider how different tactical motifs can be combined",
      "Practice solving complex tactical puzzles to improve pattern recognition",
    ],
  },
  {
    title: "Calculation",
    icon: <Combine className="h-6 w-6" />,
    points: [
      "Calculate variations deeply when considering a combination",
      "Evaluate all possible responses from your opponent",
      "Consider intermediate moves that might improve the combination",
      "Be prepared to calculate multiple branches of the combination",
    ],
  },
  {
    title: "Execution",
    icon: <Combine className="h-6 w-6" />,
    points: [
      "Ensure all pieces are optimally placed before initiating the combination",
      "Look for forcing moves that limit your opponent's responses",
      "Be prepared to sacrifice material for positional gains or attack",
      "Follow through with the combination once started, unless a clear refutation is found",
    ],
  },
]

export function CombinationPatterns() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % combinationExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + combinationExamples.length) % combinationExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Combination Patterns</h2>
        <p className="text-gray-600 mb-6">
          Combinations in chess are sequences of moves, often involving sacrifices, that lead to a significant advantage
          or even checkmate. Recognizing and executing these patterns is crucial for improving your tactical skills and
          overall chess strength.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Combinations often involve multiple tactical motifs working together. The key to mastering combinations is to
          recognize the patterns, calculate accurately, and have the courage to execute them when the opportunity
          arises.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={combinationExamples[currentExample].fen}
          initialFen={combinationExamples[currentExample].fen}
          title={combinationExamples[currentExample].title}
          description={combinationExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {combinationExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {combinationExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Combination Principles</TabsTrigger>
          <TabsTrigger value="exercises">Combination Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {combinationPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify the Combination</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the best combination for White.
                </p>
                <ChessExample
                  initialFen="r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6"
                  title="Combination Identification"
                  description="White to move. Find the best combination."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Execute a Combination</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the moves that create a powerful combination for Black.
                </p>
                <ChessExample
                  initialFen="r1bq1rk1/ppp2ppp/2n2n2/2bpp3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 b - - 0 7"
                  title="Executing a Combination"
                  description="Black to move. Create a strong combination."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Combination Patterns</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Study classic games and combinations to improve your pattern recognition</li>
          <li>Practice solving complex tactical puzzles regularly</li>
          <li>Analyze your own games to identify missed combination opportunities</li>
          <li>Don't be afraid to calculate deeply when you spot a potential combination</li>
          <li>Look for forcing moves and sacrifices that might lead to powerful combinations</li>
          <li>Remember that successful combinations often involve multiple tactical motifs working together</li>
          <li>Develop your visualization skills to see potential combinations more easily</li>
          <li>Always consider your opponent's responses when planning a combination</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="combination-patterns" />
      </div>
    </div>
  )
}

