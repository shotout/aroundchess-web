'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, Circle } from 'lucide-react'
import { useLearningProgress } from 'contexts/LearningProgressContext'

interface CompleteButtonProps {
  sectionId: string
}

export function CompleteButton({ sectionId }: CompleteButtonProps) {
  const { toggleSectionCompletion, isCompleted } = useLearningProgress()
  const completed = isCompleted(sectionId)

  return (
    <Button 
      onClick={() => toggleSectionCompletion(sectionId)}
      className={completed ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
    >
      {completed ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Completed
        </>
      ) : (
        <>
          <Circle className="mr-2 h-4 w-4" />
          Mark as Complete
        </>
      )}
    </Button>
  )
}

