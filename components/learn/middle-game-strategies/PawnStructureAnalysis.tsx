"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, PianoIcon as ChessPawn, Target, Move, Scale } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pawnStructureExamples = [
  {
    fen: "rnbqkbnr/pp2pppp/8/2pp4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 3",
    title: "Isolated Queen's Pawn (IQP)",
    description: "An isolated pawn on the d-file, often a result of trading pawns in the center.",
    explanation: [
      "White's d-pawn is isolated, with no friendly pawns on adjacent files",
      "The IQP can be both a strength (central control) and a weakness (potential target)",
      "White gains space and piece activity, but must be careful not to let the pawn become weak",
      "Black can target the isolated pawn but must watch out for White's active pieces",
    ],
  },
  {
    fen: "rnbqkbnr/pp3ppp/4p3/2pp4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4",
    title: "Doubled Pawns",
    description: "Two pawns of the same color on the same file, often a result of captures.",
    explanation: [
      "Black has doubled pawns on the c-file",
      "Doubled pawns can be weak because they can't defend each other",
      "However, they can also control important squares and create half-open files",
      "White may try to exploit the doubled pawns, while Black looks for compensation",
    ],
  },
  {
    fen: "rnbqkbnr/pp3ppp/4p3/2p5/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4",
    title: "Pawn Chain",
    description: "A diagonal line of pawns protecting each other, often defining the pawn structure.",
    explanation: [
      "White has a pawn chain from e4 to c2",
      "Pawn chains define areas of control and often dictate piece placement",
      "The base of the chain (c2) is strong, while the head (e4) can be vulnerable",
      "Black may try to undermine the chain, while White looks to advance or maintain it",
    ],
  },
  {
    fen: "rnbqkbnr/ppp2ppp/4p3/8/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4",
    title: "Backward Pawn",
    description: "A pawn that has fallen behind its neighbors and can't be safely advanced.",
    explanation: [
      "Black's d-pawn is backward, unable to safely advance to d5",
      "Backward pawns are often weak and can be targeted by the opponent",
      "They create a hole in front of them that can be used by enemy pieces",
      "Black must either find a way to advance the pawn or compensate for its weakness",
    ],
  },
]

const pawnStructurePrinciples = [
  {
    title: "Pawn Islands",
    icon: <ChessPawn className="h-6 w-6" />,
    points: [
      "Identify groups of connected pawns",
      "Fewer pawn islands are generally better",
      "Isolated pawns create weaknesses",
      "Use pawn islands to guide piece placement",
    ],
  },
  {
    title: "Pawn Chains",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Recognize pawn chains and their implications",
      "Attack the base of the chain to break it",
      "Use pawn breaks to challenge the structure",
      "Place pieces behind your pawn chain for support",
    ],
  },
  {
    title: "Pawn Tension",
    icon: <Move className="h-6 w-6" />,
    points: [
      "Identify areas of pawn tension",
      "Decide when to release the tension",
      "Use tension to restrict opponent's pieces",
      "Create and exploit weaknesses through exchanges",
    ],
  },
  {
    title: "Pawn Majorities",
    icon: <Scale className="h-6 w-6" />,
    points: [
      "Recognize pawn majorities on each side",
      "Use majorities to create passed pawns",
      "Consider trading to create favorable endgames",
      "Balance pawn structure with piece activity",
    ],
  },
]

