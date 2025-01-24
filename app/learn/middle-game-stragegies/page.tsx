import type { Metadata } from "next"
import MiddleGameStrategies from "@/components/middle-game-strategies/MiddleGameStrategies"

export const metadata: Metadata = {
  title: "Middle Game Strategies | Chess Analyzer",
  description:
    "Master essential middlegame strategies to improve your chess gameplay. Learn about piece coordination, attack construction, defense techniques, and more.",
}

export default function MiddleGameStrategiesPage() {
  return <MiddleGameStrategies />
}

