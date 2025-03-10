"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Brain, Target, Clock, Zap, Shield, Swords } from "lucide-react"

const performanceData = [
  {
    category: "Opening",
    score: 85,
    average: 75,
  },
  {
    category: "Middlegame",
    score: 78,
    average: 72,
  },
  {
    category: "Endgame",
    score: 82,
    average: 70,
  },
  {
    category: "Tactics",
    score: 88,
    average: 76,
  },
  {
    category: "Strategy",
    score: 75,
    average: 73,
  },
]

const skillsData = [
  {
    subject: "Calculation",
    A: 85,
    fullMark: 100,
  },
  {
    subject: "Positional",
    A: 75,
    fullMark: 100,
  },
  {
    subject: "Tactical",
    A: 90,
    fullMark: 100,
  },
  {
    subject: "Endgame",
    A: 82,
    fullMark: 100,
  },
  {
    subject: "Time Management",
    A: 78,
    fullMark: 100,
  },
  {
    subject: "Opening Knowledge",
    A: 85,
    fullMark: 100,
  },
]

const strengthsAndWeaknesses = [
  {
    category: "Strengths",
    items: [
      { title: "Tactical Vision", value: 92, icon: <Target className="h-4 w-4 text-green-600" /> },
      { title: "Opening Preparation", value: 88, icon: <Brain className="h-4 w-4 text-blue-600" /> },
      { title: "Time Management", value: 85, icon: <Clock className="h-4 w-4 text-yellow-600" /> },
    ],
  },
  {
    category: "Areas for Improvement",
    items: [
      { title: "Endgame Technique", value: 72, icon: <Shield className="h-4 w-4 text-red-600" /> },
      { title: "Positional Play", value: 75, icon: <Swords className="h-4 w-4 text-orange-600" /> },
      { title: "Defense", value: 78, icon: <Zap className="h-4 w-4 text-purple-600" /> },
    ],
  },
]

export function GamePerformance() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Performance by Game Phase</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#2563eb" name="Your Score" />
              <Bar dataKey="average" fill="#94a3b8" name="Average" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Skills Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Strengths & Weaknesses</h3>
          <div className="space-y-6">
            {strengthsAndWeaknesses.map((section) => (
              <div key={section.category}>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {section.category}
                </h4>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <Card key={item.title} className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-muted rounded-lg">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-sm text-muted-foreground">
                              {item.value}%
                            </span>
                          </div>
                          <Progress value={item.value} className="h-2" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Improvement Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium">Short-term Goals</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Practice endgame positions with rook and pawn</li>
                <li>Study positional pawn sacrifices</li>
                <li>Work on defensive techniques</li>
              </ul>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium">Training Focus</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Endgame studies (40%)</li>
                <li>Positional exercises (35%)</li>
                <li>Defensive puzzles (25%)</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 