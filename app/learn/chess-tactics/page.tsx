import { Metadata } from "next"
import dynamic from "next/dynamic"

const ChessTacticsPage = dynamic(
  () => import("@/components/learn/chess-tactics/ChessTactics"),
  { ssr: false }
)

export const metadata: Metadata = {
  title: "Chess Tactics | Chess Analyzer",
  description:
    "Master essential chess tactics to improve your gameplay. Learn about pins, forks, discovery attacks, and more advanced tactical motifs.",
}

export default ChessTacticsPage