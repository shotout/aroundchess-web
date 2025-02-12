import { OpeningTopic } from '../types'

export const caroKann: OpeningTopic = {
  id: 'caro-kann',
  title: 'Caro-Kann Defense',
  description: 'A solid and strategically rich defense against 1.e4. The Caro-Kann offers Black a stable pawn structure and clear strategic plans.',
  difficulty: 'Intermediate',
  estimatedTime: '25 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'piece-coordination'
  ],
  objectives: [
    'Master the main Caro-Kann variations',
    'Understand typical pawn structures',
    'Learn strategic plans for both sides',
    'Handle different White setups',
    'Develop positional understanding'
  ],
  resources: [
    {
      title: 'Caro-Kann Defense Guide - Chess.com',
      url: 'https://www.chess.com/lessons/caro-kann',
      platform: 'chess.com',
      description: 'Complete guide to the Caro-Kann Defense'
    },
    {
      title: 'Caro-Kann Study - Lichess',
      url: 'https://lichess.org/study/caro-kann',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Advanced Caro-Kann',
      url: 'https://lichess.org/study/advanced-caro-kann',
      platform: 'lichess.org',
      description: 'Complex variations and strategies'
    }
  ],
  variations: [
    {
      name: 'Classical Variation',
      moves: '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4',
      description: 'The main line leading to balanced positions.',
      keyIdeas: [
        'Solid pawn structure',
        'Control of e5 square',
        'Queenside expansion',
        'Active piece play'
      ]
    },
    {
      name: 'Advance Variation',
      moves: '1.e4 c6 2.d4 d5 3.e5',
      description: 'White gains space but gives Black targets.',
      keyIdeas: [
        'Pawn chain strategy',
        'Light square control',
        'Piece maneuvering',
        'Break preparation'
      ]
    },
    {
      name: 'Panov Attack',
      moves: '1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4',
      description: 'Sharp variation leading to IQP positions.',
      keyIdeas: [
        'IQP dynamics',
        'Piece activity',
        'Central control',
        'Attacking chances'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 4,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'french-defense',
    'slav-defense',
    'pawn-structures',
    'positional-play'
  ],
  eco: 'B10-B19'
} 