export interface Opening {
    id: number;
    title: string;
    slug: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    fen: string;
    description: string;
    strategicIdeas: string[];
    tacticalIdeas: string[];
    learningObjectives: string[];
    prerequisites: string[];
    externalResources: {
      title: string;
      description: string;
      url: string;
      siteName: string;
    }[];
  }
  
  // Expanded openings data with more details for the lesson pages
  export const openings: Opening[] = [
    {
      id:0,
      title: "Basic Opening Principles",
      slug: "basic-opening-principles",
      difficulty: "Beginner",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      description: "Master the fundamental principles of chess openings. Learn how to develop your pieces effectively, control the center, and ensure king safety.",
      strategicIdeas: [
        "Control the center with e4/d4 pawns",
        "Develop knights before bishops",
      ],
      tacticalIdeas: [
        "Watch for early tactical opportunities on f2/f7",
      ],
      learningObjectives: [
        "Understand core opening principles",
        "Learn proper piece development",
        "Master center control concepts",
        "Ensure king safety",
        "Avoid common opening mistakes"
      ],
      prerequisites: [],
      externalResources: [
        {
          title: "Opening Principles - Chess.com",
          description: "Essential opening principles for beginners",
          url: "https://www.chess.com/article/view/the-principles-of-the-opening",
          siteName: "Chess.com"
        },
        {
          title: "Opening Basics - Lichess",
          description: "Interactive lessons on opening fundamentals",
          url: "https://lichess.org/learn#/6",
          siteName: "Lichess.org"
        },
        {
          title: "Common Opening Mistakes",
          description: "Interactive lessons on opening fundamentals",
          url: "https://lichess.org/study/rYmQRJpM",
          siteName: "Lichess.org"
        }
      ]
    },
    {
      id:1,
      title: "Piece Movement and Basic Rules",
      slug: "piece-movement-and-basic-rules",
      difficulty: "Intermediate",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      description: "Learn how each piece moves and the fundamental rules of chess that govern the opening phase of the game.",
      strategicIdeas: [
        "Understand piece values and exchanges",
        "Learn how to coordinate different pieces",
        "Recognize piece mobility patterns"
      ],
      tacticalIdeas: [
        "Identify piece interactions and threats",
        "Recognize basic tactical patterns",
        "Understand the power of each piece in different positions"
      ],
      learningObjectives: [
        "Master movement patterns for all pieces",
        "Understand special rules like castling and en passant",
        "Learn the relative value of pieces",
        "Recognize the strength and weakness of each piece"
      ],
      prerequisites: ["piece-movement"],
      externalResources: [
        {
          title: "Chess Rules - Chess.com",
          description: "Complete guide to chess rules",
          url: "https://www.chess.com/learn-how-to-play-chess",
          siteName: "Chess.com"
        },
        {
          title: "Piece Movement - Lichess",
          description: "Interactive lessons on piece movement",
          url: "https://lichess.org/learn#/1",
          siteName: "Lichess.org"
        }
      ]
    },
    {
      id:2,
      title: "Italian Game",
      slug: "italian-game",
      difficulty: "Advanced",
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
      description: "The Italian Game is one of the oldest recorded chess openings, characterized by the moves 1.e4 e5 2.Nf3 Nc6 3.Bc4, targeting the vulnerable f7 square.",
      strategicIdeas: [
        "Control the center with e4 and d4",
        "Develop the light-squared bishop to c4 targeting f7",
        "Create attacking opportunities on the kingside"
      ],
      tacticalIdeas: [
        "Look for the Fried Liver Attack if Black plays ...Nf6",
        "Be aware of tactical opportunities against f7",
        "Watch for discovered attacks with the bishop on c4"
      ],
      learningObjectives: [
        "Understand the main ideas behind the Italian Game",
        "Learn key variations and responses",
        "Master attacking patterns in open games",
        "Develop positional understanding of central pawn structures"
      ],
      prerequisites: ["piece-movement", "basic-opening-principles"],
      externalResources: [
        {
          title: "Italian Game Guide - Chess.com",
          description: "Comprehensive guide to the Italian Game",
          url: "https://www.chess.com/openings/Italian-Game",
          siteName: "Chess.com"
        },
        {
          title: "Italian Game Variations - Lichess",
          description: "Interactive study on Italian Game variations",
          url: "https://lichess.org/study/XtFCFYlM",
          siteName: "Lichess.org"
        }
      ]
    },
    {
      id:3,

      title: "London System",
      slug: "london-system",
      difficulty: "Expert",
      fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3",
      description: "The London System is a solid opening characterized by a bishop development to f4 and a consistent structure. It's popular at all levels for its solid and flexible nature.",
      strategicIdeas: [
        "Develop the dark-squared bishop to f4 early",
        "Establish a solid pawn structure with e3",
        "Create a flexible setup that works against various defenses",
        "Prepare for controlled central breaks when appropriate"
      ],
      tacticalIdeas: [
        "Look for opportunities to exploit weaknesses in Black's setup",
        "Watch for tactical opportunities along the h2-b8 diagonal",
        "Prepare e4 breaks when favorable"
      ],
      learningObjectives: [
        "Understand the solid framework of the London System",
        "Learn to adapt the system against different Black setups",
        "Master the middlegame plans arising from the London",
        "Develop positional understanding of closed positions"
      ],
      prerequisites: ["basic-opening-principles"],
      externalResources: [
        {
          title: "London System Guide - Chess.com",
          description: "Comprehensive guide to the London System",
          url: "https://www.chess.com/openings/London-System",
          siteName: "Chess.com"
        },
        {
          title: "London System Masterclass - Lichess",
          description: "Advanced study on London System",
          url: "https://lichess.org/study/OQMjfq34",
          siteName: "Lichess.org"
        }
      ]
    },
    {
      id:4,
      title: "Sicilian Defense",
      slug: "sicilian-defense",
      difficulty: "Advanced",
      fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
      description: "The Sicilian Defense is one of the most popular and aggressive responses to White's 1.e4, immediately challenging the center and creating asymmetrical positions.",
      strategicIdeas: [
        "Counter-attack in the center rather than mirror White's moves",
        "Prepare ...d5 break to fight for the center",
        "Create imbalanced positions to play for a win",
        "Develop pieces actively while maintaining central pressure"
      ],
      tacticalIdeas: [
        "Watch for tactical opportunities along open files",
        "Be aware of Nc3-d5 or Nf3-d5 jumps",
        "Calculate carefully in the sharp mainlines"
      ],
      learningObjectives: [
        "Understand the aggressive nature of the Sicilian",
        "Learn the main variations and White's responses",
        "Master the unique pawn structures of Sicilian positions",
        "Develop tactical awareness in sharp positions"
      ],
      prerequisites: ["basic-opening-principles"],
      externalResources: [
        {
          title: "Sicilian Defense Guide - Chess.com",
          description: "Comprehensive guide to the Sicilian Defense",
          url: "https://www.chess.com/openings/Sicilian-Defense",
          siteName: "Chess.com"
        },
        {
          title: "Sicilian Defense Variations - Lichess",
          description: "Interactive study on Sicilian variations",
          url: "https://lichess.org/study/PDkQDt6u",
          siteName: "Lichess.org"
        }
      ]
    },
    {
      id:5,
      title: "French Defense",
      slug: "french-defense",
      difficulty: "Intermediate",
      fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
      description: "The French Defense is a solid and strategic opening characterized by 1.e4 e6, preparing to challenge White's center with ...d5 while keeping a solid pawn structure.",
      strategicIdeas: [
        "Build a solid pawn structure with e6 and d5",
        "Prepare counterplay against White's center",
        "Develop pieces methodically behind the pawn structure",
        "Look for opportunities to break with ...c5 or ...f6"
      ],
      tacticalIdeas: [
        "Watch for tactical opportunities after central exchanges",
        "Be aware of light square weaknesses around the king",
        "Calculate carefully when playing ...c5 breaks"
      ],
      learningObjectives: [
        "Understand the solid nature of the French structure",
        "Learn the main variations and White's responses",
        "Master the strategic plans in closed positions",
        "Develop positional understanding of pawn chains"
      ],
      prerequisites: ["basic-opening-principles"],
      externalResources: [
        {
          title: "French Defense Guide - Chess.com",
          description: "Comprehensive guide to the French Defense",
          url: "https://www.chess.com/openings/French-Defense",
          siteName: "Chess.com"
        },
        {
          title: "French Defense Variations - Lichess",
          description: "Interactive study on French Defense variations",
          url: "https://lichess.org/study/rja9zZI6",
          siteName: "Lichess.org"
        }
      ]
    }
  ];
  
  export function getOpeningBySlug(slug: string): Opening | undefined {
    return openings.find(opening => opening.slug === slug);
  }
  
  export function getRelatedOpenings(currentSlug: string, limit: number = 3): Opening[] {
    const currentOpening = getOpeningBySlug(currentSlug);
    if (!currentOpening) return [];
    
    // Filter openings with the same difficulty or adjacent difficulties
    const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const currentIndex = difficultyLevels.indexOf(currentOpening.difficulty);
    
    const relatedOpenings = openings.filter(opening => {
      if (opening.slug === currentSlug) return false;
      
      const openingIndex = difficultyLevels.indexOf(opening.difficulty);
      return Math.abs(currentIndex - openingIndex) <= 1; // Same or adjacent difficulty
    });
    
    // Sort by same difficulty first, then return limited results
    return relatedOpenings
      .sort((a, b) => {
        if (a.difficulty === currentOpening.difficulty && b.difficulty !== currentOpening.difficulty) return -1;
        if (a.difficulty !== currentOpening.difficulty && b.difficulty === currentOpening.difficulty) return 1;
        return 0;
      })
      .slice(0, limit);
  }