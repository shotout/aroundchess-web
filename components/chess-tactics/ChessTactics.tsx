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
import { PinMechanisms } from "./PinMechanisms"
import { ForkTechniques } from "./ForkTechniques"
import { DiscoveryAttacks } from "./DiscoveryAttacks"
import { DoubleAttacks } from "./DoubleAttacks"
import { SkewerTactics } from "./SkewerTactics"
import { DeflectionTactics } from "./DeflectionTactics"
import { OverloadingConcepts } from "./OverloadingConcepts"
import { InterferenceTactics } from "./InterferenceTactics"
import { ClearanceSacrifices } from "./ClearanceSacrifices"
import { CombinationPatterns } from "./CombinationPatterns"
import { ChessTacticsProgressProvider, useChessTacticsProgress } from "@/contexts/ChessTacticsProgressContext"
import { useInView } from "react-intersection-observer"
import {
  Magnet,
  GitFork,
  Eye,
  Swords,
  Scissors,
  MoveRight,
  Weight,
  BanIcon as Prohibit,
  Eraser,
  Combine,
} from "lucide-react"

const chessTacticsTopics = [
  {
    id: "pin-mechanisms",
    title: "Pin Mechanisms",
    icon: <Magnet className="h-5 w-5" />,
    description: "Learn about absolute and relative pins",
  },
  {
    id: "fork-techniques",
    title: "Fork Techniques",
    icon: <GitFork className="h-5 w-5" />,
    description: "Master the art of attacking multiple pieces",
  },
  {
    id: "discovery-attacks",
    title: "Discovery Attacks",
    icon: <Eye className="h-5 w-5" />,
    description: "Understand how to reveal hidden attacks",
  },
  {
    id: "double-attacks",
    title: "Double Attacks",
    icon: <Swords className="h-5 w-5" />,
    description: "Learn to create multiple threats simultaneously",
  },
  {
    id: "skewer-tactics",
    title: "Skewer Tactics",
    icon: <Scissors className="h-5 w-5" />,
    description: "Explore the reverse pin tactic",
  },
  {
    id: "deflection-tactics",
    title: "Deflection Tactics",
    icon: <MoveRight className="h-5 w-5" />,
    description: "Learn to lure pieces away from key squares",
  },
  {
    id: "overloading-concepts",
    title: "Overloading Concepts",
    icon: <Weight className="h-5 w-5" />,
    description: "Understand how to exploit overloaded pieces",
  },
  {
    id: "interference-tactics",
    title: "Interference Tactics",
    icon: <Prohibit className="h-5 w-5" />,
    description: "Master the art of blocking defensive pieces",
  },
  {
    id: "clearance-sacrifices",
    title: "Clearance Sacrifices",
    icon: <Eraser className="h-5 w-5" />,
    description: "Learn to clear lines and squares with sacrifices",
  },
  {
    id: "combination-patterns",
    title: "Combination Patterns",
    icon: <Combine className="h-5 w-5" />,
    description: "Study complex tactical combinations",
  },
]

function SidebarContent({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const { progress, isCompleted } = useChessTacticsProgress()
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
          {chessTacticsTopics.map((item, index) => (
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

function ChessTacticsContent() {
  const [activeTab, setActiveTab] = useState("pin-mechanisms")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Chess Tactics</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master essential chess tactics to improve your gameplay. Explore key concepts like pins, forks, discovery
            attacks, and more advanced tactical motifs to gain an edge over your opponents.
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
                <TabsContent value="pin-mechanisms">
                  <PinMechanisms />
                </TabsContent>
                <TabsContent value="fork-techniques">
                  <ForkTechniques />
                </TabsContent>
                <TabsContent value="discovery-attacks">
                  <DiscoveryAttacks />
                </TabsContent>
                <TabsContent value="double-attacks">
                  <DoubleAttacks />
                </TabsContent>
                <TabsContent value="skewer-tactics">
                  <SkewerTactics />
                </TabsContent>
                <TabsContent value="deflection-tactics">
                  <DeflectionTactics />
                </TabsContent>
                <TabsContent value="overloading-concepts">
                  <OverloadingConcepts />
                </TabsContent>
                <TabsContent value="interference-tactics">
                  <InterferenceTactics />
                </TabsContent>
                <TabsContent value="clearance-sacrifices">
                  <ClearanceSacrifices />
                </TabsContent>
                <TabsContent value="combination-patterns">
                  <CombinationPatterns />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ChessTactics() {
  return (
    <ChessTacticsProgressProvider>
      <ChessTacticsContent />
    </ChessTacticsProgressProvider>
  )
}

