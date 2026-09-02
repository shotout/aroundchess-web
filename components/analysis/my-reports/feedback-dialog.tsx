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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MessageSquare, Star, ThumbsUp, ThumbsDown } from "lucide-react"

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({
  open,
  onOpenChange,
}: FeedbackDialogProps) {
  const [feedbackType, setFeedbackType] = useState("general")
  const [satisfaction, setSatisfaction] = useState<number | null>(null)
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    // Implement feedback submission logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve your reporting experience.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <RadioGroup
              value={feedbackType}
              onValueChange={setFeedbackType}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="general"
                  id="general"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="general"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <MessageSquare className="mb-2 h-6 w-6" />
                  General Feedback
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="feature"
                  id="feature"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="feature"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Star className="mb-2 h-6 w-6" />
                  Feature Request
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>How satisfied are you with the reports?</Label>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={satisfaction === rating ? "default" : "outline"}
                  size="lg"
                  className="h-12 w-12"
                  onClick={() => setSatisfaction(rating)}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ui">User Interface</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="features">Features</SelectItem>
                <SelectItem value="data">Data & Analytics</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Brief summary of your feedback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Provide detailed feedback..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32"
            />
          </div>

          <div className="flex items-center justify-between text-[14px] --sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>Clear and specific feedback helps us improve</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="h-4 w-4" />
              <span>Please avoid personal information</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim()}
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 