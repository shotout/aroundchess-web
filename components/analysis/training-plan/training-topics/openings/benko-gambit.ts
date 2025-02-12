import { OpeningTopic } from '../types'

export const benkoGambit: OpeningTopic = {
  id: 'benko-gambit',
  title: 'Benko Gambit',
  description: 'A dynamic opening where Black sacrifices a pawn for long-term pressure on White\'s queenside, featuring active piece play and clear strategic goals.',
  difficulty: 'Intermediate',
  estimatedTime: '25 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'tactical-awareness',
    'piece-coordination'
  ],
  objectives: [
    'Master Benko Gambit principles',
    'Learn queenside attacking patterns',
    'Understand pawn structure implications',
    'Handle various White setups',
    'Develop positional understanding'
  ],
  resources: [
    {
      title: 'Benko Gambit Guide - Chess.com',
      url: 'https://www.chess.com/lessons/benko-gambit',
      platform: 'chess.com',
      description: 'Complete guide to the Benko Gambit'
    },
    {
      title: 'Benko Gambit Study - Lichess',
      url: 'https://lichess.org/study/benko-gambit',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Benko Gambit Strategy',
      url: 'https://lichess.org/study/benko-strategy',
      platform: 'lichess.org',
      description: 'Strategic themes and plans'
    }
  ],
  variations: [
    {
      name: 'Accepted Main Line',
      moves: '1.d4 Nf6 2.c4 c5 3.d5 b5 4.cxb5 a6',
      description: 'White accepts the pawn sacrifice.',
      keyIdeas: [
        'Queenside pressure',
        'Open a-file play',
        'Bishop fianchetto',
        'Long-term compensation'
      ]
    },
    {
      name: 'Fianchetto Variation',
      moves: '1.d4 Nf6 2.c4 c5 3.d5 b5 4.cxb5 a6 5.g3',
      description: 'White aims for a more positional game.',
      keyIdeas: [
        'Control of long diagonal',
        'Kingside fianchetto',
        'Piece coordination',
        'Strategic battle'
      ]
    },
    {
      name: 'Modern Variation',
      moves: '1.d4 Nf6 2.c4 c5 3.d5 b5 4.cxb5 a6 5.f3',
      description: 'White strengthens central control.',
      keyIdeas: [
        'Central control',
        'Pawn structure battle',
        'Active piece play',
        'Dynamic positions'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 3,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'benoni-defense',
    'kings-indian-defense',
    'dynamic-play',
    'gambit-play'
  ],
  eco: 'A57-A59'
} 