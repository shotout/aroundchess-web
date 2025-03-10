import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import FamousGames from "@/components/learn/famous-games/FamousGames"

export const metadata: Metadata = {
  title: "Famous Chess Games | Chess Analyzer",
  description:
    "Explore a collection of famous chess games, from historical masterpieces to modern classics, and learn from the best.",
}

export default function FamousGamesPage() {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <FamousGames />
        </main>
        <SiteFooter />
      </div>
    )
  }
