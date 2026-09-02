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
import { Input } from "@/components/ui/input"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Filter, Save, X } from "lucide-react"

interface FiltersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SavedFilter {
  id: string
  name: string
  criteria: {
    type: string[]
    dateRange: string
    tags: string[]
    size: string
    rating: string
  }
}

export function FiltersDialog({
  open,
  onOpenChange,
}: FiltersDialogProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sizeFilter, setSizeFilter] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")
  const [showSavedFilters, setShowSavedFilters] = useState(true)

  const reportTypes = [
    "Progress Report",
    "Game Analysis",
    "Training Plan",
    "Tournament Report",
  ]

  const tags = [
    "Important",
    "Review",
    "Training",
    "Tournament",
    "Archived",
  ]

  const savedFilters: SavedFilter[] = [
    {
      id: "1",
      name: "Recent Tournament Reports",
      criteria: {
        type: ["Tournament Report"],
        dateRange: "last30",
        tags: ["Tournament"],
        size: "any",
        rating: "any",
      },
    },
    {
      id: "2",
      name: "Training Progress",
      criteria: {
        type: ["Progress Report", "Training Plan"],
        dateRange: "last90",
        tags: ["Training"],
        size: "any",
        rating: ">2000",
      },
    },
  ]

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleApplyFilter = () => {
    // Implement filter application logic
    onOpenChange(false)
  }

  const handleSaveFilter = () => {
    // Implement filter saving logic
  }

  const handleLoadFilter = (filter: SavedFilter) => {
    setSelectedTypes(filter.criteria.type)
    setSelectedTags(filter.criteria.tags)
    setSizeFilter(filter.criteria.size)
    setRatingFilter(filter.criteria.rating)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Report Filters</DialogTitle>
          <DialogDescription>
            Filter and save your report search criteria.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Report Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {reportTypes.map((type) => (
                    <Button
                      key={type}
                      variant={
                        selectedTypes.includes(type) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTypeToggle(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag}
                      variant={
                        selectedTags.includes(tag) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Date Range</Label>
                <div className="mt-2">
                  <CalendarDateRangePicker />
                </div>
              </div>
              <div>
                <Label>File Size</Label>
                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any size</SelectItem>
                    <SelectItem value="small">Small (&lt;1MB)</SelectItem>
                    <SelectItem value="medium">Medium (1-5MB)</SelectItem>
                    <SelectItem value="large">Large (&gt;5MB)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rating Range</Label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any rating</SelectItem>
                    <SelectItem value="<1500">&lt;1500</SelectItem>
                    <SelectItem value="1500-2000">1500-2000</SelectItem>
                    <SelectItem value=">2000">&gt;2000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Saved Filters</Label>
              <Switch
                checked={showSavedFilters}
                onCheckedChange={setShowSavedFilters}
              />
            </div>
            {showSavedFilters && (
              <ScrollArea className="h-[150px]">
                <div className="space-y-2">
                  {savedFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className="flex items-center justify-between p-2 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{filter.name}</p>
                        <div className="flex gap-2 mt-1">
                          {filter.criteria.type.map((type) => (
                            <Badge key={type} variant="secondary">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadFilter(filter)}
                      >
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilter}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
          <Button variant="outline" onClick={handleSaveFilter}>
            <Save className="mr-2 h-4 w-4" />
            Save Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 