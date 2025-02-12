import { OpeningTopic } from '../types'

export const italianGame: OpeningTopic = {
  id: 'italian-game',
  title: 'Italian Game',
  description: 'The Italian Game is a perfect opening for beginners. It follows natural developing principles, creates clear plans, and teaches fundamental chess concepts.',
  difficulty: 'Beginner',
  estimatedTime: '15 hours',
  prerequisites: ['basic-piece-movement'],
  objectives: [
    'Learn the fundamental principles of chess openings',
    'Understand basic piece development',
    'Control the center with pawns and pieces',
    'Create simple attacking plans',
    'Learn basic tactical patterns'
  ],
  resources: [
    {
      title: 'Italian Game Basics - Chess.com',
      url: 'https://www.chess.com/lessons/learn-the-openings/italian-game',
      platform: 'chess.com',
      description: 'Beginner-friendly guide to the Italian Game'
    },
    {
      title: 'Italian Game Study - Lichess',
      url: 'https://lichess.org/study/italian-game',
      platform: 'lichess.org',
      description: 'Interactive lessons for beginners'
    },
    {
      title: 'Common Tactics in the Italian Game',
      url: 'https://lichess.org/study/italian-tactics',
      platform: 'lichess.org',
      description: 'Basic tactical patterns for beginners'
    }
  ],
  variations: [
    {
      name: 'Giuoco Piano',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5',
      description: 'The most straightforward variation, perfect for beginners to learn basic principles.',
      keyIdeas: [
        'Develop pieces toward the center',
        'Control central squares',
        'Create simple attacking plans',
        'Learn basic pawn structures'
      ]
    },
    {
      name: 'Giuoco Pianissimo',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.d3',
      description: 'A quiet variation that helps learn positional play.',
      keyIdeas: [
        'Slow and steady development',
        'Build a strong pawn center',
        'Create long-term plans',
        'Learn piece coordination'
      ]
    },
    {
      name: 'Evans Gambit',
      moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4',
      description: 'An exciting gambit that teaches attacking chess.',
      keyIdeas: [
        'Sacrifice a pawn for development',
        'Create attacking chances',
        'Learn basic attacking patterns',
        'Practice tactical awareness'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 5,
  recommendedFor: ['Beginner', 'Intermediate'],
  relatedTopics: [
    'basic-principles',
    'center-control',
    'piece-development',
    'basic-tactics'
  ],
  eco: 'C50-C54'
} 