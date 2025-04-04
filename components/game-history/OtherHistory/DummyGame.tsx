// src/data/dummyGames.ts

import { Game } from "../Dialog/DialogStore";

export const dummyOtherGames: Game[] = [
  {
    id: "og-1",
    date: "2024-03-20",
    timeControl: "10+0",
    result: "WIN",
    opponent: "FritzEngine",
    rating: "1850",
    eloChange: "(+15 ELO Rating)",
    moves: "42",
    opening: "Sicilian Defense",
    source: "Lichess",
    color: "White",
    gameFormat: "Lichess",
    pgn: '[Event "Casual Game"]\n[Site "Lichess"]\n[Date "2024.03.20"]\n[Result "1-0"]\n[White "User"]\n[Black "FritzEngine"]\n[TimeControl "10+0"]\n1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6',
    gameType: "standard",
  },
];
