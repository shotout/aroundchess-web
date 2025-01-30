"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Target, Crosshair, Sword, Shield } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const middlegamePatternExamples = [
  {
    fen: "r1bq1rk1/ppp2ppp/2n2n2/1B1pp3/4P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 8",
    title: "Isolated Queen's Pawn (IQP)",
    description: "A position with an isolated d-pawn, which can be both a strength and a weakness.",
    explanation: [
      "White has an isolated queen's pawn on d3",
      "The IQP provides space advantage and control over the e4 square",
      "However, it can also become a target for Black's pieces",
      "White should aim to utilize the open c-file and attack on the kingside",
      "Black's strategy involves blockading the pawn and exploiting its isolation",
    ],
  },
  {
    fen: "r4rk1/pp1n1ppp/2p1pn2/q2p1b2/1bPP4/2N1PN2/PPQB1PPP/R3KB1R w KQ - 0 11",
    title: "Carlsbad Structure",
    description: "A pawn structure arising from the Exchange Variation of the Queen's Gambit Declined.",
    explanation: [
      "Characterized by White's c4 and e3 pawns against Black's c6 and e6 pawns",
      "Creates a semi-open d-file, which both sides try to control",
      "White often plays for a queenside expansion with b4-b5",
      "Black typically counterattacks on the kingside or central break with ...e5",
      "Understanding this structure is crucial for playing many d4 openings",
    ],
  },
  {
    fen: "rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 8",
    title: "Maroczy Bind",
    description: "A pawn structure with pawns on c4 and e4, often seen in Sicilian Defense variations.",
    explanation: [
      "White has central pawns on c4 and e4, controlling the d5 square",
      "This structure restricts Black's piece movement and counterplay",
      "White aims to maintain this bind while slowly improving their position",
      "Black typically tries to break the structure with ...d5 or ...e5 pawn breaks",
      "Understanding how to play with and against this structure is crucial in many Sicilian positions",
    ],
  },
  {
    fen: "r1bq1rk1/pp2ppbp/2np1np1/8/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 9",
    title: "Hedgehog Structure",
    description: "A flexible pawn structure for Black, often used against various White setups.",
    explanation: [
      "Black has pawns on a6, b6, d6, and e6, resembling a hedgehog's spines",
      "This structure is very solid but flexible, allowing various piece setups",
      "Black can break with ...b5, ...d5, or ...e5 depending on White's setup",
      "White typically tries to exploit the lack of space and launch an attack",
      "The Hedgehog requires patience and good timing from Black to counter-attack effectively",
    ],
  },
]

const pawnStructurePatterns = [
  {
    title: "Isolated Queen's Pawn (IQP)",
    description: "A pawn structure where one side has a lone pawn on the d-file.",
    key_points: [
      "Provides space advantage and control over key central squares",
      "Can be both a strength (central control) and a weakness (potential target)",
      "Side with IQP should seek active piece play and kingside attacks",
      "Opposing side should blockade the pawn and exploit its isolation",
    ],
  },
  {
    title: "Hanging Pawns",
    description: "Two pawns on adjacent files (usually c and d) with no pawns on neighboring files.",
    key_points: [
      "Offer control of central squares and provide space advantage",
      "Can be vulnerable to attacks and become weak if advanced carelessly",
      "Side with hanging pawns should keep them flexible and use them for active play",
      "Opposing side should try to force one pawn to advance, making both weak",
    ],
  },
  {
    title: "Pawn Chain",
    description: "A diagonal formation of pawns protecting each other.",
    key_points: [
      "Provides space advantage and a basis for attacks on the side of the chain's base",
      "The head of the chain can be vulnerable to attacks",
      "Side with the chain should attack on the side of the chain's base",
      "Opposing side should target the base of the chain to undermine the structure",
    ],
  },
  {
    title: "Backward Pawn",
    description: "A pawn that has fallen behind its neighbors and can't be safely advanced.",
    key_points: [
      "Creates a weak square in front of the pawn that can be exploited by opponent's pieces",
      "Often becomes a target for attack in the middlegame and endgame",
      "Side with the backward pawn should try to advance supporting pawns to unblock it",
      "Opposing side should try to control the square in front of the backward pawn",
    ],
  },
]

