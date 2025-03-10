import { OpeningTopic } from '../types'

export const philidor: OpeningTopic = {
  id: 'philidor',
  title: 'Philidor Defense',
  description: 'The Philidor Defense is a solid but passive opening for Black, characterized by the moves 1.e4 e5 2.Nf3 d6. While not as popular at higher levels, it offers beginners a chance to learn important positional concepts.',
  difficulty: 'Beginner',
  estimatedTime: '15 hours',
  prerequisites: [
    'piece-movement',
    'basic-opening-principles'
  ],
  objectives: [
    'Understand basic Philidor structures',
    'Learn defensive techniques',
    'Master piece development',
    'Create counterplay opportunities',
    'Handle common attacking patterns'
  ],
  resources: [
    {
      title: 'Philidor Defense Guide - Chess.com',
      url: 'https://www.chess.com/lessons/philidor',
      platform: 'chess.com',
      description: 'Beginner-friendly guide to the Philidor'
    },
    {
      title: 'Philidor Study - Lichess',
      url: 'https://lichess.org/study/philidor',
      platform: 'lichess.org',
      description: 'Interactive lessons for beginners'
    },
    {
      title: 'Common Philidor Patterns',
      url: 'https://lichess.org/study/philidor-patterns',
      platform: 'lichess.org',
      description: 'Essential tactical and strategic patterns'
    }
  ],
  variations: [
    {
      name: 'Classical Defense',
      moves: '1.e4 e5 2.Nf3 d6 3.d4 exd4 4.Nxd4 Nf6',
      description: 'The main line of the Philidor, focusing on solid development.',
      keyIdeas: [
        'Solid pawn structure',
        'Careful development',
        'Central control',
        'Patient counterplay'
      ]
    },
    {
      name: 'Hanham Variation',
      moves: '1.e4 e5 2.Nf3 d6 3.d4 Nd7',
      description: 'A flexible setup that avoids immediate central tension.',
      keyIdeas: [
        'Flexible development',
        'Delayed central tension',
        'Kingside safety',
        'Counter-attacking chances'
      ]
    },
    {
      name: 'Lion Variation',
      moves: '1.e4 e5 2.Nf3 d6 3.d4 Nf6 4.Nc3 Nbd7',
      description: 'A modern interpretation with more dynamic possibilities.',
      keyIdeas: [
        'Dynamic piece play',
        'Multiple pawn breaks',
        'Active defense',
        'Tactical opportunities'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 2,
  recommendedFor: ['Beginner'],
  relatedTopics: [
    'basic-opening-principles',
    'piece-development',
    'pawn-structures',
    'defensive-techniques'
  ],
  eco: 'C41'
} 