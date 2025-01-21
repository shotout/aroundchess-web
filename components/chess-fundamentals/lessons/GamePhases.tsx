'use client'

import { useState } from 'react'
import { LessonCard } from '../LessonCard'
import { InteractiveBoard } from '../InteractiveBoard'
import { useLearningProgress } from '@/contexts/LearningProgressContext'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const gamePhases = [
  {
    name: "Opening",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    description: "The first phase of the game where pieces are developed and control of the center is established.",
    principles: [
      "Control the center",
      "Develop pieces quickly",
      "Castle early for king safety",
      "Don't move the same piece twice",
      "Don't bring the queen out too early"
    ]
  },
  {
    name: "Middlegame",
    fen: "r2qk2r/ppp2ppp/2n1b3/3np3/2B5/2N2N2/PPP2PPP/R1BQ1RK1 w kq - 0 1",
    description: "The phase where strategic plans are executed and tactical opportunities arise.",
    principles: [
      "Create and exploit weaknesses",
      "Control open files with rooks",
      "Coordinate pieces for attack",
      "Maintain pawn structure",
      "Look for tactical opportunities"
    ]
  },
  {
    name: "Endgame",
    fen: "4k3/4p3/8/4P3/8/8/8/4K3 w - - 0 1",
    description: "The final phase where pawns become crucial and king activity is important.",
    principles: [
      "Activate your king",
      "Create passed pawns",
      "Centralize pieces",
      "Cut off enemy king",
      "Know basic checkmate patterns"
    ]
  }
]

export function GamePhasesLesson() {
  const { progress, isCompleted, completeLesson } = useLearningProgress()
  const [currentPhase, setCurrentPhase] = useState(0)
  const phases = [
    {
      name: "Opening",
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      description: "The opening phase focuses on piece development, controlling the center, and king safety.",
      key_points: [
        "Develop your pieces quickly and efficiently",
        "Control the center squares (e4, e5, d4, d5)",
        "Castle early to protect your king",
        "Don't move the same piece multiple times",
        "Connect your rooks"
      ]
    },
    {
      name: "Middlegame",
      fen: "r2qr1k1/ppp2ppp/2n2n2/3p4/3P4/2NBB3/PPP2PPP/R2Q1RK1 w - - 0 1",
      description: "The middlegame is characterized by tactical battles, strategic planning, and piece coordination.",
      key_points: [
        "Create and exploit weaknesses in opponent's position",
        "Coordinate your pieces for attack",
        "Control open files with rooks",
        "Maintain pawn structure",
        "Look for tactical opportunities"
      ]
    },
    {
      name: "Endgame",
      fen: "4k3/4p3/8/4P3/8/8/8/4K3 w - - 0 1",
      description: "The endgame features simplified positions where pawns and king activity become crucial.",
      key_points: [
        "Activate your king",
        "Create passed pawns",
        "Centralize your pieces",
        "Know basic checkmate patterns",
        "Calculate pawn races carefully"
      ]
    }
  ]

  const nextPhase = () => {
    setCurrentPhase((prev) => (prev + 1) % phases.length)
  }

  const previousPhase = () => {
    setCurrentPhase((prev) => (prev - 1 + phases.length) % phases.length)
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        A chess game is typically divided into three main phases. Understanding the characteristics
        and principles of each phase is crucial for improving your chess strategy.
      </p>

      <div className="relative">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={previousPhase}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-semibold">
              {phases[currentPhase].name} Phase
            </h3>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPhase}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <InteractiveBoard
            fen={phases[currentPhase].fen}
            showHints={true}
            allowMoves={false}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <p className="mb-4">{phases[currentPhase].description}</p>
            <h4 className="font-semibold mb-2">Key Points:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {phases[currentPhase].key_points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Phase Transitions</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-600">Opening to Middlegame</h4>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
              <li>Most pieces are developed</li>
              <li>Kings are castled</li>
              <li>Center pawns are established</li>
              <li>Piece coordination begins</li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-600">Middlegame to Endgame</h4>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
              <li>Several pieces are exchanged</li>
              <li>Queens are often traded</li>
              <li>Pawn structure becomes critical</li>
              <li>King activity increases</li>
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-700 mb-2">Pro Tip</h4>
        <p className="text-sm text-blue-600">
          The boundaries between phases are not always clear. Be ready to adjust your strategy
          based on the position rather than strictly following phase "rules".
        </p>
      </div>
    </div>
  )
}
