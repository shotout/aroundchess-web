"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, FileText, Calendar, Eye, Trophy, Star, Share2, Tags, MoreVertical } from "lucide-react"
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
    title: "Monthly Games Summary",
    date: "2024-03-15",
    type: "Monthly",
    games: 45,
    size: "3.1 MB",
    format: "PDF",
  },
  {
    id: 2,
    title: "Opening Repertoire Analysis",
    date: "2024-03-12",
    type: "Analysis",
    games: 120,
    size: "2.8 MB",
    format: "PDF",
  },
  {
    id: 3,
    title: "Time Management Report",
    date: "2024-03-08",
    type: "Analysis",
    games: 75,
    size: "1.9 MB",
    format: "PDF",
  },
  {
    id: 4,
    title: "Opponent Analysis Q1",
    date: "2024-03-01",
    type: "Quarterly",
    games: 150,
    size: "4.2 MB",
    format: "PDF",
  },
  {
    id: 5,
    title: "Games Archive Export",
    date: "2024-02-28",
    type: "Export",
    games: 200,
    size: "1.2 MB",
    format: "PGN",
  },
]

interface GameHistoryReportsProps {
  onSelect: Dispatch<SetStateAction<string[]>>
}

export function GameHistoryReports({ onSelect }: GameHistoryReportsProps) {
  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Game History Reports</h3>
            <p className="text-[14px] --sm text-muted-foreground">
              Access and download your game analysis reports
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
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="export">Export</SelectItem>
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
                    <div className="flex items-center space-x-4 text-[14px] --sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{report.date}</span>
                      </div>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-3 w-3" />
                        <span>{report.games} games</span>
                      </div>
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