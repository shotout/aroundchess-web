import { BookOpen, CheckCircle, Clock, Loader2 } from "lucide-react";
import { getResultData } from "../hooks/useGameData";
import { useTutorial } from "@/components/TutorialProvider";
import { useEffect } from "react";
import { usePgnStore } from "@/app/store/zustandStore";

const dummyAnalysis = [
  {
    id: "99202c8b-da32-4ede-b5d6-707c5993cc06",
    userId: "dbe87b71-e053-472a-922e-891d71a54c77",
    username: "Oliluk",
    pgn: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2025.10.14"]\n[Round "-"]\n[White "Oliluk"]\n[Black "TenderCandy"]\n[Result "1-0"]\n[CurrentPosition "1r6/NPP2kpp/8/P2b1p2/4p3/B2rP1P1/5PBP/R3K1NR b KQ - 0 26"]\n[Timezone "UTC"]\n[ECO "A00"]\n[ECOUrl "https://www.chess.com/openings/Van-t-Kruijs-Opening-1...d5"]\n[UTCDate "2025.10.14"]\n[UTCTime "15:58:41"]\n[WhiteElo "444"]\n[BlackElo "355"]\n[TimeControl "600"]\n[Termination "Oliluk won by resignation"]\n[StartTime "15:58:41"]\n[EndDate "2025.10.14"]\n[EndTime "16:08:06"]\n[Link "https://www.chess.com/game/live/144287540052"]\n\n1. e3 {[%clk 0:10:00]} 1... d5 {[%clk 0:10:00]} 2. c3 {[%clk 0:09:58.4]} 2... e5 {[%clk 0:09:58.6]} 3. a3 {[%clk 0:09:50.3]} 3... e4 {[%clk 0:09:58.1]} 4. g3 {[%clk 0:09:48.8]} 4... f5 {[%clk 0:09:54.9]} 5. Bg2 {[%clk 0:09:48]} 5... Nf6 {[%clk 0:09:52.3]} 6. b4 {[%clk 0:09:39.3]} 6... Be6 {[%clk 0:09:49.1]} 7. Qe2 {[%clk 0:09:23.5]} 7... Bd6 {[%clk 0:09:43]} 8. Qb5+ {[%clk 0:09:15.4]} 8... c6 {[%clk 0:09:40.5]} 9. Qxb7 {[%clk 0:09:10.3]} 9... Nbd7 {[%clk 0:09:25]} 10. b5 {[%clk 0:08:45.8]} 10... Nc5 {[%clk 0:08:47.9]} 11. Qxc6+ {[%clk 0:08:25]} 11... Ke7 {[%clk 0:08:20]} 12. d4 {[%clk 0:08:12.5]} 12... Rb8 {[%clk 0:08:11]} 13. dxc5 {[%clk 0:08:03.4]} 13... Bd7 {[%clk 0:08:09.4]} 14. Qxd6+ {[%clk 0:07:58.4]} 14... Kf7 {[%clk 0:07:55.2]} 15. a4 {[%clk 0:07:35.1]} 15... Ne8 {[%clk 0:07:45.3]} 16. Qxd5+ {[%clk 0:07:23.4]} 16... Be6 {[%clk 0:07:38]} 17. Qxd8 {[%clk 0:07:11.2]} 17... Rxd8 {[%clk 0:07:37.4]} 18. a5 {[%clk 0:07:04.6]} 18... Rd5 {[%clk 0:07:19]} 19. Ba3 {[%clk 0:06:41.3]} 19... Nc7 {[%clk 0:07:13.8]} 20. b6 {[%clk 0:06:37.8]} 20... Nb5 {[%clk 0:07:12.7]} 21. b7 {[%clk 0:06:26.6]} 21... Nxc3 {[%clk 0:07:05.8]} 22. Nxc3 {[%clk 0:06:19.6]} 22... Rd3 {[%clk 0:06:57.1]} 23. Nb5 {[%clk 0:06:03.8]} 23... Bc4 {[%clk 0:06:35.7]} 24. Nxa7 {[%clk 0:05:56.5]} 24... Rb8 {[%clk 0:06:02.3]} 25. c6 {[%clk 0:05:40.2]} 25... Bd5 {[%clk 0:05:51.3]} 26. c7 {[%clk 0:05:33]} 1-0\n',
    date: "2025-02-13",
    time_control: "10 + 0",
    result: "WIN",
    opponent: "Guest1234",
    rating: 1950,
    elo_change: +12,
    moves: 45,
    opening_eco: "A00",
    opening_name: "Sicilian Defense",
    opening_moves: "1. e3",
    source: "Chess.com",
    archive_url: "https://api.chess.com/pub/player/oliluk/games/2025/10",
    color: "White",
    remaining_time: 333,
    time_class: "rapid",
    rated: true,
    termination: "Oliluk won by resignation",
    accuracies_white: null,
    accuracies_black: null,
    end_time: 1760458086,
    is_analysis: false,
    has_viewed_analysis: false,
    createdAt: "2025-10-14T23:19:18.566Z",
    updatedAt: "2025-10-15T03:42:36.257Z",
  },
];
const DESKTOP_GRID_TEMPLATE = "0.5fr 1.5fr 1fr 1fr 2fr 1fr 1fr 1fr 2fr 1fr 2fr";

