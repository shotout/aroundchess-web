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
import { Download, Share2, Tag } from "lucide-react"

interface PreviewReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreviewReportDialog({
  open,
  onOpenChange,
}: PreviewReportDialogProps) {
  const mockReport = {
    title: "Monthly Progress Report",
    date: "March 15, 2024",
    type: "Progress Report",
    size: "2.4 MB",
    format: "PDF",
    tags: ["Important", "Training"],
    summary: "Comprehensive analysis of chess performance and improvement for March 2024",
    sections: [
      {
        title: "Performance Overview",
        content: "Your chess rating has increased by 75 points this month, showing significant improvement in endgame positions and tactical awareness.",
      },
      {
        title: "Key Statistics",
        content: "• Games Played: 45\n• Win Rate: 65%\n• Average Game Length: 35 moves\n• Most Common Opening: Sicilian Defense",
      },
      {
        title: "Areas of Improvement",
        content: "1. Positional understanding in closed positions\n2. Time management in complex middlegames\n3. Calculation accuracy in tactical positions",
      },
      {
        title: "Recommendations",
        content: "• Focus on studying closed pawn structures\n• Practice time management with specific exercises\n• Increase tactical training frequency",
      },
    ],
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Report Preview</DialogTitle>
          <DialogDescription>
            Preview your report before downloading or sharing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{mockReport.title}</h2>
              <p className="text-[14px] --sm text-muted-foreground">
                Generated on {mockReport.date}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[14px] --sm text-muted-foreground">
            <span>{mockReport.type}</span>
            <span>•</span>
            <span>{mockReport.size}</span>
            <span>•</span>
            <span>{mockReport.format}</span>
          </div>
          <div className="flex gap-2">
            {mockReport.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                <Tag className="mr-2 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
          <div className="border-t pt-4">
            <p className="text-[14px] --sm text-muted-foreground mb-4">
              {mockReport.summary}
            </p>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-6">
                {mockReport.sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-lg font-semibold mb-2">
                      {section.title}
                    </h3>
                    <p className="text-[14px] --sm whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
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