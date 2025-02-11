"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, FileText, Calendar, Eye, Star, Share2, Tags, MoreVertical } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dispatch, SetStateAction } from "react"

// Mock data - replace with real data from your backend
const availableReports = [
  {
    id: 1,
    title: "Monthly Progress Summary",
    date: "2024-03-15",
    type: "Monthly",
    size: "2.4 MB",
    format: "PDF",
  },
  {
    id: 2,
    title: "Skill Assessment Report",
    date: "2024-03-10",
    type: "Assessment",
    size: "1.8 MB",
    format: "PDF",
  },
  {
    id: 3,
    title: "Performance Analytics Q1",
    date: "2024-03-01",
    type: "Quarterly",
    size: "3.2 MB",
    format: "PDF",
  },
  {
    id: 4,
    title: "Training Effectiveness Report",
    date: "2024-02-28",
    type: "Monthly",
    size: "1.5 MB",
    format: "PDF",
  },
  {
    id: 5,
    title: "Progress Metrics Export",
    date: "2024-02-15",
    type: "Monthly",
    size: "945 KB",
    format: "CSV",
  },
]

interface ProgressReportsProps {
  onSelect: Dispatch<SetStateAction<string[]>>
}

export function ProgressReports({ onSelect }: ProgressReportsProps) {
  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Available Reports</h3>
            <p className="text-sm text-muted-foreground">
              Recent progress reports
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <Card>
        <ScrollArea className="h-[600px] w-full">
          <div className="p-4 space-y-4">
            {availableReports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">{report.title}</h4>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{report.date}</span>
                      </div>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span>{report.format}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        Add to Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Report
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Tags className="mr-2 h-4 w-4" />
                        Manage Tags
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
} 