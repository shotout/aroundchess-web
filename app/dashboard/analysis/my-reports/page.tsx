"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Download,
  Filter,
  Search,
  Brain,
  Trophy,
  Clock,
  Plus,
  Calendar,
  Star,
  Share2,
  Tags,
  FolderPlus,
  Bell,
  Settings,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

// Import report components
import { ProgressReports } from "@/components/analysis/my-reports/progress-reports"
import { GameHistoryReports } from "@/components/analysis/my-reports/game-history-reports"
import { TrainingPlanReports } from "@/components/analysis/my-reports/training-plan-reports"

// Import new components (to be created)
import { GenerateReportDialog } from "@/components/analysis/my-reports/generate-report-dialog"
import { ScheduleReportDialog } from "@/components/analysis/my-reports/schedule-report-dialog"
import { ReportCollectionsDialog } from "@/components/analysis/my-reports/collections-dialog"
import { AdvancedSearchDialog } from "@/components/analysis/my-reports/advanced-search-dialog"
import { ReportSettingsDialog } from "@/components/analysis/my-reports/settings-dialog"

export default function ReportsPage() {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showCollectionsDialog, setShowCollectionsDialog] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Reports</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button variant="outline" onClick={() => setShowAdvancedSearch(true)}>
            <Search className="mr-2 h-4 w-4" />
            Advanced Search
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowGenerateDialog(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowScheduleDialog(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Star className="mr-2 h-4 w-4" />
          Favorites
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Shared
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowCollectionsDialog(true)}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Collections
        </Button>
        <Button variant="outline" size="sm">
          <Tags className="mr-2 h-4 w-4" />
          Tags
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-[14px] --sm font-medium">Total Reports</span>
          </div>
          <div className="mt-2 text-2xl font-bold">24</div>
          <p className="text-[14px] --xs text-muted-foreground">Generated this month</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-green-600" />
            <span className="text-[14px] --sm font-medium">Progress Reports</span>
          </div>
          <div className="mt-2 text-2xl font-bold">8</div>
          <p className="text-[14px] --xs text-muted-foreground">Last updated today</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="text-[14px] --sm font-medium">Game Analysis</span>
          </div>
          <div className="mt-2 text-2xl font-bold">12</div>
          <p className="text-[14px] --xs text-muted-foreground">From recent games</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-purple-600" />
            <span className="text-[14px] --sm font-medium">Scheduled Reports</span>
          </div>
          <div className="mt-2 text-2xl font-bold">4</div>
          <p className="text-[14px] --xs text-muted-foreground">Next generation in 2d</p>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reports..." className="pl-8" />
            </div>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="games">Games</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="date">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedReports.length > 0 && (
        <Card className="p-2">
          <div className="flex items-center space-x-2">
            <span className="text-[14px] --sm text-muted-foreground">
              {selectedReports.length} reports selected
            </span>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Tags className="mr-2 h-4 w-4" />
              Tag
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Progress Reports</TabsTrigger>
          <TabsTrigger value="games">Game History</TabsTrigger>
          <TabsTrigger value="training">Training Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <ProgressReports onSelect={setSelectedReports} />
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <GameHistoryReports onSelect={setSelectedReports} />
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <TrainingPlanReports onSelect={setSelectedReports} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <GenerateReportDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
      />
      <ScheduleReportDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
      />
      <ReportCollectionsDialog
        open={showCollectionsDialog}
        onOpenChange={setShowCollectionsDialog}
      />
      <AdvancedSearchDialog
        open={showAdvancedSearch}
        onOpenChange={setShowAdvancedSearch}
      />
      <ReportSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </div>
  )
} 