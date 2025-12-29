"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Upload,
  Crown,
  BarChart2,
  FileText,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Brain,
  Swords,
} from "lucide-react"
import { ChessAnalysisService } from "@/lib/services/chess-analysis"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

interface GameAnalysis {
  id: string
  date: string
  opponent: string
  result: string
  accuracy: number
  mistakes: number
  blunders: number
  missedWins: number
  timeControl: string
  opening: string
  evaluation: "Good" | "Average" | "Poor"
}

interface RecommendedLesson {
  type: string
  topic: string
  priority: number
  reason: string
}

interface MistakeAnalysis {
  move: string
  position: string
  evaluation: number
  bestMove: string
  mistake: boolean
  blunder: boolean
  improvement: string
  lessonType: 'tactical' | 'positional' | 'opening' | 'endgame'
  explanation: string
}

const recentGames: GameAnalysis[] = [
  {
    id: "1",
    date: "2024-02-20",
    opponent: "IM_ChessMaster",
    result: "Win",
    accuracy: 92,
    mistakes: 1,
    blunders: 0,
    missedWins: 0,
    timeControl: "15+10",
    opening: "Sicilian Defense",
    evaluation: "Good",
  },
  {
    id: "2",
    date: "2024-02-19",
    opponent: "GM_Challenger",
    result: "Loss",
    accuracy: 78,
    mistakes: 3,
    blunders: 1,
    missedWins: 2,
    timeControl: "10+5",
    opening: "Queen's Gambit",
    evaluation: "Poor",
  },
  {
    id: "3",
    date: "2024-02-18",
    opponent: "ChessExpert2000",
    result: "Draw",
    accuracy: 85,
    mistakes: 2,
    blunders: 0,
    missedWins: 1,
    timeControl: "15+10",
    opening: "Ruy Lopez",
    evaluation: "Average",
  },
]

