'use client'

import { useState } from 'react'
import { InteractiveBoard } from '../InteractiveBoard'
import { useLearningProgress } from '@/contexts/LearningProgressContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface SetupSection {
  title: string
  content: string[]
  importance: string
}

const setupSections: SetupSection[] = [
  {
    title: "Board Orientation",
    content: [
      "White square must be in the right corner for both players",
      "Board should be perfectly square and level",
      "Each player faces their opponent across the board"
    ],
    importance: "Critical for proper game orientation and piece movement"
  },
  {
    title: "Piece Placement",
    content: [
      "Back rank: Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook",
      "Queen goes on its matching color (White Queen on white, Black Queen on black)",
      "Kings and Queens face each other across the board",
      "All pieces should be centered in their squares"
    ],
    importance: "Ensures correct starting positions for all pieces"
  },
  {
    title: "Pawn Setup",
    content: [
      "White pawns on second rank (2nd row)",
      "Black pawns on seventh rank (7th row)",
      "All eight pawns form a protective wall",
      "Each pawn should align with the piece behind it"
    ],
    importance: "Creates the initial pawn structure"
  },
  {
    title: "Final Checks",
    content: [
      "Verify symmetrical setup for both players",
      "Confirm all pieces are properly oriented",
      "Check that no squares are skipped or doubled",
      "Ensure both players agree on the setup"
    ],
    importance: "Prevents common setup mistakes"
  }
]

export function BoardSetupLesson() {
  const { progress, isCompleted, completeLesson } = useLearningProgress()
  const [expandedSection, setExpandedSection] = useState<string | null>("Board Orientation")
  const [currentFen, setCurrentFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <InteractiveBoard 
          fen={currentFen}
          showHints={true}
          allowMoves={false}
        />
        <motion.div
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-[14px] --sm shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-medium text-blue-600">Initial Position</p>
          <p className="text-gray-600">Standard starting setup</p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-lg shadow-sm p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Board Setup Guide</h2>
        
        <div className="space-y-3">
          {setupSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="border rounded-lg overflow-hidden"
            >
              <motion.button
                className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 ${
                  expandedSection === section.title ? 'bg-blue-50' : ''
                }`}
                onClick={() => setExpandedSection(
                  expandedSection === section.title ? null : section.title
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="font-medium text-gray-900">{section.title}</span>
                {expandedSection === section.title ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </motion.button>

              <AnimatePresence>
                {expandedSection === section.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t"
                  >
                    <div className="p-3 bg-white">
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.1 }}
                            className="flex items-start"
                          >
                            <span className="h-5 w-5 mr-2 flex-shrink-0">•</span>
                            <span className="text-gray-600">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-3 text-[14px] --sm text-blue-600 italic"
                      >
                        {section.importance}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-blue-50 rounded-lg p-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-blue-900 font-semibold mb-2">Pro Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Always double-check the queen's color placement</li>
          <li>• Use the "White on Right" rule to quickly verify board orientation</li>
          <li>• Take your time with the initial setup - it's crucial for a proper game</li>
          <li>• If in doubt, don't hesitate to ask your opponent to verify the setup</li>
        </ul>
      </motion.div>
    </div>
  )
}
