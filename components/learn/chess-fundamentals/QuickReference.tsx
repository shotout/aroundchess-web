'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Term {
  term: string
  definition: string
  category: string
}

const chessTerms: Term[] = [
  {
    term: 'Pin',
    definition: 'A situation where a piece cannot move because it would expose a more valuable piece to capture.',
    category: 'tactics'
  },
  {
    term: 'Fork',
    definition: 'A single piece attacks two or more enemy pieces simultaneously.',
    category: 'tactics'
  },
  {
    term: 'Fianchetto',
    definition: 'Developing a bishop to b2 or g2 (b7 or g7 for Black) after moving the knight pawn one square.',
    category: 'strategy'
  },
]

const shortcuts = [
  { key: 'Spacebar', action: 'Rotate Board' },
  { key: '←/→', action: 'Navigate Moves' },
  { key: 'Ctrl + Z', action: 'Undo Move' },
  { key: 'R', action: 'Reset Board' },
]

export function QuickReference() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTerms = chessTerms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="h-full">
      <Tabs defaultValue="glossary" className="h-full flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="glossary">Glossary</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
        </TabsList>

        <TabsContent value="glossary" className="flex-1 p-4 pt-2">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-4 pr-4">
              {filteredTerms.map((term, index) => (
                <motion.div
                  key={term.term}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-gray-50"
                >
                  <h4 className="font-medium text-blue-600">{term.term}</h4>
                  <p className="text-[14px] --sm text-gray-600 mt-1">{term.definition}</p>
                  <span className="text-[14px] --xs text-gray-400 mt-2 inline-block">
                    {term.category}
                  </span>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="shortcuts" className="flex-1 p-4">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <span className="font-mono text-[14px] --sm bg-gray-100 px-2 py-1 rounded">
                    {shortcut.key}
                  </span>
                  <span className="text-[14px] --sm text-gray-600">{shortcut.action}</span>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
