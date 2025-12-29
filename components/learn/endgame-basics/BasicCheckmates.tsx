"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const checkmatePatternsExamples = [
  {
    fen: "4k3/8/4K3/8/8/8/8/3Q4 w - - 0 1",
    title: "Queen and King vs King",
    description: "A basic checkmate pattern using the queen and king against a lone king.",
    explanation: [
      "The queen controls key squares around the enemy king",
      "The attacking king supports the queen and limits the enemy king's escape",
      "This checkmate can be achieved in just a few moves with proper technique",
      "Practice this pattern to build confidence in endgame positions",
    ],
  },
  {
    fen: "4k3/8/4K3/8/8/8/8/R7 w - - 0 1",
    title: "Rook and King vs King",
    description: "A fundamental checkmate pattern using the rook and king against a lone king.",
    explanation: [
      "The rook controls an entire rank or file, limiting the enemy king's movement",
      "The attacking king works with the rook to force the enemy king to the edge",
      "This checkmate takes more moves than with a queen but is still relatively straightforward",
      "Understanding this pattern is crucial for playing rook endgames",
    ],
  },
  {
    fen: "4k3/8/3NK3/8/8/8/8/8 w - - 0 1",
    title: "Two Bishops and King vs King",
    description: "A checkmate pattern using two bishops and the king against a lone king.",
    explanation: [
      "The two bishops work together to control diagonals and limit the enemy king's movement",
      "The attacking king helps to force the enemy king to the corner",
      "This checkmate requires precise coordination between the bishops and king",
      "While less common, this pattern demonstrates the power of the bishop pair",
    ],
  },
  {
    fen: "4k3/8/3NK3/8/8/8/7B/8 w - - 0 1",
    title: "Bishop and Knight Mate",
    description: "A challenging checkmate pattern using a bishop, knight, and king against a lone king.",
    explanation: [
      "This is one of the most difficult basic checkmates to execute",
      "The bishop and knight work together to control key squares",
      "The attacking king plays a crucial role in forcing the enemy king to a corner",
      "This pattern requires understanding of how the bishop and knight complement each other",
    ],
  },
]

export function BasicCheckmates() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % checkmatePatternsExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + checkmatePatternsExamples.length) % checkmatePatternsExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Checkmate Patterns</h2>
        <p className="text-gray-600 mb-6">
          Understanding basic checkmate patterns is crucial for every chess player. These fundamental patterns form the
          building blocks for more complex endgame strategies and help you convert winning positions into victories.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Mastering these basic checkmate patterns will significantly improve your endgame play. Practice them regularly
          to build muscle memory and confidence in winning positions.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={checkmatePatternsExamples[currentExample].fen}
          initialFen={checkmatePatternsExamples[currentExample].fen}
          title={checkmatePatternsExamples[currentExample].title}
          description={checkmatePatternsExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {checkmatePatternsExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {checkmatePatternsExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Executing Basic Checkmates</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Practice these patterns regularly to build muscle memory</li>
          <li>Focus on restricting the enemy king's movement</li>
          <li>Use your pieces in coordination to create a mating net</li>
          <li>Be patient and avoid stalemate traps</li>
          <li>Study the optimal piece placements for each checkmate pattern</li>
          <li>Practice both sides of the checkmate to understand defensive ideas</li>
        </ul>
      </motion.div>
    </div>
  )
}

