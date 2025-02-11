import { MiddlegameTopic } from '../types'

export const basicTactics: MiddlegameTopic = {
  id: 'basic-tactics',
  title: 'Basic Tactics',
  description: 'Learn the fundamental tactical patterns that form the building blocks of chess combinations. Essential for beginners to develop their tactical awareness.',
  difficulty: 'Beginner',
  estimatedTime: '20 hours',
  prerequisites: ['piece-movement', 'basic-principles'],
  objectives: [
    'Understand basic tactical patterns',
    'Learn to spot tactical opportunities',
    'Master simple combinations',
    'Develop calculation skills',
    'Build pattern recognition'
  ],
  resources: [
    {
      title: 'Basic Tactics Course - Chess.com',
      url: 'https://www.chess.com/lessons/basic-tactics',
      platform: 'chess.com',
      description: 'Comprehensive course on fundamental tactics'
    },
    {
      title: 'Tactics Trainer - Lichess',
      url: 'https://lichess.org/training/basics',
      platform: 'lichess.org',
      description: 'Interactive tactical puzzles for beginners'
    },
    {
      title: 'Common Tactical Patterns',
      url: 'https://lichess.org/study/basic-tactics',
      platform: 'lichess.org',
      description: 'Study of essential tactical motifs'
    }
  ],
  patterns: [
    'Basic pins',
    'Simple forks',
    'Double attacks',
    'Discovered attacks',
    'Basic skewers',
    'Removing the defender',
    'Back rank weakness'
  ],
  commonThemes: [
    'Undefended pieces',
    'Weak back rank',
    'Overloaded pieces',
    'Loose pieces',
    'King safety',
    'Piece coordination'
  ],
  tacticalMotifs: [
    'Pin and win',
    'Knight forks',
    'Queen forks',
    'Discovered check',
    'Back rank mate',
    'Deflection tactics',
    'Decoy combinations'
  ],
  strategicConcepts: [
    'Tactical awareness',
    'Pattern recognition',
    'Calculation process',
    'Candidate moves',
    'Forcing moves',
    'Piece activity',
    'King safety evaluation'
  ],
  relatedTopics: [
    'basic-principles',
    'piece-coordination',
    'attacking-patterns',
    'defensive-tactics'
  ]
} 