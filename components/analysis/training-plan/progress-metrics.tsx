"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Brain,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart2,
} from "lucide-react"

interface Metric {
  label: string
  value: number
  target: number
  icon: any
  color: string
}

const metrics: Metric[] = [
  {
    label: "Tactical Accuracy",
    value: 85,
    target: 90,
    icon: Target,
    color: "blue",
  },
  {
    label: "Opening Proficiency",
    value: 75,
    target: 85,
    icon: Brain,
    color: "green",
  },
  {
    label: "Time Management",
    value: 70,
    target: 80,
    icon: Clock,
    color: "yellow",
  },
  {
    label: "Endgame Technique",
    value: 65,
    target: 75,
    icon: CheckCircle,
    color: "purple",
  },
]

const performanceStats = [
  {
    label: "Games Won",
    value: 65,
    trend: "+5%",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    label: "Accuracy",
    value: 82,
    trend: "+3%",
    icon: BarChart2,
    color: "text-blue-500",
  },
  {
    label: "Mistakes",
    value: -15,
    trend: "-20%",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    label: "Blunders",
    value: -8,
    trend: "-30%",
    icon: XCircle,
    color: "text-red-500",
  },
]

export function ProgressMetrics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Performance Metrics</h3>
        <p className="text-[14px] --sm text-muted-foreground">
          Track your progress across different aspects
        </p>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          <div className="grid gap-4">
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <metric.icon className={`h-4 w-4 text-${metric.color}-500`} />
                      <span className="font-medium">{metric.label}</span>
                    </div>
                    <span className="text-[14px] --sm font-medium">
                      {metric.value}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Progress
                      value={(metric.value / metric.target) * 100}
                      className={`h-2 bg-${metric.color}-100`}
                    />
                    <div className="flex justify-between text-[14px] --xs text-muted-foreground">
                      <span>Current</span>
                      <span>Target: {metric.target}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Last 30 days improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {performanceStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center space-x-2 p-2 rounded-lg border"
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <div>
                      <div className="text-[14px] --sm font-medium">
                        {stat.label}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold">
                          {Math.abs(stat.value)}
                        </span>
                        <span className={`text-[14px] --xs ${stat.color}`}>
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
} 