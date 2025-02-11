"use client"

import { pawnendgames } from "@/components/analysis/training-plan/training-topics/endgame/pawn-endgames"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function PawnEndgamesPage() {
  return <EndgameTopicPage topic={pawnendgames} topicId="pawn-endgames" />
}