import { OpeningTopic } from '../types'

export const fourKnights: OpeningTopic = {
  id: 'four-knights',
  title: 'Four Knights Game',
  description: 'The Four Knights Game is a classic opening that follows natural development principles. It\'s perfect for beginners as it teaches fundamental concepts of piece coordination and central control.',
  difficulty: 'Beginner',
  estimatedTime: '15 hours',
  prerequisites: [
    'piece-movement',
    'basic-opening-principles'
  ],
  objectives: [
    'Master basic development',
    'Learn piece coordination',
    'Understand central control',
    'Handle symmetrical positions',
    'Create simple plans'
  ],
  resources: [
    {
      title: 'Four Knights Guide - Chess.com',
      url: 'https://www.chess.com/lessons/four-knights',
      platform: 'chess.com',
      description: 'Beginner-friendly guide to the Four Knights Game'
    },
    {
      title: 'Four Knights Study - Lichess',
      url: 'https://lichess.org/study/four-knights',
      platform: 'lichess.org',
      description: 'Interactive lessons for beginners'
    },
    {
      title: 'Basic Four Knights Patterns',
      url: 'https://lichess.org/study/four-knights-patterns',
      platform: 'lichess.org',
      description: 'Essential strategic and tactical patterns'
    }
  ],
  variations: [
    {
      name: 'Symmetrical Variation',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6',
      description: 'The main line leading to balanced positions.',
      keyIdeas: [
        'Equal development',
        'Central control',
        'Piece coordination',
        'Strategic play'
      ]
    },
    {
      name: 'Spanish Variation',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bb5',
      description: 'A more aggressive approach adding pressure on Black\'s position.',
      keyIdeas: [
        'Pin tactics',
        'Piece activity',
        'Pawn structure',
        'Long-term pressure'
      ]
    },
    {
      name: 'Scotch Four Knights',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.d4',
      description: 'An active variation opening up the center immediately.',
      keyIdeas: [
        'Central break',
        'Open positions',
        'Active pieces',
        'Tactical opportunities'
      ]
    }
  ],
  forColor: 'both',
  popularityLevel: 3,
  recommendedFor: ['Beginner'],
  relatedTopics: [
    'basic-opening-principles',
    'piece-development',
    'central-control',
    'piece-coordination'
  ],
  eco: 'C47-C49'
} 