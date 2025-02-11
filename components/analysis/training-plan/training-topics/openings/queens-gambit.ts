import { OpeningTopic } from '../types'

export const queensGambit: OpeningTopic = {
  id: 'queens-gambit',
  title: 'Queen\'s Gambit',
  description: 'The Queen\'s Gambit is one of the oldest and most fundamental chess openings. White offers a pawn to gain control of the center and establish a strong pawn presence.',
  difficulty: 'Intermediate',
  estimatedTime: '25 hours',
  prerequisites: [
    'basic-chess-principles',
    'pawn-structure-fundamentals',
    'center-control'
  ],
  objectives: [
    'Understand the main ideas and plans in the Queen\'s Gambit',
    'Learn key variations and move orders',
    'Master typical IQP positions',
    'Handle Black\'s different defensive setups',
    'Learn common middlegame and endgame positions'
  ],
  resources: [
    {
      title: 'Queen\'s Gambit Fundamentals - Chess.com',
      url: 'https://www.chess.com/lessons/learn-the-openings/queens-gambit',
      platform: 'chess.com',
      description: 'Complete guide to the Queen\'s Gambit'
    },
    {
      title: 'Queen\'s Gambit Study - Lichess',
      url: 'https://lichess.org/study/queens-gambit',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'IQP Positions Course',
      url: 'https://www.chess.com/lessons/isolated-queen-pawn',
      platform: 'chess.com',
      description: 'Deep dive into Isolated Queen Pawn positions'
    }
  ],
  variations: [
    {
      name: 'Queen\'s Gambit Accepted',
      moves: '1.d4 d5 2.c4 dxc4',
      description: 'Black accepts the gambit pawn but must deal with White\'s central control and development advantage.',
      keyIdeas: [
        'Quick development of pieces',
        'Control of the center',
        'Attack on the c4 pawn',
        'Early queen activity risks'
      ]
    },
    {
      name: 'Queen\'s Gambit Declined',
      moves: '1.d4 d5 2.c4 e6',
      description: 'The most solid response, maintaining central control and creating a strong pawn chain.',
      keyIdeas: [
        'Control of e4 square',
        'Development behind pawn chain',
        'Minority attack possibilities',
        'Break with c5 or e5'
      ]
    },
    {
      name: 'Slav Defense',
      moves: '1.d4 d5 2.c4 c6',
      description: 'A solid and flexible defense that protects the d5 pawn without blocking the c8 bishop.',
      keyIdeas: [
        'Solid pawn structure',
        'Active piece play',
        'Control of e4 square',
        'Various pawn breaks available'
      ]
    },
    {
      name: 'Semi-Slav Defense',
      moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6',
      description: 'Combines ideas from both the QGD and Slav Defense, leading to complex positions.',
      keyIdeas: [
        'Flexible pawn structure',
        'Dynamic piece play',
        'Botvinnik Variation possibilities',
        'Rich tactical opportunities'
      ]
    }
  ],
  forColor: 'both',
  popularityLevel: 5,
  recommendedFor: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  relatedTopics: [
    'isolated-queen-pawn',
    'minority-attack',
    'carlsbad-structure',
    'semi-slav-structures'
  ],
  eco: 'D00-D69'
} 