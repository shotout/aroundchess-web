import { OpeningTopic } from '../types'

export const londonSystem: OpeningTopic = {
  id: 'london-system',
  title: 'London System',
  description: 'The London System is a flexible opening system for White that can be played against almost any Black setup. It\'s perfect for beginners due to its solid structure and consistent development plan.',
  difficulty: 'Beginner',
  estimatedTime: '15 hours',
  prerequisites: [
    'basic-opening-principles',
    'piece-coordination'
  ],
  objectives: [
    'Master the standard London System setup',
    'Learn flexible move orders',
    'Understand typical pawn structures',
    'Develop attacking plans',
    'Handle different Black responses'
  ],
  resources: [
    {
      title: 'London System Guide - Chess.com',
      url: 'https://www.chess.com/lessons/london-system',
      platform: 'chess.com',
      description: 'Complete guide to the London System'
    },
    {
      title: 'London System Study - Lichess',
      url: 'https://lichess.org/study/london-system',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Common Tactics in the London',
      url: 'https://lichess.org/study/london-tactics',
      platform: 'lichess.org',
      description: 'Tactical patterns specific to the London'
    }
  ],
  variations: [
    {
      name: 'Standard London Setup',
      moves: '1.d4 d5 2.Bf4 Nf6 3.e3 c5 4.c3',
      description: 'The classical setup with early Bf4.',
      keyIdeas: [
        'Early dark-squared bishop development',
        'Solid pawn structure',
        'Control of e5 square',
        'Preparation for e3-e4 push'
      ]
    },
    {
      name: 'Jobava London',
      moves: '1.d4 d5 2.Bf4 Nf6 3.Nc3',
      description: 'A more dynamic approach with early knight development.',
      keyIdeas: [
        'Quick development',
        'Pressure on d5',
        'Potential for e4 push',
        'Active piece play'
      ]
    },
    {
      name: 'London vs King\'s Indian Setup',
      moves: '1.d4 Nf6 2.Bf4 g6 3.e3 Bg7',
      description: 'How to handle fianchetto setups.',
      keyIdeas: [
        'Control central light squares',
        'Prevent ...e5 break',
        'Build queenside pressure',
        'Plan kingside expansion'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 5,
  recommendedFor: ['Beginner', 'Intermediate'],
  relatedTopics: [
    'piece-development',
    'pawn-structures',
    'central-control',
    'attacking-patterns'
  ],
  eco: 'D02'
} 