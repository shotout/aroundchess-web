interface Resource {
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

export const rookvsminor: EndgameTopic = {
  id: "rook-vs-minor",
  title: "Rook Vs Minor",
  description: "Master the essential concepts and techniques for rook vs minor",
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
}