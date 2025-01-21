'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronDown, ChevronUp, CheckCircle, Pin } from 'lucide-react'
import { usePinnedSections } from '@/contexts/PinnedSectionsContext'

interface LessonCardProps {
  title: string
  description: string
  content: React.ReactNode
  progress: number
  isCompleted?: boolean
  onComplete?: () => void
  children?: React.ReactNode
  id: string
  icon: string
  defaultExpanded?: boolean
}

export function LessonCard({
  title,
  description,
  content,
  progress,
  isCompleted = false,
  onComplete,
  children,
  id,
  icon,
  defaultExpanded = false
}: LessonCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { isPinned, togglePin } = usePinnedSections()
  const pinned = isPinned(id)

  return (
    <Card className="overflow-hidden">
      <motion.div
        initial={false}
        animate={{ backgroundColor: isCompleted ? '#f0fdf4' : '#ffffff' }}
        className="p-4"
      >
        <div 
          className="flex items-start justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              {isCompleted && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onComplete?.()
              }}
            >
              {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                togglePin({ id, title, icon })
              }}
              className={pinned ? 'text-blue-600' : ''}
            >
              <Pin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">{progress}% Complete</p>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="prose prose-blue max-w-none">
                {content}
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Card>
  )
}
