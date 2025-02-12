"use client"

import { knightvsbishop } from "@/components/analysis/training-plan/training-topics/endgame/knight-vs-bishop"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function KnightVsBishopPage() {
  return <EndgameTopicPage topic={knightvsbishop} topicId="knight-vs-bishop" />
}