const piecePlayPatterns = [
  {
    title: "Knight Outpost",
    description: "A strong square for a knight, typically in enemy territory and supported by a pawn.",
    key_points: [
      "Provides a stable base for attacks and limits opponent's piece movement",
      "Often found on the 5th or 6th rank, supported by a pawn",
      "Can be used to exert pressure on the opponent's position",
      "Opposing side should try to undermine the pawn support or exchange the knight",
    ],
  },
  {
    title: "Fianchettoed Bishop",
    description: "A bishop developed to g2/g7 or b2/b7, often behind a pawn structure.",
    key_points: [
      "Controls a long diagonal and supports kingside castling",
      "Provides flexible defense and can quickly switch to offense",
      "Can be very powerful in open positions",
      "Opposing side should be cautious about weakening squares of the bishop's color",
    ],
  },
  {
    title: "Rook on the Seventh",
    description: "A rook placed on the opponent's second rank (seventh for White, second for Black).",
    key_points: [
      "Attacks opponent's unadvanced pawns and can trap the enemy king",
      "Often decisive in endgames",
      "Can create mating threats when coordinated with other pieces",
      "Defending side should try to block the seventh rank or force the rook's retreat",
    ],
  },
  {
    title: "Bishop Pair",
    description: "Having two bishops while the opponent has fewer than two bishops.",
    key_points: [
      "Provides long-range control over both light and dark squares",
      "Particularly strong in open positions",
      "Can dominate knights in endgames",
      "Side with the bishop pair should try to open the position",
      "Opposing side should seek closed positions or try to exchange one of the bishops",
    ],
  },
]

export function CommonMiddlegamePatterns() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % middlegamePatternExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + middlegamePatternExamples.length) % middlegamePatternExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Middlegame Patterns</h2>
        <p className="text-gray-600 mb-6">
          Recognizing common middlegame patterns is crucial for improving your chess play. These patterns, which include
          pawn structures, piece placements, and tactical motifs, occur frequently across many games. Understanding them
          will help you make better decisions and formulate effective plans.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          While it's important to recognize these patterns, remember that each position is unique. Always verify that
          the pattern applies to your specific position and consider how it interacts with other elements of the game.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={middlegamePatternExamples[currentExample].fen}
          initialFen={middlegamePatternExamples[currentExample].fen}
          title={middlegamePatternExamples[currentExample].title}
          description={middlegamePatternExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Pattern Analysis</h4>
          <ul className="list-disc pl-5 space-y-2">
            {middlegamePatternExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {middlegamePatternExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pawn-structures" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pawn-structures">Pawn Structure Patterns</TabsTrigger>
          <TabsTrigger value="piece-play">Piece Play Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="pawn-structures">
          <div className="grid gap-6 md:grid-cols-2">
            {pawnStructurePatterns.map((pattern, index) => (
              <motion.div
                key={pattern.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-blue-600">
                        <Target className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-600">{pattern.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{pattern.description}</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {pattern.key_points.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-sm text-gray-600">
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

        <TabsContent value="piece-play">
          <div className="grid gap-6 md:grid-cols-2">
            {piecePlayPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-blue-600">
                        <Crosshair className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-600">{pattern.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{pattern.description}</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {pattern.key_points.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-sm text-gray-600">
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
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Tips for Recognizing and Utilizing Middlegame Patterns
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Study classic games to see how strong players handle these common patterns</li>
          <li>Practice identifying these patterns in your own games during post-game analysis</li>
          <li>When you recognize a pattern, consider both its strengths and potential weaknesses</li>
          <li>Use these patterns as a starting point for formulating your middlegame plans</li>
          <li>Be aware that your opponent may also be trying to create or exploit these patterns</li>
          <li>Don't rely solely on pattern recognition; always calculate concrete variations</li>
          <li>Try to combine multiple patterns to create a comprehensive middlegame strategy</li>
        </ul>
      </motion.div>
    </div>
  )
}

