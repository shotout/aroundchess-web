"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trophy, Filter, RefreshCw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TournamentHeader() {
  const [filter, setFilter] = useState("all")

  return (
    <div className="flex h-24 items-center justify-between border-b border-gray-200 px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tournaments</h1>
          <p className="text-[14px] --sm text-gray-500">View and manage chess tournaments</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter tournaments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tournaments</SelectItem>
            <SelectItem value="live">Live Tournaments</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="starred">Starred</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 