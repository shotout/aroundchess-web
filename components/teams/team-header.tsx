"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users } from "lucide-react"
import { CreateTeamDialog } from "./create-team-dialog"

export function TeamHeader() {
  const [showCreateTeam, setShowCreateTeam] = useState(false)

  return (
    <div className="flex h-24 items-center justify-between border-b border-gray-200 px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Teams</h1>
          <p className="text-sm text-gray-500">Create and manage your chess teams</p>
        </div>
      </div>
      <Button
        onClick={() => setShowCreateTeam(true)}
        className="flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Create Team
      </Button>
      <CreateTeamDialog open={showCreateTeam} onOpenChange={setShowCreateTeam} />
    </div>
  )
} 