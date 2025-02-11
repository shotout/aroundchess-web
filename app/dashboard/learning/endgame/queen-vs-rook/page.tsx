"use client"

import { queenvsrook } from "@/components/analysis/training-plan/training-topics/endgame/queen-vs-rook"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function QueenVsRookPage() {
  return <EndgameTopicPage topic={queenvsrook} topicId="queen-vs-rook" />
}