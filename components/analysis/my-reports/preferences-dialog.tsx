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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Settings,
  Bell,
  Download,
  FileText,
  Mail,
  Calendar,
  Eye,
} from "lucide-react"

interface PreferencesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreferencesDialog({
  open,
  onOpenChange,
}: PreferencesDialogProps) {
  const [defaultFormat, setDefaultFormat] = useState("pdf")
  const [autoSave, setAutoSave] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [notificationFrequency, setNotificationFrequency] = useState("instant")
  const [autoArchive, setAutoArchive] = useState(false)
  const [previewMode, setPreviewMode] = useState("detailed")

  const handleSave = () => {
    // Implement preferences save logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Report Preferences</DialogTitle>
          <DialogDescription>
            Customize your report settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <Settings className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="display">
              <Eye className="mr-2 h-4 w-4" />
              Display
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Default Report Format</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Choose the default format for downloading reports
                  </p>
                </div>
                <Select
                  value={defaultFormat}
                  onValueChange={setDefaultFormat}
                >
                  <SelectTrigger className="w-[180px]">
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
                  <Label>Auto-save Reports</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Automatically save reports while editing
                  </p>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Archive</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Automatically archive reports older than 30 days
                  </p>
                </div>
                <Switch
                  checked={autoArchive}
                  onCheckedChange={setAutoArchive}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Receive email notifications for new reports
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="grid gap-2">
                <Label>Notification Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  disabled={!emailNotifications}
                />
              </div>

              <div className="grid gap-2">
                <Label>Notification Frequency</Label>
                <Select
                  value={notificationFrequency}
                  onValueChange={setNotificationFrequency}
                  disabled={!emailNotifications}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Preview Mode</Label>
                <Select value={previewMode} onValueChange={setPreviewMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preview mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show File Size</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Display file size in report listings
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Creation Date</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Display report creation date
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Tags</Label>
                  <p className="text-[14px] --sm text-muted-foreground">
                    Display report tags in listings
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 