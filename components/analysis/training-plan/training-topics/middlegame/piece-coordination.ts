import { MiddlegameTopic } from '../types'

export const pieceCoordination: MiddlegameTopic = {
  id: 'piece-coordination',
  title: 'Piece Coordination',
  description: 'Master the art of coordinating your pieces effectively. Learn how to create harmony between your pieces and maximize their collective strength.',
  difficulty: 'Intermediate',
  estimatedTime: '30 hours',
  prerequisites: [
    'piece-movement',
    'basic-tactics',
    'pawn-structure-basics'
  ],
  objectives: [
    'Understand piece harmony and coordination',
    'Learn to create and exploit piece synergies',
    'Master piece maneuvering in closed positions',
    'Develop attacking formations',
    'Coordinate pieces in defense'
  ],
  resources: [
    {
      title: 'Piece Coordination - Chess.com',
      url: 'https://www.chess.com/lessons/piece-coordination',
      platform: 'chess.com',
      description: 'Comprehensive course on piece coordination'
    },
    {
      title: 'Piece Play Mastery - Lichess',
      url: 'https://lichess.org/study/piece-coordination',
      platform: 'lichess.org',
      description: 'Interactive lessons on piece coordination'
    },
    {
      title: 'Minor Piece Coordination',
      url: 'https://lichess.org/study/minor-pieces',
      platform: 'lichess.org',
      description: 'Deep dive into bishop and knight coordination'
    }
  ],
  patterns: [
    'Bishop pair coordination',
    'Knight outposts',
    'Rook lifts',
    'Queen and bishop battery',
    'Double rooks on open files',
    'Minor piece tandems',
    'Piece triangulation'
  ],
  commonThemes: [
    'Piece mobility',
    'Control of key squares',
    'Piece exchanges',
    'Space advantage',
    'Piece repositioning',
    'Creating threats'
  ],
  tacticalMotifs: [
    'Discovered attacks',
    'Pin and skewer combinations',
    'Double attacks',
    'Interference tactics',
    'Clearance sacrifices'
  ],
  strategicConcepts: [
    'Prophylaxis',
    'Piece regrouping',
    'Creating and exploiting outposts',
    'Restricting enemy pieces',
    'Improving piece placement',
    'Coordinated attacks',
    'Defensive formations'
  ],
  relatedTopics: [
    'piece-activity',
    'attacking-formations',
    'defensive-techniques',
    'positional-play'
  ]
} 