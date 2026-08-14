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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Table, FileSpreadsheet } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDialog({
  open,
  onOpenChange,
}: ExportDialogProps) {
  const [format, setFormat] = useState("pdf")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeComments, setIncludeComments] = useState(false)
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "overview",
    "statistics",
    "analysis",
  ])

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "statistics", label: "Statistics" },
    { id: "analysis", label: "Analysis" },
    { id: "recommendations", label: "Recommendations" },
    { id: "appendix", label: "Appendix" },
  ]

  const handleExport = () => {
    onOpenChange(false)
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "csv":
        return <Table className="h-4 w-4" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4" />
      default:
        return <Download className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Choose your export preferences and format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Export Format</Label>
            <div className="grid grid-cols-3 gap-2">
              {["pdf", "csv", "excel"].map((type) => (
                <Button
                  key={type}
                  variant={format === type ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setFormat(type)}
                >
                  {getFormatIcon(type)}
                  <span className="ml-2 capitalize">{type}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Sections to Include</Label>
            <div className="grid gap-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={section.id}
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSections([...selectedSections, section.id])
                      } else {
                        setSelectedSections(
                          selectedSections.filter((id) => id !== section.id)
                        )
                      }
                    }}
                  />
                  <label
                    htmlFor={section.id}
                    className="text-[14px] --sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {section.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Charts</Label>
              <div className="text-[14px] --sm text-muted-foreground">
                Export with visual representations
              </div>
            </div>
            <Switch
              checked={includeCharts}
              onCheckedChange={setIncludeCharts}
              disabled={format === "csv"}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Comments</Label>
              <div className="text-[14px] --sm text-muted-foreground">
                Export with discussion threads
              </div>
            </div>
            <Switch
              checked={includeComments}
              onCheckedChange={setIncludeComments}
              disabled={format === "csv"}
            />
          </div>
          {format === "pdf" && (
            <div className="grid gap-2">
              <Label>Page Size</Label>
              <Select defaultValue="a4">
                <SelectTrigger>
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 