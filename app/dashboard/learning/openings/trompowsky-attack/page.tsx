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
import { trompowskyAttack } from "@/components/analysis/training-plan/training-topics/openings/trompowsky-attack"
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

export default function TrompowskyAttackPage() {
  const [currentVariation, setCurrentVariation] = useState(trompowskyAttack.variations[0])
  const [game, setGame] = useState<Chess>(new Chess())
  const [position, setPosition] = useState("rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq - 3 2")

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
    const newGame = new Chess("rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq - 3 2")
    setGame(newGame)
    setPosition(newGame.fen())
  }

  useEffect(() => {
    resetPosition()
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/learning/openings">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">Trompowsky Attack</h2>
            <Badge variant="secondary">{trompowskyAttack.difficulty}</Badge>
          </div>
          <p className="text-muted-foreground">
            {trompowskyAttack.description}
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={resetPosition}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Position</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mx-auto" style={{ width: '100%', maxWidth: '500px' }}>
            <Chessboard
              position={position}
              boardSize={500}
              isDraggable={true}
              onPieceDrop={onDrop}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Objectives
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {trompowskyAttack.objectives.map((objective, index) => (
                <li key={index} className="text-muted-foreground">{objective}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Prerequisites
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {trompowskyAttack.prerequisites?.map((prerequisite, index) => (
                <li key={index} className="text-muted-foreground">{prerequisite}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="variations">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="variations">Variations</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="variations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trompowskyAttack.variations.map((variation, index) => (
              <Card
                key={index}
                className={`p-4 cursor-pointer transition-colors ${
                  currentVariation.name === variation.name
                    ? "border-primary"
                    : ""
                }`}
                onClick={() => setCurrentVariation(variation)}
              >
                <h4 className="font-semibold">{variation.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {variation.moves}
                </p>
              </Card>
            ))}
          </div>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">{currentVariation.name}</h3>
            <p className="text-muted-foreground mb-4">
              {currentVariation.description}
            </p>
            <h4 className="font-semibold mb-2">Key Ideas:</h4>
            <ul className="list-disc list-inside space-y-1">
              {currentVariation.keyIdeas.map((idea, index) => (
                <li key={index} className="text-muted-foreground">
                  {idea}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
        <TabsContent value="resources" className="space-y-4">
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {trompowskyAttack.resources.map((resource, index) => (
              <Card key={index} className="p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {resource.description}
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={resource.url} target="_blank">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Study
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
} 