import { OpeningTopic } from '../types'

export const modernDefense: OpeningTopic = {
  id: 'modern-defense',
  title: 'Modern Defense',
  description: 'The Modern Defense is a hypermodern opening where Black develops flexibly with g6 and Bg7. It can transpose into many different structures and is highly adaptable.',
  difficulty: 'Intermediate',
  estimatedTime: '25 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'piece-coordination'
  ],
  objectives: [
    'Understand Modern Defense principles',
    'Master the fianchetto setup',
    'Learn flexible move orders',
    'Handle various White setups',
    'Develop strategic understanding'
  ],
  resources: [
    {
      title: 'Modern Defense Guide - Chess.com',
      url: 'https://www.chess.com/lessons/modern-defense',
      platform: 'chess.com',
      description: 'Complete guide to the Modern Defense'
    },
    {
      title: 'Modern Defense Study - Lichess',
      url: 'https://lichess.org/study/modern-defense',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Modern Defense Strategy',
      url: 'https://lichess.org/study/modern-strategy',
      platform: 'lichess.org',
      description: 'Strategic themes and plans'
    }
  ],
  variations: [
    {
      name: 'Standard Modern',
      moves: '1.e4 g6 2.d4 Bg7',
      description: 'The main line with early fianchetto.',
      keyIdeas: [
        'Flexible development',
        'Control of dark squares',
        'Multiple pawn break options',
        'Dynamic counterplay'
      ]
    },
    {
      name: 'Modern vs d4',
      moves: '1.d4 g6 2.c4 Bg7',
      description: 'Handling Queen\'s Pawn setups.',
      keyIdeas: [
        'Control of dark squares',
        'Flexible pawn structure',
        'Multiple development schemes',
        'Strategic play'
      ]
    },
    {
      name: 'Averbakh Variation',
      moves: '1.e4 g6 2.d4 Bg7 3.c4 d6 4.Nc3 Nd7',
      description: 'A solid setup against White\'s space advantage.',
      keyIdeas: [
        'Solid pawn structure',
        'Piece coordination',
        'Queenside expansion',
        'Central control'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 3,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'pirc-defense',
    'kings-indian-defense',
    'hypermodern-principles',
    'fianchetto-positions'
  ],
  eco: 'B06'
} 