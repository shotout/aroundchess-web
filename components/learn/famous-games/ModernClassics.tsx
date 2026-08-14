"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Info, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Chessboard } from "react-chessboard"
import { useState } from "react"
import { Chess } from "chess.js"

interface LearningPoint {
  title: string
  description: string
  example: string
  position: string
  explanation: string[]
}

interface ModernClassicGame {
  id: string
  title: string
  white: string
  black: string
  date: string
  event: string
  result: string
  opening: string
  learningPoints: LearningPoint[]
  summary: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  concepts: string[]
  pgn: string
}

const modernClassicsData: ModernClassicGame[] = [
  {
    id: "nakamura-carlsen-2023",
    title: "Speed Chess Mastery",
    white: "Hikaru Nakamura",
    black: "Magnus Carlsen",
    date: "2023-12-12",
    event: "Speed Chess Championship 2023",
    result: "1-0",
    opening: "Queen's Gambit Declined",
    learningPoints: [
      {
        title: "Online Speed Chess",
        description: "Modern speed chess techniques in high-stakes matches",
        example: "Nakamura's precise calculation under extreme time pressure",
        position: "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
        explanation: [
          "Time management in critical positions",
          "Quick tactical pattern recognition",
          "Pre-moving in complex positions",
          "Online chess specific strategies"
        ]
      },
      {
        title: "Modern Opening Theory",
        description: "Contemporary approach to classical openings",
        example: "Novel interpretation of a standard Queen's Gambit position",
        position: "rnbqkb1r/pp2pppp/5n2/2pp4/3P4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 6",
        explanation: [
          "Engine-influenced opening preparation",
          "Dynamic pawn structures",
          "Concrete calculation vs general principles",
          "Modern piece deployment patterns"
        ]
      }
    ],
    summary: "A high-stakes speed chess battle between two elite rapid players.",
    difficulty: "Advanced",
    concepts: ["Speed Chess", "Online Play", "Time Management", "Tactical Awareness"],
    pgn: "1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Be7 5. Bf4 O-O 6. e3 c5"
  },
  {
    id: "duda-rapport-2023",
    title: "Creative Modern Chess",
    white: "Jan-Krzysztof Duda",
    black: "Richard Rapport",
    date: "2023-11-15",
    event: "European Club Cup 2023",
    result: "1-0",
    opening: "English Opening",
    learningPoints: [
      {
        title: "Creative Opening Play",
        description: "Modern approach to non-standard openings",
        example: "Rapport's creative piece placement in the early game",
        position: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 0 5",
        explanation: [
          "Flexible pawn structures",
          "Early piece activation",
          "Creating unusual positions",
          "Breaking opening principles purposefully"
        ]
      },
      {
        title: "Dynamic Play",
        description: "Modern handling of complex positions",
        example: "Duda's energetic piece play in an unclear position",
        position: "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
        explanation: [
          "Active piece play",
          "Creating and handling complications",
          "Calculated risk-taking",
          "Finding unexpected resources"
        ]
      }
    ],
    summary: "A creative battle featuring Rapport's trademark unconventional style against Duda's precise calculation.",
    difficulty: "Advanced",
    concepts: ["Creative Chess", "Tactical Play", "Unconventional Ideas", "Risk Taking"],
    pgn: "1. c4 c6 2. Nf3 d5 3. e3 Nf6 4. Nc3 e6 5. b3 Bd6"
  },
  {
    id: "aronian-mamedyarov-2023",
    title: "Strategic Innovation",
    white: "Levon Aronian",
    black: "Shakhriyar Mamedyarov",
    date: "2023-10-28",
    event: "Champions Chess Tour 2023",
    result: "1-0",
    opening: "Catalan Opening",
    learningPoints: [
      {
        title: "Modern Strategic Play",
        description: "Contemporary strategic concepts in closed positions",
        example: "Aronian's long-term positional play",
        position: "r1bq1rk1/ppp1bppp/2n2n2/3p4/2PP4/2N2NP1/PP2PPBP/R1BQK2R w KQ - 0 8",
        explanation: [
          "Modern pawn structure treatment",
          "Piece optimization in closed positions",
          "Strategic pawn breaks",
          "Prophylactic thinking"
        ]
      },
      {
        title: "Dynamic Defense",
        description: "Modern defensive techniques",
        example: "Mamedyarov's active defensive resources",
        position: "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
        explanation: [
          "Active piece counter-play",
          "Creating practical chances",
          "Dynamic pawn sacrifices",
          "Resource-finding in defense"
        ]
      }
    ],
    summary: "A deep strategic battle showcasing modern interpretations of classical positional concepts.",
    difficulty: "Advanced",
    concepts: ["Strategic Play", "Positional Chess", "Modern Defense", "Pawn Structure"],
    pgn: "1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 Be7 5. Nf3 O-O"
  },
  {
    id: "ding-nepomniachtchi-2023",
    title: "World Championship Clash",
    white: "Ding Liren",
    black: "Ian Nepomniachtchi",
    date: "2023-04-23",
    event: "World Chess Championship 2023",
    result: "1-0",
    opening: "Petroff Defense",
    learningPoints: [
      {
        title: "Championship-Level Preparation",
        description: "Modern opening preparation at the highest level",
        example: "Ding's deep preparation in a critical line",
        position: "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4",
        explanation: [
          "Deep opening analysis",
          "Computer-assisted preparation",
          "Critical line selection",
          "Surprise element in known positions"
        ]
      },
      {
        title: "Modern Endgame Technique",
        description: "Contemporary endgame play with perfect technique",
        example: "Ding's precise conversion of a small advantage",
        position: "4r1k1/5ppp/8/4P3/8/7P/5PP1/4R1K1 w - - 0 1",
        explanation: [
          "Technical precision",
          "Prophylactic thinking",
          "Active king play",
          "Creating and exploiting weaknesses"
        ]
      }
    ],
    summary: "A crucial game from the World Championship match, demonstrating modern chess at the absolute highest level.",
    difficulty: "Advanced",
    concepts: ["Opening Preparation", "Technical Precision", "Championship Chess", "Endgame Technique"],
    pgn: "1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4"
  },
  {
    id: "gukesh-praggnanandhaa-2023",
    title: "Indian Chess Revolution",
    white: "Gukesh D",
    black: "R Praggnanandhaa",
    date: "2023-09-15",
    event: "Champions Chess Tour 2023",
    result: "1-0",
    opening: "Sicilian Defense",
    learningPoints: [
      {
        title: "Modern Attacking Chess",
        description: "Contemporary attacking ideas in complex positions",
        example: "Gukesh's energetic kingside attack",
        position: "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
        explanation: [
          "Creating attacking chances in equal positions",
          "Piece coordination in attack",
          "Timing of tactical strikes",
          "Calculated sacrifices"
        ]
      },
      {
        title: "Dynamic Defense",
        description: "Modern defensive resources in sharp positions",
        example: "Praggnanandhaa's resourceful defense",
        position: "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
        explanation: [
          "Active piece defense",
          "Creating counterplay under pressure",
          "Tactical alertness",
          "Resource finding in critical positions"
        ]
      }
    ],
    summary: "A dynamic battle between India's young super-grandmasters, showcasing modern attacking chess.",
    difficulty: "Advanced",
    concepts: ["Attacking Chess", "Dynamic Play", "Tactical Awareness", "Critical Positions"],
    pgn: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6"
  },
  {
    id: "erigaisi-keymer-2023",
    title: "Next Generation Battle",
    white: "Arjun Erigaisi",
    black: "Vincent Keymer",
    date: "2023-08-30",
    event: "Junior Speed Chess Championship 2023",
    result: "1-0",
    opening: "Queen's Indian Defense",
    learningPoints: [
      {
        title: "Modern Opening Treatment",
        description: "Contemporary ideas in classical openings",
        example: "Erigaisi's dynamic interpretation of a quiet position",
        position: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 0 5",
        explanation: [
          "Dynamic piece play in quiet positions",
          "Creating imbalances strategically",
          "Modern pawn structure treatment",
          "Active piece deployment"
        ]
      },
      {
        title: "Strategic Initiative",
        description: "Modern strategic play in complex positions",
        example: "Converting small advantages in unclear positions",
        position: "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
        explanation: [
          "Accumulating small advantages",
          "Strategic piece placement",
          "Prophylactic thinking",
          "Long-term planning"
        ]
      }
    ],
    summary: "A fascinating game between two of the world's top young players, demonstrating modern strategic understanding.",
    difficulty: "Advanced",
    concepts: ["Strategic Play", "Dynamic Chess", "Opening Theory", "Position Evaluation"],
    pgn: "1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Ba6"
  },
  {
    id: "niemann-sevian-2023",
    title: "American New Wave",
    white: "Hans Niemann",
    black: "Sam Sevian",
    date: "2023-07-25",
    event: "US Championship 2023",
    result: "1-0",
    opening: "King's Indian Defense",
    learningPoints: [
      {
        title: "Modern King's Indian Play",
        description: "Contemporary treatment of dynamic positions",
        example: "Niemann's aggressive kingside expansion",
        position: "rnbq1rk1/pp2ppbp/3p1np1/2p5/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 0 8",
        explanation: [
          "Modern pawn structure dynamics",
          "Active piece play",
          "Creating attacking chances",
          "Strategic pawn breaks"
        ]
      },
      {
        title: "Complex Tactics",
        description: "Modern tactical play in sharp positions",
        example: "Tactical complications in the middlegame",
        position: "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
        explanation: [
          "Tactical pattern recognition",
          "Calculating complex variations",
          "Risk assessment",
          "Finding hidden resources"
        ]
      }
    ],
    summary: "A sharp tactical battle between two of America's strongest young players.",
    difficulty: "Advanced",
    concepts: ["Tactical Play", "King's Indian Defense", "Complex Positions", "Attacking Chess"],
    pgn: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6"
  },
  {
    id: "artemiev-esipenko-2023",
    title: "Russian School Modern Style",
    white: "Vladislav Artemiev",
    black: "Andrey Esipenko",
    date: "2023-06-20",
    event: "Russian Championship Superfinal 2023",
    result: "1-0",
    opening: "English Opening",
    learningPoints: [
      {
        title: "Modern Positional Play",
        description: "Contemporary positional understanding",
        example: "Artemiev's subtle positional maneuvering",
        position: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 0 5",
        explanation: [
          "Subtle piece placement",
          "Pawn structure manipulation",
          "Strategic piece exchanges",
          "Long-term planning"
        ]
      },
      {
        title: "Technical Conversion",
        description: "Modern endgame technique",
        example: "Converting positional advantages in technical positions",
        position: "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
        explanation: [
          "Technical precision",
          "Gradual advantage building",
          "Prophylactic thinking",
          "Endgame technique"
        ]
      }
    ],
    summary: "A masterclass in modern positional play from the Russian school of chess.",
    difficulty: "Advanced",
    concepts: ["Positional Play", "Technical Chess", "Strategic Planning", "Endgame Technique"],
    pgn: "1. c4 e6 2. Nc3 d5 3. d4 Be7 4. Nf3 Nf6"
  },
  {
    id: "vidit-harikrishna-2023",
    title: "Indian Classical Modern",
    white: "Vidit Gujrathi",
    black: "P Harikrishna",
    date: "2023-05-18",
    event: "Asian Continental 2023",
    result: "1-0",
    opening: "Nimzo-Indian Defense",
    learningPoints: [
      {
        title: "Modern Opening Theory",
        description: "Contemporary treatment of classical openings",
        example: "Vidit's modern interpretation of a classical position",
        position: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4",
        explanation: [
          "Modern opening preparation",
          "Dynamic piece play",
          "Pawn structure dynamics",
          "Strategic planning"
        ]
      },
      {
        title: "Strategic Breakthrough",
        description: "Converting strategic advantages in modern chess",
        example: "Strategic breakthrough in a complex middlegame",
        position: "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
        explanation: [
          "Strategic piece placement",
          "Creating and exploiting weaknesses",
          "Timing of decisive actions",
          "Technical conversion"
        ]
      }
    ],
    summary: "A high-level strategic battle between India's top players, showcasing modern chess understanding.",
    difficulty: "Advanced",
    concepts: ["Strategic Chess", "Opening Theory", "Technical Play", "Positional Understanding"],
    pgn: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O"
  }
]

