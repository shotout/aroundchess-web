"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, BookOpen } from "lucide-react"
import { trainingTopics } from "@/components/analysis/training-plan/create-plan-modal"
import dynamic from "next/dynamic"
import Link from "next/link"
import { openingPositions } from "@/components/analysis/training-plan/training-topics/openings/positions"

const Chessboard = dynamic(() => import("@/components/chess/chessboard"), {
  ssr: false,
})

export default function OpeningsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([])

  const difficultyLevels = [
    { label: 'Beginner', elo: '0-1200', color: 'bg-green-100' },
    { label: 'Intermediate', elo: '1200-1800', color: 'bg-blue-100' },
    { label: 'Advanced', elo: '1800-2200', color: 'bg-purple-100' },
    { label: 'Expert', elo: '2200+', color: 'bg-red-100' }
  ]

  const handleDifficultyToggle = (difficulty: string) => {
    setSelectedDifficulty((prev) => {
      if (prev.includes(difficulty)) {
        return prev.filter((d) => d !== difficulty)
      }
      return [...prev, difficulty]
    })
  }

  const filterTopicsByDifficulty = (topics: any[]) => {
    if (selectedDifficulty.length === 0) return topics
    return topics.filter((topic) => selectedDifficulty.includes(topic.difficulty))
  }

  const filterTopicsBySearch = (topics: any[]) => {
    if (!searchQuery) return filterTopicsByDifficulty(topics)
    return filterTopicsByDifficulty(topics).filter(topic =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getOpeningPosition = (topicId: string) => {
    return openingPositions[topicId] || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Opening Theory</h2>
          <p className="text-muted-foreground">
            Master the first phase of the game with our comprehensive opening lessons
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search openings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {difficultyLevels.map((level) => (
            <Button
              key={level.label}
              variant="outline"
              className={`${selectedDifficulty.includes(level.label) ? level.color : ""}`}
              onClick={() => handleDifficultyToggle(level.label)}
            >
              {level.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterTopicsBySearch(Object.values(trainingTopics.openings)).map((topic) => (
          <Card key={topic.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div style={{ width: '100%', maxWidth: '280px', aspectRatio: '1/1' }}>
                <Chessboard
                  position={getOpeningPosition(topic.id)}
                  boardSize={280}
                  isDraggable={false}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{topic.title}</h3>
                <Badge variant="secondary">{topic.difficulty}</Badge>
              </div>
              <Link href={`/dashboard/learning/openings/${topic.id}`}>
                <Button className="w-full gap-2">
                  <BookOpen className="h-4 w-4" />
                  Start Learning
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 