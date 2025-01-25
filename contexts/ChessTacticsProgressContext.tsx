"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Section = {
  id: string
  completed: boolean
}

type ChessTacticsProgressContextType = {
  sections: Section[]
  progress: number
  toggleSectionCompletion: (sectionId: string) => void
  isCompleted: (sectionId: string) => boolean
}

const ChessTacticsProgressContext = createContext<ChessTacticsProgressContextType | undefined>(undefined)

export function ChessTacticsProgressProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<Section[]>([
    { id: "pin-mechanisms", completed: false },
    { id: "fork-techniques", completed: false },
    { id: "discovery-attacks", completed: false },
    { id: "double-attacks", completed: false },
    { id: "skewer-tactics", completed: false },
    { id: "deflection-tactics", completed: false },
    { id: "overloading-concepts", completed: false },
    { id: "interference-tactics", completed: false },
    { id: "clearance-sacrifices", completed: false },
    { id: "combination-patterns", completed: false },
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
    <ChessTacticsProgressContext.Provider value={{ sections, progress, toggleSectionCompletion, isCompleted }}>
      {children}
    </ChessTacticsProgressContext.Provider>
  )
}

export function useChessTacticsProgress() {
  const context = useContext(ChessTacticsProgressContext)
  if (context === undefined) {
    throw new Error("useChessTacticsProgress must be used within a ChessTacticsProgressProvider")
  }
  return context
}

