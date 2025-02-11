import { Difficulty, Resource, EndgameTopic as BaseEndgameTopic } from '../../types'

export const queenvspawn: BaseEndgameTopic = {
  id: "queen-vs-pawn",
  title: "Queen Vs Pawn",
  description: "Master the essential concepts and techniques for queen vs pawn",
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
      title: "Queen Vs Pawn Fundamentals",
      description: "Learn the essential concepts of queen vs pawn",
      platform: "chess.com",
      url: "https://www.chess.com/lessons/queen-vs-pawn"
    },
    {
      title: "Advanced Queen Vs Pawn",
      description: "Master complex queen vs pawn positions",
      platform: "lichess.org",
      url: "https://lichess.org/study/queen-vs-pawn"
    }
  ],
  relatedTopics: [
    "endgame-principles",
    "practical-endgame",
    "technical-winning",
    "endgame-calculation"
  ]
}