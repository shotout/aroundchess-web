'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChessBoard } from '@/components/chess-fundamentals/ChessBoard'
import { PieceValues } from '@/components/chess-fundamentals/PieceValues'
import { CheckmatePatterns } from '@/components/chess-fundamentals/CheckmatePatterns'
import { PawnStructure } from '@/components/chess-fundamentals/PawnStructure'
import { GamePhases } from '@/components/chess-fundamentals/GamePhases'
import { ChessTerminology } from '@/components/chess-fundamentals/ChessTerminology'
import { ChessNotation } from '@/components/chess-fundamentals/ChessNotation'
import { BoardSetup } from '@/components/chess-fundamentals/BoardSetup'
import { Progress } from '@/components/ui/progress'
import { LearningProgressProvider, useLearningProgress } from 'contexts/LearningProgressContext'
import { CheckCircle, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ProgressTracker } from './ProgressTracker'
import { InteractiveBoard } from './InteractiveBoard'
import { LessonCard } from './LessonCard'
import { QuickReference } from './QuickReference'
import { BoardSetupLesson } from './lessons/BoardSetup'
import { PieceValuesLesson } from './lessons/PieceValues'
import { CheckmatePatternsLesson } from './lessons/CheckmatePatterns'
import { PawnStructureLesson } from './lessons/PawnStructure'
import { GamePhasesLesson } from './lessons/GamePhases'
import { ChessTerminologyLesson } from './lessons/ChessTerminology'
import { ChessNotationLesson } from './lessons/ChessNotation'
import { BasicRulesLesson } from './lessons/BasicRules'
import { PinnedSectionsProvider } from '@/contexts/PinnedSectionsContext'
import { PinnedSections } from './PinnedSections'

const fundamentals = [
  { 
    id: 'rules', 
    title: 'Basic Rules', 
    icon: '♟️',
    description: 'Learn how each piece moves and the fundamental rules of chess'
  },
  { 
    id: 'board-setup', 
    title: 'Board Setup', 
    icon: '♜',
    description: 'Understand how to properly set up the chess board'
  },
  { 
    id: 'piece-values', 
    title: 'Piece Values', 
    icon: '♝',
    description: 'Learn the relative value of each chess piece'
  },
  { 
    id: 'checkmate', 
    title: 'Checkmate', 
    icon: '♚',
    description: 'Master basic checkmate patterns'
  },
  { 
    id: 'pawn-structure', 
    title: 'Pawn Structure', 
    icon: '♙',
    description: 'Understand pawn formations and their importance'
  },
  { 
    id: 'game-phases', 
    title: 'Game Phases', 
    icon: '♛',
    description: 'Learn about the opening, middlegame, and endgame'
  },
  { 
    id: 'terminology', 
    title: 'Terminology', 
    icon: '♞',
    description: 'Master essential chess terms and concepts'
  },
  { 
    id: 'notation', 
    title: 'Notation', 
    icon: '♖',
    description: 'Learn how to read and write chess moves'
  },
]

