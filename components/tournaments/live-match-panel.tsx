"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Timer, ChevronUp, ChevronDown } from "lucide-react"

const mockLiveMatch = {
  id: 1,
  team1: {
    name: "Chess Masters",
    score: 2,
    timeLeft: "12:30",
  },
  team2: {
    name: "Knight Riders",
    score: 2,
    timeLeft: "08:45",
  },
  currentMove: 24,
  lastMove: "e4",
  moveQuality: "good",
}

export function LiveMatchPanel() {
  const [isExpanded, setIsExpanded] = useState(true)

  const getMoveQualityBadge = (quality: string) => {
    switch (quality) {
      case "best":
        return <Badge className="bg-green-500">Best Move</Badge>
      case "good":
        return <Badge className="bg-blue-500">Good Move</Badge>
      case "inaccuracy":
        return <Badge className="bg-yellow-500">Inaccuracy</Badge>
      case "mistake":
        return <Badge className="bg-orange-500">Mistake</Badge>
      case "blunder":
        return <Badge className="bg-red-500">Blunder</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[14px] --sm font-medium">Live Match</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{mockLiveMatch.team1.name}</p>
                  <div className="flex items-center gap-2 text-[14px] --sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    {mockLiveMatch.team1.timeLeft}
                  </div>
                </div>
                <span className="text-2xl font-bold">{mockLiveMatch.team1.score}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{mockLiveMatch.team2.name}</p>
                  <div className="flex items-center gap-2 text-[14px] --sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    {mockLiveMatch.team2.timeLeft}
                  </div>
                </div>
                <span className="text-2xl font-bold">{mockLiveMatch.team2.score}</span>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center justify-between text-[14px] --sm">
                  <span>Move {mockLiveMatch.currentMove}</span>
                  <span>Last: {mockLiveMatch.lastMove}</span>
                </div>
                <div className="flex items-center justify-between">
                  {getMoveQualityBadge(mockLiveMatch.moveQuality)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
} 