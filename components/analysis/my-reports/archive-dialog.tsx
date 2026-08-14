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
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Archive, Clock, Download, FileText, Tag } from "lucide-react"

interface ArchiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ArchivedReport {
  id: string
  title: string
  type: string
  date: string
  size: string
  tags: string[]
  archiveDate: string
}

export function ArchiveDialog({
  open,
  onOpenChange,
}: ArchiveDialogProps) {
  const [sortBy, setSortBy] = useState("date")
  const [showTags, setShowTags] = useState(true)
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  const archivedReports: ArchivedReport[] = [
    {
      id: "1",
      title: "January Progress Report",
      type: "Progress Report",
      date: "January 15, 2024",
      size: "1.2 MB",
      tags: ["Training", "Review"],
      archiveDate: "March 1, 2024",
    },
    {
      id: "2",
      title: "Tournament Analysis Q4 2023",
      type: "Game Analysis",
      date: "December 20, 2023",
      size: "2.8 MB",
      tags: ["Tournament", "Important"],
      archiveDate: "March 1, 2024",
    },
    {
      id: "3",
      title: "Training Plan Review 2023",
      type: "Training Report",
      date: "December 31, 2023",
      size: "1.5 MB",
      tags: ["Training"],
      archiveDate: "March 1, 2024",
    },
  ]

  const handleRestore = () => {
    setSelectedReports([])
  }

  const handleDelete = () => {
    setSelectedReports([])
  }

  const toggleReportSelection = (id: string) => {
    if (selectedReports.includes(id)) {
      setSelectedReports(selectedReports.filter((reportId) => reportId !== id))
    } else {
      setSelectedReports([...selectedReports, id])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Archive</DialogTitle>
          <DialogDescription>
            View and manage your archived reports.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Archive Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Label htmlFor="show-tags" className="text-[14px] --sm">
                  Show Tags
                </Label>
                <Switch
                  id="show-tags"
                  checked={showTags}
                  onCheckedChange={setShowTags}
                />
              </div>
            </div>
            {selectedReports.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestore}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Restore
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {archivedReports.map((report) => (
                <div
                  key={report.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer ${
                    selectedReports.includes(report.id)
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => toggleReportSelection(report.id)}
                >
                  <div className="mt-1">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-[14px] --sm text-muted-foreground">
                        {report.size}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] --sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>Created {report.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] --sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Archived {report.archiveDate}</span>
                    </div>
                    {showTags && report.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {report.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="mr-2 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
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