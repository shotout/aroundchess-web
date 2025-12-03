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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Keyboard } from "lucide-react"

interface ShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ShortcutCategory {
  name: string
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

export function ShortcutsDialog({
  open,
  onOpenChange,
}: ShortcutsDialogProps) {
  const [enableShortcuts, setEnableShortcuts] = useState(true)

  const shortcutCategories: ShortcutCategory[] = [
    {
      name: "Navigation",
      shortcuts: [
        {
          keys: ["⌘", "1"],
          description: "Go to Progress Reports",
        },
        {
          keys: ["⌘", "2"],
          description: "Go to Game History",
        },
        {
          keys: ["⌘", "3"],
          description: "Go to Training Plans",
        },
        {
          keys: ["⌘", "F"],
          description: "Focus search",
        },
      ],
    },
    {
      name: "Actions",
      shortcuts: [
        {
          keys: ["⌘", "N"],
          description: "New report",
        },
        {
          keys: ["⌘", "E"],
          description: "Export selected",
        },
        {
          keys: ["⌘", "D"],
          description: "Download selected",
        },
        {
          keys: ["⌘", "S"],
          description: "Share selected",
        },
      ],
    },
    {
      name: "Selection",
      shortcuts: [
        {
          keys: ["Space"],
          description: "Select/deselect item",
        },
        {
          keys: ["⌘", "A"],
          description: "Select all",
        },
        {
          keys: ["⌘", "⇧", "A"],
          description: "Deselect all",
        },
        {
          keys: ["⇧", "↑"],
          description: "Extend selection up",
        },
        {
          keys: ["⇧", "↓"],
          description: "Extend selection down",
        },
      ],
    },
    {
      name: "View",
      shortcuts: [
        {
          keys: ["⌘", "G"],
          description: "Grid view",
        },
        {
          keys: ["⌘", "L"],
          description: "List view",
        },
        {
          keys: ["⌘", "+"],
          description: "Zoom in",
        },
        {
          keys: ["⌘", "-"],
          description: "Zoom out",
        },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            View and manage keyboard shortcuts for faster navigation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Keyboard Shortcuts</Label>
              <p className="text-[14px] --sm text-muted-foreground">
                Toggle all keyboard shortcuts
              </p>
            </div>
            <Switch
              checked={enableShortcuts}
              onCheckedChange={setEnableShortcuts}
            />
          </div>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {shortcutCategories.map((category) => (
                <div key={category.name} className="space-y-3">
                  <h4 className="font-medium">{category.name}</h4>
                  <div className="space-y-2">
                    {category.shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[14px] --sm text-muted-foreground">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <kbd
                              key={keyIndex}
                              className={`${
                                key.length > 1 ? "px-2" : "px-1.5"
                              } h-6 items-center justify-center rounded border bg-muted text-[14px] --sm font-medium opacity-100`}
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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