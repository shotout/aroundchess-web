"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const chessTacticsTopics = [
  {
    id: "pin-mechanisms",
    title: "Pin Mechanisms",
    icon: <Magnet className="h-6 w-6 text-primary" />,
    description: "Learn about absolute and relative pins",
  },
  {
    id: "fork-techniques",
    title: "Fork Techniques",
    icon: <GitFork className="h-6 w-6 text-primary" />,
    description: "Master the art of attacking multiple pieces",
  },
  {
    id: "discovery-attacks",
    title: "Discovery Attacks",
    icon: <Eye className="h-6 w-6 text-primary" />,
    description: "Understand how to reveal hidden attacks",
  },
  {
    id: "double-attacks",
    title: "Double Attacks",
    icon: <Swords className="h-6 w-6 text-primary" />,
    description: "Learn to create multiple threats simultaneously",
  },
  {
    id: "skewer-tactics",
    title: "Skewer Tactics",
    icon: <Scissors className="h-6 w-6 text-primary" />,
    description: "Explore the reverse pin tactic",
  },
  {
    id: "deflection-tactics",
    title: "Deflection Tactics",
    icon: <MoveRight className="h-6 w-6 text-primary" />,
    description: "Learn to lure pieces away from key squares",
  },
  {
    id: "overloading-concepts",
    title: "Overloading",
    icon: <Weight className="h-6 w-6 text-primary" />,
    description: "Understand how to exploit overloaded pieces",
  },
  {
    id: "interference-tactics",
    title: "Interference",
    icon: <Prohibit className="h-6 w-6 text-primary" />,
    description: "Master the art of blocking defensive pieces",
  },
  {
    id: "clearance-sacrifices",
    title: "Clearance",
    icon: <Eraser className="h-6 w-6 text-primary" />,
    description: "Learn to clear lines and squares with sacrifices",
  },
  {
    id: "combination-patterns",
    title: "Combinations",
    icon: <Combine className="h-6 w-6 text-primary" />,
    description: "Study complex tactical combinations",
  },
]

function ChessTacticsContent() {
  const [activeTab, setActiveTab] = useState("pin-mechanisms")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Chess Tactics</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master essential chess tactics to improve your gameplay. Explore key concepts like pins, forks, discovery
          attacks, and more advanced tactical motifs to gain an edge over your opponents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {chessTacticsTopics.map((topic) => (
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
  )
}

export function ChessTactics() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ChessTacticsContent />
      </main>
      <SiteFooter />
    </div>
  )
}

export default ChessTactics

