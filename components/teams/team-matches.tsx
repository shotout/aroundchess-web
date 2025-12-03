"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Clock } from "lucide-react"

interface TeamMatchesProps {
  limit?: number
}

// Mock data - replace with real data from your backend
const mockMatches = [
  {
    id: 1,
    opponent: "Chess Masters",
    date: new Date("2024-03-25T15:00:00"),
    status: "upcoming",
    ourScore: null,
    opponentScore: null,
  },
  {
    id: 2,
    opponent: "Knight Riders",
    date: new Date("2024-03-20T14:00:00"),
    status: "completed",
    ourScore: 3,
    opponentScore: 2,
  },
  {
    id: 3,
    opponent: "Bishop Brigade",
    date: new Date("2024-03-15T16:30:00"),
    status: "completed",
    ourScore: 2,
    opponentScore: 4,
  },
  // Add more matches as needed
]

export function TeamMatches({ limit }: TeamMatchesProps) {
  const [matches] = useState(
    limit ? mockMatches.slice(0, limit) : mockMatches
  )

  const getStatusBadge = (status: string, ourScore: number | null, opponentScore: number | null) => {
    if (status === "upcoming") {
      return <Badge variant="outline">Upcoming</Badge>
    }
    
    if (ourScore === null || opponentScore === null) {
      return <Badge variant="secondary">Pending</Badge>
    }

    if (ourScore > opponentScore) {
      return <Badge className="bg-green-500">Won</Badge>
    }

    if (ourScore < opponentScore) {
      return <Badge variant="destructive">Lost</Badge>
    }

    return <Badge variant="secondary">Draw</Badge>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Team Matches</CardTitle>
        {!limit && (
          <Button variant="outline" size="sm">
            Schedule Match
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">vs {match.opponent}</span>
                  {getStatusBadge(match.status, match.ourScore, match.opponentScore)}
                </div>
                <div className="flex items-center gap-4 text-[14px] --sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(match.date, "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(match.date, "h:mm a")}
                  </div>
                </div>
              </div>
              {match.status === "completed" && (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">
                    {match.ourScore} - {match.opponentScore}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        {limit && (
          <Button variant="link" className="mt-4 w-full">
            View All Matches
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 