const commonPawnStructures = [
  {
    title: "Carlsbad Structure",
    description: "A common structure in the Queen's Gambit, characterized by interlocking central pawns.",
    key_points: [
      "White has pawns on c4 and e3, Black on c6 and e6",
      "Often leads to a closed center and play on the flanks",
      "White typically plays on the queenside, Black on the kingside",
      "Understanding piece placement is crucial in this structure",
    ],
  },
  {
    title: "Maroczy Bind",
    description: "A pawn structure with pawns on c4 and e4, often seen in Sicilian Defense variations.",
    key_points: [
      "White has central pawns on c4 and e4",
      "Gives White space advantage and control over d5",
      "Black often aims for ...d6 and ...e6 breaks",
      "Requires careful maneuvering by both sides",
    ],
  },
  {
    title: "Hedgehog Structure",
    description: "A flexible pawn structure often adopted by Black in various openings.",
    key_points: [
      "Black has pawns on a6, b6, d6, and e6",
      "Allows for multiple pawn breaks and piece arrangements",
      "Can transition into various types of positions",
      "Requires good understanding of when to make pawn breaks",
    ],
  },
  {
    title: "Hanging Pawns",
    description: "Two pawns on adjacent files with no pawns on neighboring files.",
    key_points: [
      "Often seen with pawns on c4 and d4 (or c5 and d5 for Black)",
      "Can be both a strength (space and mobility) and a weakness (targets)",
      "Requires careful handling and piece support",
      "Understanding when to advance or maintain these pawns is crucial",
    ],
  },
]

export function PawnStructureAnalysis() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % pawnStructureExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + pawnStructureExamples.length) % pawnStructureExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pawn Structure Analysis</h2>
        <p className="text-gray-600 mb-6">
          Understanding pawn structures is crucial in chess as they shape the character of the position and influence
          long-term strategy. Mastering pawn structure analysis will greatly improve your positional understanding and
          decision-making.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Pawns are often called the "soul of chess." Their structure determines the nature of the position and the
          plans for both sides. Pay close attention to pawn formations and their implications for piece placement and
          strategy.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={pawnStructureExamples[currentExample].fen}
          initialFen={pawnStructureExamples[currentExample].fen}
          title={pawnStructureExamples[currentExample].title}
          description={pawnStructureExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Structure Analysis</h4>
          <ul className="list-disc pl-5 space-y-2">
            {pawnStructureExamples[currentExample].explanation.map((point, index) => (
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
          <span className="text-[14px] --sm text-muted-foreground">
            {currentExample + 1} of {pawnStructureExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="principles">Pawn Structure Principles</TabsTrigger>
          <TabsTrigger value="structures">Common Structures</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-2">
            {pawnStructurePrinciples.map((principle, index) => (
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

        <TabsContent value="structures">
          <div className="grid gap-6 md:grid-cols-2">
            {commonPawnStructures.map((structure, index) => (
              <motion.div
                key={structure.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{structure.title}</h3>
                    <p className="text-gray-600 mb-4">{structure.description}</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {structure.key_points.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-[14px] --sm text-gray-600">
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

        <TabsContent value="analysis">
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Identify Weaknesses</h3>
                  <p className="text-gray-600 mb-4">
                    Look for pawn weaknesses that can be exploited in the current position and future play.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Isolated pawns</li>
                    <li>Backward pawns</li>
                    <li>Doubled pawns</li>
                    <li>Holes in pawn structure</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Evaluate Pawn Breaks</h3>
                  <p className="text-gray-600 mb-4">
                    Assess potential pawn moves that can change the pawn structure and create new opportunities.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Central breaks (e.g., d5 in closed positions)</li>
                    <li>Flank breaks to create passed pawns</li>
                    <li>Breaks to open lines for pieces</li>
                    <li>Prophylactic breaks to prevent opponent's plans</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Consider Long-term Implications</h3>
                  <p className="text-gray-600 mb-4">
                    Analyze how the current pawn structure might influence the endgame and long-term strategy.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Potential passed pawns</li>
                    <li>Pawn majorities on each side</li>
                    <li>Pawn islands and their impact</li>
                    <li>Influence on piece activity and mobility</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Effective Pawn Structure Analysis</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always consider the pawn structure when evaluating a position</li>
          <li>Look for ways to improve your pawn structure and weaken your opponent's</li>
          <li>Practice identifying common pawn structures and their implications</li>
          <li>Study master games to see how strong players handle various pawn structures</li>
          <li>Be aware of how pawn moves can irreversibly change the character of the position</li>
        </ul>
      </motion.div>
    </div>
  )
}

