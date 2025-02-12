import { Metadata } from "next"
import { TeamDashboard } from "@/components/teams/team-dashboard"
import { TeamHeader } from "@/components/teams/team-header"

export const metadata: Metadata = {
  title: "Teams | AroundChess",
  description: "Create and manage your chess teams, organize matches, and track team performance.",
}

export default function TeamsPage() {
  return (
    <>
      <TeamHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TeamDashboard />
      </div>
    </>
  )
} 