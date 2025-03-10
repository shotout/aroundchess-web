import fs from 'fs'
import path from 'path'

const topics = [
  'advanced-pawn-endgames',
  'basic-checkmates',
  'basic-endgame-principles',
  'basic-minor-piece',
  'basic-rook-endgames',
  'bishop-knight-mate',
  'complex-minor-piece',
  'complex-queen-endgames',
  'complex-rook-endgames',
  'drawing-techniques',
  'endgame-calculation',
  'endgame-principles',
  'endgame-studies',
  'endgame-tactics',
  'fortress-positions',
  'king-activity',
  'king-and-pawn',
  'knight-vs-bishop',
  'minor-piece-endgames',
  'opposite-colored-bishops',
  'pawn-breakthroughs',
  'pawn-endgames',
  'practical-endgame',
  'queen-endgame-principles',
  'queen-endgames',
  'queen-vs-pawn',
  'queen-vs-rook',
  'rook-bishop-vs-rook',
  'rook-endgames',
  'rook-vs-minor',
  'rook-vs-pawns',
  'same-colored-bishops',
  'stalemate-patterns',
  'technical-conversion',
  'technical-winning',
  'theoretical-endgames',
  'theoretical-positions',
  'zugzwang-positions'
]

const template = (topic: string, importName: string) => `"use client"

import { ${importName} } from "@/components/analysis/training-plan/training-topics/endgame/${topic}"
import EndgameTopicPage from "@/components/learn/endgame/endgame-topic-page"

export default function ${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Page() {
  return <EndgameTopicPage topic={${importName}} topicId="${topic}" />
}`

// Create directories and files
topics.forEach(topic => {
  const dir = path.join(process.cwd(), 'app/dashboard/learning/endgame', topic)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const filePath = path.join(dir, 'page.tsx')
  const importName = topic.replace(/-/g, '')
  fs.writeFileSync(filePath, template(topic, importName))
  console.log(`Generated ${filePath}`)
}) 