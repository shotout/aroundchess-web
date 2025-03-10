import { OpeningTopic } from '../types'

export const kingsGambit: OpeningTopic = {
  id: 'kings-gambit',
  title: 'King\'s Gambit',
  description: 'A bold and aggressive opening where White sacrifices a pawn for rapid development and attacking chances. The King\'s Gambit leads to sharp tactical positions with rich historical heritage.',
  difficulty: 'Advanced',
  estimatedTime: '25 hours',
  prerequisites: [
    'basic-opening-principles',
    'attacking-patterns',
    'tactical-awareness',
    'piece-activity'
  ],
  objectives: [
    'Master attacking patterns',
    'Learn tactical themes',
    'Handle Black\'s defenses',
    'Understand compensation',
    'Create attacking plans'
  ],
  resources: [
    {
      title: 'King\'s Gambit Guide - Chess.com',
      url: 'https://www.chess.com/lessons/kings-gambit',
      platform: 'chess.com',
      description: 'Comprehensive guide to King\'s Gambit attacking patterns'
    },
    {
      title: 'King\'s Gambit Study - Lichess',
      url: 'https://lichess.org/study/kings-gambit',
      platform: 'lichess.org',
      description: 'Interactive lessons on key variations'
    },
    {
      title: 'Attacking in King\'s Gambit',
      url: 'https://lichess.org/study/kings-gambit-attack',
      platform: 'lichess.org',
      description: 'Deep dive into tactical themes and plans'
    }
  ],
  variations: [
    {
      name: 'King\'s Gambit Accepted',
      moves: '1.e4 e5 2.f4 exf4',
      description: 'Black accepts the pawn sacrifice, leading to sharp tactical play.',
      keyIdeas: [
        'Rapid development',
        'King safety',
        'Attacking chances',
        'Tactical opportunities'
      ]
    },
    {
      name: 'Fischer Defense',
      moves: '1.e4 e5 2.f4 exf4 3.Nf3 d6',
      description: 'A solid approach to handling the gambit, popularized by Bobby Fischer.',
      keyIdeas: [
        'Solid defense',
        'Pawn structure',
        'Counter-attacking',
        'Strategic play'
      ]
    },
    {
      name: 'Modern Defense',
      moves: '1.e4 e5 2.f4 d5',
      description: 'An immediate counter in the center, challenging White\'s setup.',
      keyIdeas: [
        'Central counter',
        'Quick development',
        'Dynamic equality',
        'Active pieces'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 3,
  recommendedFor: ['Advanced'],
  relatedTopics: [
    'vienna-game',
    'attacking-chess',
    'tactical-patterns',
    'piece-activity'
  ],
  eco: 'C30-C39'
} 