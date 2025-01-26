import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import PositionalPlay from "@/components/positional-play/PositionalPlay"

export const metadata: Metadata = {
  title: "Positional Play | Chess Analyzer",
  description:
    "Learn the intricacies of positional chess, including pawn structure analysis, piece placement, and strategic planning.",
}

export default function PositionalPlayPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PositionalPlay />
      </main>
      <SiteFooter />
    </div>
  )
}