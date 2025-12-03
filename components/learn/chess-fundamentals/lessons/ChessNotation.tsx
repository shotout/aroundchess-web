'use client'

import { useState } from 'react'
import { InteractiveBoard } from '../InteractiveBoard'
import { useLearningProgress } from '@/contexts/LearningProgressContext'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Chess } from 'chess.js'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AnimatePresence } from 'framer-motion'

interface NotationItem {
  title: string
  description: string
  example?: string
  category: string
}

const notationContent: NotationItem[] = [
  {
    title: "Pawn Moves",
    description: "Pawns are written with just the destination square",
    example: "e4, d5, c6",
    category: "Basic"
  },
  {
    title: "Piece Moves",
    description: "Pieces are indicated by their capital letter (K, Q, R, B, N) followed by destination",
    example: "Nf3, Bb5, Qd4",
    category: "Basic"
  },
  {
    title: "Captures",
    description: "The 'x' symbol indicates a capture",
    example: "Bxe5, exd5, Qxf7+",
    category: "Basic"
  },
  {
    title: "Castling",
    description: "Kingside castle is O-O, Queenside is O-O-O",
    example: "O-O, O-O-O",
    category: "Basic"
  },
  {
    title: "Check",
    description: "The '+' symbol indicates a check",
    example: "Qh5+, Nf7+",
    category: "Basic"
  },
  {
    title: "Checkmate",
    description: "The '#' symbol indicates checkmate",
    example: "Qh7#, Nf7#",
    category: "Basic"
  },
  {
    title: "Pawn Promotion",
    description: "Use '=' followed by the piece letter for pawn promotion",
    example: "e8=Q, d1=N",
    category: "Advanced"
  },
  {
    title: "Disambiguation",
    description: "When two pieces can move to the same square, add file or rank to clarify",
    example: "Nbd7, R1e4",
    category: "Advanced"
  },
  {
    title: "En Passant",
    description: "Capturing a pawn that just moved two squares, marked with 'e.p.'",
    example: "exd6 e.p.",
    category: "Advanced"
  },
  {
    title: "Move Quality",
    description: "Symbols to indicate move quality: ! (good), ? (poor), !! (brilliant), ?? (blunder)",
    example: "Nf3!, e4??",
    category: "Analysis"
  },
  {
    title: "Position Assessment",
    description: "Symbols for position evaluation: ± (White is better), ∓ (Black is better), = (equal)",
    example: "After Nf3 ±",
    category: "Analysis"
  },
  {
    title: "File Notation",
    description: "Files are labeled a-h from White's left to right",
    example: "a-file, e-file",
    category: "Basic"
  },
  {
    title: "Rank Notation",
    description: "Ranks are numbered 1-8 from White's side to Black's side",
    example: "1st rank, 8th rank",
    category: "Basic"
  },
  {
    title: "Move Numbers",
    description: "Each pair of moves starts with a number followed by dots",
    example: "1.e4 e5 2.Nf3",
    category: "Basic"
  },
  {
    title: "Alternative Moves",
    description: "Alternative moves in analysis are shown in parentheses",
    example: "1.e4 (1.d4, 1.c4)",
    category: "Analysis"
  }
]

const categories = ['All', 'Basic', 'Advanced', 'Analysis']

export function ChessNotationLesson() {
  const { progress, isCompleted, completeLesson } = useLearningProgress()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showMore, setShowMore] = useState(false)

  const filterNotation = (items: NotationItem[]) => {
    return items.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.example?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }

  const displayedItems = showMore ? notationContent : notationContent.slice(0, 9)
  const filteredItems = filterNotation(displayedItems)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-[14px] --sm ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory + searchTerm + showMore}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.05 }
              }}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-[14px] --sm text-gray-600 mt-1">{item.description}</p>
              {item.example && (
                <p className="text-[14px] --sm text-gray-500 mt-2 font-mono">Example: {item.example}</p>
              )}
              <span className="inline-block mt-2 text-[14px] --xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {item.category}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {notationContent.length > 9 && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            onClick={() => setShowMore(!showMore)}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showMore ? 'Show Less' : 'Show More'}
          </motion.button>
        </motion.div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Pro Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Practice writing notation by recording your own games</li>
          <li>• Study master games by following the notation move by move</li>
          <li>• Use online tools to verify your notation understanding</li>
          <li>• Start with basic moves before learning advanced symbols</li>
        </ul>
      </div>
    </div>
  )
}
