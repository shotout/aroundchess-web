import { NextResponse } from 'next/server';

export async function GET() {
  const pgn = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2020.08.23"]
[Round "?"]
[White "Yohaneyon"]
[Black "signiorytokhanaga"]
[Result "1-0"]
[TimeControl "600"]
[WhiteElo "1426"]
[BlackElo "397"]
[Termination "Yohaneyon won on time"]
[ECO "C42"]
[EndTime "16:09:04 GMT+0000"]
[Link "https://www.chess.com/game/live/5339424178?move=0"]

1. e4 e5 2. Nc3 Nf6 3. Nf3 d6 4. d4 Bg4 5. Bg5 h6 6. Bxf6 gxf6 7. dxe5 fxe5 8.
Nd5 Bg7 9. h3 Bxf3 10. Qxf3 Rf8 11. Bb5+ c6 12. Bxc6+ bxc6 13. Nc3 Qa5 14. O-O
c5 15. a4 a6 16. Nd5 Nc6 17. Ra3 Nd4 18. Qd1 Nb5 19. Rg3 Qxa4 20. Rxg7 Qxe4 21.
Re1 Qh4 22. Qf3 Ra7 23. Qf5 Qd8 24. f4 Nd4 25. Qh5 Ne6 26. Rh7 Qa5 27. Rf1 c4
28. Nf6+ Ke7 29. Ng8+ Rxg8 30. Qxf7+ Kd8 31. Qxg8+ 1-0`;
  
  return NextResponse.json({ pgn });
}