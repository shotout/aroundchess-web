"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Wand, Settings, Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const trainingTopics = {
  openings: [
    { id: "basic-opening-principles", title: "Basic Opening Principles", level: "Beginner" },
    { id: "piece-movement", title: "Piece Movement and Basic Rules", level: "Beginner" },
    { id: "italian-game", title: "Italian Game", level: "Beginner" },
    { id: "london-system", title: "London System", level: "Beginner" },
    { id: "colle-system", title: "Colle System", level: "Beginner" },
    { id: "philidor-defense", title: "Philidor Defense", level: "Beginner" },
    { id: "four-knights", title: "Four Knights Game", level: "Beginner" },
    { id: "scotch-game", title: "Scotch Game", level: "Intermediate" },
    { id: "vienna-game", title: "Vienna Game", level: "Intermediate" },
    { id: "ruy-lopez", title: "Ruy Lopez", level: "Intermediate" },
    { id: "queens-gambit", title: "Queen's Gambit", level: "Intermediate" },
    { id: "sicilian-defense", title: "Sicilian Defense", level: "Advanced" },
    { id: "english-opening", title: "English Opening", level: "Intermediate" },
    { id: "kings-indian", title: "King's Indian Defense", level: "Advanced" },
    { id: "french-defense", title: "French Defense", level: "Intermediate" },
    { id: "caro-kann", title: "Caro-Kann Defense", level: "Intermediate" },
    { id: "pirc-defense", title: "Pirc Defense", level: "Intermediate" },
    { id: "nimzo-indian", title: "Nimzo-Indian Defense", level: "Advanced" },
    { id: "catalan-opening", title: "Catalan Opening", level: "Advanced" },
    { id: "dutch-defense", title: "Dutch Defense", level: "Advanced" },
    { id: "kings-gambit", title: "King's Gambit", level: "Advanced" },
    { id: "najdorf-sicilian", title: "Najdorf Sicilian", level: "Expert" },
    { id: "grunfeld-defense", title: "Grünfeld Defense", level: "Expert" },
    { id: "semi-slav", title: "Semi-Slav Defense", level: "Expert" },
    { id: "modern-benoni", title: "Modern Benoni", level: "Expert" },
    { id: "alekhine-defense", title: "Alekhine Defense", level: "Advanced" },
    { id: "birds-opening", title: "Bird's Opening", level: "Intermediate" },
    { id: "budapest-gambit", title: "Budapest Gambit", level: "Intermediate" },
    { id: "chigorin", title: "Chigorin Defense", level: "Intermediate" },
    { id: "accelerated-dragon", title: "Accelerated Dragon", level: "Advanced" },
    { id: "reti-opening", title: "Reti Opening", level: "Advanced" },
    { id: "kings-indian-attack", title: "King's Indian Attack", level: "Intermediate" },
    { id: "modern-defense", title: "Modern Defense", level: "Intermediate" },
    { id: "scandinavian-defense", title: "Scandinavian Defense", level: "Intermediate" },
    { id: "trompowsky-attack", title: "Trompowsky Attack", level: "Advanced" },
    { id: "benko-gambit", title: "Benko Gambit", level: "Advanced" },
    { id: "benoni-defense", title: "Benoni Defense", level: "Advanced" }
  ],
  middlegame: [
    { id: "basic-principles", title: "Basic Chess Principles", level: "Beginner" },
    { id: "basic-tactics", title: "Basic Tactics", level: "Beginner" },
    { id: "material-counting", title: "Material Value and Counting", level: "Beginner" },
    { id: "pattern-recognition", title: "Basic Pattern Recognition", level: "Beginner" },
    { id: "piece-coordination", title: "Piece Coordination", level: "Intermediate" },
    { id: "pawn-structures", title: "Pawn Structures", level: "Intermediate" },
    { id: "pawn-breaks", title: "Pawn Breaks", level: "Intermediate" },
    { id: "bishop-pair", title: "Playing with the Bishop Pair", level: "Intermediate" },
    { id: "rook-handling", title: "Rook Handling", level: "Intermediate" },
    { id: "knight-outposts", title: "Knight Outposts", level: "Intermediate" },
    { id: "attacking-the-king", title: "Attacking the King", level: "Intermediate" },
    { id: "exchange-decisions", title: "Exchange Decisions", level: "Intermediate" },
    { id: "tactical-combinations", title: "Tactical Combinations", level: "Intermediate" },
    { id: "defensive-resources", title: "Defensive Resources", level: "Intermediate" },
    { id: "positional-play", title: "Positional Play", level: "Advanced" },
    { id: "prophylaxis-prevention", title: "Prophylaxis and Prevention", level: "Advanced" },
    { id: "space-advantage", title: "Space Advantage", level: "Advanced" },
    { id: "calculation-skills", title: "Calculation Skills", level: "Advanced" },
    { id: "piece-activity", title: "Piece Activity", level: "Advanced" },
    { id: "strategic-planning", title: "Strategic Planning", level: "Advanced" },
    { id: "attacking-patterns", title: "Attacking Patterns", level: "Advanced" },
    { id: "defense-technique", title: "Defense Technique", level: "Advanced" },
    { id: "initiative", title: "Initiative", level: "Advanced" },
    { id: "transformation", title: "Position Transformation", level: "Expert" },
    { id: "compensation", title: "Compensation", level: "Advanced" },
    { id: "complex-sacrifices", title: "Complex Sacrifices", level: "Expert" },
    { id: "color-complex", title: "Color Complex Strategy", level: "Advanced" },
    { id: "zugzwang-creation", title: "Zugzwang Creation", level: "Expert" },
    { id: "breakthrough-sacrifices", title: "Breakthrough Sacrifices", level: "Advanced" },
    { id: "piece-domination", title: "Piece Domination", level: "Advanced" },
    { id: "dynamic-play", title: "Dynamic Play", level: "Advanced" },
    { id: "minor-piece-strategy", title: "Minor Piece Strategy", level: "Advanced" },
    { id: "isolated-queen-pawn", title: "Isolated Queen Pawn", level: "Advanced" },
    { id: "hanging-pawns", title: "Hanging Pawns Strategy", level: "Advanced" },
    { id: "pawn-majority", title: "Pawn Majority Strategy", level: "Advanced" },
    { id: "doubled-pawns", title: "Doubled Pawns Strategy", level: "Intermediate" },
    { id: "minority-attack", title: "Minority Attack", level: "Advanced" },
    { id: "prophylaxis", title: "Prophylaxis", level: "Advanced" }
  ],
  endgame: [
    { id: "basic-endgame-principles", title: "Basic Endgame Principles", level: "Beginner" },
    { id: "basic-checkmates", title: "Basic Checkmates", level: "Beginner" },
    { id: "king-and-pawn", title: "King and Pawn Endgames", level: "Intermediate" },
    { id: "basic-rook-endgames", title: "Basic Rook Endgames", level: "Intermediate" },
    { id: "basic-minor-piece", title: "Basic Minor Piece Endgames", level: "Intermediate" },
    { id: "drawing-techniques", title: "Drawing Techniques", level: "Advanced" },
    { id: "fortress-positions", title: "Fortress Positions", level: "Expert" },
    { id: "endgame-studies", title: "Endgame Studies", level: "Expert" },
    { id: "zugzwang-positions", title: "Zugzwang Positions", level: "Expert" },
    { id: "opposite-colored-bishops", title: "Opposite-Colored Bishops", level: "Advanced" },
    { id: "technical-winning", title: "Technical Winning Positions", level: "Advanced" },
    { id: "rook-vs-pawns", title: "Rook vs Pawns", level: "Advanced" },
    { id: "bishop-knight-mate", title: "Bishop and Knight Checkmate", level: "Expert" },
    { id: "pawn-breakthroughs", title: "Pawn Breakthroughs", level: "Advanced" },
    { id: "rook-bishop-vs-rook", title: "Rook and Bishop vs Rook", level: "Expert" },
    { id: "queen-vs-rook", title: "Queen vs Rook", level: "Expert" },
    { id: "rook-vs-minor", title: "Rook vs Minor Piece", level: "Advanced" },
    { id: "endgame-principles", title: "Advanced Endgame Principles", level: "Advanced" },
    { id: "endgame-tactics", title: "Endgame Tactics", level: "Advanced" },
    { id: "stalemate-patterns", title: "Stalemate Patterns", level: "Advanced" },
    { id: "same-colored-bishops", title: "Same-Colored Bishops", level: "Advanced" },
    { id: "knight-vs-bishop", title: "Knight vs Bishop", level: "Advanced" },
    { id: "queen-vs-pawn", title: "Queen vs Pawn", level: "Advanced" },
    { id: "technical-conversion", title: "Technical Conversion", level: "Advanced" },
    { id: "queen-endgames", title: "Queen Endgames", level: "Advanced" },
    { id: "minor-piece-endgames", title: "Minor Piece Endgames", level: "Advanced" },
    { id: "theoretical-endgames", title: "Theoretical Endgames", level: "Expert" },
    { id: "practical-endgame", title: "Practical Endgame Play", level: "Advanced" },
    { id: "endgame-calculation", title: "Endgame Calculation", level: "Advanced" },
    { id: "theoretical-positions", title: "Theoretical Positions", level: "Expert" },
    { id: "complex-queen-endgames", title: "Complex Queen Endgames", level: "Expert" },
    { id: "complex-minor-piece", title: "Complex Minor Piece Endgames", level: "Expert" },
    { id: "complex-rook-endgames", title: "Complex Rook Endgames", level: "Expert" },
    { id: "advanced-pawn-endgames", title: "Advanced Pawn Endgames", level: "Advanced" },
    { id: "queen-endgame-principles", title: "Queen Endgame Principles", level: "Advanced" },
    { id: "king-activity", title: "King Activity", level: "Advanced" }
  ]
}

