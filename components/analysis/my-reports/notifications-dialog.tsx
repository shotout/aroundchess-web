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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Bell,
  Download,
  Share2,
  MessageSquare,
  Tag,
  Clock,
  CheckCircle2,
} from "lucide-react"

interface NotificationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Notification {
  id: string
  type: "share" | "comment" | "download" | "tag" | "generate" | "complete"
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  read: boolean
}

export function NotificationsDialog({
  open,
  onOpenChange,
}: NotificationsDialogProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "share",
      title: "Report Shared",
      description: "Jane Smith shared 'Monthly Progress Report' with you",
      timestamp: "2 minutes ago",
      user: {
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=jane",
      },
      read: false,
    },
    {
      id: "2",
      type: "comment",
      title: "New Comment",
      description: "John Doe commented on your 'Game Analysis Report'",
      timestamp: "1 hour ago",
      user: {
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=john",
      },
      read: false,
    },
    {
      id: "3",
      type: "download",
      title: "Report Downloaded",
      description: "Your report 'Training Plan Q1' was downloaded",
      timestamp: "2 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "tag",
      title: "Report Tagged",
      description: "Mike added 'Important' tag to 'Tournament Analysis'",
      timestamp: "3 hours ago",
      user: {
        name: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=mike",
      },
      read: true,
    },
    {
      id: "5",
      type: "generate",
      title: "Report Generation Started",
      description: "Monthly Progress Report is being generated",
      timestamp: "4 hours ago",
      read: true,
    },
    {
      id: "6",
      type: "complete",
      title: "Report Generation Complete",
      description: "Your Weekly Analysis Report is ready to view",
      timestamp: "5 hours ago",
      read: true,
    },
  ])

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "share":
        return <Share2 className="h-4 w-4" />
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      case "download":
        return <Download className="h-4 w-4" />
      case "tag":
        return <Tag className="h-4 w-4" />
      case "generate":
        return <Clock className="h-4 w-4" />
      case "complete":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Notifications</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
          <DialogDescription>
            Stay updated with your report activities.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4 py-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  !notification.read ? "bg-muted" : ""
                }`}
              >
                <div className="mt-1">
                  {notification.user ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>
                        {notification.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.read && (
                      <Badge variant="secondary" className="h-5">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-[14px] --sm text-muted-foreground">
                    {notification.description}
                  </p>
                  <p className="text-[14px] --sm text-muted-foreground">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 