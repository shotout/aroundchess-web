import { OpeningTopic } from '../types'

export const alekhineDefense: OpeningTopic = {
  id: 'alekhine-defense',
  title: 'Alekhine\'s Defense',
  description: 'A hypermodern defense where Black invites White to advance in the center, planning to undermine and attack the resulting pawn structure.',
  difficulty: 'Advanced',
  estimatedTime: '30 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'tactical-patterns'
  ],
  objectives: [
    'Master Alekhine\'s Defense principles',
    'Learn to handle pawn centers',
    'Understand tactical opportunities',
    'Develop counterattacking skills',
    'Handle different White setups'
  ],
  resources: [
    {
      title: 'Alekhine\'s Defense Guide - Chess.com',
      url: 'https://www.chess.com/lessons/alekhine-defense',
      platform: 'chess.com',
      description: 'Complete guide to Alekhine\'s Defense'
    },
    {
      title: 'Alekhine Study - Lichess',
      url: 'https://lichess.org/study/alekhine-defense',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Advanced Alekhine',
      url: 'https://lichess.org/study/advanced-alekhine',
      platform: 'lichess.org',
      description: 'Complex variations and strategies'
    }
  ],
  variations: [
    {
      name: 'Four Pawns Attack',
      moves: '1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.c4 Nb6 5.f4',
      description: 'The most aggressive try against the Alekhine.',
      keyIdeas: [
        'Massive pawn center',
        'Active counterplay',
        'Tactical opportunities',
        'Dynamic positions'
      ]
    },
    {
      name: 'Modern Variation',
      moves: '1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3',
      description: 'A more positional approach by White.',
      keyIdeas: [
        'Controlled center',
        'Piece development',
        'Strategic battle',
        'Pawn breaks'
      ]
    },
    {
      name: 'Exchange Variation',
      moves: '1.e4 Nf6 2.e5 Nd5 3.c4 Nb6 4.d4',
      description: 'White builds a strong pawn center.',
      keyIdeas: [
        'Central control',
        'Piece activity',
        'Break preparation',
        'Dynamic play'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 3,
  recommendedFor: ['Advanced'],
  relatedTopics: [
    'modern-defense',
    'pirc-defense',
    'hypermodern-principles',
    'pawn-structures'
  ],
  eco: 'B02-B05'
} 