export function GameAnalysis() {
  const [selectedGame, setSelectedGame] = useState<string>("")
  const [pgnText, setPgnText] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [recentGames, setRecentGames] = useState<any[]>([])
  const analysisService = new ChessAnalysisService()

  useEffect(() => {
    // Initialize Stockfish when component mounts
    console.log('Initializing analysis service')
  }, [])

  const fetchGames = async () => {
    if (!username) return
    setError(null)
    try {
      const games = await analysisService.fetchChessComGames(username)
      setRecentGames(games)
    } catch (error) {
      console.error('Error fetching games:', error)
      setError('Failed to fetch games. Please check the username and try again.')
    }
  }

  const handlePGNUpload = async () => {
    if (!pgnText && !selectedGame) return
    setIsAnalyzing(true)
    setError(null)
    try {
      const pgn = pgnText || selectedGame
      console.log('Starting analysis of PGN:', pgn)
      const result = await analysisService.analyzeGame(pgn)
      console.log('Analysis completed:', result)
      setAnalysis(result)
    } catch (error) {
      console.error('Error analyzing game:', error)
      setError('Failed to analyze game. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const renderLessonRecommendations = () => {
    if (!analysis?.summary?.recommendedLessons) return null

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Recommended Training Focus</h4>
        {analysis.summary.recommendedLessons.map((lesson: RecommendedLesson, index: number) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                {lesson.type === 'tactical' && <Target className="h-5 w-5 text-blue-500" />}
                {lesson.type === 'positional' && <Brain className="h-5 w-5 text-green-500" />}
                {lesson.type === 'opening' && <BookOpen className="h-5 w-5 text-yellow-500" />}
                {lesson.type === 'endgame' && <Swords className="h-5 w-5 text-purple-500" />}
                <div>
                  <h5 className="font-medium">{lesson.topic}</h5>
                  <p className="text-[14px] --sm text-muted-foreground">{lesson.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderMistakeAnalysis = () => {
    if (!analysis?.summary?.criticalMistakes) return null

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Critical Mistakes Analysis</h4>
        {analysis.summary.criticalMistakes.map((mistake: MistakeAnalysis, index: number) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={mistake.blunder ? "destructive" : "secondary"}>
                    {mistake.blunder ? "Blunder" : "Mistake"}
                  </Badge>
                  <span className="text-[14px] --sm text-muted-foreground">Move: {mistake.move}</span>
                </div>
                <p className="text-[14px] --sm">{mistake.explanation}</p>
                <p className="text-[14px] --sm text-blue-500">{mistake.improvement}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fetch Game</CardTitle>
            <CardDescription>
              Import your games from Chess.com or paste PGN
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Chess.com username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button 
                  onClick={fetchGames} 
                  className="w-full"
                  disabled={!username || isAnalyzing}
                >
                  Fetch Recent Games
                </Button>
              </div>
              <div className="space-y-2">
                <Select onValueChange={setSelectedGame} value={selectedGame}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select game to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Remove duplicates by using game URL as unique identifier */}
                    {recentGames
                      .filter((game, index, self) => 
                        index === self.findIndex((g) => g.url === game.url)
                      )
                      .map((game: any, index: number) => {
                        const date = new Date(game.end_time * 1000)
                        const isUserWhite = game.white.username.toLowerCase() === username.toLowerCase()
                        const userColor = isUserWhite ? "White" : "Black"
                        const opponent = isUserWhite ? game.black.username : game.white.username
                        
                        // Get game result based on who won
                        let result = "draw"
                        if (game.white.result === "win") {
                          result = isUserWhite ? "win" : "loss"
                        } else if (game.black.result === "win") {
                          result = !isUserWhite ? "win" : "loss"
                        } else if (game.white.result === "checkmated") {
                          result = isUserWhite ? "loss" : "win"
                        } else if (game.black.result === "checkmated") {
                          result = !isUserWhite ? "loss" : "win"
                        } else if (game.white.result === "timeout") {
                          result = isUserWhite ? "loss" : "win"
                        } else if (game.black.result === "timeout") {
                          result = !isUserWhite ? "loss" : "win"
                        }
                        
                        return (
                          <SelectItem key={game.url} value={game.pgn}>
                            {date.toLocaleDateString()} - {username} ({userColor}) vs {opponent} ({result})
                          </SelectItem>
                        )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Or paste your PGN here..."
                  value={pgnText || selectedGame}
                  onChange={(e) => setPgnText(e.target.value)}
                  className="h-[200px]"
                  disabled={isAnalyzing}
                />
              </div>
              {error && (
                <div className="text-[14px] --sm text-red-500">
                  {error}
                </div>
              )}
              <Button 
                onClick={handlePGNUpload} 
                className="w-full"
                disabled={isAnalyzing || (!pgnText && !selectedGame)}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze Game
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered game analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  <p className="text-[14px] --sm text-muted-foreground">Analyzing your game...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>{error}</p>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="threats">Threats</TabsTrigger>
                      <TabsTrigger value="goodMoves">Good Moves</TabsTrigger>
                      <TabsTrigger value="plans">Plans</TabsTrigger>
                      <TabsTrigger value="functionality">Functionality</TabsTrigger>
                      <TabsTrigger value="concepts">Concepts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[14px] --sm text-muted-foreground">Accuracy</span>
                          <div className="text-2xl font-bold">
                            {analysis.summary.averageAccuracy.toFixed(1)}%
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[14px] --sm text-muted-foreground">Mistakes</span>
                          <div className="text-2xl font-bold text-yellow-500">
                            {analysis.summary.mistakes}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[14px] --sm text-muted-foreground">Blunders</span>
                          <div className="text-2xl font-bold text-red-500">
                            {analysis.summary.blunders}
                          </div>
                        </div>
                      </div>
                      {renderLessonRecommendations()}
                      {renderMistakeAnalysis()}
                    </TabsContent>

                    <TabsContent value="threats" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Position Threats</h4>
                        {analysis.moves.map((move: MistakeAnalysis, index: number) => (
                          move.blunder && (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <p className="text-[14px] --sm font-medium">Move {move.move}</p>
                                  <p className="text-[14px] --sm text-red-500">
                                    Missed threat: {move.explanation}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="goodMoves" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Best Moves Found</h4>
                        {analysis.moves.map((move: MistakeAnalysis, index: number) => (
                          !move.mistake && !move.blunder && (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <p className="text-[14px] --sm font-medium">Move {move.move}</p>
                                  <p className="text-[14px] --sm text-green-500">
                                    Good move: Maintains positional advantage
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="plans" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Strategic Plans</h4>
                        {analysis.summary.recommendedLessons.map((lesson: RecommendedLesson, index: number) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <h5 className="font-medium">{lesson.topic}</h5>
                                <p className="text-[14px] --sm text-muted-foreground">
                                  {lesson.reason}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="functionality" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Piece Functionality</h4>
                        <p className="text-[14px] --sm text-muted-foreground">
                          Analysis of how effectively your pieces were used throughout the game.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="concepts" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Key Chess Concepts</h4>
                        <p className="text-[14px] --sm text-muted-foreground">
                          Important chess principles and concepts from your game.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>Select a game and click analyze to get AI recommendations</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 