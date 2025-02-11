"use client"

import { rookendgames } from "@/components/analysis/training-plan/training-topics/endgame/rook-endgames"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function RookEndgamesPage() {
  return <EndgameTopicPage topic={rookendgames} topicId="rook-endgames" />
}