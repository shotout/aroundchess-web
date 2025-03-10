"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Target,
  Play,
  Trophy,
  Swords,
  Crown,
  Brain,
} from "lucide-react"

const recommendations = [
  {
    id: 1,
    title: "Master the Sicilian Defense",
    description: "Your win rate with Black is lower. Focus on this popular defense.",
    category: "Opening",
    difficulty: "Intermediate",
    timeEstimate: "2 weeks",
    icon: Crown,
    color: "text-blue-500",
  },
  {
    id: 2,
    title: "Tactical Pattern Recognition",
    description: "Improve your tactical vision with these curated exercises.",
    category: "Tactics",
    difficulty: "Advanced",
    timeEstimate: "1 week",
    icon: Swords,
    color: "text-purple-500",
  },
  {
    id: 3,
    title: "Endgame Fundamentals",
    description: "Master essential king and pawn endgames.",
    category: "Endgame",
    difficulty: "Beginner",
    timeEstimate: "3 weeks",
    icon: Crown,
    color: "text-yellow-500",
  },
  {
    id: 4,
    title: "Strategic Planning",
    description: "Learn to create and execute long-term plans.",
    category: "Strategy",
    difficulty: "Intermediate",
    timeEstimate: "4 weeks",
    icon: Brain,
    color: "text-green-500",
  },
]

function RecommendationCard({ recommendation }: { recommendation: typeof recommendations[0] }) {
  const Icon = recommendation.icon

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-muted ${recommendation.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">{recommendation.title}</h4>
              <p className="text-sm text-muted-foreground">
                {recommendation.category} • {recommendation.difficulty}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Target className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {recommendation.description}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Est. Time: {recommendation.timeEstimate}
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Learn
            </Button>
            <Button size="sm">
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function LearningRecommendations() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Personalized Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            Tailored suggestions to improve your game
          </p>
        </div>
        <Button variant="outline">
          <Trophy className="mr-2 h-4 w-4" />
          View All Courses
        </Button>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="grid gap-4">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 