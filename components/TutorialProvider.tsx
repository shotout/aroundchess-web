"use client";

import React, {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import tutorials from "../tutorials/steps";
import MinimalTour, { MinimalStep } from "./MinimalTour";

type TutorialContextType = {
  startTutorial: (id?: string) => void;
  stopTutorial: () => void;
  dataTutorial: any;
  gameTutorial: any;
  isTutorialPlay: boolean;
  currentTourId?: string;
  stepFocused: number;
  setStepFocused: (step: any) => void;
  allSteps: any[];
};

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined
);

export const useTutorial = () => {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error("useTutorial must be used within TutorialProvider");
  return ctx;
};

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<MinimalStep[]>([]);
  const [stepFocused, setStepFocused] = useState<number>(0);
  const [gameTutorial, setGameTutorial] = useState<any>({});
  const [currentTourId, setCurrentTourId] = useState<string | undefined>(
    undefined
  );
  const [dataTutorial, setDataTutorial] = useState<any>({
    username: "ChessMaster2000",
    dateSelectedGame: "13/02/2025",
    gameTitle: "ChessMaster2000 (White) vs Guest1234 (Black)",
    bestWinRating: "2,100",
    bestWinEnemy: "IM_ChessMaster",
    winRate: "90",
    winRateThisMonth: "5",
    averageEloRating: "1,850",
    averagePoint: "25",
    totalGames: "1,234",
    totalGamesThisMonth: "45",
    dataHistory: [
      {
        id: "d4c02ecd-7fd2-4aa0-b206-8deb3ef59473",
        userId: "96f24676-c1e8-40f2-b052-0bf0166df14f",
        username: "ainaatub",
        pgn: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2025.10.11"]\n[Round "-"]\n[White "a2thedeep"]\n[Black "ainaatub"]\n[Result "0-1"]\n[CurrentPosition "3k1b1r/p1N1pppp/1p6/7N/5B2/2P2b2/PP2nP1P/R4RK1 w - - 1 17"]\n[Timezone "UTC"]\n[ECO "B01"]\n[ECOUrl "https://www.chess.com/openings/Scandinavian-Defense-Mieses-Kotrc-Variation-3.Nc3-Qe5"]\n[UTCDate "2025.10.11"]\n[UTCTime "14:13:39"]\n[WhiteElo "732"]\n[BlackElo "684"]\n[TimeControl "900+10"]\n[Termination "ainaatub won by checkmate"]\n[StartTime "14:13:39"]\n[EndDate "2025.10.11"]\n[EndTime "14:18:32"]\n[Link "https://www.chess.com/game/live/144167582998"]\n\n1. e4 {[%clk 0:15:09.9]} 1... d5 {[%clk 0:15:06.2]} 2. exd5 {[%clk 0:15:15.1]} 2... Qxd5 {[%clk 0:15:14.7]} 3. Nc3 {[%clk 0:15:24.5]} 3... Qe5+ {[%clk 0:15:21.6]} 4. Nge2 {[%clk 0:15:30.9]} 4... Nf6 {[%clk 0:15:29.4]} 5. d4 {[%clk 0:15:40.1]} 5... Qe6 {[%clk 0:15:34.6]} 6. g4 {[%clk 0:15:37.6]} 6... Qc6 {[%clk 0:15:34.2]} 7. Ng3 {[%clk 0:15:33.1]} 7... Bxg4 {[%clk 0:15:33.1]} 8. Bb5 {[%clk 0:15:26.1]} 8... Qxb5 {[%clk 0:14:58.5]} 9. Nxb5 {[%clk 0:15:23.1]} 9... Bxd1 {[%clk 0:15:05.2]} 10. Nxc7+ {[%clk 0:15:32.9]} 10... Kd8 {[%clk 0:15:05.2]} 11. Nxa8 {[%clk 0:15:41.7]} 11... Bf3 {[%clk 0:15:10.9]} 12. O-O {[%clk 0:15:38.7]} 12... b6 {[%clk 0:15:17.9]} 13. Bf4 {[%clk 0:15:35.7]} 13... Nc6 {[%clk 0:15:15.7]} 14. Nc7 {[%clk 0:15:35.5]} 14... Nh5 {[%clk 0:15:05]} 15. Nxh5 {[%clk 0:15:38]} 15... Nxd4 {[%clk 0:15:08.6]} 16. c3 {[%clk 0:15:24.6]} 16... Ne2# {[%clk 0:15:14.6]} 0-1\n',
        date: "2024-03-20",
        time_control: "10 + 0",
        result: "LOSS",
        opponent: "GrandMaster123",
        rating: 1950,
        elo_change: -8,
        moves: 32,
        opening_eco: "B00",
        opening_name: "Queen's Gambit",
        opening_moves: "1. e4",
        source: "Chess.com",
        archive_url: "https://api.chess.com/pub/player/ainaatub/games/2025/10",
        color: "Black",
        remaining_time: 914,
        time_class: "rapid",
        rated: true,
        termination: "ainaatub won by checkmate",
        accuracies_white: 60.56,
        accuracies_black: 60.56,
        end_time: 1760192312,
        is_analysis: true,
        createdAt: "2025-10-13T02:59:31.810Z",
        updatedAt: "2025-10-20T04:42:15.041Z",
      },

      {
        id: "d4c02ecd-7fd2-4aa0-b206-8deb3ef59473",
        userId: "96f24676-c1e8-40f2-b052-0bf0166df14f",
        username: "ainaatub",
        pgn: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2025.10.11"]\n[Round "-"]\n[White "a2thedeep"]\n[Black "ainaatub"]\n[Result "0-1"]\n[CurrentPosition "3k1b1r/p1N1pppp/1p6/7N/5B2/2P2b2/PP2nP1P/R4RK1 w - - 1 17"]\n[Timezone "UTC"]\n[ECO "B01"]\n[ECOUrl "https://www.chess.com/openings/Scandinavian-Defense-Mieses-Kotrc-Variation-3.Nc3-Qe5"]\n[UTCDate "2025.10.11"]\n[UTCTime "14:13:39"]\n[WhiteElo "732"]\n[BlackElo "684"]\n[TimeControl "900+10"]\n[Termination "ainaatub won by checkmate"]\n[StartTime "14:13:39"]\n[EndDate "2025.10.11"]\n[EndTime "14:18:32"]\n[Link "https://www.chess.com/game/live/144167582998"]\n\n1. e4 {[%clk 0:15:09.9]} 1... d5 {[%clk 0:15:06.2]} 2. exd5 {[%clk 0:15:15.1]} 2... Qxd5 {[%clk 0:15:14.7]} 3. Nc3 {[%clk 0:15:24.5]} 3... Qe5+ {[%clk 0:15:21.6]} 4. Nge2 {[%clk 0:15:30.9]} 4... Nf6 {[%clk 0:15:29.4]} 5. d4 {[%clk 0:15:40.1]} 5... Qe6 {[%clk 0:15:34.6]} 6. g4 {[%clk 0:15:37.6]} 6... Qc6 {[%clk 0:15:34.2]} 7. Ng3 {[%clk 0:15:33.1]} 7... Bxg4 {[%clk 0:15:33.1]} 8. Bb5 {[%clk 0:15:26.1]} 8... Qxb5 {[%clk 0:14:58.5]} 9. Nxb5 {[%clk 0:15:23.1]} 9... Bxd1 {[%clk 0:15:05.2]} 10. Nxc7+ {[%clk 0:15:32.9]} 10... Kd8 {[%clk 0:15:05.2]} 11. Nxa8 {[%clk 0:15:41.7]} 11... Bf3 {[%clk 0:15:10.9]} 12. O-O {[%clk 0:15:38.7]} 12... b6 {[%clk 0:15:17.9]} 13. Bf4 {[%clk 0:15:35.7]} 13... Nc6 {[%clk 0:15:15.7]} 14. Nc7 {[%clk 0:15:35.5]} 14... Nh5 {[%clk 0:15:05]} 15. Nxh5 {[%clk 0:15:38]} 15... Nxd4 {[%clk 0:15:08.6]} 16. c3 {[%clk 0:15:24.6]} 16... Ne2# {[%clk 0:15:14.6]} 0-1\n',
        date: "2024-03-20",
        time_control: "10 + 0",
        result: "WIN",
        opponent: "Guest1234",
        rating: 1950,
        elo_change: +12,
        moves: 45,
        opening_eco: "B00",
        opening_name: "Sicilian Defense",
        opening_moves: "1. e4",
        source: "Chess.com",
        archive_url: "https://api.chess.com/pub/player/ainaatub/games/2025/10",
        color: "Black",
        remaining_time: 914,
        time_class: "rapid",
        rated: true,
        termination: "ainaatub won by checkmate",
        accuracies_white: 60.56,
        accuracies_black: 60.56,
        end_time: 1760192312,
        is_analysis: true,
        createdAt: "2025-10-13T02:59:31.810Z",
        updatedAt: "2025-10-20T04:42:15.041Z",
      },

      {
        id: "d4c02ecd-7fd2-4aa0-b206-8deb3ef59473",
        userId: "96f24676-c1e8-40f2-b052-0bf0166df14f",
        username: "ainaatub",
        pgn: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2025.10.11"]\n[Round "-"]\n[White "a2thedeep"]\n[Black "ainaatub"]\n[Result "0-1"]\n[CurrentPosition "3k1b1r/p1N1pppp/1p6/7N/5B2/2P2b2/PP2nP1P/R4RK1 w - - 1 17"]\n[Timezone "UTC"]\n[ECO "B01"]\n[ECOUrl "https://www.chess.com/openings/Scandinavian-Defense-Mieses-Kotrc-Variation-3.Nc3-Qe5"]\n[UTCDate "2025.10.11"]\n[UTCTime "14:13:39"]\n[WhiteElo "732"]\n[BlackElo "684"]\n[TimeControl "900+10"]\n[Termination "ainaatub won by checkmate"]\n[StartTime "14:13:39"]\n[EndDate "2025.10.11"]\n[EndTime "14:18:32"]\n[Link "https://www.chess.com/game/live/144167582998"]\n\n1. e4 {[%clk 0:15:09.9]} 1... d5 {[%clk 0:15:06.2]} 2. exd5 {[%clk 0:15:15.1]} 2... Qxd5 {[%clk 0:15:14.7]} 3. Nc3 {[%clk 0:15:24.5]} 3... Qe5+ {[%clk 0:15:21.6]} 4. Nge2 {[%clk 0:15:30.9]} 4... Nf6 {[%clk 0:15:29.4]} 5. d4 {[%clk 0:15:40.1]} 5... Qe6 {[%clk 0:15:34.6]} 6. g4 {[%clk 0:15:37.6]} 6... Qc6 {[%clk 0:15:34.2]} 7. Ng3 {[%clk 0:15:33.1]} 7... Bxg4 {[%clk 0:15:33.1]} 8. Bb5 {[%clk 0:15:26.1]} 8... Qxb5 {[%clk 0:14:58.5]} 9. Nxb5 {[%clk 0:15:23.1]} 9... Bxd1 {[%clk 0:15:05.2]} 10. Nxc7+ {[%clk 0:15:32.9]} 10... Kd8 {[%clk 0:15:05.2]} 11. Nxa8 {[%clk 0:15:41.7]} 11... Bf3 {[%clk 0:15:10.9]} 12. O-O {[%clk 0:15:38.7]} 12... b6 {[%clk 0:15:17.9]} 13. Bf4 {[%clk 0:15:35.7]} 13... Nc6 {[%clk 0:15:15.7]} 14. Nc7 {[%clk 0:15:35.5]} 14... Nh5 {[%clk 0:15:05]} 15. Nxh5 {[%clk 0:15:38]} 15... Nxd4 {[%clk 0:15:08.6]} 16. c3 {[%clk 0:15:24.6]} 16... Ne2# {[%clk 0:15:14.6]} 0-1\n',
        date: "2024-03-20",
        time_control: "10 + 0",
        result: "WIN",
        opponent: "Guest1234",
        rating: 1950,
        elo_change: -12,
        moves: 55,
        opening_eco: "B00",
        opening_name: "Sicilian Defense",
        opening_moves: "1. e4",
        source: "Chess.com",
        archive_url: "https://api.chess.com/pub/player/ainaatub/games/2025/10",
        color: "Black",
        remaining_time: 914,
        time_class: "rapid",
        rated: true,
        termination: "ainaatub won by checkmate",
        accuracies_white: 60.56,
        accuracies_black: 60.56,
        end_time: 1760192312,
        is_analysis: true,
        createdAt: "2025-10-13T02:59:31.810Z",
        updatedAt: "2025-10-20T04:42:15.041Z",
      },
    ],
  });

  const allSteps: any[] = [
    {
      target: "[data-tutorial='1']",
      title: "How to start a Game Analysis",
      content: "Select the game that you want to analyze. ",
      placement: "bottom",
      stepText: "1/7",
    },
    {
      target: "[data-tutorial='2']",
      title: "How to start a Game Analysis",
      content:
        "Choose your Analysis Depth. A deeper analysis depth considers more potential moves and will lead to a more sophisticated analysis.",
      placement: "top",
      stepText: "2/7",
    },
    {
      target: "[data-tutorial='3']",
      title: "How to start a Game Analysis",
      content:
        "After choosing your game and analysis depth, click on this button to start the analysis.",
      placement: "top",
      stepText: "3/7",
    },
    {
      target: "[data-tutorial='4']",
      title: "How to start a Game Analysis",
      content:
        "Your game will be analyzed in the background. You can find the game in the “My Game History” tab.",
      placement: "top",
      stepText: "4/7",
    },
    {
      target: "[data-tutorial='5']",
      title: "How to start a Game Analysis",
      content:
        "You can find all of your past analyses and also start new game analyses in the “My Game History” tab.",
      placement: "top",
      stepText: "5/7",
    },
    {
      target: "[data-tutorial='6']",
      title: "How to start a Game Analysis",
      content: "Click here to open the analysis, once it’s ready.",
      placement: "top",
      stepText: "6/7",
    },
    {
      target: "[data-tutorial='7']",
      title: "How to start a Game Analysis",
      content: "That’s it, time to discover your Game Analysis!",
      stepText: "7/7",
      placement: "top",
    },
  ];
  useEffect(() => {
    loadTutorialGame();
  }, []);
  const loadTutorialGame = async () => {
    try {
      const [tutorialGame] = await Promise.all([
        fetch("/local-data/tutorialPgn.json"),
      ]);

      const responseGame = await tutorialGame.json();
      setGameTutorial(responseGame);
    } catch (err) {
      console.error("Error loading famous game:", err);
    }
  };
  // Load steps for current route (or for a requested tour id)
  useEffect(() => {
    const tour = tutorials[pathname] as MinimalStep[] | undefined;
    // if (tour && tour.length > 0) {
    //   setSteps(tour);
    // } else {
    //   setSteps([]);
    // }
    setSteps(tour ?? []);
  }, [pathname]);

  // Example: start tutorial if ?tutorial=true in url
  useEffect(() => {
    try {
      if (search?.get("tutorial") === "true") {
        setIsRunning(true);
      }
    } catch (e) {
      // noop
    }
  }, [search]);

  const startTutorial = useCallback((id?: string) => {
    setCurrentTourId(id);
    setIsRunning(true);
  }, []);

  const stopTutorial = useCallback(() => {
    setIsRunning(false);
    setCurrentTourId(undefined);
  }, []);

  const handleJoyrideCallback = () => {
    setIsRunning(false);
  };

  const value = useMemo(
    () => ({
      startTutorial,
      stopTutorial,
      isTutorialPlay: isRunning,
      dataTutorial,
      currentTourId,
      stepFocused,
      setStepFocused,
      gameTutorial,
      allSteps,
    }),
    [
      startTutorial,
      stopTutorial,
      isRunning,
      currentTourId,
      stepFocused,
      setStepFocused,
      gameTutorial,
      allSteps,
    ]
  );

  return (
    <Suspense>
      <TutorialContext.Provider value={value}>
        {children}
        {/* Render a minimal in-house tour to avoid react-joyride/react-dom issues */}
        {steps.length > 0 && (
          <MinimalTour
            steps={steps as MinimalStep[]}
            run={isRunning}
            // onClose={() => setIsRunning(false)}
          />
        )}
      </TutorialContext.Provider>
    </Suspense>
  );
}

export default TutorialProvider;
