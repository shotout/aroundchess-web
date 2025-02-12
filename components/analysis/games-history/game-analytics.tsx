"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const ratingHistory = [
  { date: "Jan", rating: 1500 },
  { date: "Feb", rating: 1550 },
  { date: "Mar", rating: 1525 },
  { date: "Apr", rating: 1600 },
  { date: "May", rating: 1575 },
  { date: "Jun", rating: 1650 },
]

const resultDistribution = [
  { name: "Wins", value: 150, color: "#22c55e" },
  { name: "Draws", value: 50, color: "#eab308" },
  { name: "Losses", value: 100, color: "#ef4444" },
]

const openingStats = [
  { name: "Sicilian Defense", games: 45, winRate: 65 },
  { name: "Queen's Gambit", games: 38, winRate: 58 },
  { name: "Ruy Lopez", games: 32, winRate: 62 },
  { name: "French Defense", games: 28, winRate: 55 },
  { name: "King's Indian", games: 25, winRate: 60 },
]

export function GameAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Rating Progress</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={["dataMin - 100", "dataMax + 100"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Result Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resultDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resultDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Opening Statistics</h3>
          <div className="space-y-2">
            {openingStats.map((opening) => (
              <div key={opening.name} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{opening.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {opening.games} games
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    {opening.winRate}% win rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Performance Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="text-sm font-medium">Average Game Length</div>
            <div className="text-2xl font-bold mt-1">35 moves</div>
            <div className="text-xs text-muted-foreground">
              +3 moves from last month
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium">Time Management</div>
            <div className="text-2xl font-bold mt-1">85%</div>
            <div className="text-xs text-muted-foreground">
              Efficient time usage
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium">Accuracy</div>
            <div className="text-2xl font-bold mt-1">92%</div>
            <div className="text-xs text-muted-foreground">
              Top moves played
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm font-medium">Blunder Rate</div>
            <div className="text-2xl font-bold mt-1">3.5%</div>
            <div className="text-xs text-muted-foreground">
              -1.2% from last month
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 