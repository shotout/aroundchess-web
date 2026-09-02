"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface Match {
  id: number
  team1: { name: string; score: number | null }
  team2: { name: string; score: number | null }
  isCompleted: boolean
  winner?: string
}

interface Round {
  name: string
  matches: Match[]
}

// Mock data - replace with real data from your backend
const mockBracketData: { rounds: Round[] } = {
  rounds: [
    {
      name: "Quarter Finals",
      matches: [
        {
          id: 1,
          team1: { name: "Chess Masters", score: 3 },
          team2: { name: "Knight Riders", score: 2 },
          isCompleted: true,
          winner: "Chess Masters"
        },
        {
          id: 2,
          team1: { name: "Bishop Brigade", score: 1 },
          team2: { name: "Pawn Stars", score: 3 },
          isCompleted: true,
          winner: "Pawn Stars"
        },
        {
          id: 3,
          team1: { name: "Rook Warriors", score: 4 },
          team2: { name: "Queen's Gambit", score: 2 },
          isCompleted: true,
          winner: "Rook Warriors"
        },
        {
          id: 4,
          team1: { name: "King's Legion", score: 2 },
          team2: { name: "Checkmate Elite", score: 3 },
          isCompleted: true,
          winner: "Checkmate Elite"
        }
      ]
    },
    {
      name: "Semi Finals",
      matches: [
        {
          id: 5,
          team1: { name: "Chess Masters", score: 2 },
          team2: { name: "Pawn Stars", score: 2 },
          isCompleted: false
        },
        {
          id: 6,
          team1: { name: "Rook Warriors", score: 1 },
          team2: { name: "Checkmate Elite", score: 1 },
          isCompleted: false
        }
      ]
    },
    {
      name: "Finals",
      matches: [
        {
          id: 7,
          team1: { name: "TBD", score: null },
          team2: { name: "TBD", score: null },
          isCompleted: false
        }
      ]
    }
  ]
}

export function TournamentBracket() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] p-6">
        <div className="flex justify-between">
          {mockBracketData.rounds.map((round, roundIndex) => (
            <div
              key={round.name}
              className="flex flex-col space-y-8"
              style={{
                marginTop: `${roundIndex * 4}rem`
              }}
            >
              <h3 className="text-[14px] --sm font-medium text-gray-500 mb-4">{round.name}</h3>
              {round.matches.map((match, matchIndex) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: matchIndex * 0.1 }}
                  className="relative"
                >
                  <div className="w-64 rounded-lg border bg-card p-4 shadow-sm">
                    <div className="space-y-2">
                      <MatchTeam
                        name={match.team1.name}
                        score={match.team1.score}
                        isWinner={match.winner === match.team1.name}
                      />
                      <div className="border-t border-gray-200" />
                      <MatchTeam
                        name={match.team2.name}
                        score={match.team2.score}
                        isWinner={match.winner === match.team2.name}
                      />
                    </div>
                    {!match.isCompleted && (
                      <div className="absolute -right-2 -top-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface MatchTeamProps {
  name: string
  score: number | null
  isWinner?: boolean
}

function MatchTeam({ name, score, isWinner }: MatchTeamProps) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[14px] --sm ${isWinner ? "font-semibold text-blue-600" : "text-gray-700"}`}>
        {name}
      </span>
      {score !== null && (
        <span className={`text-[14px] --sm ${isWinner ? "font-semibold text-blue-600" : "text-gray-500"}`}>
          {score}
        </span>
      )}
    </div>
  )
} 