'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { InteractiveBoard } from '../InteractiveBoard'
import { Button } from '@/components/ui/button'
import { cn } from "@/utils/common/cn"

interface PiecePosition {
  piece: string
  from: string
  to: string[]
  fen: string
  specialMoves?: string[]
  capturePattern?: string
  value?: number
  tips?: string[]
}

const piecePositions = [
  {
    piece: "Pawns",
    from: "e2",
    to: ["e3", "e4"],
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    specialMoves: ["En passant", "Promotion"],
    capturePattern: "Diagonal one square forward",
    value: 1,
    tips: [
      "Control the center with your pawns",
      "Avoid creating doubled pawns",
      "Consider pawn structure when moving"
    ]
  },
  {
    piece: "Knights",
    from: "b1",
    to: ["c3", "a3"],
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    specialMoves: ["Can jump over other pieces"],
    value: 3,
    tips: [
      "Knights are strongest in the center",
      "Use knights to fork multiple pieces",
      "Look for outpost squares"
    ]
  },
  {
    piece: "Bishops",
    from: "f1",
    to: ["e2", "d3", "c4", "b5", "a6"],
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    value: 3,
    tips: [
      "Keep your bishops active",
      "Control long diagonals",
      "Bishop pairs are powerful"
    ]
  },
  {
    piece: "Rooks",
    from: "a1",
    to: ["a3", "a4", "a5", "a6", "a7", "a8"],
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    value: 5,
    tips: [
      "Control open files",
      "Connect your rooks",
      "Rooks belong behind passed pawns"
    ]
  },
  {
    piece: "Queens",
    from: "d1",
    to: ["d3", "d4", "d5", "d6", "d7", "f3", "g4", "h5"],
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    value: 9,
    tips: [
      "Don't develop the queen too early",
      "Avoid unnecessary queen trades",
      "Use the queen to control key squares"
    ]
  },
  {
    piece: "Kings",
    from: "e1",
    to: ["e2", "f2", "f1"],
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    specialMoves: ["Castling"],
    tips: [
      "Castle early for king safety",
      "Keep pawns in front of your king",
      "Activate your king in the endgame"
    ]
  }
]