export const DummyList = () => {
  const { stepFocused, startTutorial, isTutorialPlay, dataTutorial } =
    useTutorial();
  useEffect(() => {
    if (stepFocused > 6 && isTutorialPlay) {
      startTutorial();
    }
    console.log("DummyList stepFocused", stepFocused);
  }, [stepFocused]);

  const displayTimeControl = (tc: string) => {
    if (!tc.trim()) {
      return (
        <span className="text-gray-400 italic flex items-center">
          <Clock className="h-3 w-3 mr-1" /> N/A
        </span>
      );
    }
    return tc;
  };

  const displayOpening = (op: string) => {
    if (!op || op.toLowerCase().includes("unknown")) {
      return (
        <span className="text-gray-400 italic flex items-center">
          <BookOpen className="h-3 w-3 mr-1" /> Not Available
        </span>
      );
    }
    return op;
  };

  const displayMoves = (moves: number | string) => {
    if (!moves || moves === "N/A") {
      return "N/A";
    }

    const numMoves = typeof moves === "string" ? parseInt(moves) : moves;

    return numMoves;
  };
  if (window.innerWidth < 1024) return null;
  if (stepFocused == 3) {
    return (
      <div>
        <div className="" data-tutorial="4">
          {dummyAnalysis.map((game, idx) => {
            const isNew = !game.has_viewed_analysis && !game.is_analysis;
            const indexInPage = idx + 1;
            return (
              <div
                key={game.id}
                className={`grid relative transition-colors duration-150 ${
                  isNew ? "bg-[#FFF6DB]" : "bg-[#FFF6DB]"
                }`}
                style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
              >
                <div className="flex items-center px-2 py-3 border-r border-gray-200">
                  {/* {isNew && (
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                  )} */}
                  <span className="w-6 text-center text-gray-500">
                    {indexInPage}
                  </span>
                </div>

                <div className="flex items-center px-4 py-3">{game.date}</div>

                <div className="flex items-center px-2 py-3">
                  {displayTimeControl(game.time_control)}
                </div>

                <div className="flex items-center px-2 py-3">
                  {(() => {
                    const r = getResultData(game.result);
                    return <span className={r.className}>{r.text}</span>;
                  })()}
                </div>

                <div className="flex items-center px-4 py-3 truncate">
                  {game.opponent || "Unknown Player"}
                </div>

                <div className="flex items-center px-2 py-3">
                  {game.rating || "N/A"}
                </div>

                <div className="flex items-center px-2 py-3 truncate">
                  {game.time_class || "Unknown Game Type"}
                </div>

                <div className="flex items-center px-2 py-3">
                  {displayMoves(game.moves)}
                </div>

                <div className="flex items-center px-4 py-3">
                  {displayOpening(game.opening_name || "N/A")}
                </div>

                <div className="flex items-center px-2 py-3">
                  {game.source || "Unknown"}
                </div>

                <div className="px-4 py-3">
                  {(() => {
                    return (
                      <button
                        className={`h-8 w-full rounded-3xl text-xs text-white flex justify-center items-center transition-colors duration-150 ${
                          !game.is_analysis
                            ? "border border-white bg-gradient-to-b from-[#EEC602] to-[#EE9402] hover:[#EE9402] hover:to-[#EE9402] text-white shadow-sm ring-1 ring-yellow-200"
                            : "border border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200"
                        } `}
                        disabled={true}
                      >
                        {!game.is_analysis ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {!game.is_analysis ? "40%" : "View Result"}
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
        {dataTutorial?.dataHistory.map((game: any, idx: number) => {
          const isNew = !game.has_viewed_analysis && !game.is_analysis;
          const indexInPage = idx + 1;
          return (
            <div
              key={game.id + Math.random()}
              className={`grid relative transition-colors duration-150 ${
                isNew
                  ? "bg-[#FFF6DB]"
                  : "even:bg-blue-50 odd:bg-white hover:bg-blue-50"
              }`}
              style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
            >
              <div className="flex items-center px-2 py-3 border-r border-gray-200">
                {/* {isNew && (
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                  )} */}
                <span className="w-6 text-center text-gray-500">
                  {indexInPage + 1}
                </span>
              </div>

              <div className="flex items-center px-4 py-3">{game.date}</div>

              <div className="flex items-center px-2 py-3">
                {displayTimeControl(game.time_control)}
              </div>

              <div className="flex items-center px-2 py-3">
                {(() => {
                  const r = getResultData(game.result);
                  return <span className={r.className}>{r.text}</span>;
                })()}
              </div>

              <div className="flex items-center px-4 py-3 truncate">
                {game.opponent || "Unknown Player"}
              </div>

              <div className="flex items-center px-2 py-3">
                {game.rating || "N/A"}
              </div>

              <div className="flex items-center px-2 py-3 truncate">
                {game.time_class || "Unknown Game Type"}
              </div>

              <div className="flex items-center px-2 py-3">
                {displayMoves(game.moves)}
              </div>

              <div className="flex items-center px-4 py-3">
                {displayOpening(game.opening_name || "N/A")}
              </div>

              <div className="flex items-center px-2 py-3">
                {game.source || "Unknown"}
              </div>

              <div className="px-4 py-3">
                {(() => {
                  return (
                    <button
                      className={`h-8 w-full rounded-3xl text-xs text-white flex justify-center items-center transition-colors duration-150 ${
                        !game.is_analysis
                          ? "border border-white bg-gradient-to-b from-[#EEC602] to-[#EE9402] hover:[#EE9402] hover:to-[#EE9402] text-white shadow-sm ring-1 ring-yellow-200"
                          : "border border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200"
                      } `}
                      disabled={true}
                    >
                      {!game.is_analysis ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      {!game.is_analysis ? "In Progress 40%" : "View Result"}
                    </button>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div>
        <div className="">
          {dummyAnalysis.map((game, idx) => {
            const isNew = !game.has_viewed_analysis && game.is_analysis;
            const indexInPage = idx + 1;
            return (
              <div
                key={game.id}
                className={`grid relative transition-colors duration-150 ${
                  isNew ? "bg-[#FFF6DB]" : "bg-[#FFF6DB]"
                }`}
                style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
              >
                <div className="flex items-center px-2 py-3 border-r border-gray-200">
                  {/* {isNew && (
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                  )} */}
                  <span className="w-6 text-center text-gray-500">
                    {indexInPage}
                  </span>
                </div>

                <div className="flex items-center px-4 py-3">{game.date}</div>

                <div className="flex items-center px-2 py-3">
                  {displayTimeControl(game.time_control)}
                </div>

                <div className="flex items-center px-2 py-3">
                  {(() => {
                    const r = getResultData(game.result);
                    return <span className={r.className}>{r.text}</span>;
                  })()}
                </div>

                <div className="flex items-center px-4 py-3 truncate">
                  {game.opponent || "Unknown Player"}
                </div>

                <div className="flex items-center px-2 py-3">
                  {game.rating || "N/A"}
                </div>

                <div className="flex items-center px-2 py-3 truncate">
                  {game.time_class || "Unknown Game Type"}
                </div>

                <div className="flex items-center px-2 py-3">
                  {displayMoves(game.moves)}
                </div>

                <div className="flex items-center px-4 py-3">
                  {displayOpening(game.opening_name || "N/A")}
                </div>

                <div className="flex items-center px-2 py-3">
                  {game.source || "Unknown"}
                </div>

                <div className="px-4 py-3" data-tutorial="6">
                  {(() => {
                    return (
                      <button
                        className={`h-8 w-full rounded-3xl text-xs text-white flex justify-center items-center transition-colors duration-150 ${
                          !game.is_analysis
                            ? "border border-white bg-gradient-to-b from-[#EEC602] to-[#EE9402] hover:[#EE9402] hover:to-[#EE9402] text-white shadow-sm ring-1 ring-yellow-200"
                            : "border border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200"
                        } `}
                        disabled={true}
                      >
                        {game.is_analysis ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {game.is_analysis ? "In Progress 40%" : "View Result"}
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
        {dataTutorial?.dataHistory.map((game: any, idx: number) => {
          const isNew = !game.has_viewed_analysis && !game.is_analysis;
          const indexInPage = idx + 1;
          return (
            <div
              key={game.id + Math.random()}
              className={`grid relative transition-colors duration-150 ${
                isNew
                  ? "bg-[#FFF6DB]"
                  : "even:bg-blue-50 odd:bg-white hover:bg-blue-50"
              }`}
              style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
            >
              <div className="flex items-center px-2 py-3 border-r border-gray-200">
                {/* {isNew && (
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                  )} */}
                <span className="w-6 text-center text-gray-500">
                  {indexInPage + 1}
                </span>
              </div>

              <div className="flex items-center px-4 py-3">{game.date}</div>

              <div className="flex items-center px-2 py-3">
                {displayTimeControl(game.time_control)}
              </div>

              <div className="flex items-center px-2 py-3">
                {(() => {
                  const r = getResultData(game.result);
                  return <span className={r.className}>{r.text}</span>;
                })()}
              </div>

              <div className="flex items-center px-4 py-3 truncate">
                {game.opponent || "Unknown Player"}
              </div>

              <div className="flex items-center px-2 py-3">
                {game.rating || "N/A"}
              </div>

              <div className="flex items-center px-2 py-3 truncate">
                {game.time_class || "Unknown Game Type"}
              </div>

              <div className="flex items-center px-2 py-3">
                {displayMoves(game.moves)}
              </div>

              <div className="flex items-center px-4 py-3">
                {displayOpening(game.opening_name || "N/A")}
              </div>

              <div className="flex items-center px-2 py-3">
                {game.source || "Unknown"}
              </div>

              <div className="px-4 py-3">
                {(() => {
                  return (
                    <button
                      className={`h-8 w-full rounded-3xl text-xs text-white flex justify-center items-center transition-colors duration-150 ${
                        !game.is_analysis
                          ? "border border-[#FFE057] bg-gradient-to-t from-[#EEC602] to-[#EE9402] hover:[#EE9402] hover:to-[#EE9402] text-white shadow-sm ring-1 ring-yellow-200"
                          : "border border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200"
                      } `}
                      disabled={true}
                    >
                      {!game.is_analysis ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      {!game.is_analysis ? "In Progress 40%" : "View Result"}
                    </button>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};
