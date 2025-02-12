import { OpeningTopic } from '../types'

export const kingsIndianAttack: OpeningTopic = {
  id: 'kings-indian-attack',
  title: 'King\'s Indian Attack',
  description: 'A flexible opening system for White that can be played against various Black setups. It features a kingside fianchetto and solid pawn structure.',
  difficulty: 'Beginner',
  estimatedTime: '20 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'piece-coordination'
  ],
  objectives: [
    'Master the standard KIA setup',
    'Learn typical attacking patterns',
    'Understand pawn structure goals',
    'Handle various Black responses',
    'Develop strategic understanding'
  ],
  resources: [
    {
      title: 'KIA Guide - Chess.com',
      url: 'https://www.chess.com/lessons/kings-indian-attack',
      platform: 'chess.com',
      description: 'Complete guide to the King\'s Indian Attack'
    },
    {
      title: 'KIA Study - Lichess',
      url: 'https://lichess.org/study/kings-indian-attack',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'KIA Strategy',
      url: 'https://lichess.org/study/kia-strategy',
      platform: 'lichess.org',
      description: 'Strategic themes and plans'
    }
  ],
  variations: [
    {
      name: 'Standard KIA',
      moves: '1.Nf3 d5 2.g3',
      description: 'The main setup against a d5 pawn.',
      keyIdeas: [
        'Kingside fianchetto',
        'Flexible development',
        'Kingside attacking chances',
        'Solid center'
      ]
    },
    {
      name: 'KIA vs French',
      moves: '1.e4 e6 2.d3 d5 3.Nd2',
      description: 'Setup against the French Defense structure.',
      keyIdeas: [
        'Control of e5',
        'Kingside attack',
        'Pawn breaks',
        'Piece coordination'
      ]
    },
    {
      name: 'KIA vs Sicilian',
      moves: '1.e4 c5 2.d3 Nc6 3.g3',
      description: 'Handling Sicilian-type positions.',
      keyIdeas: [
        'Control of d4',
        'Kingside fianchetto',
        'Flexible pawn structure',
        'Strategic play'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 3,
  recommendedFor: ['Beginner', 'Intermediate'],
  relatedTopics: [
    'kings-indian-defense',
    'pirc-defense',
    'modern-defense',
    'fianchetto-positions'
  ],
  eco: 'A07-A09'
} 