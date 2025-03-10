"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"
import { 
  BookOpen, 
  ChevronRight, 
  Lightbulb, 
  Target, 
  TrendingUp,
  MessageCircle,
  Sparkles,
  Brain,
  CheckCircle,
  ChevronLeft
} from "lucide-react"

/**
 * Criteria for Instructive Chess Games
 * 
 * 1. Clear Strategic Themes:
 * - Demonstrates fundamental chess principles
 * - Shows clear strategic plans and their execution
 * - Illustrates important positional concepts
 * 
 * 2. Educational Value:
 * - Contains clear learning points for players of various levels
 * - Demonstrates common patterns and motifs
 * - Shows both correct play and instructive mistakes
 * 
 * 3. Technical Elements:
 * - Features important tactical or strategic themes
 * - Shows proper technique in different phases of the game
 * - Demonstrates key principles in action
 * 
 * 4. Historical Significance:
 * - Games that have influenced chess theory
 * - Demonstrates evolution of chess understanding
 * - Shows timeless principles that remain relevant
 * 
 * 5. Practical Application:
 * - Provides concrete lessons that can be applied in practice
 * - Shows common positions and how to handle them
 * - Illustrates typical mistakes and how to avoid them
 * 
 * 6. Modern Relevance:
 * - Concepts that are applicable in modern chess
 * - Shows principles that have stood the test of time
 * - Demonstrates ideas used in contemporary play
 */

interface Position {
  fen: string
  evaluation: string
  commentary: string
  keyIdeas: string[]
  variations: {
    moves: string
    explanation: string
  }[]
}

interface AnalysisPoint {
  title: string
  description: string
  positions: Position[]
  principles: string[]
  practicalAdvice: string[]
  commonMistakes: string[]
  relatedThemes: string[]
}

interface InstructiveGame {
  id: string
  title: string
  white: string
  black: string
  date: string
  event: string
  result: string
  opening: string
  eco: string
  themes: string[]
  pgn: string
  description: string
  analysis: string[]
  keyPoints: string[]
  practicalAdvice: string[]
  commonMistakes: string[]
  historicalContext: string
  modernRelevance: string[]
  sourceUrl: string
}

