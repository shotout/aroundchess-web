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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Eye,
  Type,
  MousePointer2,
  Keyboard,
  Contrast,
  Palette,
} from "lucide-react"

interface AccessibilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccessibilityDialog({
  open,
  onOpenChange,
}: AccessibilityDialogProps) {
  const [fontSize, setFontSize] = useState("medium")
  const [contrast, setContrast] = useState("default")
  const [colorBlindMode, setColorBlindMode] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [keyboardMode, setKeyboardMode] = useState(false)
  const [screenReader, setScreenReader] = useState(false)

  const handleApply = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Accessibility Settings</DialogTitle>
          <DialogDescription>
            Customize your experience for better accessibility.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Type className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <Label>Text Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select text size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="x-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Contrast className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <Label>Contrast</Label>
                  <Select value={contrast} onValueChange={setContrast}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contrast" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="increased">Increased</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Palette className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Color Blind Mode</Label>
                      <p className="text-[14px] --sm text-muted-foreground">
                        Optimize colors for color vision deficiencies
                      </p>
                    </div>
                    <Switch
                      checked={colorBlindMode}
                      onCheckedChange={setColorBlindMode}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MousePointer2 className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduce Motion</Label>
                      <p className="text-[14px] --sm text-muted-foreground">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Switch
                      checked={reduceMotion}
                      onCheckedChange={setReduceMotion}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Keyboard className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Keyboard Navigation Mode</Label>
                      <p className="text-[14px] --sm text-muted-foreground">
                        Enhanced keyboard controls and focus indicators
                      </p>
                    </div>
                    <Switch
                      checked={keyboardMode}
                      onCheckedChange={setKeyboardMode}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Eye className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Screen Reader Optimization</Label>
                      <p className="text-[14px] --sm text-muted-foreground">
                        Improve compatibility with screen readers
                      </p>
                    </div>
                    <Switch
                      checked={screenReader}
                      onCheckedChange={setScreenReader}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 