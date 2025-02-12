"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Brain,
  Target,
  Swords,
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react"

interface WeeklyActivity {
  day: string
  activities: {
    type: string
    title: string
    duration: number
    completed: boolean
    icon: any
  }[]
  progress: number
}

const weeklySchedule: WeeklyActivity[] = [
  {
    day: "Monday",
    activities: [
      {
        type: "Tactics",
        title: "Pattern Recognition",
        duration: 45,
        completed: true,
        icon: Target,
      },
      {
        type: "Opening",
        title: "Sicilian Defense",
        duration: 60,
        completed: true,
        icon: BookOpen,
      },
    ],
    progress: 100,
  },
  {
    day: "Tuesday",
    activities: [
      {
        type: "Games",
        title: "Practice Matches",
        duration: 90,
        completed: true,
        icon: Swords,
      },
      {
        type: "Endgame",
        title: "Rook Endings",
        duration: 45,
        completed: false,
        icon: Brain,
      },
    ],
    progress: 50,
  },
  {
    day: "Wednesday",
    activities: [
      {
        type: "Tactics",
        title: "Calculation Training",
        duration: 60,
        completed: false,
        icon: Target,
      },
      {
        type: "Opening",
        title: "Repertoire Review",
        duration: 45,
        completed: false,
        icon: BookOpen,
      },
    ],
    progress: 0,
  },
  {
    day: "Thursday",
    activities: [
      {
        type: "Games",
        title: "Tournament Prep",
        duration: 120,
        completed: false,
        icon: Swords,
      },
    ],
    progress: 0,
  },
  {
    day: "Friday",
    activities: [
      {
        type: "Tactics",
        title: "Complex Puzzles",
        duration: 60,
        completed: false,
        icon: Target,
      },
      {
        type: "Endgame",
        title: "Pawn Endings",
        duration: 45,
        completed: false,
        icon: Brain,
      },
    ],
    progress: 0,
  },
]

export function WeeklyPlan() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Weekly Training Schedule</h3>
        <p className="text-sm text-muted-foreground">
          Your training plan for this week
        </p>
      </div>

      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Day</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead className="text-right">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weeklySchedule.map((day) => (
              <TableRow key={day.day}>
                <TableCell className="font-medium">{day.day}</TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {day.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border rounded-lg p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <activity.icon className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">
                                {activity.title}
                              </span>
                              <Badge variant={activity.completed ? "default" : "secondary"}>
                                {activity.type}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{activity.duration} min</span>
                            </div>
                          </div>
                        </div>
                        {activity.completed && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Progress value={day.progress} className="w-[60px]" />
                    <span className="text-sm font-medium">
                      {day.progress}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
} 