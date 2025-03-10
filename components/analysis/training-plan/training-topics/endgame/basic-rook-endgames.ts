import { Difficulty, Resource, EndgameTopic as BaseEndgameTopic } from '../types'

export const basicrookendgames: BaseEndgameTopic = {
  id: "basic-rook-endgames",
  title: "Basic Rook Endgames",
  description: "Master the essential concepts and techniques for basic rook endgames",
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
      title: "Basic Rook Endgames Fundamentals",
      description: "Learn the essential concepts of basic rook endgames",
      platform: "chess.com",
      url: "https://www.chess.com/lessons/basic-rook-endgames"
    },
    {
      title: "Advanced Basic Rook Endgames",
      description: "Master complex basic rook endgames positions",
      platform: "lichess.org",
      url: "https://lichess.org/study/basic-rook-endgames"
    }
  ],
  relatedTopics: [
    "endgame-principles",
    "practical-endgame",
    "technical-winning",
    "endgame-calculation"
  ]
}