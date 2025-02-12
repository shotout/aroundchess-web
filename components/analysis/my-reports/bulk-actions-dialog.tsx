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
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Share2,
  Archive,
  Trash2,
  Tag,
  FolderPlus,
  Copy,
  Star,
} from "lucide-react"

interface BulkActionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
}

export function BulkActionsDialog({
  open,
  onOpenChange,
  selectedCount,
}: BulkActionsDialogProps) {
  const [exportFormat, setExportFormat] = useState("pdf")
  const [includeComments, setIncludeComments] = useState(false)
  const [notifyOnComplete, setNotifyOnComplete] = useState(true)

  const handleAction = () => {
    // Implement bulk action logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Actions</DialogTitle>
          <DialogDescription>
            Perform actions on {selectedCount} selected reports
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={handleAction}
            >
              <Download className="h-6 w-6" />
              <span>Download</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={handleAction}
            >
              <Share2 className="h-6 w-6" />
              <span>Share</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={handleAction}
            >
              <Archive className="h-6 w-6" />
              <span>Archive</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={handleAction}
            >
              <Tag className="h-6 w-6" />
              <span>Add Tags</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={handleAction}
            >
              <FolderPlus className="h-6 w-6" />
              <span>Add to Collection</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={handleAction}
            >
              <Star className="h-6 w-6" />
              <span>Add to Favorites</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={handleAction}
            >
              <Copy className="h-6 w-6" />
              <span>Duplicate</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 text-destructive hover:text-destructive"
              onClick={handleAction}
            >
              <Trash2 className="h-6 w-6" />
              <span>Delete</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                  <SelectItem value="excel">Excel Workbook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Export with discussion threads
                </p>
              </div>
              <Switch
                checked={includeComments}
                onCheckedChange={setIncludeComments}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notify on Complete</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when bulk action is completed
                </p>
              </div>
              <Switch
                checked={notifyOnComplete}
                onCheckedChange={setNotifyOnComplete}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAction}>Apply to Selected</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 