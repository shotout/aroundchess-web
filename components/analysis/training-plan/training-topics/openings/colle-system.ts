import { OpeningTopic } from '../types'

export const colleSystem: OpeningTopic = {
  id: 'colle-system',
  title: 'Colle System',
  description: 'The Colle System is a solid opening system for White that focuses on piece development and central control. Perfect for beginners as it follows opening principles naturally.',
  difficulty: 'Beginner',
  estimatedTime: '15 hours',
  prerequisites: [
    'basic-opening-principles',
    'piece-coordination'
  ],
  objectives: [
    'Master the standard Colle setup',
    'Learn typical attacking patterns',
    'Understand pawn structure goals',
    'Develop systematic piece placement',
    'Handle various Black defenses'
  ],
  resources: [
    {
      title: 'Colle System Guide - Chess.com',
      url: 'https://www.chess.com/lessons/colle-system',
      platform: 'chess.com',
      description: 'Complete guide to the Colle System'
    },
    {
      title: 'Colle System Study - Lichess',
      url: 'https://lichess.org/study/colle-system',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Attacking with the Colle',
      url: 'https://lichess.org/study/colle-attacks',
      platform: 'lichess.org',
      description: 'Common attacking patterns'
    }
  ],
  variations: [
    {
      name: 'Standard Colle',
      moves: '1.d4 d5 2.Nf3 Nf6 3.e3 e6 4.Bd3',
      description: 'The classical setup leading to typical attacking positions.',
      keyIdeas: [
        'Solid pawn structure',
        'Bishop to d3',
        'Kingside attacking chances',
        'Control of e4 square'
      ]
    },
    {
      name: 'Colle-Zukertort',
      moves: '1.d4 d5 2.Nf3 Nf6 3.e3 e6 4.Bd3 c5 5.b3',
      description: 'A more flexible approach with queenside fianchetto.',
      keyIdeas: [
        'Bishop to b2',
        'Control of e5 square',
        'Flexible pawn structure',
        'Multiple attacking options'
      ]
    },
    {
      name: 'Colle vs King\'s Indian',
      moves: '1.d4 Nf6 2.Nf3 g6 3.e3 Bg7',
      description: 'How to handle modern setups.',
      keyIdeas: [
        'Central control',
        'Piece coordination',
        'Kingside expansion',
        'Pawn breaks'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 3,
  recommendedFor: ['Beginner', 'Intermediate'],
  relatedTopics: [
    'london-system',
    'queens-pawn-openings',
    'piece-development',
    'attacking-patterns'
  ],
  eco: 'D05'
} 