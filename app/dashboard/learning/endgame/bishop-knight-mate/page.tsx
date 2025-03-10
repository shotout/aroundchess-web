"use client"

import { bishopknightmate } from "@/components/analysis/training-plan/training-topics/endgame/bishop-knight-mate"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function BishopKnightMatePage() {
  return <EndgameTopicPage topic={bishopknightmate} topicId="bishop-knight-mate" />
}