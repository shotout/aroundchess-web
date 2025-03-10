import { OpeningTopic } from '../types'

export const najdorfSicilian: OpeningTopic = {
  id: 'najdorf-sicilian',
  title: 'Najdorf Sicilian',
  description: 'The Najdorf Sicilian is one of the sharpest and most complex opening variations in chess. This ultra-sharp system requires deep theoretical knowledge and excellent tactical awareness.',
  difficulty: 'Expert',
  estimatedTime: '50 hours',
  prerequisites: [
    'sicilian-defense',
    'attacking-principles',
    'tactical-patterns',
    'positional-understanding'
  ],
  objectives: [
    'Master the key theoretical variations',
    'Understand typical middlegame positions',
    'Learn complex tactical patterns',
    'Handle White\'s main attacking setups',
    'Develop strategic understanding of resulting positions'
  ],
  resources: [
    {
      title: 'Najdorf Mastery Course - Chess.com',
      url: 'https://www.chess.com/lessons/najdorf-sicilian',
      platform: 'chess.com',
      description: 'Comprehensive guide to the Najdorf Sicilian'
    },
    {
      title: 'Najdorf Theory - Lichess',
      url: 'https://lichess.org/study/najdorf',
      platform: 'lichess.org',
      description: 'Deep theoretical coverage of main lines'
    },
    {
      title: 'Tactical Patterns in the Najdorf',
      url: 'https://lichess.org/study/najdorf-tactics',
      platform: 'lichess.org',
      description: 'Common tactical themes and patterns'
    }
  ],
  variations: [
    {
      name: 'English Attack',
      moves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5 7.Nb3 Be6 8.f3 Be7 9.Qd2 0-0 10.0-0-0',
      description: 'One of the most dangerous attacking setups against the Najdorf.',
      keyIdeas: [
        'White builds up a kingside attack with f3, g4, h4',
        'Black counters on the queenside with b5-b4',
        'Critical piece placement and timing',
        'Complex tactical possibilities'
      ]
    },
    {
      name: 'Poisoned Pawn Variation',
      moves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Qb6',
      description: 'One of the sharpest and most theoretical variations in all of chess.',
      keyIdeas: [
        'Black grabs the b2 pawn at great risk',
        'White gets strong attacking chances',
        'Extremely complex tactical play',
        'Deep theoretical knowledge required'
      ]
    },
    {
      name: 'Classical Main Line',
      moves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Be7',
      description: 'The traditional main line leading to complex strategic battles.',
      keyIdeas: [
        'Control of the d5 square',
        'Piece placement optimization',
        'Pawn structure dynamics',
        'Long-term strategic planning'
      ]
    },
    {
      name: 'Adams Attack',
      moves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.h3',
      description: 'A modern interpretation aiming for strategic pressure.',
      keyIdeas: [
        'Prevents ...Bg4 ideas',
        'Prepares g4 advance',
        'Flexible piece deployment',
        'Complex strategic battles'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 5,
  recommendedFor: ['Advanced', 'Expert'],
  relatedTopics: [
    'sicilian-structures',
    'complex-tactics',
    'attacking-chess',
    'defense-technique'
  ],
  eco: 'B90-B99'
} 