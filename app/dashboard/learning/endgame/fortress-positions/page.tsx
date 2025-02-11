"use client"

import { fortresspositions } from "@/components/analysis/training-plan/training-topics/endgame/fortress-positions"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function FortressPositionsPage() {
  return <EndgameTopicPage topic={fortresspositions} topicId="fortress-positions" />
}