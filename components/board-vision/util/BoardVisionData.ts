export interface QuestionData {
    id: number;
    text: string;
    answers: number[];
    correctAnswer: number;
    position: string;
    type: "legal" | "check";
    piece?: string;
  }
  
  export const questionsData: QuestionData[] = [
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
  
  // Dummy game data for PlayerGameScreen
  export const dummyGameData = {
    opponentName: "GrandMaster2000",
    opponentRating: 1850,
    playerRating: 1720,
    position: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    opening: "Italian Game Opening",
    question: {
      text: "In your game against GrandMaster2000, how many legal moves did you have in this position?",
      answers: [25, 26, 27, 28],
      correctAnswer: 27,
    }
  };