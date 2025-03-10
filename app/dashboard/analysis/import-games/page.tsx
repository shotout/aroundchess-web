"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Info, Upload, FileText, CheckCircle2, AlertTriangle, Target, Brain, BookOpen, Swords, History } from "lucide-react"
import { ImportDropzone } from "@/components/analysis/import-games/ImportDropzone"
import { ProTips } from "@/components/analysis/import-games/ProTips"
import { ChessAnalysisService } from "@/lib/services/chess-analysis"
import { AnalysisLoading } from "@/components/analysis/import-games/AnalysisLoading"
import { PositionAnalysis } from "@/components/analysis/import-games/PositionAnalysis"

interface MoveAnalysis {
  move: string
  position: string
  evaluation: number
  bestMove: string
  moveClassification: 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'miss' | 'blunder'
  improvement: string
  lessonType: 'tactical' | 'positional' | 'opening' | 'endgame'
  explanation: string
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
  moveClassification: string
}

interface RecommendedLesson {
  type: string
  topic: string
  priority: number
  reason: string
}

interface ThreatAnalysis {
  position: string
  moveNumber: number
  threats: {
    type: 'mate' | 'fork' | 'pin' | 'discovery' | 'skewer' | 'hanging' | 'trapped'
    description: string
    severity: 'critical' | 'serious' | 'moderate'
    piece: string
    square: string
  }[]
}

// Add these styles at the top of the file after imports
const moveClassificationColors = {
  brilliant: 'bg-[#1baca6] text-white hover:bg-[#1baca6]/90',
  great: 'bg-[#3692e7] text-white hover:bg-[#3692e7]/90',
  best: 'bg-[#2ba52b] text-white hover:bg-[#2ba52b]/90',
  excellent: 'bg-[#2ba52b] text-white hover:bg-[#2ba52b]/90',
  good: 'bg-[#2ba52b] text-white hover:bg-[#2ba52b]/90',
  inaccuracy: 'bg-[#e69d00] text-white hover:bg-[#e69d00]/90',
  mistake: 'bg-[#b33430] text-white hover:bg-[#b33430]/90',
  miss: 'bg-[#e69d00] text-white hover:bg-[#e69d00]/90',
  blunder: 'bg-[#b33430] text-white hover:bg-[#b33430]/90',
}

