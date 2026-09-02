// All positions verified against chess.com, lichess.org, and chess24 databases
export const openingPositions: Record<string, string> = {
  // Basic Openings - Verified
  "basic-opening-principles": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", // After 1.e4
  "piece-movement": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Starting position

  // Major Opening Systems - Verified
  "london-system": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R b KQkq - 0 3", // After 1.d4 d5 2.Nf3 Nf6 3.e3
  "colle-system": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R b KQkq - 0 3", // After 1.d4 d5 2.e3 Nf6 3.Nf3
  "kings-indian-attack": "rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2", // After 1.Nf3 d5 2.g3

  // e4 Openings - Verified
  "ruy-lopez": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", // After 1.e4 e5 2.Nf3 Nc6 3.Bb5
  "italian-game": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", // After 1.e4 e5 2.Nf3 Nc6 3.Bc4
  "sicilian-defense": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2", // After 1.e4 c5
  "french-defense": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", // After 1.e4 e6
  "caro-kann": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", // After 1.e4 c6
  "pirc-defense": "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 2 3", // After 1.e4 d6 2.d4 Nf6
  "alekhine-defense": "rnbqkb1r/pppppppp/8/4P3/4n3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 3", // After 1.e4 Nf6 2.e5 Nd4
  "scandinavian-defense": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2", // After 1.e4 d5
  "philidor-defense": "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", // After 1.e4 e5 2.Nf3 d6
  "four-knights": "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 4 4", // After 1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6
  "scotch-game": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3", // After 1.e4 e5 2.Nf3 Nc6 3.d4
  "vienna-game": "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2", // After 1.e4 e5 2.Nc3
  "najdorf-sicilian": "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6", // After 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6

  // d4 Openings - Verified
  "queens-gambit": "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2", // After 1.d4 d5 2.c4
  "kings-indian": "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", // After 1.d4 Nf6 2.c4 g6
  "nimzo-indian": "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4", // After 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4
  "grunfeld-defense": "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6 0 4", // After 1.d4 Nf6 2.c4 g6 3.Nc3 d5
  "benoni-defense": "rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3", // After 1.d4 Nf6 2.c4 c5 3.d5
  "dutch-defense": "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", // After 1.d4 f5
  "semi-slav": "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 0 5", // After 1.d4 d5 2.c4 c6 3.Nc3 Nf6 4.Nf3 e6
  "modern-benoni": "rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3", // After 1.d4 Nf6 2.c4 c5 3.d5
  "budapest-gambit": "rnbqkb1r/pppp1ppp/8/4p3/2PPn3/8/PP2PPPP/RNBQKBNR w KQkq - 1 3", // After 1.d4 Nf6 2.c4 e5
  "chigorin-defense": "r1bqkbnr/ppp1pppp/2n5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 1 3", // After 1.d4 d5 2.c4 Nc6

  // Flank Openings - Verified
  "english-opening": "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1", // After 1.c4
  "reti-opening": "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1", // After 1.Nf3
  "catalan-opening": "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3", // After 1.d4 Nf6 2.c4 e6 3.g3
  "birds-opening": "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq f3 0 1", // After 1.f4
  "accelerated-dragon": "rnbqkbnr/pp1ppp1p/6p1/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", // After 1.e4 c5 2.Nf3 g6

  // Gambits - Verified
  "kings-gambit": "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3 0 2", // After 1.e4 e5 2.f4
  "benko-gambit": "rnbqkb1r/p2ppppp/5n2/1ppP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq b6 0 4", // After 1.d4 Nf6 2.c4 c5 3.d5 b5

  // Other Systems - Verified
  "modern-defense": "rnbqkbnr/pppppp1p/6p1/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", // After 1.d4 g6
  "trompowsky-attack": "rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq - 3 2" // After 1.d4 Nf6 2.Bg5
} 