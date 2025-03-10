"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, BookOpen } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

const data = [
  { name: "Opening", value: 30, color: "#0ea5e9" },
  { name: "Middlegame", value: 25, color: "#22c55e" },
  { name: "Endgame", value: 15, color: "#eab308" },
  { name: "Tactics", value: 20, color: "#ec4899" },
  { name: "Strategy", value: 10, color: "#8b5cf6" },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="bg-background p-3">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          Strength: {payload[0].value}%
        </p>
      </Card>
    )
  }
  return null
}

export function SkillDistribution() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Skill Distribution</h3>
          <p className="text-sm text-muted-foreground">
            Your relative strength in different areas
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Target className="mr-2 h-4 w-4" />
            Focus Areas
          </Button>
          <Button size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Study Plan
          </Button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value: string) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 