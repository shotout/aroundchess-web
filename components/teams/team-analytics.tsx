"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"

// Mock data - replace with real data from your backend
const performanceData = [
  { month: "Jan", rating: 1800, wins: 8, losses: 4 },
  { month: "Feb", rating: 1825, wins: 10, losses: 3 },
  { month: "Mar", rating: 1850, wins: 12, losses: 2 },
  { month: "Apr", rating: 1875, wins: 9, losses: 5 },
  // Add more months as needed
]

const moveAnalysis = [
  { category: "Best Moves", count: 45 },
  { category: "Good Moves", count: 32 },
  { category: "Inaccuracies", count: 12 },
  { category: "Mistakes", count: 8 },
  { category: "Blunders", count: 3 },
]

export function TeamAnalytics() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="moves">Move Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rating Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Win/Loss Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="wins" fill="#22c55e" name="Wins" />
                    <Bar dataKey="losses" fill="#ef4444" name="Losses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="moves">
          <Card>
            <CardHeader>
              <CardTitle>Move Quality Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={moveAnalysis}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {moveAnalysis.map((entry, index) => {
                      let color = "#94a3b8"
                      switch (entry.category) {
                        case "Best Moves":
                          color = "#22c55e"
                          break
                        case "Good Moves":
                          color = "#3b82f6"
                          break
                        case "Inaccuracies":
                          color = "#eab308"
                          break
                        case "Mistakes":
                          color = "#f97316"
                          break
                        case "Blunders":
                          color = "#ef4444"
                          break
                      }
                      return <Cell key={`cell-${index}`} fill={color} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 