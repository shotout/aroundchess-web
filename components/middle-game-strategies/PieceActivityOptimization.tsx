"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Maximize2, Target, Crosshair, Zap } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "./ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pieceActivityExamples = [
  {
    fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/3P1B2/2NBPN2/PPP2PPP/R2Q1RK1 w - - 0 8",
    title: "Active Knights",
    description: "Both sides have developed their knights to active central squares.",
    explanation: [
      "White's knights on c3 and f3 control key central squares",
      "Black's knights on c6 and f6 are also well-placed, contesting the center",
      "The knights are placed on squares where they can't be easily attacked by pawns",
      "From these positions, the knights can quickly move to either flank if needed",
    ],
  },
  {
    fen: "r2qk2r/ppp2ppp/2n1bn2/3p2B1/3P4/2NBP3/PPP2PPP/R2Q1RK1 w kq - 0 9",
    title: "Active Bishops",
    description: "Both sides have developed their bishops to active diagonals.",
    explanation: [
      "White's light-squared bishop on g5 pins Black's knight to the queen",
      "Black's dark-squared bishop on e6 controls important central squares",
      "The bishops are placed on open diagonals where they have maximum impact",
      "These active bishops exert pressure and limit the opponent's options",
    ],
  },
  {
    fen: "r3k2r/pppq1ppp/2n2n2/3p4/3P4/2NQ1N2/PPP2PPP/R4RK1 w kq - 0 10",
    title: "Active Rooks",
    description: "Both sides have connected their rooks and placed them on open files.",
    explanation: [
      "White's rooks are connected and control the f-file",
      "Black's rooks are also connected and ready to contest open files",
      "The rooks are placed on semi-open files, ready to apply pressure",
      "Active rooks can quickly switch to attack or defense as needed",
    ],
  },
  {
    fen: "rnbqk2r/ppp2ppp/4pn2/3p4/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQkq - 0 5",
    title: "Active Queen",
    description: "Black's queen is actively placed, applying pressure on White's position.",
    explanation: [
      "Black's queen on d8 is ready to move to c7, applying pressure on the c-file",
      "The queen is well-supported by other pieces and not exposed to attack",
      "From this position, the queen can quickly shift to either flank",
      "The active queen limits White's options and creates tactical threats",
    ],
  },
]

const pieceActivityPrinciples = [
  {
    title: "Centralization",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Place pieces on central squares when possible",
      "Control the center with your pieces",
      "Use centralized pieces to restrict opponent's options",
      "Prepare to use central pieces for kingside or queenside operations",
    ],
  },
  {
    title: "Mobility",
    icon: <Maximize2 className="h-6 w-6" />,
    points: [
      "Keep your pieces on squares with many available moves",
      "Avoid blocking your own pieces",
      "Look for opportunities to improve piece placement",
      "Create threats that force opponent's pieces to less active squares",
    ],
  },
  {
    title: "Coordination",
    icon: <Zap className="h-6 w-6" />,
    points: [
      "Ensure your pieces work together effectively",
      "Create piece combinations that cover each other's weaknesses",
      "Avoid doubled pieces on the same file unless strategically beneficial",
      "Coordinate pieces to create multiple threats",
    ],
  },
  {
    title: "Flexibility",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Position pieces where they can quickly shift to different areas",
      "Maintain options for both attack and defense",
      "Avoid committing pieces too early to a specific plan",
      "Be ready to adapt your piece activity based on opponent's moves",
    ],
  },
]

const pieceSpecificTips = [
  {
    piece: "Knights",
    tips: [
      "Place knights on outposts protected by pawns",
      "Use knights to control key central squares",
      "Look for knight forks and other tactical opportunities",
      "In closed positions, knights can be superior to bishops",
    ],
  },
  {
    piece: "Bishops",
    tips: [
      "Keep bishops on open, long diagonals",
      "Try to maintain the bishop pair when possible",
      "Use bishops to control key squares of the opposite color",
      "In open positions, bishops can be more powerful than knights",
    ],
  },
  {
    piece: "Rooks",
    tips: [
      "Place rooks on open or semi-open files",
      "Double rooks on open files for maximum pressure",
      "Use rooks to control the 7th rank in the endgame",
      "Activate rooks by lifting them over other pieces when necessary",
    ],
  },
  {
    piece: "Queen",
    tips: [
      "Avoid developing the queen too early",
      "Use the queen in coordination with other pieces",
      "Be cautious of exposing the queen to enemy attacks",
      "In the endgame, centralize the queen for maximum effect",
    ],
  },
  {
    piece: "King",
    tips: [
      "Ensure king safety in the opening and middlegame",
      "In the endgame, activate the king as an attacking piece",
      "Use the king to support passed pawns in the endgame",
      "Be aware of potential back rank mates",
    ],
  },
]

export function PieceActivityOptimization() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % pieceActivityExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + pieceActivityExamples.length) % pieceActivityExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Piece Activity Optimization</h2>
        <p className="text-gray-600 mb-6">
          Optimizing piece activity is crucial for success in chess. Active pieces control important squares, create
          threats, and limit your opponent's options. Understanding how to maximize the potential of each piece is a key
          skill for improving your middlegame play.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Remember that piece activity is not just about individual pieces, but how they work together. A
          well-coordinated set of slightly less active pieces can often be more effective than a few highly active
          pieces that don't work together.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={pieceActivityExamples[currentExample].fen}
          initialFen={pieceActivityExamples[currentExample].fen}
          title={pieceActivityExamples[currentExample].title}
          description={pieceActivityExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Position Analysis</h4>
          <ul className="list-disc pl-5 space-y-2">
            {pieceActivityExamples[currentExample].explanation.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-gray-700"
              >
                {point}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <div className="flex justify-between mt-4">
          <Button onClick={previousExample} variant="outline" size="sm">
            Previous Example
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentExample + 1} of {pieceActivityExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">General Principles</TabsTrigger>
          <TabsTrigger value="piece-specific">Piece-Specific Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-2">
            {pieceActivityPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-blue-600">{principle.icon}</div>
                      <h3 className="text-lg font-semibold text-blue-600">{principle.title}</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2">
                      {principle.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-gray-600">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="piece-specific">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pieceSpecificTips.map((pieceType, index) => (
              <motion.div
                key={pieceType.piece}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{pieceType.piece}</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {pieceType.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-sm text-gray-600">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Practical Tips for Optimizing Piece Activity</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Regularly assess the activity of all your pieces during a game</li>
          <li>Look for opportunities to improve the position of your least active pieces</li>
          <li>Be willing to exchange an active opponent's piece for one of your less active pieces</li>
          <li>Create plans that gradually improve the position of multiple pieces</li>
          <li>Practice visualizing potential piece maneuvers to increase activity</li>
          <li>Study master games focusing on how they activate and coordinate their pieces</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="piece-activity-optimization" />
      </div>
    </div>
  )
}

