"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Plus,
} from "lucide-react"

interface Goal {
  id: string
  title: string
  type: "Short-term" | "Mid-term" | "Long-term"
  target: string
  deadline: string
  progress: number
  completed: boolean
}

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Reach 2000 Rating",
    type: "Long-term",
    target: "2000",
    deadline: "2024-12-31",
    progress: 35,
    completed: false,
  },
  {
    id: "2",
    title: "Master Sicilian Defense",
    type: "Mid-term",
    target: "Complete repertoire",
    deadline: "2024-06-30",
    progress: 60,
    completed: false,
  },
  {
    id: "3",
    title: "Solve 500 Puzzles",
    type: "Short-term",
    target: "500 puzzles",
    deadline: "2024-03-31",
    progress: 80,
    completed: false,
  },
]

export function GoalSetting() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id" | "progress" | "completed">>({
    title: "",
    type: "Short-term",
    target: "",
    deadline: "",
  })

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target && newGoal.deadline) {
      setGoals([
        ...goals,
        {
          id: (goals.length + 1).toString(),
          ...newGoal,
          progress: 0,
          completed: false,
        },
      ])
      setNewGoal({
        title: "",
        type: "Short-term",
        target: "",
        deadline: "",
      })
    }
  }

  const toggleGoalCompletion = (id: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 }
          : goal
      )
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Training Goals</h3>
        <p className="text-sm text-muted-foreground">
          Set and track your chess improvement goals
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <Input
            placeholder="Goal title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />
          <Select
            value={newGoal.type}
            onValueChange={(value) =>
              setNewGoal({ ...newGoal, type: value as Goal["type"] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Goal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Short-term">Short-term (1 month)</SelectItem>
              <SelectItem value="Mid-term">Mid-term (6 months)</SelectItem>
              <SelectItem value="Long-term">Long-term (12 months)</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Target (e.g., rating, puzzles)"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          />
          <Input
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          />
          <Button onClick={handleAddGoal} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="p-4 border rounded-lg space-y-3"
              onClick={() => toggleGoalCompletion(goal.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{goal.title}</span>
                </div>
                <Badge
                  variant={goal.completed ? "default" : "secondary"}
                >
                  {goal.type}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} />
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Trophy className="h-3 w-3" />
                  <span>{goal.target}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{goal.deadline}</span>
                </div>
              </div>

              {goal.completed && (
                <div className="flex items-center justify-center text-green-500">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 