import { OpeningTopic } from '../types'

export const scandinavianDefense: OpeningTopic = {
  id: 'scandinavian-defense',
  title: 'Scandinavian Defense',
  description: 'The Scandinavian Defense is a direct counter to 1.e4 with 1...d5. Learn this straightforward opening that leads to clear strategic plans and solid positions.',
  difficulty: 'Intermediate',
  estimatedTime: '20 hours',
  prerequisites: [
    'basic-opening-principles',
    'piece-coordination',
    'pawn-structures'
  ],
  objectives: [
    'Master the main variations after 1.e4 d5',
    'Learn to handle the early queen sortie',
    'Understand typical pawn structures',
    'Develop clear strategic plans',
    'Handle common tactical patterns'
  ],
  resources: [
    {
      title: 'Scandinavian Defense - Chess.com',
      url: 'https://www.chess.com/lessons/scandinavian-defense',
      platform: 'chess.com',
      description: 'Complete guide to the Scandinavian Defense'
    },
    {
      title: 'Scandinavian Study - Lichess',
      url: 'https://lichess.org/study/scandinavian',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Modern Scandinavian',
      url: 'https://lichess.org/study/modern-scandinavian',
      platform: 'lichess.org',
      description: 'Contemporary treatment of the opening'
    }
  ],
  variations: [
    {
      name: 'Main Line with 2...Qxd5',
      moves: '1.e4 d5 2.exd5 Qxd5',
      description: 'The classical approach, leading to open positions with clear plans.',
      keyIdeas: [
        'Early queen development',
        'Quick development of kingside pieces',
        'Control of central squares',
        'Active piece play'
      ]
    },
    {
      name: 'Modern Variation with 2...Nf6',
      moves: '1.e4 d5 2.exd5 Nf6',
      description: 'A solid approach avoiding early queen moves.',
      keyIdeas: [
        'Solid piece development',
        'Control of e4 square',
        'Flexible pawn structure',
        'Multiple recapture options'
      ]
    },
    {
      name: 'Portuguese Variation',
      moves: '1.e4 d5 2.exd5 Nf6 3.d4 Bg4',
      description: 'An aggressive approach with early piece activity.',
      keyIdeas: [
        'Pin against white\'s queen',
        'Quick development',
        'Tactical opportunities',
        'Dynamic equality'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 3,
  recommendedFor: ['Beginner', 'Intermediate'],
  relatedTopics: [
    'piece-activity',
    'central-control',
    'queen-handling',
    'open-positions'
  ],
  eco: 'B01'
} 