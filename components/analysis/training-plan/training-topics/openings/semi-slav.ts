import { OpeningTopic } from '../types'

export const semiSlav: OpeningTopic = {
  id: 'semi-slav',
  title: 'Semi-Slav Defense',
  description: 'A sophisticated defense combining ideas from the Slav and Queen\'s Gambit Declined. The Semi-Slav is known for its complex positions and rich strategic and tactical possibilities.',
  difficulty: 'Expert',
  estimatedTime: '40 hours',
  prerequisites: [
    'queens-gambit',
    'positional-play',
    'tactical-patterns',
    'pawn-structures'
  ],
  objectives: [
    'Master Semi-Slav structures',
    'Learn key tactical patterns',
    'Handle various transpositions',
    'Understand strategic plans',
    'Navigate complex positions'
  ],
  resources: [
    {
      title: 'Semi-Slav Guide - Chess.com',
      url: 'https://www.chess.com/lessons/semi-slav',
      platform: 'chess.com',
      description: 'Comprehensive guide to Semi-Slav structures and plans'
    },
    {
      title: 'Semi-Slav Study - Lichess',
      url: 'https://lichess.org/study/semi-slav',
      platform: 'lichess.org',
      description: 'Interactive lessons on key variations'
    },
    {
      title: 'Advanced Semi-Slav Strategy',
      url: 'https://lichess.org/study/semi-slav-strategy',
      platform: 'lichess.org',
      description: 'Deep dive into strategic themes and plans'
    }
  ],
  variations: [
    {
      name: 'Meran Variation',
      moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.e3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5',
      description: 'A dynamic approach where Black gains space on the queenside.',
      keyIdeas: [
        'Queenside expansion',
        'Dynamic play',
        'Piece activity',
        'Counter-attacking chances'
      ]
    },
    {
      name: 'Moscow Variation',
      moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.Bg5',
      description: 'White develops actively and creates immediate pressure.',
      keyIdeas: [
        'Early development',
        'Pin tactics',
        'Central control',
        'Strategic complexity'
      ]
    },
    {
      name: 'Anti-Moscow Variation',
      moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.Bg5 h6',
      description: 'Black challenges White\'s bishop early, leading to unique structures.',
      keyIdeas: [
        'Pawn structure changes',
        'Bishop placement',
        'King safety',
        'Long-term plans'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 5,
  recommendedFor: ['Expert'],
  relatedTopics: [
    'slav-defense',
    'queens-gambit-declined',
    'pawn-structures',
    'positional-play'
  ],
  eco: 'D43-D49'
} 