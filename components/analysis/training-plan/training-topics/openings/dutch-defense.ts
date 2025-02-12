import { OpeningTopic } from '../types'

export const dutchDefense: OpeningTopic = {
  id: 'dutch-defense',
  title: 'Dutch Defense',
  description: 'An aggressive defense against 1.d4 where Black plays f5, immediately fighting for the e4 square. The Dutch Defense leads to sharp, unbalanced positions with mutual attacking chances.',
  difficulty: 'Advanced',
  estimatedTime: '30 hours',
  prerequisites: [
    'basic-opening-principles',
    'attacking-patterns',
    'pawn-structures',
    'king-safety'
  ],
  objectives: [
    'Master Dutch pawn structures',
    'Learn attacking patterns',
    'Handle White\'s responses',
    'Understand piece placement',
    'Create attacking plans'
  ],
  resources: [
    {
      title: 'Dutch Defense Guide - Chess.com',
      url: 'https://www.chess.com/lessons/dutch-defense',
      platform: 'chess.com',
      description: 'Comprehensive guide to Dutch Defense structures and plans'
    },
    {
      title: 'Dutch Defense Study - Lichess',
      url: 'https://lichess.org/study/dutch-defense',
      platform: 'lichess.org',
      description: 'Interactive lessons on key variations'
    },
    {
      title: 'Attacking with the Dutch',
      url: 'https://lichess.org/study/dutch-attack',
      platform: 'lichess.org',
      description: 'Deep dive into attacking themes and plans'
    }
  ],
  variations: [
    {
      name: 'Leningrad Variation',
      moves: '1.d4 f5 2.g3 Nf6 3.Bg2 g6',
      description: 'Black fianchettoes the king\'s bishop for a dynamic kingside attack.',
      keyIdeas: [
        'Kingside fianchetto',
        'Attacking chances',
        'Dynamic play',
        'Piece activity'
      ]
    },
    {
      name: 'Stonewall Variation',
      moves: '1.d4 f5 2.g3 Nf6 3.Bg2 e6 4.c4 d5',
      description: 'Black builds a solid pawn wall in the center, aiming for a kingside attack.',
      keyIdeas: [
        'Solid pawn structure',
        'Kingside attack',
        'Bishop placement',
        'Piece coordination'
      ]
    },
    {
      name: 'Classical Variation',
      moves: '1.d4 f5 2.g3 Nf6 3.Bg2 e6 4.c4 Be7',
      description: 'A flexible setup allowing for various pawn structures and plans.',
      keyIdeas: [
        'Flexible development',
        'Multiple plans',
        'Central control',
        'Strategic play'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 3,
  recommendedFor: ['Advanced'],
  relatedTopics: [
    'kings-indian',
    'attacking-chess',
    'pawn-structures',
    'piece-coordination'
  ],
  eco: 'A80-A99'
} 