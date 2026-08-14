'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChessBoard } from '@/components/learn/chess-fundamentals/ChessBoard'
import { PieceValues } from '@/components/learn/chess-fundamentals/PieceValues'
import { CheckmatePatterns } from '@/components/learn/chess-fundamentals/CheckmatePatterns'
import { PawnStructure } from '@/components/learn/chess-fundamentals/PawnStructure'
import { GamePhases } from '@/components/learn/chess-fundamentals/GamePhases'
import { ChessTerminology } from '@/components/learn/chess-fundamentals/ChessTerminology'
import { ChessNotation } from '@/components/learn/chess-fundamentals/ChessNotation'
import { BoardSetup } from '@/components/learn/chess-fundamentals/BoardSetup'
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
import {
  PuzzleIcon,
  BookOpenIcon,
  SwordIcon,
  AlertTriangleIcon,
  BrainCircuitIcon,
  TimerIcon,
  TargetIcon,
  ShieldIcon,
  BookmarkIcon,
  ScrollTextIcon,
} from 'lucide-react'

const fundamentals = [
  { 
    id: 'rules', 
    title: 'Basic Rules', 
    icon: <PuzzleIcon className="h-6 w-6 text-primary" />,
    description: 'Learn how each piece moves and the fundamental rules of chess'
  },
  { 
    id: 'board-setup', 
    title: 'Board Setup', 
    icon: <BookOpenIcon className="h-6 w-6 text-primary" />,
    description: 'Understand how to properly set up the chess board'
  },
  { 
    id: 'piece-values', 
    title: 'Piece Values', 
    icon: <SwordIcon className="h-6 w-6 text-primary" />,
    description: 'Learn the relative value of each chess piece'
  },
  { 
    id: 'checkmate', 
    title: 'Checkmate', 
    icon: <AlertTriangleIcon className="h-6 w-6 text-primary" />,
    description: 'Master basic checkmate patterns'
  },
  { 
    id: 'pawn-structure', 
    title: 'Pawn Structure', 
    icon: <BrainCircuitIcon className="h-6 w-6 text-primary" />,
    description: 'Understand pawn formations and their importance'
  },
  { 
    id: 'game-phases', 
    title: 'Game Phases', 
    icon: <TimerIcon className="h-6 w-6 text-primary" />,
    description: 'Learn about the opening, middlegame, and endgame'
  },
  { 
    id: 'terminology', 
    title: 'Terminology', 
    icon: <ScrollTextIcon className="h-6 w-6 text-primary" />,
    description: 'Master essential chess terms and concepts'
  },
  { 
    id: 'notation', 
    title: 'Notation', 
    icon: <BookmarkIcon className="h-6 w-6 text-primary" />,
    description: 'Learn how to read and write chess moves'
  },
]

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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Chess Fundamentals</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the essential building blocks of chess through our comprehensive learning modules. 
          Explore basic rules, piece movements, and core concepts to build a strong foundation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {fundamentals.map((topic) => (
          <Card 
            key={topic.id}
            className="relative p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center justify-center text-center"
            onClick={() => setActiveTab(topic.id)}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              {topic.icon}
              <h3 className="font-medium text-base">{topic.title}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          <Card>
            <CardContent className="p-6">
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
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-2">
          <div className="sticky top-4 space-y-6">
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
