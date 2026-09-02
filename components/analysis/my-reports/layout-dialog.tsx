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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LayoutGrid, List, Columns, Table2 } from "lucide-react"

interface LayoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LayoutDialog({
  open,
  onOpenChange,
}: LayoutDialogProps) {
  const [viewMode, setViewMode] = useState("grid")
  const [gridColumns, setGridColumns] = useState("3")
  const [showPreview, setShowPreview] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [rememberLayout, setRememberLayout] = useState(false)

  const handleApply = () => {
    // Implement layout change logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Layout Settings</DialogTitle>
          <DialogDescription>
            Customize how your reports are displayed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <Label>View Mode</Label>
            <RadioGroup
              value={viewMode}
              onValueChange={setViewMode}
              className="grid grid-cols-4 gap-2"
            >
              <div>
                <RadioGroupItem
                  value="grid"
                  id="grid"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="grid"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <LayoutGrid className="mb-2 h-6 w-6" />
                  Grid
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="list"
                  id="list"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="list"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <List className="mb-2 h-6 w-6" />
                  List
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="columns"
                  id="columns"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="columns"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Columns className="mb-2 h-6 w-6" />
                  Columns
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="table"
                  id="table"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="table"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Table2 className="mb-2 h-6 w-6" />
                  Table
                </Label>
              </div>
            </RadioGroup>
          </div>

          {viewMode === "grid" && (
            <div className="space-y-2">
              <Label>Grid Columns</Label>
              <Select value={gridColumns} onValueChange={setGridColumns}>
                <SelectTrigger>
                  <SelectValue placeholder="Select columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                  <SelectItem value="5">5 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Preview</Label>
                <p className="text-[14px] --sm text-muted-foreground">
                  Display report previews in cards
                </p>
              </div>
              <Switch
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-[14px] --sm text-muted-foreground">
                  Reduce spacing between items
                </p>
              </div>
              <Switch
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Remember Layout</Label>
                <p className="text-[14px] --sm text-muted-foreground">
                  Save these preferences for future visits
                </p>
              </div>
              <Switch
                checked={rememberLayout}
                onCheckedChange={setRememberLayout}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Layout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 