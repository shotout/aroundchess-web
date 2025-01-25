"use client"

import { Button } from "@/components/ui/button"
import { useChessTacticsProgress } from "@/contexts/ChessTacticsProgressContext"

export function CompleteButton({ sectionId }: { sectionId: string }) {
  const { toggleSectionCompletion, isCompleted } = useChessTacticsProgress()
  const completed = isCompleted(sectionId)

  return (
    <Button onClick={() => toggleSectionCompletion(sectionId)} variant={completed ? "outline" : "default"}>
      {completed ? "Mark as Incomplete" : "Mark as Complete"}
    </Button>
  )
}

