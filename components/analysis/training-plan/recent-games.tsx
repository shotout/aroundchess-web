"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
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
  Trophy,
  Clock,
  Target,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"

interface Game {
  id: string
  date: string
  opponent: string
  rating: number
  result: "Win" | "Loss" | "Draw"
  opening: string
  accuracy: number
  time: string
  mistakes: number
}

const recentGames: Game[] = [
  {
    id: "1",
    date: "2024-02-20",
    opponent: "IM_ChessMaster",
    rating: 2100,
    result: "Win",
    opening: "Sicilian Defense",
    accuracy: 92,
    time: "15+10",
    mistakes: 1,
  },
  {
    id: "2",
    date: "2024-02-19",
    opponent: "GM_Challenger",
    rating: 2300,
    result: "Loss",
    opening: "Queen's Gambit",
    accuracy: 78,
    time: "10+5",
    mistakes: 4,
  },
  {
    id: "3",
    date: "2024-02-18",
    opponent: "ChessExpert2000",
    rating: 2000,
    result: "Draw",
    opening: "Ruy Lopez",
    accuracy: 85,
    time: "15+10",
    mistakes: 2,
  },
  {
    id: "4",
    date: "2024-02-17",
    opponent: "KnightRider",
    rating: 1950,
    result: "Win",
    opening: "French Defense",
    accuracy: 89,
    time: "10+5",
    mistakes: 2,
  },
  {
    id: "5",
    date: "2024-02-16",
    opponent: "BishopMaster",
    rating: 2050,
    result: "Win",
    opening: "King's Indian",
    accuracy: 91,
    time: "15+10",
    mistakes: 1,
  },
]

export function RecentGames() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Recent Games</h3>
        <p className="text-[14px] --sm text-muted-foreground">
          Your last 5 games and performance
        </p>
      </div>

      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opponent</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Opening</TableHead>
              <TableHead className="text-right">Stats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentGames.map((game) => (
              <TableRow key={game.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div>
                    <div className="font-medium">{game.opponent}</div>
                    <div className="text-[14px] --sm text-muted-foreground">
                      Rating: {game.rating}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      game.result === "Win"
                        ? "default"
                        : game.result === "Loss"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {game.result}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-[14px] --sm">
                    <div>{game.opening}</div>
                    <div className="text-muted-foreground">{game.date}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-4 text-[14px] --sm">
                    <div className="flex items-center text-blue-500">
                      <Target className="h-4 w-4 mr-1" />
                      {game.accuracy}%
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {game.mistakes}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {game.time}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="flex justify-between items-center text-[14px] --sm text-muted-foreground pt-4 border-t">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-green-500 mr-1" />
            <span>Win Rate: 60%</span>
          </div>
          <div className="flex items-center">
            <Target className="h-4 w-4 text-blue-500 mr-1" />
            <span>Avg Accuracy: 87%</span>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Total Games: 150</span>
        </div>
      </div>
    </div>
  )
} 