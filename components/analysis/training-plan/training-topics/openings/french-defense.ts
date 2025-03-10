import { OpeningTopic } from '../types'

export const frenchDefense: OpeningTopic = {
  id: 'french-defense',
  title: 'French Defense',
  description: 'The French Defense is a solid opening for Black that leads to complex positional play. Black challenges White\'s center immediately and aims for counterplay.',
  difficulty: 'Intermediate',
  estimatedTime: '25 hours',
  prerequisites: [
    'pawn-structure-fundamentals',
    'piece-coordination',
    'positional-understanding'
  ],
  objectives: [
    'Understand the main ideas and plans in the French Defense',
    'Master typical pawn structures and breaks',
    'Learn to handle the bad light-squared bishop',
    'Develop attacking skills on both flanks',
    'Handle different White setups effectively'
  ],
  resources: [
    {
      title: 'French Defense - Chess.com',
      url: 'https://www.chess.com/lessons/learn-the-openings/french-defense',
      platform: 'chess.com',
      description: 'Complete guide to the French Defense'
    },
    {
      title: 'French Defense Study - Lichess',
      url: 'https://lichess.org/study/french-defense',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Winawer Variation Course',
      url: 'https://www.chess.com/lessons/french-winawer',
      platform: 'chess.com',
      description: 'Deep dive into the sharp Winawer Variation'
    }
  ],
  variations: [
    {
      name: 'Classical Variation',
      moves: '1.e4 e6 2.d4 d5 3.Nc3 Nf6',
      description: 'A solid line where Black maintains central tension and develops naturally.',
      keyIdeas: [
        'Control of e5 square',
        'Development of light-squared bishop',
        'Queenside expansion with ...c5',
        'Kingside attacking chances'
      ]
    },
    {
      name: 'Winawer Variation',
      moves: '1.e4 e6 2.d4 d5 3.Nc3 Bb4',
      description: 'A sharp variation where Black pins the knight and creates immediate tension.',
      keyIdeas: [
        'Pin on the knight',
        'Pawn structure decisions',
        'Queenside expansion',
        'Complex tactical play'
      ]
    },
    {
      name: 'Advance Variation',
      moves: '1.e4 e6 2.d4 d5 3.e5',
      description: 'White gains space but gives Black clear counterplay targets.',
      keyIdeas: [
        'Attack the white center',
        'Light square control',
        'Kingside attacking chances',
        'Break with ...c5 and ...f6'
      ]
    },
    {
      name: 'Tarrasch Variation',
      moves: '1.e4 e6 2.d4 d5 3.Nd2',
      description: 'A solid choice by White avoiding the complexities of the main lines.',
      keyIdeas: [
        'Control of e5 square',
        'IQP positions',
        'Active piece play',
        'Central control'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 4,
  recommendedFor: ['Beginner', 'Intermediate', 'Advanced'],
  relatedTopics: [
    'french-structures',
    'closed-positions',
    'pawn-chains',
    'light-square-strategy'
  ],
  eco: 'C00-C19'
} 