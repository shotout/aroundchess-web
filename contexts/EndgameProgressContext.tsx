"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Section = {
  id: string
  completed: boolean
}

type EndgameProgressContextType = {
  sections: Section[]
  progress: number
  toggleSectionCompletion: (sectionId: string) => void
  isCompleted: (sectionId: string) => boolean
}

const EndgameProgressContext = createContext<EndgameProgressContextType | undefined>(undefined)

export function EndgameProgressProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<Section[]>([
    { id: "basic-checkmates", completed: false },
    { id: "pawn-endgames", completed: false },
    { id: "rook-endgames", completed: false },
    { id: "minor-piece-endgames", completed: false },
    { id: "queen-endgames", completed: false },
    { id: "king-activity", completed: false },
    { id: "opposition-concepts", completed: false },
    { id: "drawing-techniques", completed: false },
    { id: "zugzwang-positions", completed: false },
    { id: "theoretical-endgames", completed: false },
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
    <EndgameProgressContext.Provider value={{ sections, progress, toggleSectionCompletion, isCompleted }}>
      {children}
    </EndgameProgressContext.Provider>
  )
}

export function useEndgameProgress() {
  const context = useContext(EndgameProgressContext)
  if (context === undefined) {
    throw new Error("useEndgameProgress must be used within an EndgameProgressProvider")
  }
  return context
}

