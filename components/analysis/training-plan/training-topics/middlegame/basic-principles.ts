import { MiddlegameTopic } from '../types'

export const basicPrinciples: MiddlegameTopic = {
  id: 'basic-principles',
  title: 'Basic Chess Principles',
  description: 'Learn the fundamental principles of chess that will guide your decision-making. Perfect for beginners to build a strong foundation.',
  difficulty: 'Beginner',
  estimatedTime: '15 hours',
  prerequisites: ['piece-movement'],
  objectives: [
    'Understand the importance of piece development',
    'Learn to control the center',
    'Grasp basic pawn structure concepts',
    'Recognize basic tactical patterns',
    'Learn to create simple plans'
  ],
  resources: [
    {
      title: 'Chess Fundamentals - Chess.com',
      url: 'https://www.chess.com/lessons/chess-fundamentals',
      platform: 'chess.com',
      description: 'Essential chess principles for beginners'
    },
    {
      title: 'Basic Principles Study - Lichess',
      url: 'https://lichess.org/study/chess-basics',
      platform: 'lichess.org',
      description: 'Interactive lessons on chess fundamentals'
    },
    {
      title: 'Chess Principles in Action',
      url: 'https://lichess.org/study/basic-chess',
      platform: 'lichess.org',
      description: 'Practice basic principles in real games'
    }
  ],
  patterns: [
    'Piece development order',
    'Center control with pawns',
    'King safety',
    'Basic piece coordination',
    'Simple attacking patterns',
    'Basic defensive setups'
  ],
  commonThemes: [
    'Control of central squares',
    'Piece activity',
    'Basic pawn structure',
    'King safety',
    'Simple plans',
    'Basic piece coordination'
  ],
  tacticalMotifs: [
    'Basic pins',
    'Simple forks',
    'Basic discoveries',
    'Overloaded pieces',
    'Weak back rank'
  ],
  strategicConcepts: [
    'Development before attack',
    'Center control',
    'King safety',
    'Piece activity',
    'Basic pawn structure',
    'Simple plans',
    'Piece coordination basics'
  ],
  relatedTopics: [
    'piece-development',
    'center-control',
    'king-safety',
    'basic-tactics'
  ]
} 