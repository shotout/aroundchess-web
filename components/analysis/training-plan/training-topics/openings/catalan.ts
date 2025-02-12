import { OpeningTopic } from '../types'

export const catalan: OpeningTopic = {
  id: 'catalan',
  title: 'Catalan Opening',
  description: 'A sophisticated opening system where White combines d4 with a kingside fianchetto, aiming for long-term positional pressure. The Catalan is known for its strategic depth and flexible pawn structures.',
  difficulty: 'Advanced',
  estimatedTime: '30 hours',
  prerequisites: [
    'basic-opening-principles',
    'positional-play',
    'pawn-structures',
    'strategic-planning'
  ],
  objectives: [
    'Master Catalan pawn structures',
    'Understand bishop fianchetto',
    'Learn queenside expansion',
    'Handle various Black setups',
    'Create long-term plans'
  ],
  resources: [
    {
      title: 'Catalan Opening Guide - Chess.com',
      url: 'https://www.chess.com/lessons/catalan',
      platform: 'chess.com',
      description: 'Comprehensive guide to Catalan structures and plans'
    },
    {
      title: 'Catalan Study - Lichess',
      url: 'https://lichess.org/study/catalan',
      platform: 'lichess.org',
      description: 'Interactive lessons on key variations'
    },
    {
      title: 'Strategic Themes in Catalan',
      url: 'https://lichess.org/study/catalan-strategy',
      platform: 'lichess.org',
      description: 'Deep dive into positional themes and plans'
    }
  ],
  variations: [
    {
      name: 'Closed Catalan',
      moves: '1.d4 d5 2.c4 e6 3.g3 Nf6 4.Bg2 Be7 5.Nf3',
      description: 'The main line where Black maintains central tension with a solid setup.',
      keyIdeas: [
        'Fianchetto pressure',
        'Central control',
        'Queenside expansion',
        'Strategic maneuvering'
      ]
    },
    {
      name: 'Open Catalan',
      moves: '1.d4 d5 2.c4 e6 3.g3 Nf6 4.Bg2 dxc4',
      description: 'Black releases central tension early, leading to more concrete play.',
      keyIdeas: [
        'Pawn sacrifice',
        'Bishop activity',
        'Space advantage',
        'Dynamic possibilities'
      ]
    },
    {
      name: 'Semi-Catalan',
      moves: '1.d4 Nf6 2.c4 e6 3.g3',
      description: 'A flexible approach where Black hasn\'t committed to ...d5.',
      keyIdeas: [
        'Flexible development',
        'Multiple pawn structures',
        'Prophylactic play',
        'Strategic options'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 4,
  recommendedFor: ['Advanced', 'Expert'],
  relatedTopics: [
    'reti-opening',
    'queens-gambit',
    'positional-play',
    'strategic-planning'
  ],
  eco: 'E01-E09'
} 