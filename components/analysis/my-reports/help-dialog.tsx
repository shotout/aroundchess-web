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
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, HelpCircle, Video, Book, MessageCircle } from "lucide-react"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface HelpTopic {
  id: string
  title: string
  content: string
  category: string
}

export function HelpDialog({
  open,
  onOpenChange,
}: HelpDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const helpTopics: HelpTopic[] = [
    {
      id: "1",
      title: "Getting Started with Reports",
      content: `Reports help you track your chess progress and analyze your games. Here's how to get started:
      
1. Generate your first report by clicking the "New Report" button
2. Choose the type of report you want to create
3. Select your preferences and data range
4. Click "Generate" to create your report

You can then view, download, or share your report with others.`,
      category: "basics",
    },
    {
      id: "2",
      title: "Understanding Progress Reports",
      content: `Progress reports show your chess improvement over time. They include:

• Rating progression
• Performance metrics
• Areas of improvement
• Recommended training focus

These reports are automatically generated based on your games and training activities.`,
      category: "basics",
    },
    {
      id: "3",
      title: "Managing Report Collections",
      content: `Organize your reports into collections for better organization:

1. Create a new collection
2. Add reports to collections
3. Share entire collections
4. Set permissions for shared collections

You can also tag reports and use filters to find them quickly.`,
      category: "organization",
    },
    {
      id: "4",
      title: "Report Sharing and Collaboration",
      content: `Share your reports with coaches or study partners:

• Set viewing permissions
• Add comments and annotations
• Receive notifications on updates
• Export in various formats

You can also create shared collections for team analysis.`,
      category: "collaboration",
    },
    {
      id: "5",
      title: "Advanced Report Features",
      content: `Take advantage of advanced features:

• Custom report templates
• Automated scheduling
• Data export options
• API integration
• Bulk operations

These features help you get more from your reports.`,
      category: "advanced",
    },
  ]

  const filteredTopics = helpTopics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Help Center</DialogTitle>
          <DialogDescription>
            Find help and learn about report features.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="justify-start">
              <Video className="mr-2 h-4 w-4" />
              Video Tutorials
            </Button>
            <Button variant="outline" className="justify-start">
              <Book className="mr-2 h-4 w-4" />
              Documentation
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageCircle className="mr-2 h-4 w-4" />
              Community Support
            </Button>
            <Button variant="outline" className="justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>

          <ScrollArea className="h-[400px]">
            <Accordion type="single" collapsible>
              {filteredTopics.map((topic) => (
                <AccordionItem key={topic.id} value={topic.id}>
                  <AccordionTrigger>{topic.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm">
                      <div className="whitespace-pre-line text-[14px] --sm text-muted-foreground">
                        {topic.content}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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