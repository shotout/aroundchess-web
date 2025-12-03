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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Settings, Bell, Eye } from "lucide-react"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportSettingsDialog({
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const [defaultFormat, setDefaultFormat] = useState("pdf")
  const [autoSave, setAutoSave] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [notificationFrequency, setNotificationFrequency] = useState("daily")
  const [previewMode, setPreviewMode] = useState(true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Report Settings</DialogTitle>
          <DialogDescription>
            Configure your report preferences and notifications
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Default Report Format</Label>
                <Select value={defaultFormat} onValueChange={setDefaultFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save Reports</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Automatically save reports after generation
                  </p>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Preview Mode</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Enable report preview before download
                  </p>
                </div>
                <Switch
                  checked={previewMode}
                  onCheckedChange={setPreviewMode}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Receive notifications about report updates
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              {emailNotifications && (
                <div className="space-y-2">
                  <Label>Notification Frequency</Label>
                  <Select
                    value={notificationFrequency}
                    onValueChange={setNotificationFrequency}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 