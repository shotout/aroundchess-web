"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Calendar, Layout, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TournamentGamesProps {
  limit?: number
}

const mockGames = [
  {
    id: 1,
    team1: "Chess Masters",
    team2: "Knight Riders",
    date: new Date("2024-03-25T15:00:00"),
    status: "completed",
    result: "3-2",
    isStarred: true,
  },
  {
    id: 2,
    team1: "Bishop Brigade",
    team2: "Pawn Stars",
    date: new Date("2024-03-26T14:00:00"),
    status: "live",
    result: "2-2",
    isStarred: false,
  },
  {
    id: 3,
    team1: "Rook Warriors",
    team2: "Queen's Gambit",
    date: new Date("2024-03-27T16:30:00"),
    status: "upcoming",
    result: null,
    isStarred: false,
  },
]

export function TournamentGames({ limit }: TournamentGamesProps) {
  const [games, setGames] = useState(
    limit ? mockGames.slice(0, limit) : mockGames
  )

  const toggleStar = (gameId: number) => {
    setGames(games.map(game => 
      game.id === gameId ? { ...game, isStarred: !game.isStarred } : game
    ))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "live":
        return <Badge className="bg-green-500">Live</Badge>
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {game.team1} vs {game.team2}
                  </span>
                  {getStatusBadge(game.status)}
                </div>
                <div className="flex items-center gap-4 text-[14px] --sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(game.date, "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(game.date, "h:mm a")}
                  </div>
                  {game.result && (
                    <div className="flex items-center gap-1">
                      <Layout className="h-4 w-4" />
                      {game.result}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleStar(game.id)}
                  className={game.isStarred ? "text-yellow-500" : "text-gray-400"}
                >
                  <Star className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Share Game</DropdownMenuItem>
                    <DropdownMenuItem>Add to Library</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
      {limit && games.length >= limit && (
        <Button variant="link" className="w-full">
          View All Games
        </Button>
      )}
    </div>
  )
} 