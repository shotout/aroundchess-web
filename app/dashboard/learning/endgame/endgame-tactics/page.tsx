"use client"

import { endgametactics } from "@/components/analysis/training-plan/training-topics/endgame/endgame-tactics"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function EndgameTacticsPage() {
  return <EndgameTopicPage topic={endgametactics} topicId="endgame-tactics" />
}