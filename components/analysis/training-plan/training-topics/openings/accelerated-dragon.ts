import { OpeningTopic } from '../types'

export const acceleratedDragon: OpeningTopic = {
  id: 'accelerated-dragon',
  title: 'Accelerated Dragon',
  description: 'The Accelerated Dragon is a dynamic variation of the Sicilian Defense where Black fianchettoes the king\'s bishop early. It offers complex counterplay and unique strategic battles.',
  difficulty: 'Advanced',
  estimatedTime: '35 hours',
  prerequisites: [
    'sicilian-defense',
    'pawn-structures',
    'piece-coordination',
    'tactical-patterns'
  ],
  objectives: [
    'Master Dragon pawn structures',
    'Learn key tactical patterns',
    'Understand strategic plans',
    'Handle different White setups',
    'Navigate complex middlegames'
  ],
  resources: [
    {
      title: 'Accelerated Dragon Guide - Chess.com',
      url: 'https://www.chess.com/lessons/accelerated-dragon',
      platform: 'chess.com',
      description: 'Complete guide to the Accelerated Dragon'
    },
    {
      title: 'Dragon Study - Lichess',
      url: 'https://lichess.org/study/accelerated-dragon',
      platform: 'lichess.org',
      description: 'Interactive lessons and tactical patterns'
    },
    {
      title: 'Advanced Dragon Strategy',
      url: 'https://lichess.org/study/advanced-dragon',
      platform: 'lichess.org',
      description: 'Complex variations and strategies'
    }
  ],
  variations: [
    {
      name: 'Maroczy Bind',
      moves: '1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.c4',
      description: 'White\'s most principled response, establishing a strong pawn center.',
      keyIdeas: [
        'Space advantage',
        'Central control',
        'Piece activity',
        'Strategic battle'
      ]
    },
    {
      name: 'Yugoslav Attack',
      moves: '1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be3',
      description: 'A sharp attacking setup leading to complex tactical play.',
      keyIdeas: [
        'Opposite-side castling',
        'King hunt',
        'Piece sacrifice',
        'Time-sensitive play'
      ]
    },
    {
      name: 'Classical Variation',
      moves: '1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be2',
      description: 'A more positional approach focusing on strategic play.',
      keyIdeas: [
        'Positional battle',
        'Piece coordination',
        'Pawn structure',
        'Long-term planning'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 4,
  recommendedFor: ['Advanced', 'Expert'],
  relatedTopics: [
    'sicilian-defense',
    'dragon-variation',
    'pawn-structures',
    'attacking-patterns'
  ],
  eco: 'B34-B39'
} 