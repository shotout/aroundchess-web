'use client'

import { useState } from 'react'
import { LessonCard } from '../LessonCard'
import { InteractiveBoard } from '../InteractiveBoard'
import { useLearningProgress } from '@/contexts/LearningProgressContext'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const pawnStructures = [
  {
    name: "Doubled Pawns",
    fen: "rnbqkbnr/ppp2ppp/8/3p4/3P4/3P4/PPP2PPP/RNBQKBNR w KQkq - 0 1",
    description: "Two pawns of the same color on the same file. Generally considered a weakness as they cannot protect each other."
  },
  {
    name: "Isolated Pawn",
    fen: "rnbqkbnr/ppp2ppp/8/3p4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
    description: "A pawn with no friendly pawns on adjacent files. Can be both a weakness and a strength depending on the position."
  },
  {
    name: "Pawn Chain",
    fen: "rnbqkbnr/pppp1ppp/8/8/3PP3/2P5/PP3PPP/RNBQKBNR w KQkq - 0 1",
    description: "A diagonal line of pawns protecting each other. Creates a strong spatial advantage and controls key squares."
  },
  {
    name: "Passed Pawn",
    fen: "rnbqkbnr/ppp2ppp/8/3P4/8/8/PPP2PPP/RNBQKBNR w KQkq - 0 1",
    description: "A pawn with no opposing pawns ahead of it on the same or adjacent files. A significant advantage in endgames."
  }
]

export function PawnStructureLesson() {
  const { progress, isCompleted, completeLesson } = useLearningProgress()
  const [currentStructure, setCurrentStructure] = useState(0)

  const nextStructure = () => {
    setCurrentStructure((prev) => (prev + 1) % pawnStructures.length)
  }

  const previousStructure = () => {
    setCurrentStructure((prev) => (prev - 1 + pawnStructures.length) % pawnStructures.length)
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        Understanding pawn structure is crucial in chess as it determines the character of the position
        and influences your strategic choices.
      </p>

      <div className="relative">
        <motion.div
          key={currentStructure}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={previousStructure}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-semibold">
              {pawnStructures[currentStructure].name}
            </h3>
            <Button
              variant="outline"
              size="icon"
              onClick={nextStructure}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <InteractiveBoard
            fen={pawnStructures[currentStructure].fen}
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
              {pawnStructures[currentStructure].description}
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Key Concepts</h3>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Pawn Islands",
              description: "Groups of pawns separated by empty files. Fewer islands are generally better."
            },
            {
              title: "Backward Pawns",
              description: "Pawns that can't be protected by adjacent pawns and are blocked by enemy pawns."
            },
            {
              title: "Pawn Majority",
              description: "Having more pawns than your opponent on one side of the board."
            },
            {
              title: "Pawn Storm",
              description: "Advancing multiple pawns to attack the enemy king's position."
            }
          ].map((concept, index) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <h4 className="font-semibold text-blue-600">{concept.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{concept.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
