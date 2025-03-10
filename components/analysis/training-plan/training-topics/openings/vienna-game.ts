import { OpeningTopic } from '../types'

export const viennaGame: OpeningTopic = {
  id: 'vienna-game',
  title: 'Vienna Game',
  description: 'The Vienna Game is a flexible opening that begins with 1.e4 e5 2.Nc3. It can lead to both tactical and positional play, offering White various attacking opportunities.',
  difficulty: 'Intermediate',
  estimatedTime: '20 hours',
  prerequisites: [
    'basic-opening-principles',
    'tactical-patterns',
    'attacking-the-king'
  ],
  objectives: [
    'Master Vienna Game principles',
    'Learn tactical patterns',
    'Understand piece coordination',
    'Create attacking plans',
    'Handle different responses'
  ],
  resources: [
    {
      title: 'Vienna Game Guide - Chess.com',
      url: 'https://www.chess.com/lessons/vienna-game',
      platform: 'chess.com',
      description: 'Complete guide to the Vienna Game'
    },
    {
      title: 'Vienna Game Study - Lichess',
      url: 'https://lichess.org/study/vienna-game',
      platform: 'lichess.org',
      description: 'Interactive lessons on Vienna Game'
    },
    {
      title: 'Vienna Game Tactics',
      url: 'https://lichess.org/study/vienna-tactics',
      platform: 'lichess.org',
      description: 'Tactical themes in the Vienna'
    }
  ],
  variations: [
    {
      name: 'Vienna Gambit',
      moves: '1.e4 e5 2.Nc3 Nf6 3.f4',
      description: 'An aggressive variation offering a pawn for rapid development and attacking chances.',
      keyIdeas: [
        'Kingside attack',
        'Pawn storm possibilities',
        'Quick development',
        'Active piece play'
      ]
    },
    {
      name: 'Max Lange Defense',
      moves: '1.e4 e5 2.Nc3 Nf6 3.Bc4',
      description: 'A solid approach focusing on development and central control.',
      keyIdeas: [
        'Piece development',
        'Central control',
        'Bishop activity',
        'Flexible plans'
      ]
    },
    {
      name: 'Steinitz Variation',
      moves: '1.e4 e5 2.Nc3 Nc6 3.g3',
      description: 'A more positional approach with fianchetto development.',
      keyIdeas: [
        'Kingside fianchetto',
        'Flexible pawn structure',
        'Long-term pressure',
        'Strategic play'
      ]
    }
  ],
  forColor: 'white',
  popularityLevel: 3,
  recommendedFor: ['Intermediate'],
  relatedTopics: [
    'kings-gambit',
    'attacking-patterns',
    'piece-coordination',
    'tactical-combinations'
  ],
  eco: 'C25-C29'
} 