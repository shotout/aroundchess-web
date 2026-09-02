import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

const template = (topic) => `interface Resource {
  title: string
  description: string
  platform: "chess.com" | "lichess.org" | "custom"
  url: string
}

export interface EndgameTopic {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedTime: string
  objectives: string[]
  prerequisites: string[]
  fundamentalPositions: string[]
  winningTechniques: string[]
  commonMistakes: string[]
  resources: Resource[]
  relatedTopics: string[]
}

export const ${topic.replace(/-/g, '')}: EndgameTopic = {
  id: "${topic}",
  title: "${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}",
  description: "Master the essential concepts and techniques for ${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').toLowerCase()}",
  difficulty: "Beginner",
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
      title: "Essential Concepts",
      description: "Learn the fundamental concepts and strategies",
      platform: "lichess.org",
      url: "https://lichess.org/study"
    },
    {
      title: "Practice Positions",
      description: "Train with carefully selected positions",
      platform: "chess.com",
      url: "https://www.chess.com/lessons"
    }
  ],
  relatedTopics: [
    "endgame-principles",
    "practical-endgame",
    "technical-winning",
    "endgame-calculation"
  ]
}`

// Generate files for each topic
topics.forEach(topic => {
  const dir = path.join(process.cwd(), 'components/analysis/training-plan/training-topics/endgame')
  const file = path.join(dir, `${topic}.ts`)
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  fs.writeFileSync(file, template(topic))
})

console.log('Generated all endgame topic files') 