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
import { EndgameProgressProvider, useEndgameProgress } from "@/contexts/EndgameProgressContext"
import { useInView } from "react-intersection-observer"
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

const endgameTopics = [
  {
    id: "basic-checkmates",
    title: "Basic Checkmate Patterns",
    icon: <Swords className="h-5 w-5" />,
    description: "Learn essential checkmate patterns",
  },
  {
    id: "pawn-endgames",
    title: "Pawn Endgames",
    icon: <ChessPawn className="h-5 w-5" />,
    description: "Master pawn endgame techniques",
  },
  {
    id: "rook-endgames",
    title: "Rook Endgames",
    icon: <ChessRook className="h-5 w-5" />,
    description: "Understand common rook endgame positions",
  },
  {
    id: "minor-piece-endgames",
    title: "Minor Piece Endgames",
    icon: <ChessBishop className="h-5 w-5" />,
    description: "Study endgames with knights and bishops",
  },
  {
    id: "queen-endgames",
    title: "Queen Endgames",
    icon: <ChessQueen className="h-5 w-5" />,
    description: "Explore queen endgame strategies",
  },
  {
    id: "king-activity",
    title: "King Activity in Endgames",
    icon: <ChessKing className="h-5 w-5" />,
    description: "Learn to utilize your king effectively",
  },
  {
    id: "opposition-concepts",
    title: "Opposition Concepts",
    icon: <ArrowLeftRight className="h-5 w-5" />,
    description: "Understand the power of opposition",
  },
  {
    id: "drawing-techniques",
    title: "Drawing Techniques",
    icon: <Divide className="h-5 w-5" />,
    description: "Learn how to secure a draw in tough positions",
  },
  {
    id: "zugzwang-positions",
    title: "Zugzwang Positions",
    icon: <Pause className="h-5 w-5" />,
    description: "Recognize and create zugzwang",
  },
  {
    id: "theoretical-endgames",
    title: "Theoretical Endgames",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Study important theoretical endgame positions",
  },
]

function SidebarContent({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const { progress, isCompleted } = useEndgameProgress()
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
          {endgameTopics.map((item, index) => (
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

function EndgameBasicsContent() {
  const [activeTab, setActiveTab] = useState("basic-checkmates")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Endgame Basics</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master essential endgame techniques and concepts to improve your chess gameplay. Explore key topics like
            basic checkmates, pawn endgames, and theoretical positions to gain an edge in the final stage of the game.
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
      </div>
    </div>
  )
}

export default function EndgameBasics() {
  return (
    <EndgameProgressProvider>
      <EndgameBasicsContent />
    </EndgameProgressProvider>
  )
}