const basicMovementRules = [
  {
    piece: "Pawns",
    rule: "Pawns move forward one square at a time",
    description: "On their first move, pawns can move two squares forward. They capture diagonally.",
    detailedExplanation: [
      "Pawns are unique in that they move and capture differently:",
      "Forward movement: One square straight ahead (or two on first move)",
      "Capture movement: One square diagonally forward",
      "Cannot move backward",
      "Can be promoted when reaching the opposite end of the board"
    ],
    commonMistakes: [
      "Moving diagonally when not capturing",
      "Moving backward",
      "Moving forward when an enemy piece blocks the path",
      "Forgetting about the two-square first move option",
      "Not recognizing promotion opportunities"
    ],
    strategicConcepts: [
      "Pawn structure shapes the entire game strategy",
      "Connected pawns protect each other",
      "Isolated pawns are typically weak",
      "Passed pawns can become powerful in endgames",
      "The center pawns (d and e) are most valuable"
    ],
    advancedTechniques: [
      "En passant capture of pawns that move two squares",
      "Creating pawn chains for position control",
      "Using pawns to control key central squares",
      "Advancing pawns to restrict enemy piece movement",
      "Sacrificing pawns for positional advantages"
    ]
  },
  {
    piece: "Knights",
    rule: "Knights move in an L-shape pattern",
    description: "Move two squares in one direction and then one square perpendicular to that direction.",
    detailedExplanation: [
      "Knights have a unique movement pattern that makes them special:",
      "Can jump over other pieces",
      "Move in an L-shape: 2 squares one way, 1 square perpendicular",
      "Always land on a square of the opposite color",
      "Excellent for tactical surprises and forks"
    ],
    commonMistakes: [
      "Confusing the L-shape pattern",
      "Not recognizing all possible landing squares",
      "Overlooking knight forks",
      "Placing knights on the board edges where they have fewer moves",
      "Not using their ability to jump over pieces"
    ],
    strategicConcepts: [
      "Knights are strongest in closed positions",
      "A knight on the rim is dim (avoid edge squares)",
      "Knights are excellent blockaders",
      "Outposts are key squares for knights",
      "Knights complement pawns well in controlling squares"
    ],
    advancedTechniques: [
      "Using knights for double attacks (forks)",
      "Knight outpost supported by pawns",
      "Smothered mate patterns",
      "Knight sacrifices to open lines",
      "Using knights to control key central squares"
    ]
  },
  {
    piece: "Bishops",
    rule: "Bishops move diagonally any number of squares",
    description: "Can move forward or backward on diagonals of the same color. Cannot jump over pieces.",
    detailedExplanation: [
      "Bishops are long-range pieces with specific characteristics:",
      "Move any number of squares diagonally",
      "Stay on squares of the same color throughout the game",
      "Cannot jump over other pieces",
      "Work well in pairs controlling both colors"
    ],
    commonMistakes: [
      "Moving along ranks or files instead of diagonals",
      "Trying to jump over pieces",
      "Not developing bishops early in the game",
      "Trapping the bishop behind own pawns",
      "Not recognizing long-range attacking potential"
    ],
    strategicConcepts: [
      "The bishop pair is a significant advantage",
      "Bishops are stronger in open positions",
      "Bad bishops are restricted by own pawns",
      "Fianchettoed bishops can be very powerful",
      "Light-squared/dark-squared bishop weaknesses"
    ],
    advancedTechniques: [
      "Bishop sacrifices to open lines",
      "Using bishops to control long diagonals",
      "Double bishop checkmate patterns",
      "Bishop and pawn endgame techniques",
      "Creating and exploiting color weaknesses"
    ]
  },
  {
    piece: "Rooks",
    rule: "Rooks move horizontally or vertically any number of squares",
    description: "Can move along ranks or files. Cannot jump over pieces. Strong in open positions.",
    detailedExplanation: [
      "Rooks are powerful pieces that excel in open positions:",
      "Move any number of squares horizontally or vertically",
      "Cannot jump over other pieces",
      "Can castle with the king under specific conditions",
      "Most valuable in endgames controlling open files"
    ],
    commonMistakes: [
      "Moving diagonally",
      "Trying to jump over pieces",
      "Not connecting rooks",
      "Keeping rooks passive behind pawn chains",
      "Missing opportunities for back rank mates"
    ],
    strategicConcepts: [
      "Control open files and ranks",
      "Rooks belong behind passed pawns",
      "Double rooks on the seventh rank are powerful",
      "Connected rooks double their strength",
      "Rooks are most effective when coordinated"
    ],
    advancedTechniques: [
      "Back rank checkmate patterns",
      "Rook lifts to attack enemy king",
      "Using rooks to cut off enemy king",
      "Rook sacrifices to open lines",
      "Doubling or tripling heavy pieces"
    ]
  },
  {
    piece: "Queens",
    rule: "Queens combine the moves of rooks and bishops",
    description: "Can move any number of squares in any direction. Most powerful piece on the board.",
    detailedExplanation: [
      "Queens are the most versatile and powerful pieces:",
      "Combine movement of rooks and bishops",
      "Move any number of squares in any direction",
      "Cannot jump over other pieces",
      "Must be used carefully due to their high value"
    ],
    commonMistakes: [
      "Developing the queen too early",
      "Exposing the queen to attacks by minor pieces",
      "Using the queen for tasks that minor pieces can do",
      "Trading the queen without clear compensation",
      "Not protecting the queen adequately"
    ],
    strategicConcepts: [
      "Queen centralization is powerful but risky",
      "Queens excel in open positions",
      "Queen and bishop coordination is deadly",
      "Queens are strong in endgames",
      "Early queen trades can simplify the position"
    ],
    advancedTechniques: [
      "Queen sacrifices for checkmate",
      "Perpetual check patterns",
      "Queen and pawn endgame techniques",
      "Using the queen to control key squares",
      "Coordinating queen attacks with other pieces"
    ]
  },
  {
    piece: "Kings",
    rule: "Kings move one square in any direction",
    description: "Must always move out of check. Can castle under specific conditions. Vital piece that must be protected.",
    detailedExplanation: [
      "Kings have special rules and considerations:",
      "Move one square in any direction",
      "Cannot move into check",
      "Can castle with rooks under specific conditions",
      "Becomes a strong piece in endgames"
    ],
    commonMistakes: [
      "Moving into check",
      "Not castling when safe to do so",
      "Exposing the king unnecessarily",
      "Missing opportunities to use the king in endgames",
      "Forgetting about opposition in king and pawn endgames"
    ],
    strategicConcepts: [
      "King safety is crucial in the opening and middlegame",
      "Kings should be active in endgames",
      "Pawn shield protects the castled king",
      "Opposition is key in king and pawn endgames",
      "Centralized king is strong in the endgame"
    ],
    advancedTechniques: [
      "King and pawn endgame techniques",
      "Using the king to support passed pawns",
      "Understanding king opposition",
      "Triangulation in endgames",
      "King activity in minor piece endgames"
    ]
  }
];

