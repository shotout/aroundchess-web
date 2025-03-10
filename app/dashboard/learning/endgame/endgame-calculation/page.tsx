"use client"

import { endgamecalculation } from "@/components/analysis/training-plan/training-topics/endgame/endgame-calculation"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function EndgameCalculationPage() {
  return <EndgameTopicPage topic={endgamecalculation} topicId="endgame-calculation" />
}