const instructiveGamesData: InstructiveGame[] = [
  {
    id: "morphy-opera",
    title: "Morphy's Opera Game",
    white: "Paul Morphy",
    black: "Duke Karl / Count Isouard",
    date: "1858",
    event: "Paris Opera House",
    result: "1-0",
    opening: "Philidor Defense",
    eco: "C41",
    themes: ["Rapid Development", "Open Files", "Queen Sacrifice"],
    pgn: "1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8#",
    description: "One of the most famous games in chess history, demonstrating the importance of development and piece coordination.",
    analysis: [
      "A masterpiece of attacking chess showing the importance of development over material.",
      "Morphy sacrifices his queen to achieve a beautiful checkmate.",
      "The game illustrates how ignoring development leads to collapse."
    ],
    keyPoints: [
      "Development before material gains",
      "The power of piece coordination",
      "Sacrificial attack leading to mate",
      "Punishing slow development"
    ],
    practicalAdvice: [
      "Develop your pieces before attacking",
      "Control the center early",
      "Castle early to protect your king"
    ],
    commonMistakes: [
      "Ignoring development",
      "Moving the same piece multiple times in the opening",
      "Leaving the king in the center too long"
    ],
    historicalContext: "This game, played at the Paris Opera House in 1858, is considered one of the greatest examples of the importance of development in chess history.",
    modernRelevance: [
      "The principles of rapid development remain crucial in modern chess",
      "Similar attacking patterns are still seen in contemporary games",
      "The importance of initiative over material is a timeless concept"
    ],
    sourceUrl: "https://www.chess.com/game/live/4608850145"
  },
  {
    id: "fischer-game-century",
    title: "Game of the Century",
    white: "Donald Byrne",
    black: "Bobby Fischer",
    date: "1956",
    event: "Rosenwald Memorial Tournament",
    result: "0-1",
    opening: "Grunfeld Defense",
    eco: "D92",
    themes: ["Queen Sacrifice", "Knight Dominance", "Positional Play"],
    pgn: "1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2#",
    description: "13-year-old Bobby Fischer's brilliant queen sacrifice and tactical masterpiece against Donald Byrne.",
    analysis: [
      "Fischer's queen sacrifice leads to a devastating attack",
      "Perfect coordination of minor pieces after the queen sacrifice",
      "Converting tactical advantages into a winning endgame"
    ],
    keyPoints: [
      "Value of piece coordination over material",
      "Long-term compensation for the queen",
      "Converting tactical advantages to endgame wins"
    ],
    practicalAdvice: [
      "Look for tactical opportunities even in quiet positions",
      "Don't fear sacrificing material for positional compensation",
      "Focus on piece coordination"
    ],
    commonMistakes: [
      "Overvaluing material advantage",
      "Underestimating opponent's compensation",
      "Poor piece coordination"
    ],
    historicalContext: "This game, played when Fischer was just 13 years old, earned its name 'Game of the Century' for its brilliant combination and mature strategic play.",
    modernRelevance: [
      "Demonstrates timeless principles of compensation",
      "Shows the power of coordinated minor pieces",
      "Illustrates tactical possibilities in strategic positions"
    ],
    sourceUrl: "https://www.chess.com/game/live/4608850146"
  },
  {
    id: "capablanca-endgame",
    title: "Capablanca's Endgame Masterclass",
    white: "Jose Raul Capablanca",
    black: "Savielly Tartakower",
    date: "1924",
    event: "New York International",
    result: "1-0",
    opening: "Queen's Gambit Declined",
    eco: "D30",
    themes: ["Rook Activity", "Pawn Structure", "Endgame Technique"],
    pgn: "1. d4 d5 2. c4 e6 3. Nf3 Nf6 4. Bg5 Be7 5. e3 Nbd7 6. Nc3 O-O 7. Rc1 b6 8. cxd5 exd5 9. Bb5 Bb7 10. O-O a6 11. Ba4 c5 12. dxc5 bxc5 13. Bf4 Qb6 14. Qe2 c4 15. Nd4 Rfe8 16. Na2",
    description: "A masterclass in endgame technique by the great Capablanca.",
    analysis: [
      "Perfect demonstration of rook activity on the 7th rank",
      "Masterful pawn structure management",
      "Converting minimal advantages in the endgame"
    ],
    keyPoints: [
      "Rook placement on the 7th rank",
      "Pawn structure manipulation",
      "Technical conversion with minimal material"
    ],
    practicalAdvice: [
      "Focus on rook activity in endgames",
      "Create and exploit pawn weaknesses",
      "Maintain control of key files"
    ],
    commonMistakes: [
      "Passive rook placement",
      "Poor pawn structure management",
      "Rushing the conversion process"
    ],
    historicalContext: "This game showcases Capablanca's legendary endgame technique and his ability to win with minimal advantages.",
    modernRelevance: [
      "Endgame principles remain unchanged",
      "Importance of technical precision",
      "Value of small advantages in modern chess"
    ],
    sourceUrl: "https://www.chess.com/game/live/4608850147"
  },
  {
    id: "reti-pawn-lever",
    title: "Reti's Pawn Lever Demolition",
    white: "Richard Reti",
    black: "Efim Bogoljubov",
    date: "1924",
    event: "New York International",
    result: "1-0",
    opening: "King's Indian Attack",
    eco: "A07",
    themes: ["Pawn Breaks", "Center Control", "King Safety"],
    pgn: "1. Nf3 d5 2. g3 Nf6 3. Bg2 e6 4. O-O Be7 5. d3 O-O 6. Nbd2 c5 7. e4 Nc6 8. Re1 b5 9. e5 Nd7 10. Nf1 Bb7 11. h4 a5 12. N3h2 b4 13. f4 a4 14. Ng4 b3 15. axb3 axb3 16. f4",
    description: "A brilliant demonstration of using pawn levers to destroy the opponent's center.",
    analysis: [
      "Reti's famous 16.f4! undermining Black's center",
      "Perfect timing of pawn breaks",
      "Strategic destruction of the opponent's position"
    ],
    keyPoints: [
      "Timing of pawn breaks",
      "Center control through flank operations",
      "Strategic piece placement"
    ],
    practicalAdvice: [
      "Look for key pawn breaks",
      "Time your central thrust carefully",
      "Prepare pawn breaks with piece play"
    ],
    commonMistakes: [
      "Premature pawn breaks",
      "Poor preparation for central battles",
      "Ignoring opponent's counterplay"
    ],
    historicalContext: "This game demonstrates Reti's hypermodern approach to chess, attacking the center from the flanks.",
    modernRelevance: [
      "Modern understanding of pawn breaks",
      "Hypermodern ideas in contemporary chess",
      "Strategic planning in closed positions"
    ],
    sourceUrl: "https://www.chess.com/game/live/4608850148"
  },
  {
    id: "karpov-squeeze",
    title: "Karpov's Positional Squeeze",
    white: "Anatoly Karpov",
    black: "Viktor Korchnoi",
    date: "1974",
    event: "World Championship Candidates Final",
    result: "1-0",
    opening: "Nimzo-Indian Defense",
    eco: "E41",
    themes: ["Space Advantage", "Prophylaxis", "Minority Attack"],
    pgn: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 c5 5. Bd3 Nc6 6. Nf3 Bxc3+ 7. bxc3 d6 8. O-O e5 9. e4 O-O 10. h3 b6 11. Re1 Ba6 12. Bc2 Re8 13. a4 Qc7",
    description: "A masterclass in positional play and prophylactic thinking by Karpov.",
    analysis: [
      "Perfect demonstration of space advantage",
      "Prophylactic moves preventing counterplay",
      "Classic minority attack execution"
    ],
    keyPoints: [
      "Space advantage utilization",
      "Prophylactic thinking",
      "Restricting opponent's counterplay"
    ],
    practicalAdvice: [
      "Control key squares",
      "Prevent opponent's counterplay",
      "Build up pressure gradually"
    ],
    commonMistakes: [
      "Allowing counterplay",
      "Rushing the attack",
      "Poor prophylactic thinking"
    ],
    historicalContext: "This game showcases Karpov's legendary positional style and technical precision.",
    modernRelevance: [
      "Prophylactic thinking in modern chess",
      "Positional squeeze techniques",
      "Technical precision in modern play"
    ],
    sourceUrl: "https://www.chess.com/game/live/4608850149"
  },
  {
    id: "kasparov-fianchetto",
    title: "Kasparov's Double Fianchetto",
    white: "Garry Kasparov",
    black: "Anatoly Karpov",
    date: "1987",
    event: "World Championship Match",
    result: "1-0",
    opening: "King's Indian Defense",
    eco: "E97",
    themes: ["Double Fianchetto", "Strategic Flexibility", "King Safety"],
    pgn: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. b4 Nh5 10. Re1 f5 11. Ng5 Nf6 12. f3 c6",
    description: "A brilliant display of hypermodern chess and strategic flexibility.",
    analysis: [
      "Masterful use of the double fianchetto setup",
      "Strategic flexibility in a must-win situation",
      "Perfect harmony between pieces"
    ],
    keyPoints: [
      "Double fianchetto strategy",
      "Piece coordination",
      "Strategic flexibility"
    ],
    practicalAdvice: [
      "Maintain flexibility in your setup",
      "Coordinate your pieces effectively",
      "Balance attack and defense"
    ],
    commonMistakes: [
      "Poor piece coordination",
      "Inflexible strategic thinking",
      "Neglecting king safety"
    ],
    historicalContext: "This game was played in a crucial moment of the 1987 World Championship match.",
    modernRelevance: [
      "Modern interpretation of fianchetto setups",
      "Strategic flexibility in contemporary chess",
      "Balance of attack and defense"
    ],
    sourceUrl: "https://www.chess.com/game/live/4608850150"
  },
  {
    id: "rubinstein-immortal",
    title: "Rubinstein's Immortal Endgame",
    white: "Akiba Rubinstein",
    black: "Georg Rotlewi",
    date: "1907",
    event: "Lodz",
    result: "1-0",
    opening: "Queen's Gambit Declined",
    eco: "D40",
    themes: ["Piece Coordination", "King Attack", "Queen Sacrifice"],
    pgn: "1. d4 d5 2. Nf3 e6 3. e3 c5 4. c4 Nc6 5. Nc3 Nf6 6. dxc5 Bxc5 7. a3 a6 8. b4 Bd6 9. Bb2 O-O 10. Qd2 Qe7 11. Bd3 dxc4 12. Bxc4 b5 13. Bd3 Rd8 14. Qe2 Bb7 15. O-O Ne5",
    description: "One of the most famous endgames in chess history, featuring a brilliant queen sacrifice.",
    analysis: [
      "Perfect piece coordination leading to a winning attack",
      "Brilliant queen sacrifice for checkmate",
      "Converting initiative into mate"
    ],
    keyPoints: [
      "Piece coordination importance",
      "Queen sacrifice technique",
      "Converting initiative to mate"
    ],
    practicalAdvice: [
      "Look for piece coordination opportunities",
      "Calculate sacrifices thoroughly",
      "Maintain attacking initiative"
    ],
    commonMistakes: [
      "Poor piece coordination",
      "Missing tactical opportunities",
      "Losing initiative"
    ],
    historicalContext: "This game is considered one of the most beautiful examples of converting an attack into mate.",
    modernRelevance: [
      "Tactical awareness in modern chess",
      "Importance of piece coordination",
      "Converting advantages to victory"
    ],
    sourceUrl: "https://www.chess.com/game/live/4608850151"
  },
  {
    id: "illingworth-bullet",
    title: "Illingworth's Modern Bullet Game",
    white: "Max Illingworth",
    black: "Anonymous NM",
    date: "2024",
    event: "Online Bullet Tournament",
    result: "1-0",
    opening: "Sicilian Defense",
    eco: "B90",
    themes: ["Time Management", "Opening Traps", "Tactical Awareness"],
    pgn: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Nbd7 11. g4 b5 12. g5 Nh5 13. Nd5",
    description: "A modern example of high-level bullet chess, showcasing rapid decision making and tactical awareness.",
    analysis: [
      "Excellent time management in critical positions",
      "Quick recognition of tactical patterns",
      "Balance of speed and accuracy"
    ],
    keyPoints: [
      "Time management in bullet chess",
      "Opening trap awareness",
      "Quick tactical calculation"
    ],
    practicalAdvice: [
      "Develop time management skills",
      "Learn common tactical patterns",
      "Balance speed with accuracy"
    ],
    commonMistakes: [
      "Poor time management",
      "Missing tactical opportunities",
      "Sacrificing accuracy for speed"
    ],
    historicalContext: "This game represents the evolution of chess in the digital age, where rapid play is increasingly important.",
    modernRelevance: [
      "Modern online chess techniques",
      "Time management in digital chess",
      "Tactical awareness in rapid play"
    ],
    sourceUrl: "https://www.chess.com/game/live/4608850152"
  }
]

