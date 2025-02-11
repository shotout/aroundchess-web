import { Difficulty, Resource, EndgameTopic as BaseEndgameTopic } from '../types'

export const theoreticalpositions: BaseEndgameTopic = {
  id: "theoretical-positions",
  title: "Theoretical Positions",
  description: "Master the essential concepts and techniques for theoretical positions",
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
      title: "Theoretical Positions Fundamentals",
      description: "Learn the essential concepts of theoretical positions",
      platform: "chess.com",
      url: "https://www.chess.com/lessons/theoretical-positions"
    },
    {
      title: "Advanced Theoretical Positions",
      description: "Master complex theoretical positions positions",
      platform: "lichess.org",
      url: "https://lichess.org/study/theoretical-positions"
    }
  ],
  relatedTopics: [
    "endgame-principles",
    "practical-endgame",
    "technical-winning",
    "endgame-calculation"
  ]
}