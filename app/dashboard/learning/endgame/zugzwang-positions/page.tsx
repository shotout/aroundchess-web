"use client"

import { zugzwangpositions } from "@/components/analysis/training-plan/training-topics/endgame/zugzwang-positions"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function ZugzwangPositionsPage() {
  return <EndgameTopicPage topic={zugzwangpositions} topicId="zugzwang-positions" />
}