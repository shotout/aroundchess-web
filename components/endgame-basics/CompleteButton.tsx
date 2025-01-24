"use client"

import { Button } from "@/components/ui/button"
import { useEndgameProgress } from "@/contexts/EndgameProgressContext"

export function CompleteButton({ sectionId }: { sectionId: string }) {
  const { toggleSectionCompletion, isCompleted } = useEndgameProgress()
  const completed = isCompleted(sectionId)

  return (
    <Button onClick={() => toggleSectionCompletion(sectionId)} variant={completed ? "outline" : "default"}>
      {completed ? "Mark as Incomplete" : "Mark as Complete"}
    </Button>
  )
}

