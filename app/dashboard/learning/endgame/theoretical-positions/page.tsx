"use client"

import { theoreticalpositions } from "@/components/analysis/training-plan/training-topics/endgame/theoretical-positions"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function TheoreticalPositionsPage() {
  return <EndgameTopicPage topic={theoreticalpositions} topicId="theoretical-positions" />
}