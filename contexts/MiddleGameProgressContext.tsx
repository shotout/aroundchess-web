"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Section = {
  id: string
  completed: boolean
}

type MiddleGameProgressContextType = {
  sections: Section[]
  progress: number
  toggleSectionCompletion: (sectionId: string) => void
  isCompleted: (sectionId: string) => boolean
}

const MiddleGameProgressContext = createContext<MiddleGameProgressContextType | undefined>(undefined)

export function MiddleGameProgressProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<Section[]>([
    { id: "piece-coordination", completed: false },
    { id: "attack-construction", completed: false },
    { id: "defense-techniques", completed: false },
    { id: "pawn-structure-analysis", completed: false },
    { id: "space-advantage-concepts", completed: false },
    { id: "piece-activity-optimization", completed: false },
    { id: "strategic-planning", completed: false },
    { id: "position-evaluation", completed: false },
    { id: "common-middlegame-patterns", completed: false },
    { id: "tactical-opportunities", completed: false },
  ])

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const completedCount = sections.filter((section) => section.completed).length
    const newProgress = Math.round((completedCount / sections.length) * 100)
    setProgress(newProgress)
  }, [sections])

  const toggleSectionCompletion = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, completed: !section.completed } : section)),
    )
  }

  const isCompleted = (sectionId: string) => {
    return sections.find((section) => section.id === sectionId)?.completed || false
  }

  return (
    <MiddleGameProgressContext.Provider value={{ sections, progress, toggleSectionCompletion, isCompleted }}>
      {children}
    </MiddleGameProgressContext.Provider>
  )
}

export function useMiddleGameProgress() {
  const context = useContext(MiddleGameProgressContext)
  if (context === undefined) {
    throw new Error("useMiddleGameProgress must be used within a MiddleGameProgressProvider")
  }
  return context
}

