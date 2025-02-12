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
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface SortingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SortingDialog({
  open,
  onOpenChange,
}: SortingDialogProps) {
  const [primarySort, setPrimarySort] = useState("date")
  const [primaryOrder, setPrimaryOrder] = useState("desc")
  const [secondarySort, setSecondarySort] = useState("name")
  const [secondaryOrder, setSecondaryOrder] = useState("asc")
  const [rememberPreference, setRememberPreference] = useState(false)

  const sortOptions = [
    { value: "date", label: "Date Created" },
    { value: "modified", label: "Last Modified" },
    { value: "name", label: "Report Name" },
    { value: "type", label: "Report Type" },
    { value: "size", label: "File Size" },
    { value: "rating", label: "Rating Range" },
  ]

  const handleApply = () => {
    // Implement sorting logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sort Reports</DialogTitle>
          <DialogDescription>
            Choose how your reports should be organized.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label>Primary Sort</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Select value={primarySort} onValueChange={setPrimarySort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select criteria" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <RadioGroup
                  value={primaryOrder}
                  onValueChange={setPrimaryOrder}
                  className="flex items-center space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asc" id="primary-asc" />
                    <Label htmlFor="primary-asc">
                      <ArrowUp className="h-4 w-4" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="desc" id="primary-desc" />
                    <Label htmlFor="primary-desc">
                      <ArrowDown className="h-4 w-4" />
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label>Secondary Sort</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Select value={secondarySort} onValueChange={setSecondarySort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select criteria" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions
                      .filter((option) => option.value !== primarySort)
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <RadioGroup
                  value={secondaryOrder}
                  onValueChange={setSecondaryOrder}
                  className="flex items-center space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asc" id="secondary-asc" />
                    <Label htmlFor="secondary-asc">
                      <ArrowUp className="h-4 w-4" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="desc" id="secondary-desc" />
                    <Label htmlFor="secondary-desc">
                      <ArrowDown className="h-4 w-4" />
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Remember Preference</Label>
              <p className="text-sm text-muted-foreground">
                Save this sorting preference for future visits
              </p>
            </div>
            <Switch
              checked={rememberPreference}
              onCheckedChange={setRememberPreference}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Apply Sorting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 