import { Difficulty, Resource, EndgameTopic as BaseEndgameTopic } from '../../types'

export const rookvsminor: BaseEndgameTopic = {
  id: "rook-vs-minor",
  title: "Rook Vs Minor",
  description: "Master the essential concepts and techniques for rook vs minor",
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
      title: "Rook Vs Minor Fundamentals",
      description: "Learn the essential concepts of rook vs minor",
      platform: "chess.com",
      url: "https://www.chess.com/lessons/rook-vs-minor"
    },
    {
      title: "Advanced Rook Vs Minor",
      description: "Master complex rook vs minor positions",
      platform: "lichess.org",
      url: "https://lichess.org/study/rook-vs-minor"
    }
  ],
  relatedTopics: [
    "endgame-principles",
    "practical-endgame",
    "technical-winning",
    "endgame-calculation"
  ]
}