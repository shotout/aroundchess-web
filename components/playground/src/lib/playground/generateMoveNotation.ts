export const generateMoveNotation = (
  piece: string,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  capturedPiece: string | null,
  isCheck: boolean
): string => {
  if (piece.toUpperCase() === 'K' && Math.abs(toCol - fromCol) === 2) {
    return `${toCol > fromCol ? 'O-O' : 'O-O-O'}${isCheck ? '+' : ''}`;
  }

  const pieceSymbols: { [key: string]: string } = {
    K: 'K', Q: 'Q', R: 'R', B: 'B', N: 'N', P: ''
  };
  
  const files = 'abcdefgh';
  const ranks = '87654321';
  
  const pieceSymbol = pieceSymbols[piece.toUpperCase()];
  const toSquare = `${files[toCol]}${ranks[toRow]}`;
  const capture = capturedPiece ? 'x' : '';
  const check = isCheck ? '+' : '';
  
  return `${pieceSymbol}${capture}${toSquare}${check}`;
}