export const BasicRulesLesson = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [currentRule, setCurrentRule] = useState(basicMovementRules[0]);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div>
      {/* Main Content */}
      <div className="container mx-auto py-6">
        {/* Controls */}
        <div className="flex justify-end gap-2 mb-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setBoardOrientation(prev => prev === 'white' ? 'black' : 'white')}
            className="h-9 w-9"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.5))}
            className="h-9 w-9"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}
            className="h-9 w-9"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setZoomLevel(1)}
            className="h-9 w-9"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
          {/* Left Sidebar - Piece Selection */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Chess Pieces</h3>
              </div>
              <div className="p-2">
                {basicMovementRules.map((rule) => (
                  <button
                    key={rule.piece}
                    onClick={() => setCurrentRule(rule)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      currentRule.piece === rule.piece
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "hover:bg-accent"
                    )}
                  >
                    <span className="text-lg font-chess">{
                      rule.piece === "Pawns" ? "♟" :
                      rule.piece === "Knights" ? "♞" :
                      rule.piece === "Bishops" ? "♝" :
                      rule.piece === "Rooks" ? "♜" :
                      rule.piece === "Queens" ? "♛" :
                      "♚"
                    }</span>
                    <span className="font-medium">{rule.piece}</span>
                    {currentRule.piece === rule.piece && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Interactive Board */}
          <div className="md:col-span-6">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="aspect-square w-full p-4">
                <InteractiveBoard
                  orientation={boardOrientation}
                  zoomLevel={zoomLevel}
                  position={piecePositions.find(p => p.piece === currentRule.piece)?.fen || 'start'}
                  from={piecePositions.find(p => p.piece === currentRule.piece)?.from}
                  to={piecePositions.find(p => p.piece === currentRule.piece)?.to}
                />
              </div>
            </div>

            {/* Right Sidebar - Rules and Info */}
            <div className="mt-6">
              <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-4 border-b">
                  <div className="flex gap-2">
                    {['basic', 'advanced', 'strategy'].map((tab) => (
                      <Button
                        key={tab}
                        variant={activeTab === tab ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab(tab)}
                        className="capitalize"
                      >
                        {tab}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === 'basic' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{currentRule.rule}</h3>
                        <p className="text-muted-foreground">{currentRule.description}</p>
                      </div>
                      {currentRule.detailedExplanation && (
                        <div className="space-y-3">
                          {currentRule.detailedExplanation.map((point, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <p className="text-sm">{point}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'advanced' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Common Mistakes to Avoid</h4>
                        <div className="space-y-2">
                          {currentRule.commonMistakes?.map((mistake, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{mistake}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Advanced Techniques</h4>
                        <div className="space-y-2">
                          {currentRule.advancedTechniques?.map((technique, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{technique}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'strategy' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Strategic Concepts</h4>
                        <div className="space-y-2">
                          {currentRule.strategicConcepts?.map((concept, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{concept}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {(() => {
                        const currentPosition = piecePositions.find(position => position.piece === currentRule.piece);
                        return currentPosition?.tips && currentPosition.tips.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-3">Pro Tips</h4>
                            <div className="space-y-2">
                              {currentPosition.tips.map((tip, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                                  <p className="text-sm text-muted-foreground">{tip}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