const difficultyLevels = [
  { label: 'Beginner', elo: '0-1200', color: 'bg-green-100' },
  { label: 'Intermediate', elo: '1200-1800', color: 'bg-blue-100' },
  { label: 'Advanced', elo: '1800-2200', color: 'bg-purple-100' },
  { label: 'Expert', elo: '2200+', color: 'bg-red-100' }
]

export { trainingTopics }

export function CreatePlanModal() {
  const [planDuration, setPlanDuration] = useState("1")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopics, setSelectedTopics] = useState<Record<string, string[]>>({
    openings: [],
    middlegame: [],
    endgame: [],
  })
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([])

  const handleTopicSelection = (category: string, topicId: string) => {
    setSelectedTopics((prev) => {
      const currentSelection = prev[category]
      if (currentSelection.includes(topicId)) {
        return {
          ...prev,
          [category]: currentSelection.filter((id) => id !== topicId),
        }
      }
      if (currentSelection.length >= 3) {
        return prev
      }
      return {
        ...prev,
        [category]: [...currentSelection, topicId],
      }
    })
  }

  const handleDifficultyToggle = (difficulty: string) => {
    setSelectedDifficulty((prev) => {
      if (prev.includes(difficulty)) {
        return prev.filter((d) => d !== difficulty)
      }
      return [...prev, difficulty]
    })
  }

  const isTopicSelected = (category: string, topicId: string) => {
    return selectedTopics[category].includes(topicId)
  }

  const filterTopicsByDifficulty = (topics: any[]) => {
    if (selectedDifficulty.length === 0) return topics
    return topics.filter((topic) => selectedDifficulty.includes(topic.level))
  }

  const filterTopicsBySearch = (topics: any[]) => {
    if (!searchQuery) return filterTopicsByDifficulty(topics)
    return filterTopicsByDifficulty(topics).filter(topic =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wand className="h-4 w-4" />
          Create Training Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Create Your Training Plan</DialogTitle>
          <DialogDescription>
            Choose between an AI-generated plan or customize your own training path
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="auto" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="auto">
              <Brain className="mr-2 h-4 w-4" />
              AI Generated
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Settings className="mr-2 h-4 w-4" />
              Manual Selection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Plan Duration</h4>
                <Select value={planDuration} onValueChange={setPlanDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Generate Plan with Stockfish</Button>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-medium">Plan Duration</h4>
                <Select value={planDuration} onValueChange={setPlanDuration}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">Difficulty Level</h4>
                <div className="flex gap-2">
                  <TooltipProvider>
                    {difficultyLevels.map((level) => (
                      <Tooltip key={level.label}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className={`${
                              selectedDifficulty.includes(level.label)
                                ? level.color
                                : ""
                            }`}
                            onClick={() => handleDifficultyToggle(level.label)}
                          >
                            {level.label}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ELO Range: {level.elo}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </div>

              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search topics..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Opening Repertoire (Select up to 3)</h4>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <div className="space-y-2">
                      {filterTopicsBySearch(trainingTopics.openings).map((topic) => (
                        <Card
                          key={topic.id}
                          className={`cursor-pointer p-4 transition-colors ${
                            isTopicSelected("openings", topic.id)
                              ? "border-primary bg-primary/5"
                              : ""
                          }`}
                          onClick={() => handleTopicSelection("openings", topic.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{topic.title}</p>
                              <Badge variant="secondary">{topic.level}</Badge>
                            </div>
                            <Checkbox
                              checked={isTopicSelected("openings", topic.id)}
                              onCheckedChange={() =>
                                handleTopicSelection("openings", topic.id)
                              }
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Middlegame Topics (Select up to 3)</h4>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <div className="space-y-2">
                      {filterTopicsBySearch(trainingTopics.middlegame).map((topic) => (
                        <Card
                          key={topic.id}
                          className={`cursor-pointer p-4 transition-colors ${
                            isTopicSelected("middlegame", topic.id)
                              ? "border-primary bg-primary/5"
                              : ""
                          }`}
                          onClick={() => handleTopicSelection("middlegame", topic.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{topic.title}</p>
                              <Badge variant="secondary">{topic.level}</Badge>
                            </div>
                            <Checkbox
                              checked={isTopicSelected("middlegame", topic.id)}
                              onCheckedChange={() =>
                                handleTopicSelection("middlegame", topic.id)
                              }
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Endgame Topics (Select up to 3)</h4>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <div className="space-y-2">
                      {filterTopicsBySearch(trainingTopics.endgame).map((topic) => (
                        <Card
                          key={topic.id}
                          className={`cursor-pointer p-4 transition-colors ${
                            isTopicSelected("endgame", topic.id)
                              ? "border-primary bg-primary/5"
                              : ""
                          }`}
                          onClick={() => handleTopicSelection("endgame", topic.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{topic.title}</p>
                              <Badge variant="secondary">{topic.level}</Badge>
                            </div>
                            <Checkbox
                              checked={isTopicSelected("endgame", topic.id)}
                              onCheckedChange={() =>
                                handleTopicSelection("endgame", topic.id)
                              }
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <Button className="flex-1">Create Custom Plan</Button>
                <Button variant="secondary" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Plan
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 