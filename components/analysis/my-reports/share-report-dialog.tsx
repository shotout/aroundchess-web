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
import { Input } from "@/components/ui/input"
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
import { X, Copy, Check } from "lucide-react"

interface ShareReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareReportDialog({
  open,
  onOpenChange,
}: ShareReportDialogProps) {
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [permission, setPermission] = useState("view")
  const [notifyOnDownload, setNotifyOnDownload] = useState(false)
  const [expiryDate, setExpiryDate] = useState("never")
  const [linkCopied, setLinkCopied] = useState(false)

  const handleAddEmail = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newEmail.trim() && isValidEmail(newEmail.trim())) {
      setEmails([...emails, newEmail.trim()])
      setNewEmail("")
    }
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://aroundchess.com/reports/share/abc123")
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleShare = () => {
    // Implement share logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
          <DialogDescription>
            Share your report with team members or via a link.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Share with People</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {emails.map((email) => (
                <Badge key={email} variant="secondary">
                  {email}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => handleRemoveEmail(email)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Enter email addresses"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleAddEmail}
            />
          </div>
          <div className="grid gap-2">
            <Label>Permission Level</Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger>
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View only</SelectItem>
                <SelectItem value="comment">Can comment</SelectItem>
                <SelectItem value="edit">Can edit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Share via Link</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value="https://aroundchess.com/reports/share/abc123"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {linkCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Link Expiry</Label>
            <Select value={expiryDate} onValueChange={setExpiryDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select expiry date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="1day">1 day</SelectItem>
                <SelectItem value="7days">7 days</SelectItem>
                <SelectItem value="30days">30 days</SelectItem>
                <SelectItem value="custom">Custom date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notify on Download</Label>
              <div className="text-sm text-muted-foreground">
                Get notified when someone downloads the report
              </div>
            </div>
            <Switch
              checked={notifyOnDownload}
              onCheckedChange={setNotifyOnDownload}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare}>Share Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 