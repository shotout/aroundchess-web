import { OpeningTopic } from '../types'

export const retiOpening: OpeningTopic = {
  id: 'reti-opening',
  title: 'Réti Opening',
  description: 'A flexible hypermodern opening that begins with 1.Nf3, often followed by c4. White aims to control the center with pieces rather than pawns.',
  difficulty: 'Advanced',
  estimatedTime: '30 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'positional-play',
    'strategic-planning'
  ],
  objectives: [
    'Master Réti Opening principles',
    'Learn flexible move orders',
    'Understand strategic themes',
    'Handle various Black setups',
    'Develop positional understanding'
  ],
  resources: [
    {
      title: 'Réti Opening Guide - Chess.com',
      url: 'https://www.chess.com/lessons/reti-opening',
      platform: 'chess.com',
      description: 'Complete guide to the Réti Opening'
    },
    {
      title: 'Réti Study - Lichess',
      url: 'https://lichess.org/study/reti-opening',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Advanced Réti Strategy',
      url: 'https://lichess.org/study/advanced-reti',
      platform: 'lichess.org',
      description: 'Complex positions and strategic themes'
    }
  ],
  variations: [
    {
      name: 'King\'s Indian Attack',
      moves: '1.Nf3 d5 2.g3',
      description: 'White develops with a kingside fianchetto.',
      keyIdeas: [
        'Flexible development',
        'Kingside fianchetto',
        'Central control',
        'Strategic play'
      ]
    },
    {
      name: 'Réti Gambit',
      moves: '1.Nf3 d5 2.c4',
      description: 'White immediately challenges Black\'s center.',
      keyIdeas: [
        'Pawn tension',
        'Piece activity',
        'Flexible structure',
        'Dynamic play'
      ]
    },
    {
      name: 'Closed Réti',
      moves: '1.Nf3 d5 2.c4 e6 3.g3 Nf6 4.Bg2',
      description: 'A positional approach with long-term strategic plans.',
      keyIdeas: [
        'Double fianchetto',
        'Positional play',
        'Pawn breaks',
        'Strategic complexity'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 3,
  recommendedFor: ['Advanced', 'Expert'],
  relatedTopics: [
    'english-opening',
    'kings-indian-attack',
    'hypermodern-principles',
    'positional-play'
  ],
  eco: 'A04-A09'
} 