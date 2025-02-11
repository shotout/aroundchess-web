"use client"

import { queenendgames } from "@/components/analysis/training-plan/training-topics/endgame/queen-endgames"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function QueenEndgamesPage() {
  return <EndgameTopicPage topic={queenendgames} topicId="queen-endgames" />
}