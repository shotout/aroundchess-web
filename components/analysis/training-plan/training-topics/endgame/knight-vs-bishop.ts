import { Difficulty, Resource, EndgameTopic as BaseEndgameTopic } from '../../types'

export const knightvsbishop: BaseEndgameTopic = {
  id: "knight-vs-bishop",
  title: "Knight Vs Bishop",
  description: "Master the essential concepts and techniques for knight vs bishop",
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
      title: "Knight Vs Bishop Fundamentals",
      description: "Learn the essential concepts of knight vs bishop",
      platform: "chess.com",
      url: "https://www.chess.com/lessons/knight-vs-bishop"
    },
    {
      title: "Advanced Knight Vs Bishop",
      description: "Master complex knight vs bishop positions",
      platform: "lichess.org",
      url: "https://lichess.org/study/knight-vs-bishop"
    }
  ],
  relatedTopics: [
    "endgame-principles",
    "practical-endgame",
    "technical-winning",
    "endgame-calculation"
  ]
}