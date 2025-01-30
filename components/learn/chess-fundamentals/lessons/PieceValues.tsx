'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLearningProgress } from '@/contexts/LearningProgressContext'

const pieces = [
  {
    piece: '♟',
    name: 'Pawn',
    value: 1,
    description: 'The humble pawn is the soul of chess. While worth only one point, pawns can control key squares, create weaknesses in the enemy position, and promote to any other piece (except king) upon reaching the opposite end of the board.',
    strengths: [
      'Can promote to stronger pieces',
      'Strong when connected in chains',
      'Excellent at controlling key squares',
      'Creates weaknesses in opponent\'s position'
    ],
    weaknesses: [
      'Limited mobility',
      'Cannot move backwards',
      'Vulnerable to being blocked',
      'Weak when isolated or doubled'
    ]
  },
  {
    piece: '♞',
    name: 'Knight',
    value: 3,
    description: 'The knight\'s unique L-shaped movement makes it the only piece that can jump over others. Worth three pawns, knights are particularly strong in closed positions where their ability to leap over pieces becomes invaluable.',
    strengths: [
      'Can jump over other pieces',
      'Excellent for forking attacks',
      'Strong in closed positions',
      'Unpredictable movement pattern'
    ],
    weaknesses: [
      'Slow to move across the board',
      'Vulnerable on board edges',
      'Weaker in open positions',
      'Cannot control distant squares'
    ]
  },
  {
    piece: '♝',
    name: 'Bishop',
    value: 3,
    description: 'The bishop moves diagonally and is worth three pawns. Each bishop is confined to squares of one color, making the bishop pair particularly powerful as they can control both dark and light squares.',
    strengths: [
      'Long-range diagonal control',
      'Strong in open positions',
      'Powerful when working in pairs',
      'Good at attacking king positions'
    ],
    weaknesses: [
      'Confined to one color complex',
      'Can be blocked by pawns',
      'Weaker in closed positions',
      'Vulnerable to being trapped'
    ]
  },
  {
    piece: '♜',
    name: 'Rook',
    value: 5,
    description: 'The rook moves horizontally and vertically and is worth five pawns. Rooks grow in strength as the board opens up and are particularly powerful in the endgame, especially when controlling the seventh rank.',
    strengths: [
      'Strong in open files',
      'Powerful on the 7th rank',
      'Excellent at controlling lines',
      'Works well in pairs'
    ],
    weaknesses: [
      'Difficult to activate early',
      'Can be blocked by own pieces',
      'Vulnerable to minor piece attacks',
      'Takes time to coordinate'
    ]
  },
  {
    piece: '♛',
    name: 'Queen',
    value: 9,
    description: 'The queen is the most powerful piece, combining the movements of rook and bishop. Worth nine pawns, the queen\'s mobility makes it a fearsome attacking piece, though it must be careful to avoid enemy tactics.',
    strengths: [
      'Most versatile piece',
      'Powerful attacking force',
      'Can control many squares',
      'Excellent at creating threats'
    ],
    weaknesses: [
      'Can be trapped by minor pieces',
      'Vulnerable to gaining attacks',
      'Easy target for enemy tactics',
      'Loss severely weakens position'
    ]
  },
  {
    piece: '♚',
    name: 'King',
    value: '∞',
    description: 'The king\'s value is infinite as its capture ends the game. While generally needing protection in the opening and middlegame, the king becomes a strong piece in the endgame where it can actively support its pawns.',
    strengths: [
      'Strong in endgame',
      'Can protect nearby pawns',
      'Essential for opposition',
      'Good at supporting passed pawns'
    ],
    weaknesses: [
      'Vulnerable to attacks',
      'Limited mobility',
      'Needs protection early',
      'Must stay safe in middlegame'
    ]
  }
]

export function PieceValuesLesson() {
  const { progress, isCompleted, completeLesson } = useLearningProgress()
  const [currentPiece, setCurrentPiece] = useState(0)

  const nextPiece = () => {
    setCurrentPiece((prev) => (prev + 1) % pieces.length)
  }

  const previousPiece = () => {
    setCurrentPiece((prev) => (prev - 1 + pieces.length) % pieces.length)
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        Understanding the relative value of chess pieces is crucial for evaluating positions and making
        strategic decisions about exchanges. While these values serve as guidelines, remember that a
        piece's true worth often depends on the position and stage of the game.
      </p>

      <div className="relative">
        <motion.div
          key={currentPiece}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={previousPiece}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <span className="text-4xl mr-3">{pieces[currentPiece].piece}</span>
              <span className="text-xl font-semibold">
                {pieces[currentPiece].name} = {pieces[currentPiece].value} {pieces[currentPiece].value === 1 ? 'point' : 'points'}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPiece}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <p className="text-gray-700 mb-4">
              {pieces[currentPiece].description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {pieces[currentPiece].strengths.map((strength, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {strength}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Weaknesses</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {pieces[currentPiece].weaknesses.map((weakness, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {weakness}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">General Guidelines</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>These values are guidelines, not absolute rules</li>
            <li>Two minor pieces (Knights/Bishops) are generally better than a Rook</li>
            <li>A Queen is slightly worse than two Rooks</li>
            <li>Bishops are often slightly better than Knights in open positions</li>
            <li>A protected passed pawn can be worth as much as a minor piece</li>
            <li>Position and game stage greatly affect a piece's actual value</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
