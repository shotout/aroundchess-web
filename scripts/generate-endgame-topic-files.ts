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

const template = (topic: string) => `import { Difficulty, Resource, EndgameTopic as BaseEndgameTopic } from '../../types'

export const ${topic.replace(/-/g, '')}: BaseEndgameTopic = {
  id: "${topic}",
  title: "${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}",
  description: "Master the essential concepts and techniques for ${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').toLowerCase()}",
  difficulty: "Beginner" as Difficulty,
  estimatedTime: "30 minutes",
  objectives: [
    "Understand the fundamental concepts",
    "Master key techniques and patterns",
    "Learn common winning methods",
    "Practice essential positions"
  ],
  prerequisites: [
    "Basic piece movement",
    "Understanding of endgame principles"
  ],
  fundamentalPositions: [
    "Basic setup and structure",
    "Key tactical patterns",
    "Critical positions",
    "Common formations"
  ],
  theoreticalKnowledge: [
    "Core principles",
    "Key patterns",
    "Important concepts",
    "Strategic ideas"
  ],
  practicalTips: [
    "Calculate variations carefully",
    "Use your pieces actively",
    "Create and exploit weaknesses",
    "Control key squares"
  ],
  winningTechniques: [
    "Position improvement",
    "Creating and exploiting weaknesses",
    "Converting advantages",
    "Technical execution"
  ],
  commonMistakes: [
    "Poor piece coordination",
    "Incorrect evaluation",
    "Technical mistakes",
    "Strategic errors"
  ],
  resources: [
    {
      title: "${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Fundamentals",
      description: "Learn the essential concepts of ${topic.split('-').join(' ')}",
      platform: "chess.com",
      url: "https://www.chess.com/lessons/${topic}"
    },
    {
      title: "Advanced ${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}",
      description: "Master complex ${topic.split('-').join(' ')} positions",
      platform: "lichess.org",
      url: "https://lichess.org/study/${topic}"
    }
  ],
  relatedTopics: [
    "endgame-principles",
    "practical-endgame",
    "technical-winning",
    "endgame-calculation"
  ]
}`

const dir = path.join(process.cwd(), 'components/analysis/training-plan/training-topics/endgame')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

topics.forEach(topic => {
  const filePath = path.join(dir, `${topic}.ts`)
  fs.writeFileSync(filePath, template(topic))
  console.log(`Generated ${filePath}`)
}) 