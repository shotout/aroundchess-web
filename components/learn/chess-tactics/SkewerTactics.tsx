"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Scissors } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const skewerExamples = [
  {
    fen: "4r1k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    title: "Rook Skewer",
    description: "A skewer tactic using a rook to attack two pieces on the same file or rank.",
    explanation: [
      "White can play Rd8+, attacking the black king",
      "When the king moves, the rook on e8 will be captured",
      "This skewer forces Black to choose between losing the king or the rook",
      "Rook skewers are common in endgames and can be decisive",
    ],
  },
  {
    fen: "2b3k1/5ppp/8/8/8/8/5PPP/2B3K1 w - - 0 1",
    title: "Bishop Skewer",
    description: "A skewer tactic using a bishop to attack two pieces on the same diagonal.",
    explanation: [
      "White can play Bh6, attacking the black king",
      "When the king moves, the bishop on c8 will be captured",
      "This skewer forces Black to choose between losing the king or the bishop",
      "Bishop skewers can be powerful, especially when targeting the king and another piece",
    ],
  },
]

const skewerPrinciples = [
  {
    title: "Creating Skewers",
    icon: <Scissors className="h-6 w-6" />,
    points: [
      "Look for opportunities to attack two pieces on the same line",
      "Target the king and another valuable piece for maximum effect",
      "Use long-range pieces like rooks, bishops, and queens for skewers",
      "Consider how pawn moves can open lines for potential skewers",
    ],
  },
  {
    title: "Exploiting Skewers",
    icon: <Scissors className="h-6 w-6" />,
    points: [
      "Force your opponent to choose between two unfavorable options",
      "Use skewers to gain material or positional advantages",
      "Combine skewers with other tactical motifs for complex threats",
      "Look for ways to create skewers that also give check",
    ],
  },
  {
    title: "Defending Against Skewers",
    icon: <Scissors className="h-6 w-6" />,
    points: [
      "Be aware of potential skewer threats in your opponent's position",
      "Avoid aligning valuable pieces on the same line",
      "Look for ways to block or interfere with the skewering piece",
      "Consider sacrificing the lesser piece if it leads to a better position",
    ],
  },
]

export function SkewerTactics() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % skewerExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + skewerExamples.length) % skewerExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Skewer Tactics</h2>
        <p className="text-gray-600 mb-6">
          A skewer is a powerful tactical motif in chess where a long-range piece attacks two enemy pieces on the same
          line, with the more valuable piece in front. This forces the opponent to move the more valuable piece,
          allowing the capture of the piece behind it.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Skewers are often described as "reverse pins" because the more valuable piece is in front. They are
          particularly effective when the front piece is the king, as it must move out of check, exposing the piece
          behind it to capture.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={skewerExamples[currentExample].fen}
          initialFen={skewerExamples[currentExample].fen}
          title={skewerExamples[currentExample].title}
          description={skewerExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {skewerExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {skewerExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Skewer Principles</TabsTrigger>
          <TabsTrigger value="exercises">Skewer Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {skewerPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify the Skewer</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the best skewer opportunity for White.
                </p>
                <ChessExample
                  initialFen="4r1k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1"
                  title="Skewer Identification"
                  description="White to move. Find the best skewer."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Create a Skewer</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the move that creates a powerful skewer for Black.
                </p>
                <ChessExample
                  initialFen="2b3k1/5ppp/8/8/8/8/5PPP/2B3K1 b - - 0 1"
                  title="Creating a Skewer"
                  description="Black to move. Create a strong skewer."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Skewer Tactics</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for opportunities to align enemy pieces on the same line</li>
          <li>Practice identifying and creating skewers in tactical puzzles</li>
          <li>Focus on using long-range pieces like rooks, bishops, and queens for skewers</li>
          <li>Look for ways to combine skewers with other tactical motifs for maximum effect</li>
          <li>Be aware of potential skewers against your own pieces and take preventive measures</li>
          <li>When defending against a skewer, consider moving the back piece if possible to break the alignment</li>
        </ul>
      </motion.div>
    </div>
  )
}

