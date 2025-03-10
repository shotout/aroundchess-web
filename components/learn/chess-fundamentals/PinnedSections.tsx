'use client'

import { usePinnedSections } from '@/contexts/PinnedSectionsContext'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Pin, PinOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export function PinnedSections({ 
  activeTab,
  setActiveTab 
}: { 
  activeTab: string
  setActiveTab: (tab: string) => void 
}) {
  const { pinnedSections, togglePin } = usePinnedSections()

  if (pinnedSections.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          <Pin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Pin your favorite sections for quick access</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">Pinned Sections</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {pinnedSections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
                    ${activeTab === section.id 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100'
                    }`}
                  onClick={() => setActiveTab(section.id)}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="flex-1 text-sm font-medium">{section.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePin(section)
                    }}
                  >
                    <PinOff className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </Card>
  )
}
