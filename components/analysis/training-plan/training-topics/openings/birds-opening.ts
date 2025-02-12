import { OpeningTopic } from '../types'

export const birdsOpening: OpeningTopic = {
  id: 'birds-opening',
  title: 'Bird\'s Opening',
  description: 'Bird\'s Opening is an aggressive flank opening starting with 1.f4. It leads to unique positions where White aims for early kingside pressure and unusual pawn structures.',
  difficulty: 'Intermediate',
  estimatedTime: '20 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'attacking-patterns'
  ],
  objectives: [
    'Master Bird\'s Opening structures',
    'Learn attacking patterns',
    'Understand piece placement',
    'Handle different Black setups',
    'Create kingside pressure'
  ],
  resources: [
    {
      title: 'Bird\'s Opening Guide - Chess.com',
      url: 'https://www.chess.com/lessons/birds-opening',
      platform: 'chess.com',
      description: 'Complete guide to Bird\'s Opening'
    },
    {
      title: 'Bird\'s Opening Study - Lichess',
      url: 'https://lichess.org/study/birds-opening',
      platform: 'lichess.org',
      description: 'Interactive lessons and tactical patterns'
    },
    {
      title: 'Advanced Bird\'s Strategy',
      url: 'https://lichess.org/study/advanced-bird',
      platform: 'lichess.org',
      description: 'Complex positions and strategies'
    }
  ],
  variations: [
    {
      name: 'From\'s Gambit',
      moves: '1.f4 e5',
      description: 'The sharpest response where Black immediately challenges White\'s center.',
      keyIdeas: [
        'Tactical play',
        'Open lines',
        'King safety',
        'Piece activity'
      ]
    },
    {
      name: 'Dutch Defense Reversed',
      moves: '1.f4 d5',
      description: 'A solid setup leading to Dutch Defense positions with colors reversed.',
      keyIdeas: [
        'Kingside pressure',
        'Pawn chains',
        'Strategic play',
        'Piece coordination'
      ]
    },
    {
      name: 'Williams Gambit',
      moves: '1.f4 d5 2.e4',
      description: 'An aggressive variation where White immediately fights for the center.',
      keyIdeas: [
        'Central control',
        'Active pieces',
        'Attack preparation',
        'Dynamic play'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 2,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'dutch-defense',
    'kings-gambit',
    'attacking-chess',
    'pawn-structures'
  ],
  eco: 'A02-A03'
} 