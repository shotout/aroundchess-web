"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Swords,
  PianoIcon as ChessPawn,
  RocketIcon as ChessRook,
  ChurchIcon as ChessBishop,
  DiamondIcon as ChessQueen,
  CastleIcon as ChessKing,
  ArrowLeftRight,
  Divide,
  Pause,
  BookOpen,
} from "lucide-react"
import { BasicCheckmates } from "./BasicCheckmates"
import { PawnEndgames } from "./PawnEndgames"
import { RookEndgames } from "./RookEndgames"
import { MinorPieceEndgames } from "./MinorPieceEndgames"
import { QueenEndgames } from "./QueenEndgames"
import { KingActivity } from "./KingActivity"
import { OppositionConcepts } from "./OppositionConcepts"
import { DrawingTechniques } from "./DrawingTechniques"
import { ZugzwangPositions } from "./ZugzwangPositions"
import { TheoreticalEndgames } from "./TheoreticalEndgames"

const endgameTopics = [
  {
    id: "basic-checkmates",
    title: "Basic Checkmate Patterns",
    icon: <Swords className="h-6 w-6 text-primary" />,
    description: "Learn essential checkmate patterns",
  },
  {
    id: "pawn-endgames",
    title: "Pawn Endgames",
    icon: <ChessPawn className="h-6 w-6 text-primary" />,
    description: "Master pawn endgame techniques",
  },
  {
    id: "rook-endgames",
    title: "Rook Endgames",
    icon: <ChessRook className="h-6 w-6 text-primary" />,
    description: "Understand common rook endgame positions",
  },
  {
    id: "minor-piece-endgames",
    title: "Minor Piece Endgames",
    icon: <ChessBishop className="h-6 w-6 text-primary" />,
    description: "Study endgames with knights and bishops",
  },
  {
    id: "queen-endgames",
    title: "Queen Endgames",
    icon: <ChessQueen className="h-6 w-6 text-primary" />,
    description: "Explore queen endgame strategies",
  },
  {
    id: "king-activity",
    title: "King Activity",
    icon: <ChessKing className="h-6 w-6 text-primary" />,
    description: "Learn to utilize your king effectively",
  },
  {
    id: "opposition-concepts",
    title: "Opposition Concepts",
    icon: <ArrowLeftRight className="h-6 w-6 text-primary" />,
    description: "Understand the power of opposition",
  },
  {
    id: "drawing-techniques",
    title: "Drawing Techniques",
    icon: <Divide className="h-6 w-6 text-primary" />,
    description: "Learn how to secure a draw in tough positions",
  },
  {
    id: "zugzwang-positions",
    title: "Zugzwang Positions",
    icon: <Pause className="h-6 w-6 text-primary" />,
    description: "Recognize and create zugzwang",
  },
  {
    id: "theoretical-endgames",
    title: "Theoretical Endgames",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    description: "Study important theoretical endgame positions",
  },
]

export default function EndgameBasics() {
  const [activeTab, setActiveTab] = useState("basic-checkmates")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Endgame Basics</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master essential endgame techniques and concepts to improve your chess gameplay. Explore key topics like
          basic checkmates, pawn endgames, and theoretical positions to gain an edge in the final stage of the game.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {endgameTopics.map((topic) => (
          <Card 
            key={topic.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setActiveTab(topic.id)}
          >
            <div className="flex flex-col items-center text-center gap-2">
              {topic.icon}
              <h3 className="font-medium">{topic.title}</h3>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="basic-checkmates">
              <BasicCheckmates />
            </TabsContent>
            <TabsContent value="pawn-endgames">
              <PawnEndgames />
            </TabsContent>
            <TabsContent value="rook-endgames">
              <RookEndgames />
            </TabsContent>
            <TabsContent value="minor-piece-endgames">
              <MinorPieceEndgames />
            </TabsContent>
            <TabsContent value="queen-endgames">
              <QueenEndgames />
            </TabsContent>
            <TabsContent value="king-activity">
              <KingActivity />
            </TabsContent>
            <TabsContent value="opposition-concepts">
              <OppositionConcepts />
            </TabsContent>
            <TabsContent value="drawing-techniques">
              <DrawingTechniques />
            </TabsContent>
            <TabsContent value="zugzwang-positions">
              <ZugzwangPositions />
            </TabsContent>
            <TabsContent value="theoretical-endgames">
              <TheoreticalEndgames />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

