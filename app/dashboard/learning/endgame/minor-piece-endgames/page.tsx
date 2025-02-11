"use client"

import { minorpieceendgames } from "@/components/analysis/training-plan/training-topics/endgame/minor-piece-endgames"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function MinorPieceEndgamesPage() {
  return <EndgameTopicPage topic={minorpieceendgames} topicId="minor-piece-endgames" />
}