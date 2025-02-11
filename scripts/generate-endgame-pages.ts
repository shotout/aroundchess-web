import fs from 'fs'
import path from 'path'

const topics = [
  'advanced-pawn-endgames',
  'basic-checkmates',
  'basic-endgame-principles',
  'basic-minor-piece',
  'basic-rook-endgames',
  'bishop-knight-mate',
  'complex-minor-piece',
  'complex-queen-endgames',
  'complex-rook-endgames',
  'drawing-techniques',
  'endgame-calculation',
  'endgame-principles',
  'endgame-studies',
  'endgame-tactics',
  'fortress-positions',
  'king-activity',
  'king-and-pawn',
  'knight-vs-bishop',
  'minor-piece-endgames',
  'opposite-colored-bishops',
  'pawn-breakthroughs',
  'pawn-endgames',
  'practical-endgame',
  'queen-endgame-principles',
  'queen-endgames',
  'queen-vs-pawn',
  'queen-vs-rook',
  'rook-bishop-vs-rook',
  'rook-endgames',
  'rook-vs-minor',
  'rook-vs-pawns',
  'same-colored-bishops',
  'stalemate-patterns',
  'technical-conversion',
  'technical-winning',
  'theoretical-endgames',
  'theoretical-positions',
  'zugzwang-positions'
]

const template = (topic: string) => `"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Target, Book, ChevronLeft, RotateCcw } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ${topic.replace(/-/g, '')} } from "@/components/analysis/training-plan/training-topics/endgame/${topic}"
import { endgamePositions } from "@/components/analysis/training-plan/training-topics/endgame/positions"
import { Chess, Square } from "chess.js"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface ChessboardProps {
  position: string
  boardSize: number
  isDraggable: boolean
  onPieceDrop?: (sourceSquare: Square, targetSquare: Square, piece: string) => boolean
}

const Chessboard = dynamic<ChessboardProps>(() => import("@/components/chess/chessboard"), {
  ssr: false,
})

export default function ${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Page() {
  const initialPosition = endgamePositions['${topic}']
  const [game, setGame] = useState<Chess>(new Chess(initialPosition))
  const [position, setPosition] = useState(initialPosition)

  function onDrop(sourceSquare: Square, targetSquare: Square, piece: string) {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1].toLowerCase() === "p" ? "q" : undefined,
      })

      if (move === null) return false
      setPosition(game.fen())
      return true
    } catch (e) {
      return false
    }
  }

  function resetPosition() {
    const newGame = new Chess(initialPosition)
    setGame(newGame)
    setPosition(initialPosition)
  }

  useEffect(() => {
    resetPosition()
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/learning/endgame">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{${topic.replace(/-/g, '')}.title}</h1>
          <p className="text-muted-foreground">{${topic.replace(/-/g, '')}.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-center mb-6">
              <div style={{ width: '100%', maxWidth: '480px', aspectRatio: '1/1' }}>
                <Chessboard
                  position={position}
                  boardSize={480}
                  isDraggable={true}
                  onPieceDrop={onDrop}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{${topic.replace(/-/g, '')}.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{${topic.replace(/-/g, '')}.estimatedTime}</span>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={resetPosition}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset Position
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset to initial position</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="patterns" className="flex-1">Patterns</TabsTrigger>
                  <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>
                      <ul className="space-y-2">
                        {${topic.replace(/-/g, '')}.objectives?.map((objective, index) => (
                          <li key={index} className="text-muted-foreground flex items-start gap-2">
                            <span className="select-none">•</span>
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
                      <div className="flex gap-2">
                        {${topic.replace(/-/g, '')}.prerequisites?.map((prereq, index) => (
                          <Badge key={index} variant="outline">{prereq}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Fundamental Positions</h3>
                      <ul className="space-y-2">
                        {${topic.replace(/-/g, '')}.fundamentalPositions?.map((position, index) => (
                          <li key={index} className="text-muted-foreground flex items-start gap-2">
                            <Target className="h-4 w-4 mt-1" />
                            <span>{position}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="patterns" className="space-y-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Winning Techniques</h3>
                      <ul className="space-y-2">
                        {${topic.replace(/-/g, '')}.winningTechniques?.map((technique, index) => (
                          <li key={index} className="text-muted-foreground flex items-start gap-2">
                            <Target className="h-4 w-4 mt-1" />
                            <span>{technique}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Common Mistakes</h3>
                      <ul className="space-y-2">
                        {${topic.replace(/-/g, '')}.commonMistakes?.map((mistake, index) => (
                          <li key={index} className="text-muted-foreground flex items-start gap-2">
                            <Target className="h-4 w-4 mt-1" />
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  {${topic.replace(/-/g, '')}.resources?.map((resource, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-4">
                        <Book className="h-5 w-5 mt-1" />
                        <div>
                          <h3 className="font-semibold">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Visit {resource.platform}
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Start Learning</h2>
            <Link href="/dashboard/learning/endgame/${topic}/learn">
              <Button className="w-full gap-2">
                <BookOpen className="h-4 w-4" />
                Begin Course
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Related Topics</h2>
            <div className="space-y-2">
              {${topic.replace(/-/g, '')}.relatedTopics?.map((topic, index) => (
                <Button key={index} variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/dashboard/learning/endgame/\${topic}`}>
                    {topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Link>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}`

// Generate pages for each topic
topics.forEach(topic => {
  const dir = path.join('app/dashboard/learning/endgame', topic)
  const file = path.join(dir, 'page.tsx')
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  fs.writeFileSync(file, template(topic))
})

console.log('Generated all endgame topic pages') 