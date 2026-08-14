"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Eye, BarChart2 } from "lucide-react"

interface Game {
  id: string
  date: string
  timeControl: string
  result: "win" | "loss" | "draw"
  opponent: string
  opponentRating: number
  eloChange: number
  moves: number
  opening: string
  platform: string
}

const dummyGames: Game[] = [
  {
    id: "1",
    date: "2024-03-20",
    timeControl: "10+0",
    result: "win",
    opponent: "ChessMaster2000",
    opponentRating: 1950,
    eloChange: +12,
    moves: 45,
    opening: "Sicilian Defense",
    platform: "chess.com"
  },
  {
    id: "2",
    date: "2024-03-19",
    timeControl: "5+3",
    result: "loss",
    opponent: "GrandMaster123",
    opponentRating: 2100,
    eloChange: -8,
    moves: 32,
    opening: "Queen's Gambit",
    platform: "aroundchess"
  },
]

export function GameHistoryTable() {
  const [sortColumn, setSortColumn] = useState<keyof Game>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [games, setGames] = useState<Game[]>(dummyGames)

  const handleSort = (column: keyof Game) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }

    const sortedGames = [...games].sort((a, b) => {
      const aValue = a[column]
      const bValue = b[column]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    setGames(sortedGames)
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "text-green-600"
      case "loss":
        return "text-red-600"
      case "draw":
        return "text-yellow-600"
      default:
        return ""
    }
  }

  const getEloChangeColor = (eloChange: number) => {
    if (eloChange > 0) return "text-green-600"
    if (eloChange < 0) return "text-red-600"
    return "text-yellow-600"
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("date")}
                className="flex items-center"
              >
                Date
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Time Control</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Opponent</TableHead>
            <TableHead className="text-right">Rating</TableHead>
            <TableHead className="text-right">Elo Change</TableHead>
            <TableHead className="text-right">Moves</TableHead>
            <TableHead>Opening</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell className="font-medium">{game.date}</TableCell>
              <TableCell>{game.timeControl}</TableCell>
              <TableCell>
                <span className={getResultColor(game.result)}>
                  {game.result.charAt(0).toUpperCase() + game.result.slice(1)}
                </span>
              </TableCell>
              <TableCell>{game.opponent}</TableCell>
              <TableCell className="text-right">{game.opponentRating}</TableCell>
              <TableCell className={`text-right ${getEloChangeColor(game.eloChange)}`}>
                {game.eloChange > 0 ? "+" : ""}
                {game.eloChange}
              </TableCell>
              <TableCell className="text-right">{game.moves}</TableCell>
              <TableCell>{game.opening}</TableCell>
              <TableCell>{game.platform}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Game
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Analyze
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 