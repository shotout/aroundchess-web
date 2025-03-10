"use client"

import { basiccheckmates } from "@/components/analysis/training-plan/training-topics/endgame/basic-checkmates"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function BasicCheckmatesPage() {
  return <EndgameTopicPage topic={basiccheckmates} topicId="basic-checkmates" />
}