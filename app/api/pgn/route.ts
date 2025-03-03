import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const jsonData = {
      "success": true,
      "message": "Analysis completed successfully",
      "data": {
        "gameInfo": {
          "event": "Chess.com Game",
          "date": "2025-02-27",
          "round": "1",
          "time": "09:30:04",
          "isPlayerWhite": false,
          "whiteWin": true,
          "blackWin": false,
          "draw": false,
          "pgn": "[Event \"Live Chess\"]\n[Site \"Chess.com\"]\n[Date \"2022.04.05\"]\n[Round \"-\"]\n[White \"mango_mustang\"]\n[Black \"cslama\"]\n[Result \"1-0\"]\n[CurrentPosition \"1r2Q2k/1p4pp/2p2p2/3n4/3q3P/6P1/4R1K1/8 b - -\"]\n[Timezone \"UTC\"]\n[ECO \"A00\"]\n[ECOUrl \"https://www.chess.com/openings/Mieses-Opening-Reversed-Rat-Variation\"]\n[UTCDate \"2022.04.05\"]\n[UTCTime \"08:53:56\"]\n[WhiteElo \"1061\"]\n[BlackElo \"982\"]\n[TimeControl \"600\"]\n[Termination \"mango_mustang won by resignation\"]\n[StartTime \"08:53:56\"]\n[EndDate \"2022.04.05\"]\n[EndTime \"09:08:12\"]\n[Link \"https://www.chess.com/game/live/42887940383\"]\n\n1. d3 {[%clk 0:09:59.9]} 1... e5 {[%clk 0:09:57.9]} 2. Bd2 {[%clk 0:09:59.8]} 2... d5 {[%clk 0:09:56.7]} 3. e3 {[%clk 0:09:57.2]} 3... Nc6 {[%clk 0:09:49.3]} 4. Nf3 {[%clk 0:09:41.1]} 4... Bg4 {[%clk 0:09:38.7]} 5. Be2 {[%clk 0:09:38.3]} 5... Bb4 {[%clk 0:09:13]} 6. c3 {[%clk 0:09:34.2]} 6... Ba5 {[%clk 0:09:10.9]} 7. b4 {[%clk 0:09:31.4]} 7... Bb6 {[%clk 0:09:06.4]} 8. b5 {[%clk 0:09:25.9]} 8... Na5 {[%clk 0:08:54.5]} 9. Nxe5 {[%clk 0:09:20.7]} 9... Bxe2 {[%clk 0:08:47.2]} 10. Qxe2 {[%clk 0:09:18.2]} 10... f6 {[%clk 0:08:41.9]} 11. Nf3 {[%clk 0:09:08.6]} 11... Ne7 {[%clk 0:08:35]} 12. c4 {[%clk 0:09:06.4]} 12... dxc4 {[%clk 0:08:27.9]} 13. dxc4 {[%clk 0:09:00.2]} 13... O-O {[%clk 0:08:19.2]} 14. O-O {[%clk 0:08:51.3]} 14... a6 {[%clk 0:08:09.4]} 15. Nc3 {[%clk 0:08:41.3]} 15... c6 {[%clk 0:07:31.6]} 16. Na4 {[%clk 0:08:28.2]} 16... Ba7 {[%clk 0:07:13.4]} 17. Bxa5 {[%clk 0:08:22.2]} 17... Qxa5 {[%clk 0:07:11.5]} 18. Qc2 {[%clk 0:08:01.4]} 18... axb5 {[%clk 0:07:01.3]} 19. cxb5 {[%clk 0:07:55.1]} 19... Qxb5 {[%clk 0:06:54]} 20. Rab1 {[%clk 0:07:46.1]} 20... Qa6 {[%clk 0:06:36.3]} 21. Nc5 {[%clk 0:07:41.7]} 21... Bxc5 {[%clk 0:06:25.3]} 22. Qxc5 {[%clk 0:07:39.8]} 22... Nd5 {[%clk 0:06:16.2]} 23. Nd4 {[%clk 0:07:25.4]} 23... Rab8 {[%clk 0:05:50.1]} 24. Ne6 {[%clk 0:07:19]} 24... Rfe8 {[%clk 0:05:34.4]} 25. Nc7 {[%clk 0:07:18.9]} 25... Nxc7 {[%clk 0:05:22.3]} 26. Rfd1 {[%clk 0:07:03.8]} 26... Nd5 {[%clk 0:05:17.7]} 27. g3 {[%clk 0:06:56.8]} 27... Qxa2 {[%clk 0:05:08.2]} 28. Qd6 {[%clk 0:06:41.8]} 28... Qc4 {[%clk 0:04:41.8]} 29. Rbc1 {[%clk 0:06:29.5]} 29... Qe4 {[%clk 0:04:28.3]} 30. Rd4 {[%clk 0:06:23.9]} 30... Qf3 {[%clk 0:04:17.4]} 31. h4 {[%clk 0:06:10]} 31... Rxe3 {[%clk 0:04:01.8]} 32. fxe3 {[%clk 0:06:05.3]} 32... Qxe3+ {[%clk 0:03:59.9]} 33. Kg2 {[%clk 0:05:54.3]} 33... Qxd4 {[%clk 0:03:56.8]} 34. Qe6+ {[%clk 0:05:51.4]} 34... Kh8 {[%clk 0:03:47]} 35. Re1 {[%clk 0:05:48.2]} 35... Qd2+ {[%clk 0:03:26.5]} 36. Re2 {[%clk 0:05:42.1]} 36... Qd4 {[%clk 0:02:47.3]} 37. Qe8+ {[%clk 0:05:31.9]} 1-0",
          "openings": {
            "white": {
              "eco": "A00",
              "name": "Mieses Opening",
              "moves": "1. d3"
            },
            "black": {
              "eco": "A00",
              "name": "Mieses Opening: Reversed Rat",
              "moves": "1. d3 e5"
            }
          }
        },
        "summary": {
          "whiteSide": {
            "profileInfo": {
              "photo": "https://images.chesscomfiles.com/uploads/v1/user/167142863.42f42621.200x200o.0452dad2500f.jpeg",
              "username": "mango_mustang",
              "gameRating": 1061
            },
            "analysis": {
              "accuracy": 59.5,
              "moveQuality": {
                "brilliant": 19,
                "great": 2,
                "best": 1,
                "mistake": 2,
                "miss": 2,
                "blunder": 10
              }
            }
          },
          "blackSide": {
            "profileInfo": {
              "photo": "https://www.chess.com/bundles/web/images/user-image.007dad08.svg",
              "username": "cslama",
              "gameRating": 982
            },
            "analysis": {
              "accuracy": 47.2,
              "moveQuality": {
                "brilliant": 14,
                "great": 1,
                "best": 2,
                "mistake": 1,
                "miss": 8,
                "blunder": 7
              }
            }
          }
        }
      }
    };
    
    // Return the complete jsonData structure
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error processing chess data:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to process chess data',
        error: error.message 
      },
      { status: 500 }
    );
  }
}