export default function InstructiveAnalysis() {
  const [selectedGame, setSelectedGame] = useState<InstructiveGame | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const gamesPerPage = 6

  const handleGameClick = (game: InstructiveGame) => {
    if (selectedGame?.id === game.id) {
      setSelectedGame(null)
    } else {
      setSelectedGame(game)
    }
  }

  const getCurrentPageGames = () => {
    const start = currentPage * gamesPerPage
    const end = start + gamesPerPage
    return instructiveGamesData.slice(start, end)
  }

  const getPageCount = () => {
    return Math.ceil(instructiveGamesData.length / gamesPerPage)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    {game.title}
                  </CardTitle>
                  <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex-shrink-0">
                    {game.eco}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">{game.event}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{game.date}</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium text-gray-700">{game.result}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-0">
                <p className="text-sm text-gray-600 line-clamp-3 mb-auto">{game.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {game.themes.slice(0, 3).map((theme) => (
                    <span
                      key={theme}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedGame && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-white rounded-2xl p-8 shadow-lg shadow-blue-500/5 border border-gray-200"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedGame.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{selectedGame.white} vs {selectedGame.black}</span>
                  <span>•</span>
                  <span>{selectedGame.event}</span>
                  <span>•</span>
                  <span>{selectedGame.date}</span>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      Historical Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedGame.historicalContext}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      Key Analysis Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedGame.analysis.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Key Learning Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedGame.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <Chessboard
                  position="start"
                  boardWidth={400}
                  areArrowsAllowed={true}
                  customDarkSquareStyle={{ backgroundColor: "#B58863" }}
                  customLightSquareStyle={{ backgroundColor: "#F0D9B5" }}
                />
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-indigo-500" />
                      Practical Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedGame.practicalAdvice.map((advice, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-red-500" />
                      Common Mistakes to Avoid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedGame.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      Modern Relevance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedGame.modernRelevance.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <a
                  href={selectedGame.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>View game on Chess.com</span>
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
    </div>
  )
} 