function SidebarContent({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const { isCompleted } = useLearningProgress()

  return (
    <div className="p-4 flex-1 flex flex-col h-full">
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-1 pr-4">
          {fundamentals.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-90">{item.description}</div>
                </div>
                {isCompleted(item.id) && (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default function ChessFundamentals() {
  const [activeTab, setActiveTab] = useState('rules')  

  return (
    <PinnedSectionsProvider>
      <LearningProgressProvider>
        <ChessFundamentalsContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </LearningProgressProvider>
    </PinnedSectionsProvider>
  )
}

function ChessFundamentalsContent({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string
  setActiveTab: (tab: string) => void 
}) {
  const { progress, isCompleted, completeLesson } = useLearningProgress()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {/* Tablet Navigation Button (Only visible below lg breakpoint) */}
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[380px] p-0">
            <SidebarContent activeTab={activeTab} setActiveTab={(tab) => {
              setActiveTab(tab)
              setIsSidebarOpen(false)
            }} />
          </SheetContent>
        </Sheet>
        <div className="text-lg font-semibold">Chess Fundamentals</div>
        <div className="w-9" /> {/* Spacer for alignment */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 lg:gap-6">
        {/* Left Panel - Navigation (Hidden on tablet and below) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-4">
            <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-5 lg:col-span-6">
          <div className="space-y-4 md:space-y-5 lg:space-y-6">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="rules" className="m-0">
                <LessonCard
                  id="rules"
                  icon="♟️"
                  title="Basic Rules"
                  description="Learn how each piece moves and the fundamental rules of chess"
                  content={<BasicRulesLesson />}
                  progress={progress}
                  isCompleted={isCompleted('rules')}
                  onComplete={() => completeLesson('rules')}
                  defaultExpanded={true}
                />
              </TabsContent>
              <TabsContent value="board-setup">
                <LessonCard
                  id="board-setup"
                  icon="♜"
                  title="Board Setup"
                  description="Understand how to properly set up the chess board"
                  content={<BoardSetupLesson />}
                  progress={progress}
                  isCompleted={isCompleted('board-setup')}
                  onComplete={() => completeLesson('board-setup')}
                  defaultExpanded={false}
                />
              </TabsContent>
              <TabsContent value="piece-values">
                <LessonCard
                  id="piece-values"
                  icon="♝"
                  title="Piece Values"
                  description="Learn the relative value of each chess piece"
                  content={<PieceValuesLesson />}
                  progress={progress}
                  isCompleted={isCompleted('piece-values')}
                  onComplete={() => completeLesson('piece-values')}
                  defaultExpanded={false}
                />
              </TabsContent>
              <TabsContent value="checkmate">
                <LessonCard
                  id="checkmate"
                  icon="♕"
                  title="Checkmate Patterns"
                  description="Master basic checkmate patterns"
                  content={<CheckmatePatternsLesson />}
                  progress={progress}
                  isCompleted={isCompleted('checkmate')}
                  onComplete={() => completeLesson('checkmate')}
                  defaultExpanded={false}
                />
              </TabsContent>
              <TabsContent value="pawn-structure">
                <LessonCard
                  id="pawn-structure"
                  icon="♙"
                  title="Pawn Structure"
                  description="Understand pawn formations and their importance"
                  content={<PawnStructureLesson />}
                  progress={progress}
                  isCompleted={isCompleted('pawn-structure')}
                  onComplete={() => completeLesson('pawn-structure')}
                  defaultExpanded={false}
                />
              </TabsContent>
              <TabsContent value="game-phases">
                <LessonCard
                  id="game-phases"
                  icon="♔"
                  title="Game Phases"
                  description="Learn about the opening, middlegame, and endgame"
                  content={<GamePhasesLesson />}
                  progress={progress}
                  isCompleted={isCompleted('game-phases')}
                  onComplete={() => completeLesson('game-phases')}
                  defaultExpanded={false}
                />
              </TabsContent>
              <TabsContent value="terminology">
                <LessonCard
                  id="terminology"
                  icon="📚"
                  title="Chess Terminology"
                  description="Master essential chess terms and concepts"
                  content={<ChessTerminologyLesson />}
                  progress={progress}
                  isCompleted={isCompleted('terminology')}
                  onComplete={() => completeLesson('terminology')}
                  defaultExpanded={false}
                />
              </TabsContent>
              <TabsContent value="notation">
                <LessonCard
                  id="notation"
                  icon="✍️"
                  title="Chess Notation"
                  description="Learn how to read and write chess moves"
                  content={<ChessNotationLesson />}
                  progress={progress}
                  isCompleted={isCompleted('notation')}
                  onComplete={() => completeLesson('notation')}
                  defaultExpanded={false}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <div className="sticky top-4 space-y-4 md:space-y-5 lg:space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <ProgressTracker />
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <PinnedSections activeTab={activeTab} setActiveTab={setActiveTab} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
