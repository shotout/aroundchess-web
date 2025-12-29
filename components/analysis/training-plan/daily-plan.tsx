"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Brain,
  Target,
  Swords,
  BookOpen,
} from "lucide-react"

interface TrainingActivity {
  id: string
  title: string
  type: string
  duration: number
  completed: boolean
  description: string
  timeSlot: string
  icon: any
}

const dailyActivities: TrainingActivity[] = [
  {
    id: "1",
    title: "Tactical Puzzles",
    type: "Tactics",
    duration: 30,
    completed: true,
    description: "Solve 20 tactical puzzles focusing on pin and fork patterns",
    timeSlot: "09:00 - 09:30",
    icon: Target,
  },
  {
    id: "2",
    title: "Opening Study",
    type: "Opening",
    duration: 45,
    completed: true,
    description: "Review and practice Sicilian Defense main lines",
    timeSlot: "10:00 - 10:45",
    icon: BookOpen,
  },
  {
    id: "3",
    title: "Practice Games",
    type: "Games",
    duration: 60,
    completed: false,
    description: "Play 3 rapid games (15+10) applying opening knowledge",
    timeSlot: "11:00 - 12:00",
    icon: Swords,
  },
  {
    id: "4",
    title: "Endgame Training",
    type: "Endgame",
    duration: 45,
    completed: false,
    description: "Practice rook endgames with focus on Lucena position",
    timeSlot: "14:00 - 14:45",
    icon: Brain,
  },
]

export function DailyPlan() {
  const [activities, setActivities] = useState<TrainingActivity[]>(dailyActivities)
  
  const completedActivities = activities.filter(activity => activity.completed).length
  const totalActivities = activities.length
  const progressPercentage = (completedActivities / totalActivities) * 100

  const toggleActivity = (id: string) => {
    setActivities(activities.map(activity =>
      activity.id === id
        ? { ...activity, completed: !activity.completed }
        : activity
    ))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Today's Training Plan</h3>
        <div className="flex items-center mt-2 space-x-2">
          <Progress value={progressPercentage} className="w-full" />
          <span className="text-[14px] --sm font-medium">{progressPercentage.toFixed(0)}%</span>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <activity.icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{activity.title}</h4>
                      <Badge variant={activity.completed ? "default" : "secondary"}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-[14px] --sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-[14px] --sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {activity.timeSlot}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {activity.duration} min
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActivity(activity.id)}
                >
                  {activity.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 