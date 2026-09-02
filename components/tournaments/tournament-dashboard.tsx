"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TournamentBracket } from "./tournament-bracket"
import { TournamentGames } from "./tournament-games"
import { TournamentAnalytics } from "./tournament-analytics"
import { LiveMatchPanel } from "./live-match-panel"

export function TournamentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Tournament Area (75%) */}
        <div className="xl:col-span-3 space-y-6">
          <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="games">Games</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tournament Bracket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TournamentBracket />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Games</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TournamentGames limit={5} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="games">
                <TournamentGames />
              </TabsContent>

              <TabsContent value="analytics">
                <TournamentAnalytics />
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>

        {/* Live Match Panel (25%) */}
        <div className="xl:col-span-1">
          <LiveMatchPanel />
        </div>
      </div>
    </div>
  )
} 