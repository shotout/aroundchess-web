"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CheckCircle, Menu } from "lucide-react"
import { PositionalPlayProgressProvider, usePositionalPlayProgress } from "@/contexts/PositionalPlayProgressContext"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
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

const positionalPlayTopics = [
  {
    id: "pawn-structure-analysis",
    title: "Pawn Structure Analysis",
    icon: <ListChecks className="h-5 w-5" />,
    description: "Analyze pawn structures and their impact on the position.",
  },
  {
    id: "piece-placement-principles",
    title: "Piece Placement Principles",
    icon: <ListTodo className="h-5 w-5" />,
    description: "Learn key principles for effective piece placement.",
  },
  {
    id: "square-control",
    title: "Square Control",
    icon: <EmptySquare className="h-5 w-5" />,
    description: "Understand how to control important squares on the board.",
  },
  {
    id: "prophylaxis-concepts",
    title: "Prophylaxis Concepts",
    icon: <ShieldCheck className="h-5 w-5" />,
    description: "Learn how to prevent your opponent's plans.",
  },
  {
    id: "weak-square-exploitation",
    title: "Weak Square Exploitation",
    icon: <SquareRoundedArrowDown className="h-5 w-5" />,
    description: "Identify and exploit weaknesses in your opponent's position.",
  },
  {
    id: "bishop-pair-utilization",
    title: "Bishop Pair Utilization",
    icon: <Church className="h-5 w-5" />,
    description: "Maximize the power of the bishop pair.",
  },
  {
    id: "knight-outpost-positions",
    title: "Knight Outpost Positions",
    icon: <ChessKnight className="h-5 w-5" />,
    description: "Establish and utilize strong knight outposts.",
  },
  {
    id: "space-advantage-usage",
    title: "Space Advantage Usage",
    icon: <ArrowsExpand className="h-5 w-5" />,
    description: "Create and exploit space advantages on the board.",
  },
  {
    id: "blockade-techniques",
    title: "Blockade Techniques",
    icon: <ListDashes className="h-5 w-5" />,
    description: "Restrict your opponent's pieces with blockades.",
  },
  {
    id: "strategic-sacrifices",
    title: "Strategic Sacrifices",
    icon: <X className="h-5 w-5" />,
    description: "Learn when and how to make strategic sacrifices.",
  },
]

function SidebarContent({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const { progress, isCompleted } = usePositionalPlayProgress()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

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
          {positionalPlayTopics.map((item, index) => (
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

export default function PositionalPlay() {
  const [activeTab, setActiveTab] = useState("pawn-structure-analysis")

  return (
    <PositionalPlayProgressProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Positional Play</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Master the art of positional chess. Learn how to analyze pawn structures, place your pieces effectively,
              control key squares, and formulate long-term strategic plans.
            </p>
          </div>

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
                  <div className="space-y-6 w-full">
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
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PositionalPlayProgressProvider>
  )
}

