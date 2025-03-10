import { OpeningTopic } from '../types'

export const pircDefense: OpeningTopic = {
  id: 'pirc-defense',
  title: 'Pirc Defense',
  description: 'The Pirc Defense is a hypermodern opening where Black allows White to establish a central pawn presence before striking back with piece pressure. A great introduction to hypermodern chess.',
  difficulty: 'Intermediate',
  estimatedTime: '25 hours',
  prerequisites: [
    'basic-opening-principles',
    'pawn-structures',
    'piece-coordination'
  ],
  objectives: [
    'Understand hypermodern opening principles',
    'Master the fianchetto setup',
    'Learn to handle White\'s space advantage',
    'Develop counterattacking skills',
    'Handle various White attacking setups'
  ],
  resources: [
    {
      title: 'Pirc Defense Guide - Chess.com',
      url: 'https://www.chess.com/lessons/pirc-defense',
      platform: 'chess.com',
      description: 'Complete guide to the Pirc Defense'
    },
    {
      title: 'Pirc Defense Study - Lichess',
      url: 'https://lichess.org/study/pirc-defense',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Counterattacking with the Pirc',
      url: 'https://lichess.org/study/pirc-counterattack',
      platform: 'lichess.org',
      description: 'Study of counterattacking themes'
    }
  ],
  variations: [
    {
      name: 'Classical System',
      moves: '1.e4 d6 2.d4 Nf6 3.Nc3 g6',
      description: 'The main line leading to complex strategic battles.',
      keyIdeas: [
        'Fianchetto setup',
        'Control of dark squares',
        'Queenside expansion',
        'Kingside counterplay'
      ]
    },
    {
      name: 'Austrian Attack',
      moves: '1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4',
      description: 'White\'s most aggressive try against the Pirc.',
      keyIdeas: [
        'Handle White\'s pawn storm',
        'Timely counterplay',
        'King safety',
        'Central control'
      ]
    },
    {
      name: '150 Attack',
      moves: '1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3',
      description: 'A solid and strategic approach by White.',
      keyIdeas: [
        'Control key diagonals',
        'Prepare queenside expansion',
        'Handle pawn breaks',
        'Piece coordination'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 4,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'kings-indian-defense',
    'modern-defense',
    'hypermodern-principles',
    'fianchetto-positions'
  ],
  eco: 'B07-B09'
} 