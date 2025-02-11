"use client"

import { endgamestudies } from "@/components/analysis/training-plan/training-topics/endgame/endgame-studies"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function EndgameStudiesPage() {
  return <EndgameTopicPage topic={endgamestudies} topicId="endgame-studies" />
}