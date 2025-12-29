"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Download } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

const data = [
  { date: "Jan 1", rating: 1200, milestone: "Started Training" },
  { date: "Jan 15", rating: 1250 },
  { date: "Feb 1", rating: 1300, milestone: "First Tournament" },
  { date: "Feb 15", rating: 1280 },
  { date: "Mar 1", rating: 1350, milestone: "Completed Tactics Course" },
  { date: "Mar 15", rating: 1400 },
  { date: "Apr 1", rating: 1450, milestone: "Won Local Tournament" },
  { date: "Apr 15", rating: 1500 },
]

const milestones = data.filter((item) => item.milestone)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const milestone = milestones.find((m) => m.date === label)?.milestone
    return (
      <Card className="bg-background p-3">
        <p className="font-medium">{label}</p>
        <p className="text-[14px] --sm text-muted-foreground">
          Rating: {payload[0].value}
        </p>
        {milestone && (
          <p className="mt-1 text-[14px] --xs text-primary">{milestone}</p>
        )}
      </Card>
    )
  }
  return null
}

export function ProgressTimeline() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Progress Timeline</h3>
          <p className="text-[14px] --sm text-muted-foreground">
            Your rating progression and key milestones
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Change Range
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-[14px] --sm"
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis
              className="text-[14px] --sm"
              tick={{ fill: "hsl(var(--foreground))" }}
              domain={["dataMin - 100", "dataMax + 100"]}
            />
            <Tooltip content={<CustomTooltip />} />
            {milestones.map((milestone, index) => (
              <ReferenceLine
                key={index}
                x={milestone.date}
                stroke="hsl(var(--primary))"
                strokeDasharray="3 3"
              />
            ))}
            <Line
              type="monotone"
              dataKey="rating"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 