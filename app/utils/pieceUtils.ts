export type PieceType =
  | 'p'
  | 'n'
  | 'b'
  | 'r'
  | 'q'
  | 'k'
  | 'P'
  | 'N'
  | 'B'
  | 'R'
  | 'Q'
  | 'K'

export type Piece = `${'w' | 'b'}${PieceType}`

const pieceNames: { [key in PieceType]: string } = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King',
  P: 'Pawn',
  N: 'Knight',
  B: 'Bishop',
  R: 'Rook',
  Q: 'Queen',
  K: 'King',
}

export const pieceValues: { [key in PieceType]: number } = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
  P: 1,
  N: 3,
  B: 3,
  R: 5,
  Q: 9,
  K: 0,
}

export const getPieceName = (pieceType: PieceType): string =>
  pieceNames[pieceType]

export const getPieceValue = (pieceType: PieceType): number =>
  pieceValues[pieceType]
