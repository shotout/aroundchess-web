"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PuzzleIcon as ChessPiece,
  PianoIcon as ChessPawn,
  DiamondIcon as ChessQueen,
  Move3D,
  PenIcon as Pattern,
  Scale,
  Shield,
  Swords,
  Target,
} from "lucide-react"
import { PieceCoordination } from "./PieceCoordination"
import { AttackConstruction } from "./AttackConstruction"
import { DefenseTechniques } from "./DefenseTechniques"
import { PawnStructureAnalysis } from "./PawnStructureAnalysis"
import { SpaceAdvantageConcepts } from "./SpaceAdvantageConcepts"
import { PieceActivityOptimization } from "./PieceActivityOptimization"
import { StrategicPlanning } from "./StrategicPlanning"
import { PositionEvaluation } from "./PositionEvaluation"
import { CommonMiddlegamePatterns } from "./CommonMiddlegamePatterns"
import { TacticalOpportunities } from "./TacticalOpportunities"

const middleGameTopics = [
  {
    id: "piece-coordination",
    title: "Piece Coordination",
    icon: <ChessPiece className="h-6 w-6 text-primary" />,
    description: "Learn how to coordinate your pieces effectively",
  },
  {
    id: "attack-construction",
    title: "Attack Construction",
    icon: <Swords className="h-6 w-6 text-primary" />,
    description: "Master the art of building successful attacks",
  },
  {
    id: "defense-techniques",
    title: "Defense Techniques",
    icon: <Shield className="h-6 w-6 text-primary" />,
    description: "Develop strong defensive skills",
  },
  {
    id: "pawn-structure-analysis",
    title: "Pawn Structure Analysis",
    icon: <ChessPawn className="h-6 w-6 text-primary" />,
    description: "Understand the importance of pawn structures",
  },
  {
    id: "space-advantage-concepts",
    title: "Space Advantage",
    icon: <Move3D className="h-6 w-6 text-primary" />,
    description: "Learn to utilize space effectively",
  },
  {
    id: "piece-activity-optimization",
    title: "Piece Activity",
    icon: <Target className="h-6 w-6 text-primary" />,
    description: "Maximize the potential of your pieces",
  },
  {
    id: "strategic-planning",
    title: "Strategic Planning",
    icon: <ChessQueen className="h-6 w-6 text-primary" />,
    description: "Develop short-term and long-term plans",
  },
  {
    id: "position-evaluation",
    title: "Position Evaluation",
    icon: <Scale className="h-6 w-6 text-primary" />,
    description: "Learn to assess chess positions accurately",
  },
  {
    id: "common-middlegame-patterns",
    title: "Common Patterns",
    icon: <Pattern className="h-6 w-6 text-primary" />,
    description: "Recognize and utilize frequent middlegame patterns",
  },
  {
    id: "tactical-opportunities",
    title: "Tactical Opportunities",
    icon: <Target className="h-6 w-6 text-primary" />,
    description: "Spot and exploit tactical chances in the middlegame",
  },
]

export default function MiddleGameStrategies() {
  const [activeTab, setActiveTab] = useState("piece-coordination")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Middle Game Strategies</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master essential middlegame strategies to improve your gameplay. Explore key concepts like piece coordination,
          attack construction, and strategic planning to gain an edge over your opponents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {middleGameTopics.map((topic) => (
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
            <TabsContent value="piece-coordination">
              <PieceCoordination />
            </TabsContent>
            <TabsContent value="attack-construction">
              <AttackConstruction />
            </TabsContent>
            <TabsContent value="defense-techniques">
              <DefenseTechniques />
            </TabsContent>
            <TabsContent value="pawn-structure-analysis">
              <PawnStructureAnalysis />
            </TabsContent>
            <TabsContent value="space-advantage-concepts">
              <SpaceAdvantageConcepts />
            </TabsContent>
            <TabsContent value="piece-activity-optimization">
              <PieceActivityOptimization />
            </TabsContent>
            <TabsContent value="strategic-planning">
              <StrategicPlanning />
            </TabsContent>
            <TabsContent value="position-evaluation">
              <PositionEvaluation />
            </TabsContent>
            <TabsContent value="common-middlegame-patterns">
              <CommonMiddlegamePatterns />
            </TabsContent>
            <TabsContent value="tactical-opportunities">
              <TacticalOpportunities />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

