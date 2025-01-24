import type { Metadata } from "next"
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import MiddleGameStrategies from "@/components/middle-game-strategies/MiddleGameStrategies"

export const metadata: Metadata = {
  title: "Middle Game Strategies | Chess Analyzer",
  description:
    "Master essential middlegame strategies to improve your chess gameplay. Learn about piece coordination, attack construction, defense techniques, and more.",
}

export default function MiddleGameStrategiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <MiddleGameStrategies />
      </main>
      <SiteFooter />
    </div>
  )
}

