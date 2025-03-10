import { OpeningTopic } from '../types'

export const benoniDefense: OpeningTopic = {
  id: 'benoni-defense',
  title: 'Benoni Defense',
  description: 'A sharp and dynamic defense against 1.d4 where Black immediately challenges White\'s center with c5, leading to complex tactical play.',
  difficulty: 'Intermediate',
  estimatedTime: '30 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'tactical-awareness',
    'piece-coordination'
  ],
  objectives: [
    'Master Benoni pawn structures',
    'Learn typical attacking patterns',
    'Understand strategic plans',
    'Handle various White setups',
    'Develop tactical awareness'
  ],
  resources: [
    {
      title: 'Benoni Defense Guide - Chess.com',
      url: 'https://www.chess.com/lessons/benoni-defense',
      platform: 'chess.com',
      description: 'Complete guide to the Benoni Defense'
    },
    {
      title: 'Benoni Defense Study - Lichess',
      url: 'https://lichess.org/study/benoni-defense',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Benoni Defense Strategy',
      url: 'https://lichess.org/study/benoni-strategy',
      platform: 'lichess.org',
      description: 'Strategic themes and plans'
    }
  ],
  variations: [
    {
      name: 'Modern Benoni',
      moves: '1.d4 Nf6 2.c4 c5 3.d5 e6',
      description: 'The main line leading to sharp tactical play.',
      keyIdeas: [
        'Queenside counterplay',
        'e6 pawn break',
        'Knight outposts',
        'Dynamic piece play'
      ]
    },
    {
      name: 'Czech Benoni',
      moves: '1.d4 Nf6 2.c4 c5 3.d5 e5',
      description: 'A more solid variation with central control.',
      keyIdeas: [
        'Central control',
        'Kingside attacking chances',
        'Piece coordination',
        'Strategic play'
      ]
    },
    {
      name: 'Snake Benoni',
      moves: '1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 Bd6',
      description: 'An aggressive setup with early bishop development.',
      keyIdeas: [
        'Quick development',
        'Attacking chances',
        'Dynamic piece play',
        'Tactical opportunities'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 3,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'kings-indian-defense',
    'modern-benoni',
    'benko-gambit',
    'dynamic-play'
  ],
  eco: 'A56-A79'
} 