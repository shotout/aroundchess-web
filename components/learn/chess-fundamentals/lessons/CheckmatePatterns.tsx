'use client'

import { useState } from 'react'
import { InteractiveBoard } from '../InteractiveBoard'
import { useLearningProgress } from '@/contexts/LearningProgressContext'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const matingPatterns = [
  {
    name: "Back Rank Mate",
    fen: "6k1/5ppp/8/8/8/8/5PPP/R4K2 w - - 0 1",
    description: "A common checkmate where a rook (or queen) delivers mate along the back rank when the enemy king is trapped by their own pawns.",
    key: "back-rank"
  },
  {
    name: "Smothered Mate",
    fen: "6rk/5npp/7N/8/8/8/5PPP/6K1 w - - 0 1",
    description: "A checkmate delivered by a knight where the enemy king is surrounded by their own pieces.",
    key: "smothered"
  },
  {
    name: "Scholar's Mate",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1",
    description: "A quick checkmate that can catch beginners off guard, involving the queen and bishop attacking f7/f2.",
    key: "scholars"
  },
  {
    name: "Anastasia's Mate",
    fen: "5rk1/6pp/8/8/8/5N2/6PP/R5K1 w - - 0 1",
    description: "A checkmate pattern where a knight and rook work together to trap the enemy king.",
    key: "anastasia"
  }
]

export function CheckmatePatternsLesson() {
  const { progress, isCompleted, completeLesson } = useLearningProgress()
  const [currentPattern, setCurrentPattern] = useState(0)

  const nextPattern = () => {
    setCurrentPattern((prev) => (prev + 1) % matingPatterns.length)
  }

  const previousPattern = () => {
    setCurrentPattern((prev) => 
      prev === 0 ? matingPatterns.length - 1 : prev - 1
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        Understanding common checkmate patterns is essential for both attacking and defending in chess.
      </p>

      <div className="relative">
        <motion.div
          key={currentPattern}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={previousPattern}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-semibold">
              {matingPatterns[currentPattern].name}
            </h3>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPattern}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <InteractiveBoard
            fen={matingPatterns[currentPattern].fen}
            showHints={true}
            allowMoves={false}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <p className="text-gray-700">
              {matingPatterns[currentPattern].description}
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Tips</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Always look for these common patterns in your games</li>
            <li>Practice spotting these patterns in puzzles</li>
            <li>Be aware of these patterns to avoid falling into them</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
