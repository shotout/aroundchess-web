import { OpeningTopic } from '../types'

export const basicOpeningPrinciples: OpeningTopic = {
  id: 'basic-opening-principles',
  title: 'Basic Opening Principles',
  description: 'Master the fundamental principles of chess openings. Learn how to develop your pieces effectively, control the center, and ensure king safety.',
  difficulty: 'Beginner',
  estimatedTime: '15 hours',
  prerequisites: ['piece-movement'],
  objectives: [
    'Understand core opening principles',
    'Learn proper piece development',
    'Master center control concepts',
    'Ensure king safety',
    'Avoid common opening mistakes'
  ],
  resources: [
    {
      title: 'Opening Principles - Chess.com',
      url: 'https://www.chess.com/lessons/opening-principles',
      platform: 'chess.com',
      description: 'Essential opening principles for beginners'
    },
    {
      title: 'Opening Basics - Lichess',
      url: 'https://lichess.org/study/opening-basics',
      platform: 'lichess.org',
      description: 'Interactive lessons on opening fundamentals'
    },
    {
      title: 'Common Opening Mistakes',
      url: 'https://lichess.org/study/opening-mistakes',
      platform: 'lichess.org',
      description: 'Learn to avoid typical opening errors'
    }
  ],
  variations: [
    {
      name: 'Center Control',
      moves: '1.e4 e5 2.Nf3',
      description: 'The basic approach to controlling the center with pawns and pieces.',
      keyIdeas: [
        'Control central squares',
        'Support center pawns',
        'Develop pieces toward center',
        'Create pawn tension'
      ]
    },
    {
      name: 'Piece Development',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4',
      description: 'Natural development of pieces to active squares.',
      keyIdeas: [
        'Develop knights before bishops',
        'Don\'t move same piece twice',
        'Castle early',
        'Connect rooks'
      ]
    },
    {
      name: 'King Safety',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.0-0',
      description: 'Ensuring king safety through timely castling and proper pawn structure.',
      keyIdeas: [
        'Castle within first 7 moves',
        'Maintain kingside pawns',
        'Avoid early queen moves',
        'Keep king protected'
      ]
    }
  ],
  forColor: 'both',
  popularityLevel: 5,
  recommendedFor: ['Beginner'],
  relatedTopics: [
    'piece-development',
    'center-control',
    'king-safety',
    'pawn-structure-basics'
  ],
  eco: 'A00-E99'
} 