"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Target,
  TrendingUp,
  Clock,
  BarChart2,
  Download,
} from "lucide-react"
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

const skillData = [
  { skill: "Pattern Recognition", value: 85 },
  { skill: "Calculation", value: 75 },
  { skill: "Positional Play", value: 65 },
  { skill: "Opening Theory", value: 70 },
  { skill: "Endgame Technique", value: 80 },
  { skill: "Time Management", value: 60 },
]

const timeData = [
  { category: "Study", hours: 20 },
  { category: "Practice", hours: 15 },
  { category: "Analysis", hours: 10 },
  { category: "Tournament", hours: 8 },
  { category: "Coaching", hours: 5 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="bg-background p-3">
        <p className="font-medium">{label}</p>
        <p className="text-[14px] --sm text-muted-foreground">
          {payload[0].name}: {payload[0].value}
          {payload[0].name === "hours" ? " hours" : "%"}
        </p>
      </Card>
    )
  }
  return null
}

export function DetailedAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Detailed Analytics</h3>
          <p className="text-[14px] --sm text-muted-foreground">
            In-depth analysis of your chess skills and activities
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Skill Radar Chart */}
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium">Skill Breakdown</h4>
              <p className="text-[14px] --sm text-muted-foreground">
                Your proficiency across different aspects
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Brain className="mr-2 h-4 w-4" />
              Analyze
            </Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <Radar
                  name="Skill Level"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Time Distribution Chart */}
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium">Time Distribution</h4>
              <p className="text-[14px] --sm text-muted-foreground">
                Hours spent on different activities
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="category"
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--foreground))" }}
                  label={{
                    value: "Hours",
                    angle: -90,
                    position: "insideLeft",
                    fill: "hsl(var(--foreground))",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="hours"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Key Metrics */}
        <Card className="p-4 md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium">Key Performance Metrics</h4>
              <p className="text-[14px] --sm text-muted-foreground">
                Important indicators of your progress
              </p>
            </div>
            <Button variant="outline" size="sm">
              <BarChart2 className="mr-2 h-4 w-4" />
              Details
            </Button>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-[14px] --sm font-medium">Accuracy</span>
                </div>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-[14px] --xs text-muted-foreground">
                  +5% from last month
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-[14px] --sm font-medium">Win Rate</span>
                </div>
                <div className="text-2xl font-bold">65%</div>
                <p className="text-[14px] --xs text-muted-foreground">
                  +3% from last month
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="text-[14px] --sm font-medium">Learning Score</span>
                </div>
                <div className="text-2xl font-bold">850</div>
                <p className="text-[14px] --xs text-muted-foreground">
                  Top 10% of users
                </p>
              </div>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
} 