"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Target, Book, ChevronLeft, RotateCcw } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { queensGambit } from "@/components/analysis/training-plan/training-topics/openings/queens-gambit"
import { Chess, Square } from "chess.js"
import { OpeningIdeas, openingIdeas } from "@/components/learn/opening-theory/OpeningIdeas"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChessboardProps {
  position: string
  boardSize: number
  isDraggable: boolean
  onPieceDrop?: (sourceSquare: Square, targetSquare: Square, piece: string) => boolean
}

const Chessboard = dynamic<ChessboardProps>(() => import("@/components/chess/chessboard"), {
  ssr: false,
})

export default function QueensGambitPage() {
  const [currentVariation, setCurrentVariation] = useState(queensGambit.variations[0])
  const [game, setGame] = useState<Chess>(new Chess())
  const [position, setPosition] = useState("rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2")

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
    const newGame = new Chess("rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2")
    setGame(newGame)
    setPosition(newGame.fen())
  }

  useEffect(() => {
    resetPosition()
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/learning/openings">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{queensGambit.title}</h1>
          <p className="text-muted-foreground">{queensGambit.description}</p>
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
            
            <OpeningIdeas ideas={openingIdeas['queens-gambit']} />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{queensGambit.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{queensGambit.estimatedTime}</span>
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
                      <p>Reset to initial position (after 1.d4 d5 2.c4)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="variations" className="flex-1">Variations</TabsTrigger>
                  <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>
                      <ul className="space-y-2">
                        {queensGambit.objectives.map((objective, index) => (
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
                        {queensGambit.prerequisites?.map((prereq, index) => (
                          <Badge key={index} variant="outline">{prereq}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variations" className="space-y-4">
                  {queensGambit.variations.map((variation, index) => (
                    <Card
                      key={index}
                      className={`p-4 cursor-pointer hover:bg-accent ${
                        currentVariation.name === variation.name ? "border-primary" : ""
                      }`}
                      onClick={() => setCurrentVariation(variation)}
                    >
                      <h3 className="font-semibold mb-2">{variation.name}</h3>
                      <p className="text-[14px] --sm text-muted-foreground mb-2">{variation.description}</p>
                      <div className="space-y-1">
                        {variation.keyIdeas.map((idea, ideaIndex) => (
                          <div key={ideaIndex} className="text-[14px] --sm flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span>{idea}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  {queensGambit.resources.map((resource, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-4">
                        <Book className="h-5 w-5 mt-1" />
                        <div>
                          <h3 className="font-semibold">{resource.title}</h3>
                          <p className="text-[14px] --sm text-muted-foreground">{resource.description}</p>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[14px] --sm text-primary hover:underline"
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
            <Button className="w-full gap-2">
              <BookOpen className="h-4 w-4" />
              Begin Course
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Related Topics</h2>
            <div className="space-y-2">
              {queensGambit.relatedTopics?.map((topic, index) => (
                <Button key={index} variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/dashboard/learning/openings/${topic}`}>
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
} 