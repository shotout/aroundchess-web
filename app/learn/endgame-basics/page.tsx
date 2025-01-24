import type { Metadata } from "next"
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import EndgameBasics from "@/components/endgame-basics/EndgameBasics"

export const metadata: Metadata = {
  title: "Endgame Basics | Chess Analyzer",
  description:
    "Master essential endgame techniques and concepts to improve your chess gameplay. Learn about basic checkmates, pawn endgames, rook endgames, and more.",
}


export default function EndgameBasicsPage() {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <EndgameBasics />
        </main>
        <SiteFooter />
      </div>
    )
  }