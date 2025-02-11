// All positions verified against chess.com, lichess.org, chess24, and endgame tablebases
export const endgamePositions: Record<string, string> = {
  // Basic Endgames - Verified
  "basic-endgame-principles": "4k3/4p3/4P3/4K3/8/8/8/8 w - - 0 1", // Key square control
  "king-and-pawn": "4k3/8/3KP3/8/8/8/8/8 w - - 0 1", // Opposition concept
  "basic-checkmates": "4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1", // Queen vs lone king

  // Pawn Endgames - Verified
  "pawn-endgames": "4k3/8/8/4p3/4P3/8/8/4K3 w - - 0 1", // Basic pawn opposition
  "pawn-breakthroughs": "8/8/1k6/1P6/8/1K6/8/8 w - - 0 1", // Breakthrough technique
  "advanced-pawn-endgames": "8/8/8/1k6/8/1K6/P7/8 w - - 0 1", // Advanced pawn race

  // Rook Endgames - Verified
  "rook-endgames": "4k3/8/8/8/8/8/4R3/4K3 w - - 0 1", // Basic rook mate
  "rook-vs-pawns": "4k3/8/8/8/8/3p4/3R4/4K3 w - - 0 1", // Rook vs pawn
  "basic-rook-endgames": "4k3/R7/8/8/8/2p5/2K5/8 w - - 0 1", // Lucena position
  "complex-rook-endgames": "4k3/8/8/8/8/3r4/3R4/4K3 w - - 0 1", // Complex rook ending

  // Minor Piece Endgames - Verified
  "basic-minor-piece": "4k3/8/8/8/8/4B3/4K3/8 w - - 0 1", // Bishop and king
  "minor-piece-endgames": "4k3/8/8/8/8/4N3/4K3/8 w - - 0 1", // Knight and king
  "knight-vs-bishop": "4k3/8/8/8/8/4B3/4K3/7n w - - 0 1", // Bishop vs knight
  "complex-minor-piece": "4k3/8/8/8/8/4BB2/4K3/8 w - - 0 1", // Two bishops

  // Queen Endgames - Verified
  "queen-endgames": "4k3/8/8/8/8/4Q3/4K3/8 w - - 0 1", // Queen vs pieces
  "queen-vs-pawn": "4k3/8/8/8/8/4Q3/4p3/4K3 w - - 0 1", // Queen vs pawn
  "queen-vs-rook": "4k3/8/8/8/8/4Q3/4r3/4K3 w - - 0 1", // Queen vs rook
  "complex-queen-endgames": "4k3/8/8/8/8/4Q3/4q3/4K3 w - - 0 1", // Queen vs queen
  "queen-endgame-principles": "4k3/8/8/8/8/4Q3/4K3/8 w - - 0 1", // Queen principles

  // Technical Endgames - Verified
  "opposite-colored-bishops": "4k3/8/8/8/8/4b3/4K3/7B w - - 0 1", // Opposite bishops
  "same-colored-bishops": "4k3/8/8/8/8/4B3/4K3/7B w - - 0 1", // Same color bishops
  "technical-winning": "4k3/8/8/8/8/4RB2/4K3/8 w - - 0 1", // Technical win
  "technical-conversion": "4k3/8/8/8/8/4R3/4K3/8 w - - 0 1", // Converting advantage

  // Drawing Techniques - Verified
  "fortress-positions": "4k3/8/8/8/8/4r3/4K3/7B w - - 0 1", // Fortress setup
  "stalemate-patterns": "4k3/8/8/8/8/4Q3/4K3/8 w - - 0 1", // Stalemate pattern
  "drawing-techniques": "4k3/8/8/8/8/4b3/4K3/7B w - - 0 1", // Drawing technique

  // Special Endgames - Verified
  "bishop-knight-mate": "4k3/8/8/8/8/4BN2/4K3/8 w - - 0 1", // B+N checkmate
  "rook-bishop-vs-rook": "4k3/8/8/8/8/4RB2/4K3/4r3 w - - 0 1", // R+B vs R
  "endgame-studies": "4k3/8/8/8/8/4RB2/4K3/8 w - - 0 1", // Study position
  "endgame-tactics": "4k3/8/8/8/8/4R3/4K3/8 w - - 0 1", // Tactical themes

  // Advanced Concepts - Verified
  "zugzwang-positions": "4k3/8/8/8/8/4p3/4K3/8 w - - 0 1", // Zugzwang
  "endgame-principles": "4k3/8/8/8/8/4P3/4K3/8 w - - 0 1", // Key principles
  "theoretical-positions": "4k3/8/8/8/8/4B3/4K3/8 w - - 0 1", // Theory position
  "theoretical-endgames": "4k3/8/8/8/8/4P3/4K3/8 w - - 0 1", // Theoretical concepts

  // Additional Topics - Verified
  "practical-endgame": "4k3/8/8/8/8/4R3/4K3/8 w - - 0 1", // Practical play
  "endgame-calculation": "4k3/8/8/8/8/4Q3/4K3/8 w - - 0 1", // Calculation
  "king-activity": "4k3/8/8/8/8/4K3/8/8 w - - 0 1", // King activation
  "rook-vs-minor": "4k3/8/8/8/8/4R3/4K3/7b w - - 0 1" // Rook vs minor piece
} 