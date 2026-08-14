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
  Brain,
  GraduationCap,
  Target,
  TrendingUp,
  BookOpen,
  Swords,
  Crown,
  Lightbulb,
  BarChart2
} from "lucide-react"
import { useState } from "react"

import { ProgressDashboard } from "@/components/analysis/my-progress/progress-dashboard"
import { SkillDistribution } from "@/components/analysis/my-progress/skill-distribution"
import { ProgressTimeline } from "@/components/analysis/my-progress/progress-timeline"
import { LearningRecommendations } from "@/components/analysis/my-progress/learning-recommendations"
import { DetailedAnalytics } from "@/components/analysis/my-progress/detailed-analytics"

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("last30")
  const [skillFocus, setSkillFocus] = useState("all")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Progress</h2>
        <div className="flex items-center space-x-2">
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
          <Button>
            <BookOpen className="mr-2 h-4 w-4" />
            View Study Plan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-blue-600" />
            <span className="text-[14px] --sm font-medium">Overall Progress</span>
          </div>
          <div className="mt-2 text-2xl font-bold">75%</div>
          <p className="text-[14px] --xs text-muted-foreground">+15% this month</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-[14px] --sm font-medium">Goals Completed</span>
          </div>
          <div className="mt-2 text-2xl font-bold">12/15</div>
          <p className="text-[14px] --xs text-muted-foreground">80% completion rate</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-yellow-600" />
            <span className="text-[14px] --sm font-medium">Rating Progress</span>
          </div>
          <div className="mt-2 text-2xl font-bold">+120</div>
          <p className="text-[14px] --xs text-muted-foreground">Last 30 days</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-purple-600" />
            <span className="text-[14px] --sm font-medium">Learning Streak</span>
          </div>
          <div className="mt-2 text-2xl font-bold">15 days</div>
          <p className="text-[14px] --xs text-muted-foreground">Personal best!</p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <div className="p-6">
                <ProgressDashboard />
              </div>
            </Card>
            <Card className="col-span-3">
              <div className="p-6">
                <SkillDistribution />
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <div className="p-6">
              <DetailedAnalytics />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <div className="p-6">
              <ProgressTimeline />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <div className="p-6">
              <LearningRecommendations />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 