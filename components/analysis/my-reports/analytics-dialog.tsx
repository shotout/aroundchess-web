"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Download,
  Eye,
  Clock,
  Calendar,
} from "lucide-react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

interface ReportAnalyticsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data for charts
const usageData = [
  { month: "Jan", views: 45, downloads: 32 },
  { month: "Feb", views: 52, downloads: 38 },
  { month: "Mar", views: 61, downloads: 45 },
  { month: "Apr", views: 58, downloads: 42 },
  { month: "May", views: 65, downloads: 48 },
  { month: "Jun", views: 74, downloads: 55 },
]

const typeData = [
  { name: "Progress", value: 35 },
  { name: "Games", value: 25 },
  { name: "Training", value: 20 },
  { name: "Custom", value: 20 },
]

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ReportAnalyticsDialog({
  open,
  onOpenChange,
}: ReportAnalyticsDialogProps) {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Report Analytics</DialogTitle>
          <DialogDescription>
            View insights and statistics about your reports.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between mb-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="usage">
              <BarChart className="mr-2 h-4 w-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="trends">
              <LineChart className="mr-2 h-4 w-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-4">Report Distribution</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {typeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <h3 className="text-2xl font-bold">355</h3>
                    </div>
                    <Eye className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Downloads
                      </p>
                      <h3 className="text-2xl font-bold">260</h3>
                    </div>
                    <Download className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Average Time Spent
                      </p>
                      <h3 className="text-2xl font-bold">5m 32s</h3>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4 mt-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Views & Downloads</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="views" fill="#3b82f6" name="Views" />
                    <Bar dataKey="downloads" fill="#22c55e" name="Downloads" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Usage Trends</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#3b82f6"
                      name="Views"
                    />
                    <Line
                      type="monotone"
                      dataKey="downloads"
                      stroke="#22c55e"
                      name="Downloads"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 