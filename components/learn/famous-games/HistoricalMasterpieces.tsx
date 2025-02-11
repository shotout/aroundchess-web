"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, History, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Chessboard } from "react-chessboard"
import { useState } from "react"
import { Chess } from "chess.js"

interface HistoricalGame {
  id: string
  title: string
  white: string
  black: string
  date: string
  event: string
  result: string
  opening: string
  eco: string
  pgn: string
  description: string
  historicalSignificance: string[]
  keyMoments: {
    move: string
    position: string
    explanation: string
  }[]
  impact: string[]
  modernRelevance: string[]
}

const historicalGamesData: HistoricalGame[] = [
  {
    id: "immortal-game",
    title: "The Immortal Game",
    white: "Adolf Anderssen",
    black: "Lionel Kieseritzky",
    date: "1851",
    event: "London",
    result: "1-0",
    opening: "King's Gambit",
    eco: "C33",
    pgn: "1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7#",
    description: "One of the most famous chess games ever played, known for its brilliant sacrificial play and stunning final combination.",
    historicalSignificance: [
      "Defined the romantic era of chess",
      "Demonstrated the power of sacrificial attacks",
      "Set standards for combinational play"
    ],
    keyMoments: [
      {
        move: "19. e5",
        position: "r1bk2n1/p2p1pNp/n7/1P1NP2P/6P1/3P4/P1P1K3/q3Q1b1 b - - 0 19",
        explanation: "The critical moment where Anderssen ignores the loss of his queen to set up the mating combination"
      }
    ],
    impact: [
      "Influenced attacking chess for generations",
      "Showed the importance of king safety",
      "Demonstrated the power of piece coordination"
    ],
    modernRelevance: [
      "Attacking principles still apply today",
      "Sacrificial themes remain important",
      "King safety concepts are timeless"
    ]
  },
  {
    id: "evergreen-game",
    title: "The Evergreen Game",
    white: "Adolf Anderssen",
    black: "Jean Dufresne",
    date: "1852",
    event: "Berlin",
    result: "1-0",
    opening: "Evans Gambit",
    eco: "C52",
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7#",
    description: "Another masterpiece from Anderssen, featuring a brilliant queen sacrifice and mating attack.",
    historicalSignificance: [
      "Exemplified the attacking style of the romantic era",
      "Demonstrated the power of piece coordination",
      "Showed the effectiveness of king hunt strategies"
    ],
    keyMoments: [
      {
        move: "20. Rxe7+",
        position: "1r4r1/pbpnn1p1/1b3N1p/8/8/2PB1q2/P4PPP/3R2K1 b - - 0 20",
        explanation: "The stunning queen sacrifice that leads to a forced mate"
      }
    ],
    impact: [
      "Set standards for attacking play",
      "Influenced tactical understanding",
      "Demonstrated the importance of initiative"
    ],
    modernRelevance: [
      "Attacking patterns still relevant",
      "Initiative concepts remain important",
      "Tactical themes continue to inspire"
    ]
  }
]

export default function HistoricalMasterpieces() {
  const [currentGame, setCurrentGame] = useState<HistoricalGame | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const gamesPerPage = 5

  const handleGameClick = (game: HistoricalGame) => {
    setCurrentGame(game)
  }

  const getCurrentPageGames = () => {
    const startIndex = (currentPage - 1) * gamesPerPage
    return historicalGamesData.slice(startIndex, startIndex + gamesPerPage)
  }

  const getPageCount = () => {
    return Math.ceil(historicalGamesData.length / gamesPerPage)
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getCurrentPageGames().map((game) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleGameClick(game)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  {game.title}
                </CardTitle>
                <CardDescription>
                  {game.white} vs {game.black}, {game.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {game.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {game.historicalSignificance.map((point, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {currentGame && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Game Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Chessboard
                  position={currentGame.keyMoments[0]?.position || "start"}
                  boardWidth={400}
                />
              </div>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertTitle>Key Moments</AlertTitle>
                  <AlertDescription>
                    {currentGame.keyMoments[0]?.explanation}
                  </AlertDescription>
                </Alert>
                <div>
                  <h4 className="font-medium mb-2">Historical Impact</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {currentGame.impact.map((point, index) => (
                      <li key={index} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Modern Relevance</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {currentGame.modernRelevance.map((point, index) => (
                      <li key={index} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(getPageCount(), p + 1))}
          disabled={currentPage === getPageCount()}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
} 