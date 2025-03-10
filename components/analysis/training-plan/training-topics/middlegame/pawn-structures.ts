import { MiddlegameTopic } from '../types'

export const pawnStructures: MiddlegameTopic = {
  id: 'pawn-structures',
  title: 'Pawn Structures',
  description: 'Master the art of pawn play and understand how different pawn structures influence your middlegame strategy. Learn to identify and exploit pawn weaknesses while creating favorable pawn formations.',
  difficulty: 'Intermediate',
  estimatedTime: '25 hours',
  prerequisites: [
    'basic-pawn-play',
    'piece-coordination',
    'basic-strategy'
  ],
  objectives: [
    'Understand common pawn formations and their characteristics',
    'Learn how to handle different pawn chains',
    'Master pawn breaks and transformations',
    'Identify and create pawn weaknesses',
    'Coordinate pieces around pawn structures'
  ],
  resources: [
    {
      title: 'Pawn Structure 101 - Chess.com',
      url: 'https://www.chess.com/lessons/pawn-structures',
      platform: 'chess.com',
      description: 'Comprehensive course on pawn structures'
    },
    {
      title: 'Pawn Play Mastery - Lichess',
      url: 'https://lichess.org/study/pawn-structures',
      platform: 'lichess.org',
      description: 'Interactive lessons on pawn play'
    },
    {
      title: 'Isolated Queen Pawn Positions',
      url: 'https://lichess.org/study/isolated-queen-pawn',
      platform: 'lichess.org',
      description: 'Deep dive into IQP positions'
    }
  ],
  patterns: [
    'Isolated Queen Pawn (IQP)',
    'Hanging Pawns',
    'Backward Pawns',
    'Doubled Pawns',
    'Pawn Chains',
    'Pawn Islands',
    'Passed Pawns'
  ],
  commonThemes: [
    'Central Pawn Majority',
    'Queenside Pawn Majority',
    'Fixed Center',
    'Dynamic Center',
    'Pawn Breaks',
    'Blockades'
  ],
  tacticalMotifs: [
    'Pawn breaks to open lines',
    'Sacrifices to expose king',
    'Creating passed pawns',
    'Undermining pawn chains',
    'Breakthrough combinations'
  ],
  strategicConcepts: [
    'Minority Attack',
    'Pawn Storm',
    'Space Advantage',
    'Good vs Bad Bishop',
    'Outpost Creation',
    'Prophylaxis against breaks',
    'Transformation of advantages'
  ],
  relatedTopics: [
    'piece-placement',
    'central-control',
    'pawn-weaknesses',
    'endgame-structures'
  ]
} 