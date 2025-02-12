export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export type Resource = {
  title: string
  url: string
  platform: 'chess.com' | 'lichess.org' | 'custom'
  description?: string
}

export type TrainingTopic = {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  estimatedTime: string // e.g., "2 hours", "45 minutes"
  prerequisites?: string[]
  objectives: string[]
  resources: Resource[]
  relatedTopics?: string[] // IDs of related topics
}

export type OpeningVariation = {
  name: string
  moves: string
  description: string
  keyIdeas: string[]
}

export type OpeningTopic = TrainingTopic & {
  eco?: string // ECO code if applicable
  variations: OpeningVariation[]
  forColor: 'white' | 'black' | 'both'
  popularityLevel: 1 | 2 | 3 | 4 | 5 // 1 = rare, 5 = very popular
  recommendedFor: Difficulty[]
}

export type MiddlegameTopic = TrainingTopic & {
  patterns: string[]
  commonThemes: string[]
  tacticalMotifs?: string[]
  strategicConcepts?: string[]
}

export type EndgameTopic = TrainingTopic & {
  fundamentalPositions: string[]
  theoreticalKnowledge: string[]
  practicalTips: string[]
  commonMistakes: string[]
  winningTechniques?: string[]
  drawingTechniques?: string[]
} 