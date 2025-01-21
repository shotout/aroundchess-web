'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CheckCircle, Menu } from 'lucide-react'
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
import { OpeningProgressProvider, useOpeningProgress } from '@/contexts/OpeningProgressContext'
import { ErrorBoundary } from 'react-error-boundary'

const openingTopics = [
  { 
    id: 'core-principles', 
    title: 'Core Opening Principles', 
    icon: '♟️',
    description: 'Learn the fundamental principles for a strong opening'
  },
  { 
    id: 'popular-openings', 
    title: 'Popular Opening Families', 
    icon: '♜',
    description: 'Explore common and effective chess openings'
  },
  { 
    id: 'opening-traps', 
    title: 'Opening Traps and Pitfalls', 
    icon: '♝',
    description: 'Recognize and avoid common opening traps'
  },
  { 
    id: 'common-mistakes', 
    title: 'Common Opening Mistakes', 
    icon: '♚',
    description: 'Learn from typical errors made in the opening'
  },
  { 
    id: 'repertoire-builder', 
    title: 'Opening Repertoire Builder', 
    icon: '♛',
    description: 'Develop your personal opening repertoire'
  },
  { 
    id: 'understanding-tempo', 
    title: 'Understanding Tempo', 
    icon: '♞',
    description: 'Master the concept of tempo in chess openings'
  },
  { 
    id: 'center-control', 
    title: 'Center Control Strategies', 
    icon: '♙',
    description: 'Learn techniques to control the center of the board'
  },
  { 
    id: 'development-strategies', 
    title: 'Development Strategies', 
    icon: '♗',
    description: 'Understand how to efficiently develop your pieces'
  },
  { 
    id: 'opening-explorer', 
    title: 'Interactive Opening Explorer', 
    icon: '♖',
    description: 'Explore and analyze various opening lines'
  },
  { 
    id: 'historical-analysis', 
    title: 'Historical Opening Analysis', 
    icon: '♔',
    description: 'Study famous games and their opening strategies'
  },
]

function ErrorFallback({
  error,
  resetErrorBoundary
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function SidebarContent({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const { progress, isCompleted } = useOpeningProgress()

  return (
    <div className="p-4 flex-1 flex flex-col h-full">
      <div className="mb-4 flex-shrink-0">
        <h3 className="text-sm font-medium mb-2">Learning Progress</h3>
        <Progress value={Math.min(Math.max(progress, 0), 100)} className="h-2" />
        <p className="text-sm text-gray-500 mt-1">{Math.round(Math.min(Math.max(progress, 0), 100))}% Complete</p>
      </div>
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-1 pr-4">
          {openingTopics.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-90">{item.description}</div>
                </div>
                {isCompleted(item.id) && (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function OpeningPrinciplesContent() {
  const [activeTabState, setActiveTabState] = useState('core-principles');
  const setActiveTab = (tab: string) => {
    console.log('Setting active tab to:', tab);
    setActiveTabState(tab);
  };
  console.log('Rendering OpeningPrinciplesContent, activeTab:', activeTabState);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 pt-16 pb-32">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Chess Opening Principles</h1>
          <p className="text-gray-600 text-lg md:text-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            Master the art of chess openings through our comprehensive learning modules. 
            Explore fundamental principles, popular openings, and advanced strategies to start your games with confidence.
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
              <SidebarContent activeTab={activeTabState} setActiveTab={setActiveTab} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <div className="hidden lg:block">
            <Card className="sticky top-4 h-[calc(100vh-8rem)] flex flex-col">
              <CardContent className="p-0">
                <SidebarContent activeTab={activeTabState} setActiveTab={setActiveTab} />
              </CardContent>
            </Card>
          </div>

          <Card className="border shadow-sm min-h-[calc(100vh-8rem)]">
            <CardContent className="p-6">
              <Tabs value={activeTabState} onValueChange={setActiveTab}>
                <TabsList className="hidden">
                  {openingTopics.map((topic) => (
                    <TabsTrigger key={topic.id} value={topic.id}>
                      {topic.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
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
                </ErrorBoundary>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function OpeningPrinciples() {
  return (
    <OpeningProgressProvider>
      <OpeningPrinciplesContent />
    </OpeningProgressProvider>
  )
}
