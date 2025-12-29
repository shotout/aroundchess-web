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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Share2,
  Tag,
  Clock,
  FileText,
  History,
  Users,
} from "lucide-react"

interface ReportDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDetailsDialog({
  open,
  onOpenChange,
}: ReportDetailsDialogProps) {
  const mockReport = {
    title: "Monthly Progress Report",
    date: "March 15, 2024",
    type: "Progress Report",
    size: "2.4 MB",
    format: "PDF",
    tags: ["Important", "Training"],
    summary: "Comprehensive analysis of chess performance and improvement for March 2024",
    metadata: {
      created: "March 15, 2024 14:30",
      lastModified: "March 15, 2024 16:45",
      author: "System",
      version: "1.2",
      pageCount: 12,
      wordCount: 2500,
    },
    history: [
      {
        action: "Created",
        date: "March 15, 2024 14:30",
        user: "System",
      },
      {
        action: "Modified",
        date: "March 15, 2024 15:15",
        user: "John Doe",
      },
      {
        action: "Shared",
        date: "March 15, 2024 15:45",
        user: "John Doe",
      },
      {
        action: "Downloaded",
        date: "March 15, 2024 16:30",
        user: "Jane Smith",
      },
    ],
    access: [
      {
        user: "john.doe@example.com",
        role: "Owner",
        lastAccess: "March 15, 2024 15:15",
      },
      {
        user: "jane.smith@example.com",
        role: "Viewer",
        lastAccess: "March 15, 2024 16:30",
      },
    ],
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            View detailed information about this report.
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
          <Tabs defaultValue="metadata" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metadata">
                <FileText className="mr-2 h-4 w-4" />
                Metadata
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="access">
                <Users className="mr-2 h-4 w-4" />
                Access
              </TabsTrigger>
            </TabsList>
            <TabsContent value="metadata" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(mockReport.metadata).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-[14px] --sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {mockReport.history.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 pb-4 border-b last:border-0"
                    >
                      <Clock className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{event.action}</p>
                        <p className="text-[14px] --sm text-muted-foreground">
                          by {event.user} on {event.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="access" className="mt-4">
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {mockReport.access.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 pb-4 border-b last:border-0"
                    >
                      <Users className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{user.user}</p>
                        <p className="text-[14px] --sm text-muted-foreground">
                          {user.role} • Last accessed {user.lastAccess}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
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