"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Clock,
  Target,
  Swords,
  Brain,
  TrendingUp,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

interface StatisticProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

function Statistic({ title, value, icon, trend }: StatisticProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-muted rounded-lg">{icon}</div>
      <div className="flex-1">
        <div className="text-[14px] --sm font-medium text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div
            className={`text-[14px] --sm flex items-center ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
    </div>
  )
}

export function GameStatistics() {
  const timeControlStats = [
    { type: "Bullet", games: 250, winRate: 62 },
    { type: "Blitz", games: 500, winRate: 58 },
    { type: "Rapid", games: 150, winRate: 65 },
    { type: "Classical", games: 50, winRate: 70 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Key Statistics</h3>
        <div className="space-y-4">
          <Statistic
            title="Total Games"
            value="1,234"
            icon={<Trophy className="h-4 w-4 text-yellow-600" />}
            trend={{ value: 12, isPositive: true }}
          />
          <Statistic
            title="Win Rate"
            value="65%"
            icon={<Target className="h-4 w-4 text-green-600" />}
            trend={{ value: 5, isPositive: true }}
          />
          <Statistic
            title="Average Rating"
            value="1850"
            icon={<Brain className="h-4 w-4 text-blue-600" />}
            trend={{ value: 25, isPositive: true }}
          />
          <Statistic
            title="Longest Streak"
            value="8 wins"
            icon={<TrendingUp className="h-4 w-4 text-purple-600" />}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Time Control Performance</h3>
        <div className="space-y-4">
          {timeControlStats.map((stat) => (
            <div key={stat.type} className="space-y-2">
              <div className="flex justify-between text-[14px] --sm">
                <span className="font-medium">{stat.type}</span>
                <span className="text-muted-foreground">{stat.games} games</span>
              </div>
              <Progress value={stat.winRate} className="h-2" />
              <div className="flex justify-between text-[14px] --sm">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="font-medium text-green-600">
                  {stat.winRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Recent Achievements</h3>
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <div className="font-medium">First Classical Win</div>
                <div className="text-[14px] --sm text-muted-foreground">
                  Won against 2000+ rated player
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Swords className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Winning Streak</div>
                <div className="text-[14px] --sm text-muted-foreground">
                  8 consecutive wins in Blitz
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Time Management</div>
                <div className="text-[14px] --sm text-muted-foreground">
                  90% time efficiency in last 10 games
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 