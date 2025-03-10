import { OpeningTopic } from '../types'

export const englishOpening: OpeningTopic = {
  id: 'english-opening',
  title: 'English Opening',
  description: 'The English Opening is a flexible flank opening that can transpose into many different structures. It\'s an excellent choice for players who enjoy positional play and strategic battles.',
  difficulty: 'Intermediate',
  estimatedTime: '30 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'positional-understanding'
  ],
  objectives: [
    'Understand English Opening principles',
    'Master common pawn structures',
    'Learn key strategic plans',
    'Handle various Black responses',
    'Understand common transpositions'
  ],
  resources: [
    {
      title: 'English Opening Guide - Chess.com',
      url: 'https://www.chess.com/lessons/english-opening',
      platform: 'chess.com',
      description: 'Complete guide to the English Opening'
    },
    {
      title: 'English Opening Study - Lichess',
      url: 'https://lichess.org/study/english-opening',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Strategic Themes in the English',
      url: 'https://lichess.org/study/english-strategy',
      platform: 'lichess.org',
      description: 'Common strategic patterns'
    }
  ],
  variations: [
    {
      name: 'Symmetrical English',
      moves: '1.c4 c5',
      description: 'Black mirrors White\'s approach, leading to complex battles.',
      keyIdeas: [
        'Control of d5 square',
        'Flexible pawn structure',
        'Multiple development plans',
        'Strategic maneuvering'
      ]
    },
    {
      name: 'Reversed Sicilian',
      moves: '1.c4 e5',
      description: 'Positions similar to the Sicilian with colors reversed.',
      keyIdeas: [
        'Control of d4 square',
        'Kingside attacking chances',
        'Piece activity',
        'Central control'
      ]
    },
    {
      name: 'Four Knights English',
      moves: '1.c4 e5 2.Nc3 Nf6 3.Nf3 Nc6',
      description: 'A solid and natural development scheme.',
      keyIdeas: [
        'Rapid development',
        'Central control',
        'Multiple pawn breaks',
        'Strategic play'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 4,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'positional-play',
    'pawn-structures',
    'strategic-planning',
    'piece-coordination'
  ],
  eco: 'A10-A39'
} 