'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type PinnedSection = {
  id: string
  title: string
  icon: string
}

type PinnedSectionsContextType = {
  pinnedSections: PinnedSection[]
  isPinned: (sectionId: string) => boolean
  togglePin: (section: PinnedSection) => void
}

const PinnedSectionsContext = createContext<PinnedSectionsContextType | undefined>(undefined)

export function PinnedSectionsProvider({ children }: { children: React.ReactNode }) {
  const [pinnedSections, setPinnedSections] = useState<PinnedSection[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedSections = localStorage.getItem('chessFundamentalsPinnedSections')
    if (savedSections) {
      setPinnedSections(JSON.parse(savedSections))
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('chessFundamentalsPinnedSections', JSON.stringify(pinnedSections))
  }, [pinnedSections, isInitialized])

  const isPinned = (sectionId: string) => {
    return pinnedSections.some(section => section.id === sectionId)
  }

  const togglePin = (section: PinnedSection) => {
    setPinnedSections(prev => {
      if (isPinned(section.id)) {
        return prev.filter(s => s.id !== section.id)
      } else {
        return [...prev, section]
      }
    })
  }

  return (
    <PinnedSectionsContext.Provider value={{ pinnedSections, isPinned, togglePin }}>
      {children}
    </PinnedSectionsContext.Provider>
  )
}

export function usePinnedSections() {
  const context = useContext(PinnedSectionsContext)
  if (context === undefined) {
    throw new Error('usePinnedSections must be used within a PinnedSectionsProvider')
  }
  return context
}
