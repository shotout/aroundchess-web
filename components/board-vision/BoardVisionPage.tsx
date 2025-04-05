import { useState, useEffect, RefAttributes } from "react";
import { Chessboard, ClearPremoves } from "react-chessboard";
import {
  Eye,
  Check,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  X,
  ChevronLeft,
} from "lucide-react";
import { Chess } from "chess.js";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChessboardProps } from "react-chessboard/dist/chessboard/types";

interface QuestionData {
  id: number;
  text: string;
  answers: number[];
  correctAnswer: number;
  position: string;
  type: "legal" | "check";
  piece?: string;
}

interface HighlightedSquare {
  background: string;
  border?: string;
  borderRadius?: string;
}

interface HighlightedSquares {
  [square: string]: HighlightedSquare;
}

type Arrow = [string, string];

type AppState = "welcome" | "default" | "hello";

const BoardVisionPage: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [username, setUsername] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [highlightedSquares, setHighlightedSquares] =
    useState<HighlightedSquares>({});
  const [arrows, setArrows] = useState<
    any & Omit<ChessboardProps, "ref"> & RefAttributes<ClearPremoves>
  >([]);

  const questions: QuestionData[] = [
    {
      id: 1,
      text: "How many legal moves does White have?",
      answers: [20, 21, 22, 23],
      correctAnswer: 20,
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      type: "legal",
    },
    {
      id: 2,
      text: "How many legal moves does Black have?",
      answers: [18, 19, 20, 21],
      correctAnswer: 20,
      position: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      type: "legal",
    },
    {
      id: 3,
      text: "How many check moves does White have?",
      answers: [0, 1, 2, 3],
      correctAnswer: 0,
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      type: "legal",
    },
    {
      id: 4,
      text: "How many legal moves does White have?",
      answers: [26, 27, 28, 29],
      correctAnswer: 27,
      position:
        "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
      type: "legal",
    },
    {
      id: 5,
      text: "How many check moves does White have?",
      answers: [0, 1, 2, 3],
      correctAnswer: 1,
      position:
        "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
      type: "check",
    },
    {
      id: 6,
      text: "How many legal moves does Black have?",
      answers: [23, 24, 25, 26],
      correctAnswer: 25,
      position:
        "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 0 1",
      type: "legal",
    },
    {
      id: 7,
      text: "How many check moves does White have?",
      answers: [2, 3, 4, 5],
      correctAnswer: 3,
      position:
        "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
      type: "check",
    },
    {
      id: 8,
      text: "How many legal moves does White knight have?",
      answers: [5, 6, 7, 8],
      correctAnswer: 6,
      position:
        "rnbqkb1r/pp2pppp/5n2/2pp4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 1",
      type: "legal",
      piece: "N",
    },
    {
      id: 9,
      text: "How many legal moves does Black king have?",
      answers: [0, 1, 2, 3],
      correctAnswer: 2,
      position: "8/8/3k4/8/8/5K2/8/8 b - - 0 1",
      type: "legal",
      piece: "k",
    },
    {
      id: 10,
      text: "How many check moves does White have?",
      answers: [2, 3, 4, 5],
      correctAnswer: 4,
      position: "5rk1/5ppp/8/8/8/8/5PPP/4QK1R w - - 0 1",
      type: "check",
    },
  ];

  useEffect(() => {
    setHighlightedSquares({});
    setArrows([]);
  }, [currentQuestionIndex]);

  function analyzePosition(position: string, questionData: QuestionData) {
    try {
      const chess = new Chess(position);
      const newHighlightedSquares: HighlightedSquares = {};
      const newArrows: Arrow[] = [];

      if (questionData.type === "legal") {
        const allMoves = chess.moves({ verbose: true });

        if (questionData.piece) {
          const pieceMoves = allMoves.filter((move) => {
            const piece = chess.get(move.from);
            return (
              piece &&
              piece.type.toLowerCase() === questionData.piece?.toLowerCase()
            );
          });

          pieceMoves.forEach((move) => {
            newHighlightedSquares[move.to] = {
              background: "none",
              border: "3px solid #0000C8",
            };
            newArrows.push([move.from, move.to]);
          });
        } else {
          allMoves.forEach((move) => {
            newHighlightedSquares[move.to] = {
              background: "none",
              borderRadius: "100px",
              border: "3px solid #0000C8",
            };
          });
        }
      } else if (questionData.type === "check") {
        const checkMoves = chess
          .moves({ verbose: true })
          .filter((move) => move.san.includes("+"));

        checkMoves.forEach((move) => {
          newHighlightedSquares[move.to] = {
            background: "none",
            border: "3px solid #0000C8",
            borderRadius: "4px",
          };
          newArrows.push([move.from, move.to]);
        });
      }

      setHighlightedSquares(newHighlightedSquares);
      setArrows(newArrows);
    } catch (error) {
      console.error("Error analyzing position:", error);
    }
  }

  function handleSelectAnswer(answer: number) {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentQuestion = questions[currentQuestionIndex];
    analyzePosition(currentQuestion.position, currentQuestion);
  }

  function handleNextQuestion() {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setHighlightedSquares({});
    setArrows([]);
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  }

  const WelcomeScreen = () => {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-start mb-4">
          <ChevronLeft className="h-6 w-6 text-black" />
        </div>

        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative mb-4">
            <div className="text-cyan-400 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="40" fill="transparent" />
                    <circle cx="85" cy="55" r="4" fill="#13CDD9" />
                    <circle cx="100" cy="70" r="4" fill="#13CDD9" />
                    <circle cx="55" cy="55" r="4" fill="#13CDD9" />
                    <circle cx="40" cy="70" r="4" fill="#13CDD9" />
                  </svg>
                </div>
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  className="relative"
                >
                  <path
                    d="M50 20 C 45 40, 35 50, 35 70 L 65 70 C 65 50, 55 40, 50 20"
                    fill="#13CDD9"
                  />
                  <circle cx="50" cy="35" r="15" fill="#13CDD9" />
                  <rect
                    x="30"
                    y="70"
                    width="40"
                    height="10"
                    rx="5"
                    fill="#13CDD9"
                  />
                  <rect
                    x="25"
                    y="80"
                    width="50"
                    height="10"
                    rx="5"
                    fill="#13CDD9"
                  />
                </svg>
                <div className="absolute bottom-0 right-0">
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-center">Board Vision</h1>
          <p className="text-center text-gray-800 mb-6">
            Answer technical Chess Questions from positions of your previous
            Games to improve your Board Vision.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-blue-700">♞</span>
            <span>Chess.com Username</span>
          </div>

          <Input
            placeholder="Blitzmystic"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
          />

          <div>
            <p className="mb-2">
              Show questions for my Games in the following month:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="March" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="2025" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              variant="outline"
              className="w-full py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-200"
              onClick={() => setAppState("default")}
            >
              Default Position
            </Button>

            <Button
              variant="default"
              className="w-full py-2 rounded-full bg-blue-600 text-white"
              onClick={() => setAppState("hello")}
            >
              Start
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const PlayerGameScreen = () => {
    // Dummy game data with the player's username
    const playerName = username || "Player";
    const opponentName = "GrandMaster2000";
    const dummyPosition =
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1";

    // Dummy question based on the player's game
    const dummyQuestion = {
      text: `In your game against ${opponentName}, how many legal moves did you have in this position?`,
      answers: [25, 26, 27, 28],
      correctAnswer: 27,
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-white">
        <div className="border border-gray-200 flex flex-col items-center justify-center p-4 h-full">
          <div className="w-full max-w-xl">
            <div className="text-center mb-4 text-gray-700 font-semibold">
              {opponentName}{" "}
              <span className="text-sm text-gray-500">(1850)</span>
            </div>

            <Chessboard
              id="player-game-board"
              boardWidth={600}
              position={dummyPosition}
              areArrowsAllowed={true}
            />

            <div className="text-center mt-4 text-gray-700 font-semibold">
              {playerName} <span className="text-sm text-gray-500">(1720)</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 flex flex-col p-4 h-full">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 border-b pb-2">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="font-bold text-xl">
                      Your Game Analysis
                    </span>
                  </div>
                  <div className="text-indigo-600">Italian Game Opening</div>
                </div>
              </div>

              <div className="flex-grow my-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="rounded-t-md overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-indigo-400 to-indigo-500">
                        <p className="text-white text-center font-medium">
                          {dummyQuestion.text}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2">
                      {dummyQuestion.answers.map((answer, i) => (
                        <div
                          key={i}
                          className="border rounded-md p-3 flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-lg">{answer}</span>
                          <div className="h-5 w-5 rounded-full border border-gray-300 bg-white flex items-center justify-center"></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-auto">
                <Button
                  onClick={() => setAppState("default")}
                  className="w-full flex items-center justify-center"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Default Questions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ChessInterface = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentPosition = currentQuestion.position;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-white">
        <div className="border border-gray-200 flex flex-col items-center justify-center p-4 h-full">
          <div className="w-full max-w-xl">
            <Chessboard
              id="board-vision-board"
              boardWidth={600}
              position={currentPosition}
              areArrowsAllowed={true}
              customArrows={arrows}
              customSquareStyles={highlightedSquares}
            />
            <div className="text-center mt-2 text-gray-700">
              Hikaru VS Maitreïa
            </div>
          </div>
        </div>

        <div className="border border-gray-200 flex flex-col p-4 h-full">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 border-b pb-2">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="font-bold text-xl">Board Vision</span>
                  </div>
                  <div className="text-indigo-600">
                    Question {currentQuestionIndex + 1} of 10
                  </div>
                </div>
              </div>

              <div className="flex-grow my-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="rounded-t-md overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-teal-400 to-teal-500">
                        <p className="text-white text-center font-medium">
                          {currentQuestion.text}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2">
                      {currentQuestion.answers.map((answer, i) => (
                        <div
                          key={i}
                          className={`border rounded-md p-3 flex items-center justify-between cursor-pointer ${
                            selectedAnswer === answer
                              ? "bg-teal-400 text-white"
                              : "bg-white"
                          }`}
                          onClick={() =>
                            !showFeedback && handleSelectAnswer(answer)
                          }
                        >
                          <span className="text-lg">{answer}</span>
                          <div
                            className={`h-5 w-5 rounded-full ${
                              selectedAnswer === answer
                                ? "bg-white text-teal-400"
                                : "border border-gray-300 bg-white"
                            } flex items-center justify-center`}
                          >
                            {selectedAnswer === answer && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {showFeedback ? (
                <div className="space-y-3 mt-auto">
                  <div
                    className={`${
                      isCorrect ? "bg-green-100" : "bg-red-100"
                    } rounded-md p-3 flex items-center relative overflow-hidden`}
                  >
                    <div
                      className={`${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      } rounded-full p-1 mr-2`}
                    >
                      {isCorrect ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span
                      className={`${
                        isCorrect ? "text-green-800" : "text-red-800"
                      } z-10`}
                    >
                      {isCorrect
                        ? `Correct! Correct, the answer is ${currentQuestion.correctAnswer}.`
                        : `Incorrect. The correct answer is ${currentQuestion.correctAnswer}.`}
                    </span>
                    <div className="absolute right-0 opacity-10">
                      {isCorrect ? (
                        <Check className="h-16 w-16 text-green-300" />
                      ) : (
                        <X className="h-16 w-16 text-red-300" />
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
                    variant="default"
                  >
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="mt-auto">
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full flex items-center justify-center"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Change Questions
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (appState) {
    case "welcome":
      return <WelcomeScreen />;
    case "hello":
      return <PlayerGameScreen />;
    case "default":
      return <ChessInterface />;
    default:
      return <WelcomeScreen />;
  }
};

export default BoardVisionPage;
