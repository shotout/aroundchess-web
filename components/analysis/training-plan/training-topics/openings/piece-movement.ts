import { OpeningTopic } from '../types'

export const pieceMovement: OpeningTopic = {
  id: 'piece-movement',
  title: 'Piece Movement and Basic Rules',
  description: 'Learn how each chess piece moves and understand the fundamental rules of chess. Perfect starting point for complete beginners.',
  difficulty: 'Beginner',
  estimatedTime: '5 hours',
  prerequisites: [],
  objectives: [
    'Learn how each piece moves',
    'Understand special moves like castling and en passant',
    'Know how to capture pieces',
    'Recognize check and checkmate',
    'Learn pawn promotion rules',
    'Understand stalemate and draw conditions'
  ],
  resources: [
    {
      title: 'Chess Rules - Chess.com',
      url: 'https://www.chess.com/learn-how-to-play-chess',
      platform: 'chess.com',
      description: 'Complete guide to chess rules and piece movement'
    },
    {
      title: 'Interactive Chess Lessons - Lichess',
      url: 'https://lichess.org/learn',
      platform: 'lichess.org',
      description: 'Interactive lessons for learning piece movement'
    },
    {
      title: 'Chess Rules Video Course',
      url: 'https://www.youtube.com/watch?v=OCSbzArwB10',
      platform: 'custom',
      description: 'Video explanation of all chess rules'
    }
  ],
  variations: [],
  forColor: 'both',
  popularityLevel: 5,
  recommendedFor: ['Beginner'],
  relatedTopics: [
    'basic-opening-principles',
    'basic-tactics',
    'basic-checkmates',
    'material-counting'
  ],
  eco: ''
} 