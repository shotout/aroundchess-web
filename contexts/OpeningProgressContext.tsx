'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Section = {
  id: string
  completed: boolean
}

type OpeningProgressContextType = {
  sections: Section[]
  progress: number
  toggleSectionCompletion: (sectionId: string) => void
  isCompleted: (sectionId: string) => boolean
}

const OpeningProgressContext = createContext<OpeningProgressContextType | undefined>(undefined)

export function OpeningProgressProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<Section[]>([
    { id: 'core-principles', completed: false },
    { id: 'popular-openings', completed: false },
    { id: 'opening-traps', completed: false },
    { id: 'common-mistakes', completed: false },
    { id: 'repertoire-builder', completed: false },
    { id: 'understanding-tempo', completed: false },
    { id: 'center-control', completed: false },
    { id: 'development-strategies', completed: false },
    { id: 'opening-explorer', completed: false },
    { id: 'historical-analysis', completed: false },
  ])

  const [progress, setProgress] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load data from localStorage after initial render
  useEffect(() => {
    const savedSections = localStorage.getItem('openingPrincipalsProgress')
    const savedProgress = localStorage.getItem('openingPrincipalsOverallProgress')
    
    if (savedSections) {
      setSections(JSON.parse(savedSections))
    }
    if (savedProgress) {
      setProgress(parseInt(savedProgress, 10))
    }
    setIsInitialized(true)
  }, [])

  // Update localStorage when sections change, but only after initialization
  useEffect(() => {
    if (!isInitialized) return

    const completedCount = sections.filter(section => section.completed).length
    const newProgress = Math.round((completedCount / sections.length) * 100)
    setProgress(newProgress)
    
    localStorage.setItem('openingPrincipalsProgress', JSON.stringify(sections))
    localStorage.setItem('openingPrincipalsOverallProgress', newProgress.toString())
  }, [sections, isInitialized])

  const toggleSectionCompletion = (sectionId: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId ? { ...section, completed: !section.completed } : section
      )
    )
  }

  const isCompleted = (sectionId: string) => {
    return sections.find(section => section.id === sectionId)?.completed || false
  }

  return (
    <OpeningProgressContext.Provider value={{ sections, progress, toggleSectionCompletion, isCompleted }}>
      {children}
    </OpeningProgressContext.Provider>
  )
}

export function useOpeningProgress() {
  const context = useContext(OpeningProgressContext)
  if (context === undefined) {
    throw new Error('useOpeningProgress must be used within an OpeningProgressProvider')
  }
  return context
}