import { OpeningTopic } from '../types'

export const ruyLopez: OpeningTopic = {
  id: 'ruy-lopez',
  title: 'Ruy Lopez',
  description: 'The Ruy Lopez (Spanish Opening) is one of the oldest and most popular chess openings. It creates a rich strategic battle from the very beginning.',
  difficulty: 'Intermediate',
  estimatedTime: '30 hours',
  prerequisites: ['basic-chess-principles', 'pawn-structure-fundamentals', 'piece-coordination'],
  objectives: [
    'Understand the main ideas and plans in the Ruy Lopez',
    'Learn key variations and move orders',
    'Master typical pawn structures',
    'Handle Black\'s defensive setups',
    'Learn common endgame positions'
  ],
  resources: [
    {
      title: 'Ruy Lopez Fundamentals - Chess.com',
      url: 'https://www.chess.com/lessons/learn-the-openings/ruy-lopez',
      platform: 'chess.com',
      description: 'Complete guide to the Ruy Lopez opening'
    },
    {
      title: 'Ruy Lopez Study - Lichess',
      url: 'https://lichess.org/study/ruy-lopez',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Marshall Attack Course',
      url: 'https://www.chess.com/lessons/learn-the-openings/marshall-attack',
      platform: 'chess.com',
      description: 'Deep dive into the aggressive Marshall Attack'
    }
  ],
  variations: [
    {
      name: 'Closed Ruy Lopez',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.0-0 Be7',
      description: 'The main line of the Ruy Lopez, leading to complex strategic battles.',
      keyIdeas: [
        'Control the center with pawns and pieces',
        'Fight for control of the d4 square',
        'Prepare the d2-d4 break',
        'Handle the c3 pawn advance timing'
      ]
    },
    {
      name: 'Marshall Attack',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.0-0 Be7 6.Re1 b5 7.Bb3 0-0 8.c3 d5',
      description: 'A sharp counter-attacking system for Black with piece sacrifices.',
      keyIdeas: [
        'Sacrifice pawns for initiative',
        'Attack the white king',
        'Create attacking chances on the kingside',
        'Use the semi-open f-file'
      ]
    },
    {
      name: 'Berlin Defense',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6',
      description: 'A solid defensive setup that has become very popular at top level.',
      keyIdeas: [
        'Exchange the e5 pawn',
        'Create an endgame-like position',
        'Control the open e-file',
        'Maintain solid pawn structure'
      ]
    },
    {
      name: 'Exchange Variation',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6',
      description: 'A straightforward variation that leads to slightly different pawn structures.',
      keyIdeas: [
        'Double Black\'s pawns',
        'Control the center with pawns',
        'Use the bishop pair advantage',
        'Create queenside pressure'
      ]
    }
  ],
  forColor: 'both',
  popularityLevel: 5,
  recommendedFor: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  relatedTopics: [
    'spanish-structures',
    'marshall-attack',
    'berlin-defense',
    'closed-positions'
  ],
  eco: 'C60-C99'
} 