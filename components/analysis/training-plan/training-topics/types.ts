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
  estimatedTime: string
  prerequisites?: string[]
  objectives: string[]
  resources: Resource[]
  relatedTopics?: string[]
}

export type OpeningVariation = {
  name: string
  moves: string
  description: string
  keyIdeas: string[]
}

export type OpeningTopic = TrainingTopic & {
  eco?: string
  variations: OpeningVariation[]
  forColor: 'white' | 'black' | 'both'
  popularityLevel: 1 | 2 | 3 | 4 | 5
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