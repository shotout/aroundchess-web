"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Overview } from "@/components/analysis/training-plan/overview"
import { RecentGames } from "@/components/analysis/training-plan/recent-games"
import { DailyPlan } from "@/components/analysis/training-plan/daily-plan"
import { WeeklyPlan } from "@/components/analysis/training-plan/weekly-plan"
import { GoalSetting } from "@/components/analysis/training-plan/goal-setting"
import { ProgressMetrics } from "@/components/analysis/training-plan/progress-metrics"
import { GameAnalysis } from "@/components/analysis/training-plan/game-analysis"
import { CreatePlanModal } from "@/components/analysis/training-plan/create-plan-modal"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Calendar,
  BarChart2,
  Target,
  Crown,
  Trophy,
  Clock,
  BookOpen
} from "lucide-react"

export default function TrainingPlanPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Training Plan</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <CreatePlanModal />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Plan</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Plan</TabsTrigger>
          <TabsTrigger value="analysis">Game Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-[14px] --sm font-medium">Current Rating</span>
              </div>
              <div className="mt-2 text-2xl font-bold">1850</div>
              <p className="text-[14px] --xs text-muted-foreground">+25 this month</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-[14px] --sm font-medium">Training Days</span>
              </div>
              <div className="mt-2 text-2xl font-bold">15/30</div>
              <p className="text-[14px] --xs text-muted-foreground">50% completion</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-4 w-4 text-yellow-600" />
                <span className="text-[14px] --sm font-medium">Accuracy</span>
              </div>
              <div className="mt-2 text-2xl font-bold">85%</div>
              <p className="text-[14px] --xs text-muted-foreground">+5% improvement</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-red-600" />
                <span className="text-[14px] --sm font-medium">Goals Met</span>
              </div>
              <div className="mt-2 text-2xl font-bold">8/10</div>
              <p className="text-[14px] --xs text-muted-foreground">80% success rate</p>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <div className="p-6">
                <Overview />
              </div>
            </Card>
            <Card className="col-span-3">
              <div className="p-6">
                <RecentGames />
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <DailyPlan />
            </Card>
            <Card>
              <ProgressMetrics />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <WeeklyPlan />
            </Card>
            <Card>
              <GoalSetting />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <GameAnalysis />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 