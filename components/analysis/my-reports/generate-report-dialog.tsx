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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CalendarDateRangePicker } from "@/components/date-range-picker"

interface GenerateReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GenerateReportDialog({
  open,
  onOpenChange,
}: GenerateReportDialogProps) {
  const [reportType, setReportType] = useState("progress")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeAnalysis, setIncludeAnalysis] = useState(true)
  const [format, setFormat] = useState("pdf")

  const handleGenerate = () => {
    // Implement report generation logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Create a new report with your selected preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">Progress Report</SelectItem>
                <SelectItem value="games">Game Analysis</SelectItem>
                <SelectItem value="training">Training Report</SelectItem>
                <SelectItem value="custom">Custom Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Date Range</Label>
            <CalendarDateRangePicker />
          </div>
          <div className="grid gap-2">
            <Label>Report Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                <SelectItem value="excel">Excel Workbook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Charts</Label>
              <div className="text-sm text-muted-foreground">
                Add visual representations of your data
              </div>
            </div>
            <Switch
              checked={includeCharts}
              onCheckedChange={setIncludeCharts}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Analysis</Label>
              <div className="text-sm text-muted-foreground">
                Add AI-powered insights and recommendations
              </div>
            </div>
            <Switch
              checked={includeAnalysis}
              onCheckedChange={setIncludeAnalysis}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate}>Generate Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 