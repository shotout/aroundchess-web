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
import { Switch } from "@/components/ui/switch"

interface ScheduleReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleReportDialog({
  open,
  onOpenChange,
}: ScheduleReportDialogProps) {
  const [frequency, setFrequency] = useState("weekly")
  const [reportType, setReportType] = useState("progress")
  const [emailNotifications, setEmailNotifications] = useState(true)

  const handleSchedule = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Schedule Report Generation</DialogTitle>
          <DialogDescription>
            Set up automatic report generation on a schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">Progress Report</SelectItem>
                <SelectItem value="games">Game Analysis</SelectItem>
                <SelectItem value="training">Training Report</SelectItem>
                <SelectItem value="custom">Custom Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="frequency">Generation Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {frequency === "weekly" && (
            <div className="grid gap-2">
              <Label htmlFor="day">Day of Week</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                  <SelectItem value="0">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {frequency === "monthly" && (
            <div className="grid gap-2">
              <Label htmlFor="day">Day of Month</Label>
              <Input
                type="number"
                min="1"
                max="31"
                defaultValue="1"
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="time">Generation Time</Label>
            <Input type="time" defaultValue="00:00" className="col-span-3" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <div className="text-[14px] --sm text-muted-foreground">
                Receive email when reports are generated
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>Schedule Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 