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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Tag } from "lucide-react"

interface TagsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Tag {
  id: string
  name: string
  color: string
  count: number
}

export function TagsDialog({
  open,
  onOpenChange,
}: TagsDialogProps) {
  const [tags, setTags] = useState<Tag[]>([
    {
      id: "1",
      name: "Important",
      color: "#ef4444",
      count: 5,
    },
    {
      id: "2",
      name: "Tournament",
      color: "#3b82f6",
      count: 8,
    },
    {
      id: "3",
      name: "Training",
      color: "#22c55e",
      count: 12,
    },
    {
      id: "4",
      name: "Review",
      color: "#f59e0b",
      count: 6,
    },
  ])
  const [newTagName, setNewTagName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")
  const [showNewTag, setShowNewTag] = useState(false)

  const colors = [
    "#ef4444",
    "#f59e0b",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ]

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag: Tag = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        color: selectedColor,
        count: 0,
      }
      setTags([...tags, newTag])
      setNewTagName("")
      setSelectedColor("#3b82f6")
      setShowNewTag(false)
    }
  }

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Create and manage tags to organize your reports.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] --sm font-medium">Your Tags</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewTag(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Tag
            </Button>
          </div>
          {showNewTag && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Tag Name</Label>
                <Input
                  placeholder="Enter tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tag Color</Label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-primary"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTag}>Add Tag</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewTag(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <Tag
                    className="h-4 w-4"
                    style={{ color: tag.color }}
                  />
                  <div>
                    <p className="font-medium">{tag.name}</p>
                    <p className="text-[14px] --sm text-muted-foreground">
                      {tag.count} reports
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
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