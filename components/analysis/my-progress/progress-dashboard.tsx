"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, BookOpen } from "lucide-react"

// We'll use recharts for the visualizations
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  {
    topic: "Openings",
    progress: 65,
    total: 100,
  },
  {
    topic: "Middlegame",
    progress: 45,
    total: 100,
  },
  {
    topic: "Endgame",
    progress: 80,
    total: 100,
  },
  {
    topic: "Tactics",
    progress: 70,
    total: 100,
  },
  {
    topic: "Strategy",
    progress: 55,
    total: 100,
  },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="bg-background p-3">
        <p className="font-medium">{label}</p>
        <p className="text-[14px] --sm text-muted-foreground">
          Progress: {payload[0].value}%
        </p>
      </Card>
    )
  }
  return null
}

export function ProgressDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Topic Progress</h3>
          <p className="text-[14px] --sm text-muted-foreground">
            Your progress across different chess topics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Learn
          </Button>
          <Button size="sm">
            <Play className="mr-2 h-4 w-4" />
            Practice
          </Button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="topic"
              className="text-[14px] --sm"
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis
              className="text-[14px] --sm"
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="progress"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 