import { MiddlegameTopic } from '../types'

export const patternRecognition: MiddlegameTopic = {
  id: 'pattern-recognition',
  title: 'Basic Pattern Recognition',
  description: 'Learn to recognize common chess patterns and motifs that appear frequently in games. Essential for improving tactical awareness and strategic understanding.',
  difficulty: 'Beginner',
  estimatedTime: '15 hours',
  prerequisites: ['piece-movement', 'material-counting'],
  objectives: [
    'Recognize basic tactical patterns',
    'Identify common piece configurations',
    'Spot potential threats and opportunities',
    'Understand basic mating patterns',
    'Learn common pawn structures'
  ],
  resources: [
    {
      title: 'Chess Pattern Recognition Course',
      url: 'https://www.chess.com/lessons/patterns',
      platform: 'chess.com',
      description: 'Interactive lessons on common chess patterns'
    },
    {
      title: 'Basic Tactics Training',
      url: 'https://lichess.org/practice/basic-tactics',
      platform: 'lichess.org',
      description: 'Practice recognizing basic tactical patterns'
    },
    {
      title: 'Common Chess Patterns',
      url: 'https://www.chessable.com/basic-patterns',
      platform: 'custom',
      description: 'Study guide for essential chess patterns'
    }
  ],
  patterns: [
    'Fork opportunities',
    'Pin setups',
    'Back rank weakness',
    'Discovered attack potential',
    'Common pawn breaks',
    'Basic mating patterns'
  ],
  commonThemes: [
    'Tactical awareness',
    'Pattern recognition',
    'Piece coordination',
    'Threat detection',
    'Basic combinations',
    'Safety assessment'
  ],
  tacticalMotifs: [
    'Basic forks',
    'Simple pins',
    'Double attacks',
    'Discovered attacks',
    'Back rank mates',
    'Smothered mates'
  ],
  strategicConcepts: [
    'Piece placement',
    'King safety',
    'Center control',
    'Development patterns',
    'Common structures',
    'Basic endgame patterns'
  ],
  relatedTopics: [
    'basic-tactics',
    'basic-checkmates',
    'piece-coordination',
    'material-counting'
  ]
} 