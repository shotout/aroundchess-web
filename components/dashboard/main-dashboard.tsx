import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Clock, Award, Star, CalendarIcon, FilterIcon } from 'lucide-react'
import { useState } from "react"
import { format, isAfter } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function MainDashboard() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const handleFilter = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates")
      return
    }

    if (isAfter(startDate, endDate)) {
      toast.error("Start date cannot be after end date")
      return
    }

    toast.success("Filtering data...")
  }

  return (
    <div className="p-6">
      <div className="text-center mb-8 pt-4">
        <h1 className="text-3xl font-bold mb-2">Welcome, User!</h1>
        <p className="text-muted-foreground">Here's your comprehensive chess performance overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="w-full">
          <p className="text-[14px] --sm text-muted-foreground mb-2">Start Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full">
          <p className="text-[14px] --sm text-muted-foreground mb-2">End Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Overall Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <p className="text-[14px] --sm text-muted-foreground">Total Games</p>
                <p className="text-3xl font-bold mt-2">0</p>
                <p className="text-[14px] --xs text-muted-foreground mt-1">Lifetime matches</p>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <p className="text-[14px] --sm text-muted-foreground">Win Rate</p>
                <p className="text-3xl font-bold text-green-500 mt-2">0.00%</p>
                <p className="text-[14px] --xs text-muted-foreground mt-1">Victory percentage</p>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <p className="text-[14px] --sm text-muted-foreground">Average Rating</p>
                <p className="text-3xl font-bold text-blue-500 mt-2">0</p>
                <p className="text-[14px] --xs text-muted-foreground mt-1">Current performance</p>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <p className="text-[14px] --sm text-muted-foreground">Best Rating</p>
                <p className="text-3xl font-bold text-purple-500 mt-2">N/A</p>
                <p className="text-[14px] --xs text-muted-foreground mt-1">Peak performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Win Rate Chart
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Game type distribution will be displayed here
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            Rating History Chart
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6 mb-64">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[14px] --sm text-muted-foreground">No recent games to display</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Chess News</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[14px] --sm text-muted-foreground">No recent news to display</p>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Tactics & Puzzles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[14px] --sm text-muted-foreground">Tactics and puzzles statistics will be displayed here</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Daily Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[14px] --sm text-muted-foreground">Check here for daily chess tips and strategies</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, change }: { title: string; value: string; icon: React.ReactNode; change?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-[14px] --sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && <p className={`text-[14px] --sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>}
        </div>
        {icon}
      </CardContent>
    </Card>
  )
}

