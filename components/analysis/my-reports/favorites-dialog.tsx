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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, FileText, Tag, Download, Share2 } from "lucide-react"

interface FavoritesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FavoriteReport {
  id: string
  title: string
  type: string
  date: string
  size: string
  tags: string[]
  addedDate: string
}

export function FavoritesDialog({
  open,
  onOpenChange,
}: FavoritesDialogProps) {
  const [sortBy, setSortBy] = useState("date")
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  const favoriteReports: FavoriteReport[] = [
    {
      id: "1",
      title: "Tournament Preparation Analysis",
      type: "Game Analysis",
      date: "March 15, 2024",
      size: "2.4 MB",
      tags: ["Tournament", "Important"],
      addedDate: "March 16, 2024",
    },
    {
      id: "2",
      title: "Weekly Progress Report",
      type: "Progress Report",
      date: "March 14, 2024",
      size: "1.8 MB",
      tags: ["Training", "Review"],
      addedDate: "March 15, 2024",
    },
    {
      id: "3",
      title: "Advanced Endgame Training",
      type: "Training Report",
      date: "March 13, 2024",
      size: "3.2 MB",
      tags: ["Training"],
      addedDate: "March 14, 2024",
    },
  ]

  const handleRemoveFavorite = (id: string) => {
    // Implement remove from favorites logic
    setSelectedReports(selectedReports.filter((reportId) => reportId !== id))
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
          <DialogTitle>Favorite Reports</DialogTitle>
          <DialogDescription>
            Access your most important reports quickly.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Added Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
            {selectedReports.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            )}
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {favoriteReports.map((report) => (
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFavorite(report.id)
                        }}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] --sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span>Created {report.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] --sm text-muted-foreground">
                      <span>Added to favorites {report.addedDate}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {report.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="mr-2 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
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