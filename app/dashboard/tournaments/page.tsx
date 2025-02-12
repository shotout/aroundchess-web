import { Metadata } from "next"
import { TournamentHeader } from "@/components/tournaments/tournament-header"
import { TournamentDashboard } from "@/components/tournaments/tournament-dashboard"

export const metadata: Metadata = {
  title: "Tournaments | AroundChess",
  description: "Engage in competitive chess tournaments, track live matches, and analyze game performance.",
}

export default function TournamentsPage() {
  return (
    <>
      <TournamentHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TournamentDashboard />
      </div>
    </>
  )
}