import { OpeningTopic } from '../types'

export const grunfeldDefense: OpeningTopic = {
  id: 'grunfeld-defense',
  title: 'Grünfeld Defense',
  description: 'A hypermodern opening where Black combines fianchetto with central pawn tension. Known for its dynamic counterplay and concrete nature.',
  difficulty: 'Advanced',
  estimatedTime: '35 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'tactical-combinations',
    'dynamic-play'
  ],
  objectives: [
    'Master Grünfeld Defense principles',
    'Learn key tactical patterns',
    'Understand strategic themes',
    'Handle various White setups',
    'Develop calculation skills'
  ],
  resources: [
    {
      title: 'Grünfeld Defense Guide - Chess.com',
      url: 'https://www.chess.com/lessons/grunfeld',
      platform: 'chess.com',
      description: 'Complete guide to the Grünfeld Defense'
    },
    {
      title: 'Grünfeld Study - Lichess',
      url: 'https://lichess.org/study/grunfeld',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Advanced Grünfeld Strategy',
      url: 'https://lichess.org/study/advanced-grunfeld',
      platform: 'lichess.org',
      description: 'Complex variations and strategic themes'
    }
  ],
  variations: [
    {
      name: 'Exchange Variation',
      moves: '1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5',
      description: 'The main line leading to sharp tactical play.',
      keyIdeas: [
        'Central tension',
        'Piece activity',
        'Dynamic equality',
        'Quick development'
      ]
    },
    {
      name: 'Russian System',
      moves: '1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.Nf3 Bg7 5.Qb3',
      description: 'White aims for early queenside pressure.',
      keyIdeas: [
        'Queen pressure',
        'Pawn structure battles',
        'Tactical opportunities',
        'Strategic complexity'
      ]
    },
    {
      name: 'Hungarian Variation',
      moves: '1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.Nf3 Bg7 5.e4',
      description: 'White establishes a strong pawn center.',
      keyIdeas: [
        'Central control',
        'Dynamic counterplay',
        'Piece activity',
        'Sharp tactical play'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 4,
  recommendedFor: ['Advanced', 'Expert'],
  relatedTopics: [
    'kings-indian-defense',
    'dynamic-play',
    'tactical-awareness',
    'piece-coordination'
  ],
  eco: 'D70-D99'
} 