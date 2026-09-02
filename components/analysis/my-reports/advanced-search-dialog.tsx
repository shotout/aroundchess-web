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
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AdvancedSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdvancedSearchDialog({
  open,
  onOpenChange,
}: AdvancedSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState<string[]>([])
  const [ratingRange, setRatingRange] = useState({ min: "", max: "" })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const handleSearch = () => {
    // Implement advanced search logic
    onOpenChange(false)
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleReportTypeChange = (value: string) => {
    if (reportType.includes(value)) {
      setReportType(reportType.filter((t) => t !== value))
    } else {
      setReportType([...reportType, value])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>
            Search reports using multiple criteria.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Keywords</Label>
            <Input
              placeholder="Search in report titles and content"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Date Range</Label>
            <CalendarDateRangePicker />
          </div>
          <div className="grid gap-2">
            <Label>Report Types</Label>
            <div className="flex flex-wrap gap-2">
              {["Progress", "Games", "Training", "Custom"].map((type) => (
                <Button
                  key={type}
                  variant={reportType.includes(type) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleReportTypeChange(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Rating Range</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={ratingRange.min}
                onChange={(e) =>
                  setRatingRange({ ...ratingRange, min: e.target.value })
                }
              />
              <span>to</span>
              <Input
                type="number"
                placeholder="Max"
                value={ratingRange.max}
                onChange={(e) =>
                  setRatingRange({ ...ratingRange, max: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add tags (press Enter)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>
          <div className="grid gap-2">
            <Label>Sort By</Label>
            <Select defaultValue="date">
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest first)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
                <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setReportType([])
              setRatingRange({ min: "", max: "" })
              setTags([])
            }}
          >
            Reset Filters
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 