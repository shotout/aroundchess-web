import { OpeningTopic } from '../types'

export const trompowskyAttack: OpeningTopic = {
  id: 'trompowsky-attack',
  title: 'Trompowsky Attack',
  description: 'A dynamic opening that begins with 1.d4 Nf6 2.Bg5, aiming to disrupt Black\'s standard responses to 1.d4. The Trompowsky is a flexible opening that can lead to unique positions.',
  difficulty: 'Intermediate',
  estimatedTime: '20 hours',
  prerequisites: [
    'basic-opening-principles',
    'piece-coordination',
    'positional-understanding'
  ],
  objectives: [
    'Understand the key ideas of the Trompowsky Attack',
    'Learn how to handle different Black responses',
    'Master typical tactical patterns',
    'Develop strategic understanding of resulting positions',
    'Learn to exploit Black\'s weaknesses'
  ],
  resources: [
    {
      title: 'Trompowsky Attack Guide - Chess.com',
      url: 'https://www.chess.com/lessons/trompowsky-attack',
      platform: 'chess.com',
      description: 'Complete guide to the Trompowsky Attack'
    },
    {
      title: 'Trompowsky Study - Lichess',
      url: 'https://lichess.org/study/trompowsky',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Strategic Themes in Trompowsky',
      url: 'https://lichess.org/study/trompowsky-strategy',
      platform: 'lichess.org',
      description: 'Deep dive into positional themes and plans'
    }
  ],
  variations: [
    {
      name: 'Classical Line',
      moves: '1.d4 Nf6 2.Bg5 e6',
      description: 'The most solid response, where Black establishes a strong pawn center.',
      keyIdeas: [
        'Control of central squares',
        'Bishop activity',
        'Pawn structure battles',
        'Strategic play'
      ]
    },
    {
      name: 'Poisoned Pawn Line',
      moves: '1.d4 Nf6 2.Bg5 c5',
      description: 'A sharp variation where Black immediately fights for the center.',
      keyIdeas: [
        'Tactical opportunities',
        'Dynamic play',
        'Piece activity',
        'Complex positions'
      ]
    },
    {
      name: 'Modern Approach',
      moves: '1.d4 Nf6 2.Bg5 g6',
      description: 'Black aims for a flexible setup with the fianchetto.',
      keyIdeas: [
        'Fianchetto development',
        'Flexible pawn structure',
        'Long-term strategy',
        'Positional play'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 3,
  recommendedFor: ['Intermediate', 'Advanced'],
  relatedTopics: [
    'london-system',
    'attacking-chess',
    'positional-play',
    'tactical-awareness'
  ],
  eco: 'A45'
} 