import { OpeningTopic } from '../types'

export const modernBenoni: OpeningTopic = {
  id: 'modern-benoni',
  title: 'Modern Benoni',
  description: 'A sharp and dynamic defense against 1.d4 where Black immediately creates imbalances and seeks active piece play. The Modern Benoni is known for its complex tactical and strategic battles.',
  difficulty: 'Expert',
  estimatedTime: '45 hours',
  prerequisites: [
    'basic-opening-principles',
    'tactical-patterns',
    'positional-play',
    'piece-activity'
  ],
  objectives: [
    'Master Benoni structures',
    'Learn attacking patterns',
    'Handle White\'s setups',
    'Understand piece play',
    'Create dynamic plans'
  ],
  resources: [
    {
      title: 'Modern Benoni Guide - Chess.com',
      url: 'https://www.chess.com/lessons/modern-benoni',
      platform: 'chess.com',
      description: 'Comprehensive guide to Modern Benoni structures and plans'
    },
    {
      title: 'Modern Benoni Study - Lichess',
      url: 'https://lichess.org/study/modern-benoni',
      platform: 'lichess.org',
      description: 'Interactive lessons on key variations'
    },
    {
      title: 'Dynamic Play in Benoni',
      url: 'https://lichess.org/study/benoni-dynamics',
      platform: 'lichess.org',
      description: 'Deep dive into tactical themes and plans'
    }
  ],
  variations: [
    {
      name: 'Modern Main Line',
      moves: '1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 d6 6.e4 g6',
      description: 'The most critical line leading to sharp tactical play.',
      keyIdeas: [
        'Piece activity',
        'Queenside play',
        'Pawn breaks',
        'Dynamic counterplay'
      ]
    },
    {
      name: 'Fianchetto Variation',
      moves: '1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 d6 6.Nf3 g6 7.g3',
      description: 'White adopts a more positional approach with the kingside fianchetto.',
      keyIdeas: [
        'Strategic battle',
        'Long-term pressure',
        'Piece placement',
        'Pawn structure play'
      ]
    },
    {
      name: 'Four Pawns Attack',
      moves: '1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 d6 6.e4 g6 7.f4',
      description: 'An aggressive variation where White gains maximum space advantage.',
      keyIdeas: [
        'Space advantage',
        'Attacking chances',
        'Tactical play',
        'King safety'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 3,
  recommendedFor: ['Expert'],
  relatedTopics: [
    'kings-indian',
    'dynamic-play',
    'piece-activity',
    'pawn-structures'
  ],
  eco: 'A60-A79'
} 