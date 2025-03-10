import { OpeningTopic } from '../types'

export const nimzoIndian: OpeningTopic = {
  id: 'nimzo-indian',
  title: 'Nimzo-Indian Defense',
  description: 'A sophisticated hypermodern opening where Black pins White\'s knight to control the center indirectly. The Nimzo-Indian leads to complex positional and strategic battles.',
  difficulty: 'Advanced',
  estimatedTime: '35 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'positional-play',
    'strategic-planning'
  ],
  objectives: [
    'Master Nimzo-Indian pawn structures',
    'Understand IQP positions',
    'Learn bishop pair dynamics',
    'Handle doubled pawns',
    'Create long-term plans'
  ],
  resources: [
    {
      title: 'Nimzo-Indian Guide - Chess.com',
      url: 'https://www.chess.com/lessons/nimzo-indian',
      platform: 'chess.com',
      description: 'Comprehensive guide to Nimzo-Indian structures and plans'
    },
    {
      title: 'Nimzo-Indian Study - Lichess',
      url: 'https://lichess.org/study/nimzo-indian',
      platform: 'lichess.org',
      description: 'Interactive lessons on key variations'
    },
    {
      title: 'Strategic Themes in Nimzo-Indian',
      url: 'https://lichess.org/study/nimzo-strategy',
      platform: 'lichess.org',
      description: 'Deep dive into strategic themes and plans'
    }
  ],
  variations: [
    {
      name: 'Classical Variation',
      moves: '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3',
      description: 'A solid approach where White accepts doubled pawns for the bishop pair.',
      keyIdeas: [
        'Bishop pair compensation',
        'Pawn structure flexibility',
        'Central control',
        'Long-term planning'
      ]
    },
    {
      name: 'Rubinstein Variation',
      moves: '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Bd3',
      description: 'White focuses on rapid development and kingside attacking chances.',
      keyIdeas: [
        'Quick development',
        'Kingside attack',
        'Pawn breaks',
        'Dynamic play'
      ]
    },
    {
      name: 'Sämisch Variation',
      moves: '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.a3',
      description: 'An aggressive try where White immediately challenges the bishop.',
      keyIdeas: [
        'Early bishop challenge',
        'Kingside expansion',
        'Pawn storm possibilities',
        'Sharp tactical play'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 5,
  recommendedFor: ['Advanced', 'Expert'],
  relatedTopics: [
    'queens-indian',
    'pawn-structures',
    'positional-play',
    'strategic-planning'
  ],
  eco: 'E20-E59'
} 