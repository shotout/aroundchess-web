import { Difficulty, Resource, EndgameTopic as BaseEndgameTopic } from '../types'

export const zugzwangpositions: BaseEndgameTopic = {
  id: "zugzwang-positions",
  title: "Zugzwang Positions",
  description: "Master the essential concepts and techniques for zugzwang positions",
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
      title: "Zugzwang Positions Fundamentals",
      description: "Learn the essential concepts of zugzwang positions",
      platform: "chess.com",
      url: "https://www.chess.com/lessons/zugzwang-positions"
    },
    {
      title: "Advanced Zugzwang Positions",
      description: "Master complex zugzwang positions positions",
      platform: "lichess.org",
      url: "https://lichess.org/study/zugzwang-positions"
    }
  ],
  relatedTopics: [
    "endgame-principles",
    "practical-endgame",
    "technical-winning",
    "endgame-calculation"
  ]
}