'use client'

import { useState } from 'react'
import { useLearningProgress } from '@/contexts/LearningProgressContext'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const categories = ['All', 'Basic', 'Tactics', 'Strategy', 'Endgame']
const fixedTerms = [
  {
    term: "Pin",
    definition: "When a piece cannot move because it would expose a more valuable piece to capture",
    category: "Tactics",
    example: "A bishop pinning a knight to the king"
  },
  {
    term: "Fork",
    definition: "A piece attacks two or more enemy pieces simultaneously",
    category: "Tactics",
    example: "A knight forking a king and rook"
  },
  {
    term: "Skewer",
    definition: "Similar to a pin, but the more valuable piece is in front",
    category: "Tactics",
    example: "A rook skewering a queen and bishop"
  },
  {
    term: "Discovered Attack",
    definition: "An attack revealed when one piece moves out of the way of another",
    category: "Tactics",
    example: "Moving a knight to reveal a bishop's attack"
  },
  {
    term: "Zugzwang",
    definition: "When any move a player makes will worsen their position",
    category: "Strategy",
    example: "Common in pawn endgames"
  },
  {
    term: "Fianchetto",
    definition: "Developing a bishop to the second rank of an adjacent knight file",
    category: "Strategy",
    example: "Moving the bishop to g2 or b2"
  },
]
const scrollableTerms = [
  {
    term: "Opposition",
    definition: "A position where kings face each other with one square between",
    category: "Endgame",
    example: "Critical in king and pawn endgames"
  },
  {
    term: "En Passant",
    definition: "Special pawn capture of an adjacent pawn that has just moved two squares",
    category: "Basic",
    example: "Capturing a pawn as if it had moved only one square"
  }
]

export function ChessTerminologyLesson() {
  const { progress, isCompleted, completeLesson } = useLearningProgress()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showMore, setShowMore] = useState(false)

  const filterTerms = (terms: any[]) => {
    return terms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }

  const filteredFixedTerms = filterTerms(fixedTerms)
  const filteredScrollableTerms = filterTerms(scrollableTerms)
  const allFilteredTerms = [...filteredFixedTerms, ...(showMore ? filteredScrollableTerms : [])]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search terms..."
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
              className={`px-3 py-1 rounded-full text-sm ${
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
          {allFilteredTerms.map((term, index) => (
            <motion.div
              key={term.term}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.05 }
              }}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">{term.term}</h3>
              <p className="text-sm text-gray-600 mt-1">{term.definition}</p>
              {term.example && (
                <p className="text-sm text-gray-500 mt-2 italic">Example: {term.example}</p>
              )}
              <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {term.category}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredScrollableTerms.length > 0 && (
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
    </div>
  )
}
