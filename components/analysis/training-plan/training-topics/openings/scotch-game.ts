import { OpeningTopic } from '../types'

export const scotchGame: OpeningTopic = {
  id: 'scotch-game',
  title: 'Scotch Game',
  description: 'The Scotch Game is a dynamic opening that begins with 1.e4 e5 2.Nf3 Nc6 3.d4. It leads to open positions with active piece play and teaches important central control concepts.',
  difficulty: 'Intermediate',
  estimatedTime: '20 hours',
  prerequisites: [
    'basic-opening-principles',
    'piece-coordination',
    'central-control'
  ],
  objectives: [
    'Master Scotch Game principles',
    'Learn key variations',
    'Understand central tension',
    'Handle tactical positions',
    'Create attacking plans'
  ],
  resources: [
    {
      title: 'Scotch Game Guide - Chess.com',
      url: 'https://www.chess.com/lessons/scotch-game',
      platform: 'chess.com',
      description: 'Complete guide to the Scotch Game'
    },
    {
      title: 'Scotch Game Study - Lichess',
      url: 'https://lichess.org/study/scotch-game',
      platform: 'lichess.org',
      description: 'Interactive lessons on Scotch Game'
    },
    {
      title: 'Tactical Patterns in Scotch',
      url: 'https://lichess.org/study/scotch-tactics',
      platform: 'lichess.org',
      description: 'Common tactical themes'
    }
  ],
  variations: [
    {
      name: 'Classical Variation',
      moves: '1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4',
      description: 'The main line leading to sharp tactical play.',
      keyIdeas: [
        'Central control',
        'Active piece play',
        'Quick development',
        'Tactical opportunities'
      ]
    },
    {
      name: 'Schmidt Variation',
      moves: '1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6',
      description: 'A solid response focusing on development and counterplay.',
      keyIdeas: [
        'Balanced development',
        'Knight maneuvers',
        'Central control',
        'Piece coordination'
      ]
    },
    {
      name: 'Scotch Gambit',
      moves: '1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Bc4',
      description: 'An aggressive variation offering a pawn for rapid development.',
      keyIdeas: [
        'Quick development',
        'Attacking chances',
        'King safety',
        'Initiative play'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 4,
  recommendedFor: ['Beginner', 'Intermediate'],
  relatedTopics: [
    'central-control',
    'piece-coordination',
    'attacking-patterns',
    'tactical-awareness'
  ],
  eco: 'C45'
} 