export default function ModernClassics() {
  const [selectedGame, setSelectedGame] = useState<ModernClassicGame | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<LearningPoint | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const gamesPerPage = 6

  const handleGameClick = (game: ModernClassicGame) => {
    if (selectedGame?.id === game.id) {
      setSelectedGame(null)
      setSelectedPoint(null)
    } else {
      setSelectedGame(game)
      setSelectedPoint(null)
    }
  }

  const getCurrentPageGames = () => {
    const start = currentPage * gamesPerPage
    const end = start + gamesPerPage
    return modernClassicsData.slice(start, end)
  }

  const getPageCount = () => {
    return Math.ceil(modernClassicsData.length / gamesPerPage)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {getCurrentPageGames().map((game) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              onClick={() => handleGameClick(game)}
              className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-gray-200 h-[250px] flex flex-col
                ${selectedGame?.id === game.id ? "ring-2 ring-blue-500 shadow-lg" : "hover:border-blue-200"}`}
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg font-semibold leading-tight">
                    {game.white} <span className="text-gray-400">vs</span> {game.black}
                  </CardTitle>
                  <span className="text-[14px] --xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex-shrink-0">
                    {game.opening}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-2 text-[14px] --sm">
                  <span className="font-medium text-gray-700">{game.event}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{game.date}</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium text-gray-700">{game.result}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-0">
                <p className="text-[14px] --sm text-gray-600 line-clamp-3 mb-auto">{game.summary}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {game.concepts.slice(0, 2).map((concept) => (
                    <span
                      key={concept}
                      className="text-[14px] --xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {getPageCount() > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="w-10 h-10 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: getPageCount() }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(index)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === index
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : ""
                }`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(getPageCount() - 1, prev + 1))}
            disabled={currentPage === getPageCount() - 1}
            className="w-10 h-10 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {selectedGame && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-white rounded-2xl p-8 shadow-lg shadow-blue-500/5 border border-gray-200"
        >
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedGame.white} <span className="text-gray-400">vs</span> {selectedGame.black}
            </h2>
            <div className="flex items-center gap-2 text-[14px] --sm text-gray-500">
              <span className="font-medium text-gray-700">{selectedGame.event}</span>
              <span>•</span>
              <span>{selectedGame.date}</span>
              <span>•</span>
              <span className="font-medium text-gray-700">{selectedGame.result}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Game Information</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-1">
                      <p>Players: {selectedGame.white} vs {selectedGame.black}</p>
                      <p>Event: {selectedGame.event}</p>
                      <p>Date: {selectedGame.date}</p>
                      <p>Opening: {selectedGame.opening}</p>
                      <p>Result: {selectedGame.result}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-6">
                {selectedGame.learningPoints.map((point, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedPoint === point ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedPoint(point)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        {point.title}
                      </CardTitle>
                      <CardDescription>{point.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[14px] --sm text-gray-600">{point.example}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              {selectedPoint && (
                <div className="sticky top-4">
                  <div className="mb-6">
                    <Chessboard
                      position={selectedPoint.position}
                      boardWidth={400}
                      areArrowsAllowed={true}
                      customDarkSquareStyle={{ backgroundColor: "#B58863" }}
                      customLightSquareStyle={{ backgroundColor: "#F0D9B5" }}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Key Points to Remember</h3>
                    <ul className="space-y-2">
                      {selectedPoint.explanation.map((point, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}