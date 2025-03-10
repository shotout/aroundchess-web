import { OpeningTopic } from '../types'

export const sicilianDefense: OpeningTopic = {
  id: 'sicilian-defense',
  title: 'Sicilian Defense',
  description: 'The Sicilian Defense is the most popular and aggressive response to White\'s 1.e4. Black immediately fights for the center and aims for a complex, unbalanced position.',
  difficulty: 'Advanced',
  estimatedTime: '20 hours',
  prerequisites: ['basic-chess-principles', 'pawn-structure-fundamentals'],
  objectives: [
    'Understand the main ideas and plans in the Sicilian Defense',
    'Learn key variations and move orders',
    'Master typical middlegame positions',
    'Recognize common tactical patterns',
    'Handle typical endgame positions'
  ],
  resources: [
    {
      title: 'Sicilian Defense - Chess.com Course',
      url: 'https://www.chess.com/lessons/learn-the-openings/sicilian-defense',
      platform: 'chess.com',
      description: 'Comprehensive course covering all major variations'
    },
    {
      title: 'Sicilian Defense Study - Lichess',
      url: 'https://lichess.org/study/sicilian-defense',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Dragon Variation Masterclass',
      url: 'https://lichess.org/study/dragon-sicilian',
      platform: 'lichess.org',
      description: 'Deep dive into the popular Dragon variation'
    }
  ],
  variations: [
    {
      name: 'Najdorf Variation',
      moves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6',
      description: 'The most respected and deeply analyzed variation of the Sicilian Defense.',
      keyIdeas: [
        'Control the e5 square',
        'Prepare ...e6 and ...b5 for counterplay',
        'Watch out for White\'s kingside attack',
        'Use the semi-open c-file for counterplay'
      ]
    },
    {
      name: 'Dragon Variation',
      moves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6',
      description: 'A sharp variation where Black fianchettoes their dark-squared bishop.',
      keyIdeas: [
        'Control the dark squares',
        'Attack on opposite sides',
        'Watch out for the Yugoslav Attack',
        'Use the half-open c-file'
      ]
    },
    {
      name: 'Scheveningen Variation',
      moves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6',
      description: 'A solid and flexible setup that can transpose to other variations.',
      keyIdeas: [
        'Maintain a solid pawn structure',
        'Prepare ...d5 break',
        'Control the e5 square',
        'Watch out for the Keres Attack'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 5,
  recommendedFor: ['Intermediate', 'Advanced', 'Expert'],
  relatedTopics: [
    'open-sicilian-attacking',
    'sicilian-pawn-structures',
    'dragon-middlegames',
    'najdorf-tactics'
  ]
} 