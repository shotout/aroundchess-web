"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Trophy,
  Filter,
  Download,
  Sword,
  Target,
  BarChart2,
  Swords
} from "lucide-react"
import { useState } from "react"

// Placeholder components to be implemented
import { GameStatistics } from "@/components/analysis/games-history/game-statistics"
import { GameHistoryTable } from "@/components/analysis/games-history/game-history-table"
import { GameAnalytics } from "@/components/analysis/games-history/game-analytics"
import { GamePerformance } from "@/components/analysis/games-history/game-performance"

export default function GameHistoryPage() {
  const [timeRange, setTimeRange] = useState("last30")
  const [timeControl, setTimeControl] = useState("all")
  const [color, setColor] = useState("both")
  const [result, setResult] = useState("all")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Game History</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Games
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 Days</SelectItem>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="last90">Last 90 Days</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeControl} onValueChange={setTimeControl}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Control" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="ultraBullet">Ultra Bullet</SelectItem>
              <SelectItem value="bullet">Bullet</SelectItem>
              <SelectItem value="blitz">Blitz</SelectItem>
              <SelectItem value="rapid">Rapid</SelectItem>
              <SelectItem value="classical">Classical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Both Colors</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="black">Black</SelectItem>
            </SelectContent>
          </Select>

          <Select value={result} onValueChange={setResult}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="win">Wins</SelectItem>
              <SelectItem value="draw">Draws</SelectItem>
              <SelectItem value="loss">Losses</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="default">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-green-600" />
            <span className="text-[14px] --sm font-medium">Win Rate</span>
          </div>
          <div className="mt-2 text-2xl font-bold">65%</div>
          <p className="text-[14px] --xs text-muted-foreground">+5% this month</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Sword className="h-4 w-4 text-blue-600" />
            <span className="text-[14px] --sm font-medium">Total Games</span>
          </div>
          <div className="mt-2 text-2xl font-bold">1,234</div>
          <p className="text-[14px] --xs text-muted-foreground">+45 this month</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-4 w-4 text-yellow-600" />
            <span className="text-[14px] --sm font-medium">Average Rating</span>
          </div>
          <div className="mt-2 text-2xl font-bold">1850</div>
          <p className="text-[14px] --xs text-muted-foreground">+25 points</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Swords className="h-4 w-4 text-red-600" />
            <span className="text-[14px] --sm font-medium">Best Win</span>
          </div>
          <div className="mt-2 text-2xl font-bold">2100</div>
          <p className="text-[14px] --xs text-muted-foreground">vs IM_ChessMaster</p>
        </Card>
      </div>

      <Tabs defaultValue="games" className="space-y-4">
        <TabsList>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="space-y-4">
          <Card>
            <GameHistoryTable />
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <div className="p-6">
                <GameAnalytics />
              </div>
            </Card>
            <Card className="col-span-3">
              <div className="p-6">
                <GameStatistics />
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <GamePerformance />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 