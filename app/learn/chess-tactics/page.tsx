import type { Metadata } from "next"
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import ChessTactics from "@/components/chess-tactics/ChessTactics"

export const metadata: Metadata = {
  title: "Chess Tactics | Chess Analyzer",
  description:
    "Master essential chess tactics to improve your gameplay. Learn about pins, forks, discovery attacks, and more advanced tactical motifs.",
}

export default function ChessTacticsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ChessTactics />
      </main>
      <SiteFooter />
    </div>
  )
}