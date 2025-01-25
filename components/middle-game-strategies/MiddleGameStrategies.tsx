"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CheckCircle, Menu } from "lucide-react"
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
import { MiddleGameProgressProvider, useMiddleGameProgress } from "@/contexts/MiddleGameProgressContext"
import { ChessExample } from "../chess/ChessExample"
// import { LearningPathVisualizer } from "./LearningPathVisualizer" //Removed as per update 1
import { useInView } from "react-intersection-observer"
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

const middleGameTopics = [
  {
    id: "piece-coordination",
    title: "Piece Coordination",
    icon: <ChessPiece className="h-5 w-5" />,
    description: "Learn how to coordinate your pieces effectively",
  },
  {
    id: "attack-construction",
    title: "Attack Construction",
    icon: <Swords className="h-5 w-5" />,
    description: "Master the art of building successful attacks",
  },
  {
    id: "defense-techniques",
    title: "Defense Techniques",
    icon: <Shield className="h-5 w-5" />,
    description: "Develop strong defensive skills",
  },
  {
    id: "pawn-structure-analysis",
    title: "Pawn Structure Analysis",
    icon: <ChessPawn className="h-5 w-5" />,
    description: "Understand the importance of pawn structures",
  },
  {
    id: "space-advantage-concepts",
    title: "Space Advantage Concepts",
    icon: <Move3D className="h-5 w-5" />,
    description: "Learn to utilize space effectively",
  },
  {
    id: "piece-activity-optimization",
    title: "Piece Activity Optimization",
    icon: <Target className="h-5 w-5" />,
    description: "Maximize the potential of your pieces",
  },
  {
    id: "strategic-planning",
    title: "Strategic Planning",
    icon: <ChessQueen className="h-5 w-5" />,
    description: "Develop short-term and long-term plans",
  },
  {
    id: "position-evaluation",
    title: "Position Evaluation",
    icon: <Scale className="h-5 w-5" />,
    description: "Learn to assess chess positions accurately",
  },
  {
    id: "common-middlegame-patterns",
    title: "Common Middlegame Patterns",
    icon: <Pattern className="h-5 w-5" />,
    description: "Recognize and utilize frequent middlegame patterns",
  },
  {
    id: "tactical-opportunities",
    title: "Tactical Opportunities",
    icon: <Target className="h-5 w-5" />,
    description: "Spot and exploit tactical chances in the middlegame",
  },
]

function SidebarContent({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const { progress, isCompleted } = useMiddleGameProgress()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div className="p-4 flex-1 flex flex-col h-full" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-4 flex-shrink-0"
      >
        <h3 className="text-sm font-medium mb-2">Learning Progress</h3>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-500 mt-1">{progress}% Complete</p>
      </motion.div>
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-1 pr-4">
          {middleGameTopics.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                ${activeTab === item.id ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-90">{item.description}</div>
                </div>
                {isCompleted(item.id) && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function MiddleGameStrategiesContent() {
  const [activeTab, setActiveTab] = useState("piece-coordination")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Middle Game Strategies</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master essential middlegame strategies to elevate your chess gameplay. Explore key concepts like piece
            coordination, attack construction, and strategic planning to gain an edge over your opponents.
          </p>
        </motion.div>

        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Menu className="mr-2 h-4 w-4" />
                Select Topic
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <div className="hidden lg:block">
            <Card className="sticky top-4 h-[calc(100vh-8rem)] flex flex-col">
              <CardContent className="p-0">
                <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
              </CardContent>
            </Card>
          </div>

          <Card className="border shadow-sm min-h-[calc(100vh-8rem)]">
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
      </div>
    </div>
  )
}

export default function MiddleGameStrategies() {
  return (
    <MiddleGameProgressProvider>
      <MiddleGameStrategiesContent />
    </MiddleGameProgressProvider>
  )
}

