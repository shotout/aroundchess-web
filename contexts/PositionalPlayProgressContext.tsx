"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Section = {
  id: string
  completed: boolean
}

type PositionalPlayProgressContextType = {
  sections: Section[]
  progress: number
  toggleSectionCompletion: (sectionId: string) => void
  isCompleted: (sectionId: string) => boolean
}

const PositionalPlayProgressContext = createContext<PositionalPlayProgressContextType | undefined>(undefined)

export function PositionalPlayProgressProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<Section[]>([
    { id: "pawn-structure-analysis", completed: false },
    { id: "piece-placement-principles", completed: false },
    { id: "square-control", completed: false },
    { id: "prophylaxis-concepts", completed: false },
    { id: "weak-square-exploitation", completed: false },
    { id: "bishop-pair-utilization", completed: false },
    { id: "knight-outpost-positions", completed: false },
    { id: "space-advantage-usage", completed: false },
    { id: "blockade-techniques", completed: false },
    { id: "strategic-sacrifices", completed: false },
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
    <PositionalPlayProgressContext.Provider value={{ sections, progress, toggleSectionCompletion, isCompleted }}>
      {children}
    </PositionalPlayProgressContext.Provider>
  )
}

export function usePositionalPlayProgress() {
  const context = useContext(PositionalPlayProgressContext)
  if (context === undefined) {
    throw new Error("usePositionalPlayProgress must be used within a PositionalPlayProgressProvider")
  }
  return context
}

