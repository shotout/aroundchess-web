"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  History,
  TrendingUp,
  Lightbulb,
  Sparkles,
  Flame,
  Users,
  Medal,
  Trophy,
  Gamepad2,
  BookMarked,
} from "lucide-react"
import ModernClassics from "./ModernClassics"
import HistoricalMasterpieces from "./HistoricalMasterpieces"
import InstructiveAnalysis from "./InstructiveAnalysis"

const famousGamesTopics = [
  {
    id: "historical-masterpieces",
    title: "Historical Masterpieces",
    icon: <History className="h-6 w-6 text-primary" />,
    description: "Study classic games from chess history",
  },
  {
    id: "modern-classics",
    title: "Modern Classics",
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    description: "Analyze contemporary masterpieces",
  },
  {
    id: "instructive-analysis",
    title: "Instructive Analysis",
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
    description: "Learn from detailed game analysis",
  },
  {
    id: "famous-combinations",
    title: "Famous Combinations",
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    description: "Study brilliant tactical sequences",
  },
  {
    id: "notable-sacrifices",
    title: "Notable Sacrifices",
    icon: <Flame className="h-6 w-6 text-primary" />,
    description: "Learn about game-changing sacrifices",
  },
  {
    id: "legendary-players",
    title: "Legendary Players",
    icon: <Users className="h-6 w-6 text-primary" />,
    description: "Games from chess legends",
  },
  {
    id: "tournament-highlights",
    title: "Tournament Highlights",
    icon: <Medal className="h-6 w-6 text-primary" />,
    description: "Key games from major tournaments",
  },
  {
    id: "world-championships",
    title: "World Championships",
    icon: <Trophy className="h-6 w-6 text-primary" />,
    description: "Historic world championship matches",
  },
  {
    id: "interactive-explorer",
    title: "Interactive Explorer",
    icon: <Gamepad2 className="h-6 w-6 text-primary" />,
    description: "Explore games interactively",
  },
  {
    id: "annotated-collection",
    title: "Annotated Collection",
    icon: <BookMarked className="h-6 w-6 text-primary" />,
    description: "Games with detailed annotations",
  },
]

export default function FamousGames() {
  const [activeTab, setActiveTab] = useState("historical-masterpieces")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Famous Chess Games</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore a curated collection of famous chess games, spanning different eras and styles. Analyze historical
          masterpieces, modern classics, and instructive examples to deepen your understanding of chess strategy and
          tactics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {famousGamesTopics.map((topic) => (
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
            <TabsContent value="historical-masterpieces">
              <HistoricalMasterpieces />
            </TabsContent>
            <TabsContent value="modern-classics">
              <ModernClassics />
            </TabsContent>
            <TabsContent value="instructive-analysis">
              <InstructiveAnalysis />
            </TabsContent>
            {/* Add other tab contents as they are developed */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