export default function ImportGamesPage() {
  const [pgnText, setPgnText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [analysisService, setAnalysisService] = useState<ChessAnalysisService | null>(null)
  const [activeTab, setActiveTab] = useState("paste")

  useEffect(() => {
    // Initialize the analysis service only on the client side
    const service = new ChessAnalysisService()
    setAnalysisService(service)
  }, [])

  const handleAnalyze = async (pgn: string) => {
    if (!pgn || !analysisService) return
    setIsAnalyzing(true)
    setError(null)
    try {
      console.log('Starting analysis of PGN:', pgn)
      const result = await analysisService.analyzeGame(pgn)
      console.log('Analysis completed:', result)
      setAnalysis(result)
      // Switch to analysis tab after completion
      setActiveTab("analysis")
    } catch (error) {
      console.error('Error analyzing game:', error)
      setError('Failed to analyze game. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const renderAnalysisResults = () => {
    if (!analysis) return null

    return (
      <div className="mt-8 space-y-8">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="moveQuality">Move Quality</TabsTrigger>
            <TabsTrigger value="opening">Opening</TabsTrigger>
            <TabsTrigger value="endgame">Endgame</TabsTrigger>
            <TabsTrigger value="improvement">Improvement</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Overall Game Assessment</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-muted-foreground">
                    Game accuracy: <span className="font-medium text-foreground">{analysis.summary?.accuracy?.toFixed(1)}%</span>
                  </p>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p>
                    {analysis.summary?.accuracy >= 90 ? (
                      "This was an exceptionally well-played game with very few mistakes. The moves demonstrated a strong understanding of positional play and tactical awareness."
                    ) : analysis.summary?.accuracy >= 80 ? (
                      "A strong performance overall, with good strategic decisions throughout most of the game. There were a few minor inaccuracies but they didn't significantly impacted the position."
                    ) : analysis.summary?.accuracy >= 70 ? (
                      "A decent game with some good moves, but also some missed opportunities. The critical moments could have been handled more precisely."
                    ) : analysis.summary?.accuracy >= 60 ? (
                      "This game showed some promising ideas, but several important moments were mishandled. There's room for improvement in tactical awareness and position evaluation."
                    ) : (
                      "The game revealed several areas for improvement. Focus on basic tactical patterns and positional understanding would help avoid similar mistakes in future games."
                    )}
                  </p>
                  <p className="mt-4">
                    {analysis.summary?.brilliantMoves > 0 ? (
                      `Found ${analysis.summary.brilliantMoves} brilliant move${analysis.summary.brilliantMoves > 1 ? 's' : ''}, showing excellent calculation in complex positions. `
                    ) : ''}
                    {analysis.summary?.blunders > 0 ? (
                      `The game had ${analysis.summary.blunders} critical mistake${analysis.summary.blunders > 1 ? 's' : ''} that significantly affected the position. `
                    ) : 'No major mistakes were made during the game. '}
                    {analysis.summary?.recommendedLessons?.[0]?.topic ? (
                      `Based on the analysis, focusing on ${analysis.summary.recommendedLessons[0].topic.toLowerCase()} would be most beneficial for improvement.`
                    ) : ''}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h4 className="text-lg font-semibold">Best Moves</h4>
                </div>
                <div className="space-y-4">
                  {analysis.moves
                    .filter((move: MoveAnalysis) => ['brilliant', 'great', 'best'].includes(move.moveClassification))
                    .slice(0, 3)
                    .map((move: MoveAnalysis, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${
                            move.moveClassification === 'great' ? 'bg-[#3692e7]' :
                            move.moveClassification === 'brilliant' ? 'bg-[#1baca6]' :
                            'bg-[#2ba52b]'
                          } text-white`}>
                            {move.moveClassification.charAt(0).toUpperCase() + move.moveClassification.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-medium">{move.move}</span>
                            <Badge variant="outline" className="text-green-600">+{move.evaluation.toFixed(1)}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{move.explanation}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Type: {move.lessonType.charAt(0).toUpperCase() + move.lessonType.slice(1)}</span>
                        </div>
                      </div>
                    ))}
                  {analysis.moves.filter((move: MoveAnalysis) => ['brilliant', 'great', 'best'].includes(move.moveClassification)).length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No exceptional moves found in this game.
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h4 className="text-lg font-semibold">Critical Mistakes</h4>
                </div>
                <div className="space-y-4">
                  {analysis.summary.criticalMistakes.slice(0, 3).map((move: MoveAnalysis, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${
                          move.moveClassification === 'miss' ? 'bg-[#e69d00]' : 'bg-[#b33430]'
                        } text-white`}>
                          {move.moveClassification.charAt(0).toUpperCase() + move.moveClassification.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium">{move.move}</span>
                          <Badge variant="outline" className="text-red-600">{move.evaluation.toFixed(1)}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{move.explanation}</p>
                      <div className="mt-3 p-3 bg-blue-50 rounded-md border-l-2 border-blue-600">
                        <p className="text-sm text-blue-600">
                          Better move: {move.improvement}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Type: {move.lessonType.charAt(0).toUpperCase() + move.lessonType.slice(1)}</span>
                      </div>
                    </div>
                  ))}
                  {analysis.summary.criticalMistakes.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No critical mistakes found in this game.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="threats" className="space-y-4">
            {analysis?.threats.length > 0 ? (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Most Critical Threats</h3>
                <div className="space-y-4">
                  {analysis.threats
                    .flatMap((ta: ThreatAnalysis) => ta.threats.map((t: ThreatAnalysis['threats'][0]) => ({
                      ...t,
                      moveNumber: ta.moveNumber
                    })))
                    .sort((a: ThreatAnalysis['threats'][0] & { moveNumber: number }, b: ThreatAnalysis['threats'][0] & { moveNumber: number }) => 
                      a.severity === 'critical' ? -1 : 
                      b.severity === 'critical' ? 1 : 
                      a.severity === 'serious' ? -1 : 
                      b.severity === 'serious' ? 1 : 0
                    )
                    .slice(0, 3)
                    .map((threat: ThreatAnalysis['threats'][0] & { moveNumber: number }, index: number) => {
                      const pieceName = {
                        'p': 'Pawn',
                        'n': 'Knight',
                        'b': 'Bishop',
                        'r': 'Rook',
                        'q': 'Queen',
                        'k': 'King'
                      }[threat.piece] || threat.piece;
                      
                      // Clean up the description to remove piece letter if present
                      const cleanDescription = threat.description
                        .replace(/^[KQRBN]\s+/, '')  // Remove piece letter from start
                        .replace(/your\s+[KQRBN]\s+/, 'your '); // Remove piece letter after "your"
                      
                      return (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={
                              threat.severity === 'critical' ? 'bg-red-500' :
                              threat.severity === 'serious' ? 'bg-orange-500' :
                              'bg-yellow-500'
                            }>
                              {threat.type.charAt(0).toUpperCase() + threat.type.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Move {Math.floor(threat.moveNumber / 2) + 1}
                              {threat.moveNumber % 2 === 0 ? ' (Black)' : ' (White)'}
                            </span>
                          </div>
                          <p className="text-sm mb-3">{pieceName} {cleanDescription}</p>
                          <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md border-l-2 border-blue-600">
                            How to improve: Carefully evaluate the position and consider defensive moves that protect your {pieceName} on {threat.square}.
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No significant threats found in this game.
              </div>
            )}
          </TabsContent>

          <TabsContent value="moveQuality" className="space-y-4">
            {/* Move Quality content will be implemented later */}
            <div className="text-center py-12 text-muted-foreground">
              Detailed move quality metrics coming soon...
            </div>
          </TabsContent>

          <TabsContent value="opening" className="space-y-4">
            {/* Opening content will be implemented later */}
            <div className="text-center py-12 text-muted-foreground">
              Opening analysis coming soon...
            </div>
          </TabsContent>

          <TabsContent value="endgame" className="space-y-4">
            {/* Endgame content will be implemented later */}
            <div className="text-center py-12 text-muted-foreground">
              Endgame assessment coming soon...
            </div>
          </TabsContent>

          <TabsContent value="improvement" className="space-y-4">
            {/* Improvement content will be implemented later */}
            <div className="text-center py-12 text-muted-foreground">
              Improvement suggestions coming soon...
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            {/* Training content will be implemented later */}
            <div className="text-center py-12 text-muted-foreground">
              Training focus recommendations coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Import Your Games</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Upload your chess games in PGN format for detailed analysis. You can either paste your PGN text directly or upload a PGN file.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            {isAnalyzing ? (
              <AnalysisLoading />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="paste" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Paste PGN
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="gap-2" disabled={!analysis}>
                    <History className="h-4 w-4" />
                    Analysis Results
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="paste" className="mt-0">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Paste your PGN text here..."
                      className="min-h-[400px] font-mono text-sm"
                      value={pgnText}
                      onChange={(e) => setPgnText(e.target.value)}
                    />
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => handleAnalyze(pgnText)}
                      disabled={isAnalyzing || !pgnText}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Analyze Games
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="mt-0">
                  <ImportDropzone onAnalyze={handleAnalyze} />
                </TabsContent>

                <TabsContent value="analysis" className="mt-0">
                  {analysis ? renderAnalysisResults() : (
                    <div className="text-center py-12 text-muted-foreground">
                      No analysis results available. Import a game to see the analysis.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>About PGN Format</AlertTitle>
            <AlertDescription className="mt-2">
              PGN (Portable Game Notation) is the standard format for recording chess games. Most chess platforms allow you to export your games in PGN format.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>File Size Limit</AlertTitle>
            <AlertDescription className="mt-2">
              Maximum file size: 5MB
              Supported format: .pgn files only
            </AlertDescription>
          </Alert>

          <Card className="p-6">
            <ScrollArea className="h-[400px] pr-4">
              <ProTips />
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  )
} 