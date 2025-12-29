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
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Send } from "lucide-react"

interface CommentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Comment {
  id: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  timestamp: string
  replies?: Comment[]
}

export function CommentsDialog({
  open,
  onOpenChange,
}: CommentsDialogProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=john",
      },
      content: "Great progress on the tactical awareness! The improvement in endgame positions is particularly noteworthy.",
      timestamp: "2 hours ago",
      replies: [
        {
          id: "1-1",
          user: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=jane",
          },
          content: "Agreed! The pattern recognition has improved significantly.",
          timestamp: "1 hour ago",
        },
      ],
    },
    {
      id: "2",
      user: {
        name: "Mike Johnson",
        email: "mike.j@example.com",
        avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=mike",
      },
      content: "Consider focusing more on time management in complex positions. That seems to be a recurring theme.",
      timestamp: "3 hours ago",
    },
  ])
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          name: "Current User",
          email: "user@example.com",
          avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=user",
        },
        content: newComment.trim(),
        timestamp: "Just now",
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Report Comments</DialogTitle>
          <DialogDescription>
            Discuss and provide feedback on this report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>
                        {comment.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {comment.user.name}
                        </span>
                        <span className="text-[14px] --sm text-muted-foreground">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-[14px] --sm">{comment.content}</p>
                    </div>
                  </div>
                  {comment.replies?.map((reply) => (
                    <div
                      key={reply.id}
                      className="flex gap-4 ml-12"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.user.avatar} />
                        <AvatarFallback>
                          {reply.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {reply.user.name}
                          </span>
                          <span className="text-[14px] --sm text-muted-foreground">
                            {reply.timestamp}
                          </span>
                        </div>
                        <p className="text-[14px] --sm">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button
              size="icon"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
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