'use client'

import { CircularProgress } from '@/components/ui/circular-progress'
import { Card } from '@/components/ui/card'
import { Trophy, Star, Book } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLearningProgress } from '@/contexts/LearningProgressContext'

interface Achievement {
  id: string
  title: string
  icon: React.ReactNode
  completed: boolean
}

export function ProgressTracker() {
  const { progress, sections = [] } = useLearningProgress()
  const completedSections = sections
    .filter(section => section.completed)
    .map(section => section.id)

  const achievements: Achievement[] = [
    { 
      id: 'basics_master',
      title: 'Basics Master',
      icon: <Book className="h-5 w-5" />,
      completed: completedSections.includes('rules') && completedSections.includes('board-setup')
    },
    {
      id: 'tactical_genius',
      title: 'Tactical Genius',
      icon: <Star className="h-5 w-5" />,
      completed: completedSections.includes('checkmate') && completedSections.includes('piece-values')
    },
    {
      id: 'strategy_expert',
      title: 'Strategy Expert',
      icon: <Trophy className="h-5 w-5" />,
      completed: completedSections.includes('pawn-structure') && completedSections.includes('game-phases')
    }
  ]

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
          <p className="text-[14px] --sm text-gray-500">Keep learning and earning achievements!</p>
        </div>
        <CircularProgress 
          value={progress} 
          size={60}
          strokeWidth={8}
          className="text-blue-600"
        />
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center p-3 rounded-lg ${
              achievement.completed 
                ? 'bg-green-50 text-green-700' 
                : 'bg-gray-50 text-gray-500'
            }`}
          >
            <div className={`p-2 rounded-full ${
              achievement.completed ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {achievement.icon}
            </div>
            <div className="ml-3">
              <p className="font-medium">{achievement.title}</p>
              <p className="text-[14px] --sm">
                {achievement.completed ? 'Completed!' : 'In Progress'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
