"use client"

import { stalematepatterns } from "@/components/analysis/training-plan/training-topics/endgame/stalemate-patterns"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function StalematePatternsPage() {
  return <EndgameTopicPage topic={stalematepatterns} topicId="stalemate-patterns" />
}