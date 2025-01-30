"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  ListChecks,
  ListTodo,
  SquareIcon as EmptySquare,
  ShieldCheck,
  SquareArrowDownIcon as SquareRoundedArrowDown,
  Church,
  CastleIcon as ChessKnight,
  ExpandIcon as ArrowsExpand,
  CircleDashedIcon as ListDashes,
  X,
} from "lucide-react"
import { PawnStructureAnalysis } from "./PawnStructureAnalysis"
import { PiecePlacementPrinciples } from "./PiecePlacementPrinciples"
import { SquareControl } from "./SquareControl"
import { ProphylaxisConcepts } from "./ProphylaxisConcepts"
import { WeakSquareExploitation } from "./WeakSquareExploitation"
import { BishopPairUtilization } from "./BishopPairUtilization"
import { KnightOutpostPositions } from "./KnightOutpostPositions"
import { SpaceAdvantageUsage } from "./SpaceAdvantageUsage"
import { BlockadeTechniques } from "./BlockadeTechniques"
import { StrategicSacrifices } from "./StrategicSacrifices"

const positionalPlayTopics = [
  {
    id: "pawn-structure-analysis",
    title: "Pawn Structure",
    icon: <ListChecks className="h-6 w-6 text-primary" />,
    description: "Analyze pawn structures and their impact on the position.",
  },
  {
    id: "piece-placement-principles",
    title: "Piece Placement",
    icon: <ListTodo className="h-6 w-6 text-primary" />,
    description: "Learn key principles for effective piece placement.",
  },
  {
    id: "square-control",
    title: "Square Control",
    icon: <EmptySquare className="h-6 w-6 text-primary" />,
    description: "Understand how to control important squares on the board.",
  },
  {
    id: "prophylaxis-concepts",
    title: "Prophylaxis",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    description: "Learn how to prevent your opponent's plans.",
  },
  {
    id: "weak-square-exploitation",
    title: "Weak Squares",
    icon: <SquareRoundedArrowDown className="h-6 w-6 text-primary" />,
    description: "Identify and exploit weaknesses in your opponent's position.",
  },
  {
    id: "bishop-pair-utilization",
    title: "Bishop Pair",
    icon: <Church className="h-6 w-6 text-primary" />,
    description: "Maximize the power of the bishop pair.",
  },
  {
    id: "knight-outpost-positions",
    title: "Knight Outposts",
    icon: <ChessKnight className="h-6 w-6 text-primary" />,
    description: "Establish and utilize strong knight outposts.",
  },
  {
    id: "space-advantage-usage",
    title: "Space Advantage",
    icon: <ArrowsExpand className="h-6 w-6 text-primary" />,
    description: "Create and exploit space advantages on the board.",
  },
  {
    id: "blockade-techniques",
    title: "Blockades",
    icon: <ListDashes className="h-6 w-6 text-primary" />,
    description: "Restrict your opponent's pieces with blockades.",
  },
  {
    id: "strategic-sacrifices",
    title: "Strategic Sacrifices",
    icon: <X className="h-6 w-6 text-primary" />,
    description: "Learn when and how to make strategic sacrifices.",
  },
]

export default function PositionalPlay() {
  const [activeTab, setActiveTab] = useState("pawn-structure-analysis")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Positional Play</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the art of positional chess. Learn how to analyze pawn structures, place your pieces effectively,
          control key squares, and formulate long-term strategic plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {positionalPlayTopics.map((topic) => (
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
            <TabsContent value="pawn-structure-analysis">
              <PawnStructureAnalysis />
            </TabsContent>
            <TabsContent value="piece-placement-principles">
              <PiecePlacementPrinciples />
            </TabsContent>
            <TabsContent value="square-control">
              <SquareControl />
            </TabsContent>
            <TabsContent value="prophylaxis-concepts">
              <ProphylaxisConcepts />
            </TabsContent>
            <TabsContent value="weak-square-exploitation">
              <WeakSquareExploitation />
            </TabsContent>
            <TabsContent value="bishop-pair-utilization">
              <BishopPairUtilization />
            </TabsContent>
            <TabsContent value="knight-outpost-positions">
              <KnightOutpostPositions />
            </TabsContent>
            <TabsContent value="space-advantage-usage">
              <SpaceAdvantageUsage />
            </TabsContent>
            <TabsContent value="blockade-techniques">
              <BlockadeTechniques />
            </TabsContent>
            <TabsContent value="strategic-sacrifices">
              <StrategicSacrifices />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

