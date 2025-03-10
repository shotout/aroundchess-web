import { OpeningTopic } from '../types'

export const kingsIndian: OpeningTopic = {
  id: 'kings-indian',
  title: 'King\'s Indian Defense',
  description: 'The King\'s Indian Defense is a hypermodern opening where Black allows White to establish a broad pawn center while developing pieces for a future counterattack.',
  difficulty: 'Advanced',
  estimatedTime: '35 hours',
  prerequisites: [
    'pawn-structure-fundamentals',
    'piece-coordination',
    'attacking-principles'
  ],
  objectives: [
    'Understand the main strategic ideas in the King\'s Indian',
    'Master typical pawn breaks and piece maneuvers',
    'Learn to handle different pawn structures',
    'Develop attacking skills on the kingside',
    'Handle critical middlegame positions'
  ],
  resources: [
    {
      title: 'King\'s Indian Defense - Chess.com',
      url: 'https://www.chess.com/lessons/learn-the-openings/kings-indian-defense',
      platform: 'chess.com',
      description: 'Complete guide to the King\'s Indian Defense'
    },
    {
      title: 'King\'s Indian Study - Lichess',
      url: 'https://lichess.org/study/kings-indian',
      platform: 'lichess.org',
      description: 'Interactive lessons and practice positions'
    },
    {
      title: 'Classical Variation Masterclass',
      url: 'https://www.chess.com/lessons/kings-indian-classical',
      platform: 'chess.com',
      description: 'Deep dive into the Classical Variation'
    }
  ],
  variations: [
    {
      name: 'Classical Variation',
      moves: '1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 0-0 6.Be2 e5',
      description: 'The main line leading to complex strategic battles with opposite-side attacks.',
      keyIdeas: [
        'Control of the e5 square',
        'Kingside attack with ...f5',
        'Piece coordination for attack',
        'Timing of central breaks'
      ]
    },
    {
      name: 'Sämisch Variation',
      moves: '1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3',
      description: 'A sharp line where White aims to crush Black\'s kingside aspirations.',
      keyIdeas: [
        'Control of e5 square',
        'Kingside expansion',
        'Break with ...c5',
        'Piece activity on the queenside'
      ]
    },
    {
      name: 'Four Pawns Attack',
      moves: '1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f4',
      description: 'An aggressive variation where White establishes a massive pawn center.',
      keyIdeas: [
        'Maximum central control',
        'Early kingside expansion',
        'Dynamic piece play',
        'Sharp tactical positions'
      ]
    },
    {
      name: 'Averbakh Variation',
      moves: '1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Be2 0-0 6.Bg5',
      description: 'A positional approach aiming to control key dark squares.',
      keyIdeas: [
        'Control of dark squares',
        'Prevention of ...e5',
        'Kingside expansion options',
        'Strategic piece placement'
      ]
    }
  ],
  forColor: 'black',
  popularityLevel: 4,
  recommendedFor: ['Intermediate', 'Advanced', 'Expert'],
  relatedTopics: [
    'kings-indian-structures',
    'kingside-attacking',
    'pawn-storms',
    'piece-coordination'
  ],
  eco: 'E60-E99'
} 