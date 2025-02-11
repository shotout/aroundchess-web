"use client"

import { samecoloredbishops } from "@/components/analysis/training-plan/training-topics/endgame/same-colored-bishops"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function SameColoredBishopsPage() {
  return <EndgameTopicPage topic={samecoloredbishops} topicId="same-colored-bishops" />
}