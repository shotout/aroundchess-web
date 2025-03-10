import { OpeningTopic } from '../types'

export const chigorin: OpeningTopic = {
  id: 'chigorin',
  title: 'Chigorin Defense',
  description: 'The Chigorin Defense is an unconventional response to the Queen\'s Gambit where Black develops the knights before the pawns. It leads to unique positions where piece activity compensates for structural weaknesses.',
  difficulty: 'Intermediate',
  estimatedTime: '25 hours',
  prerequisites: [
    'queens-gambit',
    'piece-coordination',
    'tactical-patterns'
  ],
  objectives: [
    'Master Chigorin pawn structures',
    'Learn tactical opportunities',
    'Understand piece activity',
    'Handle structural weaknesses',
    'Create dynamic counterplay'
  ],
  resources: [
    {
      title: 'Chigorin Defense Guide - Chess.com',
      url: 'https://www.chess.com/lessons/chigorin',
      platform: 'chess.com',
      description: 'Complete guide to the Chigorin Defense'
    },
    {
      title: 'Chigorin Study - Lichess',
      url: 'https://lichess.org/study/chigorin',
      platform: 'lichess.org',
      description: 'Interactive lessons and tactical patterns'
    },
    {
      title: 'Dynamic Chess Play',
      url: 'https://lichess.org/study/dynamic-chigorin',
      platform: 'lichess.org',
      description: 'Complex positions and strategies'
    }
  ],
  variations: [
    {
      name: 'Main Line',
      moves: '1.d4 d5 2.c4 Nc6',
      description: 'The classical approach challenging White\'s center immediately.',
      keyIdeas: [
        'Early piece activity',
        'Central control',
        'Dynamic play',
        'Tactical opportunities'
      ]
    },
    {
      name: 'Modern Variation',
      moves: '1.d4 d5 2.c4 Nc6 3.Nf3 Bg4',
      description: 'A sharp line adding pressure on White\'s kingside.',
      keyIdeas: [
        'Pin tactics',
        'Piece coordination',
        'Active development',
        'Attacking chances'
      ]
    },
    {
      name: 'Exchange Variation',
      moves: '1.d4 d5 2.c4 Nc6 3.cxd5 Qxd5',
      description: 'A direct approach where Black recaptures with the queen.',
      keyIdeas: [
        'Queen activity',
        'Quick development',
        'Tactical play',
        'Dynamic equality'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 2,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'queens-gambit',
    'piece-activity',
    'tactical-patterns',
    'dynamic-play'
  ],
  eco: 'D07'
} 