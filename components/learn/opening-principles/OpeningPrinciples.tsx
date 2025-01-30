'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
} from 'lucide-react'
import { CorePrinciples } from './CorePrinciples'
import { PopularOpenings } from './PopularOpenings'
import { OpeningTraps } from './OpeningTraps'
import { CommonMistakes } from './CommonMistakes'
import { RepertoireBuilder } from './RepertoireBuilder'
import { UnderstandingTempo } from './UnderstandingTempo'
import { CenterControl } from './CenterControl'
import { DevelopmentStrategies } from './DevelopmentStrategies'
import { OpeningExplorer } from './OpeningExplorer'
import { HistoricalAnalysis } from './HistoricalAnalysis'

const openingTopics = [
  { 
    id: 'core-principles', 
    title: 'Core Opening Principles', 
    icon: <ChessPiece className="h-6 w-6 text-primary" />,
    description: 'Learn the fundamental principles for a strong opening'
  },
  { 
    id: 'popular-openings', 
    title: 'Popular Opening Families', 
    icon: <ChessPawn className="h-6 w-6 text-primary" />,
    description: 'Explore common and effective chess openings'
  },
  { 
    id: 'opening-traps', 
    title: 'Opening Traps', 
    icon: <Pattern className="h-6 w-6 text-primary" />,
    description: 'Recognize and avoid common opening traps'
  },
  { 
    id: 'common-mistakes', 
    title: 'Common Mistakes', 
    icon: <Scale className="h-6 w-6 text-primary" />,
    description: 'Learn from typical errors made in the opening'
  },
  { 
    id: 'repertoire-builder', 
    title: 'Repertoire Builder', 
    icon: <ChessQueen className="h-6 w-6 text-primary" />,
    description: 'Develop your personal opening repertoire'
  },
  { 
    id: 'understanding-tempo', 
    title: 'Understanding Tempo', 
    icon: <Move3D className="h-6 w-6 text-primary" />,
    description: 'Master the concept of tempo in chess openings'
  },
  { 
    id: 'center-control', 
    title: 'Center Control', 
    icon: <Target className="h-6 w-6 text-primary" />,
    description: 'Learn techniques to control the center of the board'
  },
  { 
    id: 'development-strategies', 
    title: 'Development', 
    icon: <Shield className="h-6 w-6 text-primary" />,
    description: 'Understand how to efficiently develop your pieces'
  },
  { 
    id: 'opening-explorer', 
    title: 'Opening Explorer', 
    icon: <Swords className="h-6 w-6 text-primary" />,
    description: 'Explore and analyze various opening lines'
  },
  { 
    id: 'historical-analysis', 
    title: 'Historical Analysis', 
    icon: <ChessQueen className="h-6 w-6 text-primary" />,
    description: 'Study famous games and their opening strategies'
  },
]

export default function OpeningPrinciples() {
  const [activeTab, setActiveTab] = useState('core-principles')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Chess Opening Principles</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the art of chess openings through our comprehensive learning modules. 
          Explore fundamental principles, popular openings, and advanced strategies to start your games with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {openingTopics.map((topic) => (
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
            <TabsContent value="core-principles">
              <CorePrinciples />
            </TabsContent>
            <TabsContent value="popular-openings">
              <PopularOpenings />
            </TabsContent>
            <TabsContent value="opening-traps">
              <OpeningTraps />
            </TabsContent>
            <TabsContent value="common-mistakes">
              <CommonMistakes />
            </TabsContent>
            <TabsContent value="repertoire-builder">
              <RepertoireBuilder />
            </TabsContent>
            <TabsContent value="understanding-tempo">
              <UnderstandingTempo />
            </TabsContent>
            <TabsContent value="center-control">
              <CenterControl />
            </TabsContent>
            <TabsContent value="development-strategies">
              <DevelopmentStrategies />
            </TabsContent>
            <TabsContent value="opening-explorer">
              <OpeningExplorer />
            </TabsContent>
            <TabsContent value="historical-analysis">
              <HistoricalAnalysis />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
