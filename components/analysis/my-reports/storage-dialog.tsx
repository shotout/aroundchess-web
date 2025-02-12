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
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  HardDrive,
  FileText,
  Trash2,
  Archive,
  BarChart,
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
  Cell,
} from "recharts"

interface StorageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface StorageStats {
  total: number
  used: number
  byType: {
    type: string
    size: number
    count: number
  }[]
  byMonth: {
    month: string
    size: number
  }[]
}

const mockStorageStats: StorageStats = {
  total: 5120, // 5GB in MB
  used: 2150,  // 2.15GB in MB
  byType: [
    { type: "Progress Reports", size: 850, count: 45 },
    { type: "Game Analysis", size: 650, count: 32 },
    { type: "Training Plans", size: 450, count: 28 },
    { type: "Custom Reports", size: 200, count: 15 },
  ],
  byMonth: [
    { month: "Jan", size: 280 },
    { month: "Feb", size: 350 },
    { month: "Mar", size: 420 },
    { month: "Apr", size: 380 },
    { month: "May", size: 450 },
    { month: "Jun", size: 270 },
  ],
}

export function StorageDialog({
  open,
  onOpenChange,
}: StorageDialogProps) {
  const [cleanupPolicy, setCleanupPolicy] = useState("30days")

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} MB`
    return `${(size / 1024).toFixed(1)} GB`
  }

  const handleCleanup = () => {
    // Implement cleanup logic
    onOpenChange(false)
  }

  const usedPercentage = (mockStorageStats.used / mockStorageStats.total) * 100

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Storage Management</DialogTitle>
          <DialogDescription>
            Monitor storage usage and manage cleanup policies.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">Storage Usage</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatSize(mockStorageStats.used)} of{" "}
                    {formatSize(mockStorageStats.total)} used
                  </p>
                </div>
                <HardDrive className="h-8 w-8 text-muted-foreground" />
              </div>
              <Progress value={usedPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-4">Storage by Type</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockStorageStats.byType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => formatSize(value)}
                      />
                      <Bar dataKey="size">
                        {mockStorageStats.byType.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-4">Storage by Month</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockStorageStats.byMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => formatSize(value)}
                      />
                      <Bar dataKey="size" fill="#3b82f6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Cleanup Policy</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically clean up old reports
                  </p>
                </div>
                <Select value={cleanupPolicy} onValueChange={setCleanupPolicy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never Delete</SelectItem>
                    <SelectItem value="30days">After 30 Days</SelectItem>
                    <SelectItem value="90days">After 90 Days</SelectItem>
                    <SelectItem value="1year">After 1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={handleCleanup}
                >
                  <Archive className="h-6 w-6" />
                  <span>Archive Old Reports</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 text-destructive hover:text-destructive"
                  onClick={handleCleanup}
                >
                  <Trash2 className="h-6 w-6" />
                  <span>Clean Up Storage</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 