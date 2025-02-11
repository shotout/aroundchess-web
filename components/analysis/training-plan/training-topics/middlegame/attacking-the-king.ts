import { MiddlegameTopic } from '../types'

export const attackingTheKing: MiddlegameTopic = {
  id: 'attacking-the-king',
  title: 'Attacking the King',
  description: 'Learn how to build and execute successful attacks against the opponent\'s king. Master the art of piece coordination and sacrificial attacks.',
  difficulty: 'Intermediate',
  estimatedTime: '15 hours',
  prerequisites: [
    'piece-coordination',
    'pawn-structure-basics',
    'tactical-patterns'
  ],
  objectives: [
    'Identify attacking opportunities based on pawn structure',
    'Learn common attacking patterns and piece configurations',
    'Master sacrificial attacks and combinations',
    'Calculate complex variations in attacking positions',
    'Understand defensive resources and how to prevent counterplay'
  ],
  resources: [
    {
      title: 'Art of Attack - Chess.com Course',
      url: 'https://www.chess.com/lessons/attacking-chess',
      platform: 'chess.com',
      description: 'Comprehensive course on attacking chess'
    },
    {
      title: 'Attacking Patterns - Lichess Study',
      url: 'https://lichess.org/study/attacking-patterns',
      platform: 'lichess.org',
      description: 'Collection of attacking patterns and exercises'
    },
    {
      title: 'King Hunt Puzzles',
      url: 'https://lichess.org/training/kingHunt',
      platform: 'lichess.org',
      description: 'Tactical puzzles focused on attacking the king'
    }
  ],
  patterns: [
    'Greek Gift sacrifice (Bxh7+/Bxh2+)',
    'Double bishop sacrifice',
    'Queen sacrifice on h7/h2',
    'Piece storm against castled king',
    'Pawn storm against castled king',
    'Back rank combinations',
    'King hunt in the center'
  ],
  commonThemes: [
    'Weak color complex around the king',
    'Exposed king',
    'Lack of defensive pieces',
    'Overloaded defenders',
    'Pawn weaknesses around the king',
    'Open files and diagonals'
  ],
  tacticalMotifs: [
    'Clearance sacrifices',
    'Deflection of defensive pieces',
    'Opening lines for heavy pieces',
    'Removing the king\'s pawn shield',
    'Creating mating nets'
  ],
  strategicConcepts: [
    'Building up the attack gradually',
    'Preventing enemy counterplay',
    'Timing of decisive breakthroughs',
    'Regrouping pieces for the attack',
    'Prophylactic thinking in attacking positions'
  ],
  relatedTopics: [
    'piece-coordination',
    'tactical-patterns',
    'attacking-formations',
    'sacrificial-play'
  ]
} 