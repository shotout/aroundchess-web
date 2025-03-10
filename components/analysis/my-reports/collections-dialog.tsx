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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, FolderPlus, MoreVertical, Edit, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Collection {
  id: string
  name: string
  reportCount: number
  lastUpdated: string
}

interface CollectionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportCollectionsDialog({
  open,
  onOpenChange,
}: CollectionsDialogProps) {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "Important Reports",
      reportCount: 5,
      lastUpdated: "2024-03-15",
    },
    {
      id: "2",
      name: "Tournament Analysis",
      reportCount: 8,
      lastUpdated: "2024-03-12",
    },
    {
      id: "3",
      name: "Training Progress",
      reportCount: 12,
      lastUpdated: "2024-03-10",
    },
    {
      id: "4",
      name: "Game Reviews",
      reportCount: 15,
      lastUpdated: "2024-03-08",
    },
  ])
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName,
        reportCount: 0,
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      setCollections([...collections, newCollection])
      setNewCollectionName("")
      setShowNewCollection(false)
    }
  }

  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter((c) => c.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Report Collections</DialogTitle>
          <DialogDescription>
            Organize your reports into collections for easy access.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Your Collections</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewCollection(true)}
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
          </div>
          {showNewCollection && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <Button size="sm" onClick={handleCreateCollection}>
                Create
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewCollection(false)}
              >
                Cancel
              </Button>
            </div>
          )}
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <Folder className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">{collection.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {collection.reportCount} reports • Last updated{" "}
                        {collection.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteCollection(collection.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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