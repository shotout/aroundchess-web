import { OpeningTopic } from '../types'

export const budapestGambit: OpeningTopic = {
  id: 'budapest-gambit',
  title: 'Budapest Gambit',
  description: 'The Budapest Gambit is a sharp opening where Black sacrifices a pawn for quick development and active piece play. It offers practical chances and can be an effective surprise weapon.',
  difficulty: 'Intermediate',
  estimatedTime: '20 hours',
  prerequisites: [
    'basic-tactics',
    'piece-coordination',
    'attacking-patterns'
  ],
  objectives: [
    'Master typical tactics',
    'Learn attacking patterns',
    'Understand compensation principles',
    'Handle different White setups',
    'Create active piece play'
  ],
  resources: [
    {
      title: 'Budapest Gambit Guide - Chess.com',
      url: 'https://www.chess.com/lessons/budapest-gambit',
      platform: 'chess.com',
      description: 'Complete guide to the Budapest Gambit'
    },
    {
      title: 'Budapest Study - Lichess',
      url: 'https://lichess.org/study/budapest',
      platform: 'lichess.org',
      description: 'Interactive lessons and tactical patterns'
    },
    {
      title: 'Attacking with the Budapest',
      url: 'https://lichess.org/study/budapest-attack',
      platform: 'lichess.org',
      description: 'Attacking patterns and strategies'
    }
  ],
  variations: [
    {
      name: 'Main Line',
      moves: '1.d4 Nf6 2.c4 e5 3.dxe5 Ng4',
      description: 'The classical approach where Black immediately fights for the center.',
      keyIdeas: [
        'Quick development',
        'Active piece play',
        'Central control',
        'Attacking chances'
      ]
    },
    {
      name: 'Fajarowicz Variation',
      moves: '1.d4 Nf6 2.c4 e5 3.dxe5 Ne4',
      description: 'A sharp alternative focusing on the e4-square.',
      keyIdeas: [
        'Control of e4',
        'Piece activity',
        'Tactical opportunities',
        'Unusual positions'
      ]
    },
    {
      name: 'Adler Variation',
      moves: '1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Nf3',
      description: 'A solid approach by White aiming to maintain the pawn.',
      keyIdeas: [
        'Pawn structure battles',
        'Piece coordination',
        'Dynamic equality',
        'Strategic play'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 2,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'gambit-play',
    'attacking-chess',
    'tactical-patterns',
    'piece-activity'
  ],
  eco: 'A51-A52'
} 