"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, PuzzleIcon as PuzzlePiece, Target, Shield } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pawnStructureExamples = [
{
  fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3P4/4P3/PPP2PPP/RNBQKBNR w KQkq - 0 1",
  title: "Isolated Queen's Pawn (IQP)",
  description: "A common pawn structure where White has an isolated pawn on d4.",
  explanation: [
    "The d4 pawn has no supporting pawns on adjacent files",
    "This creates both strengths and weaknesses in the position",
    "The isolated pawn provides space advantage and piece activity",
    "However, it can also become a target for the opponent's pieces",
    "Understanding how to play with and against IQP positions is crucial"
  ],
},
{
  fen: "rnbqkbnr/pp1p1ppp/4p3/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR w KQkq - 0 1",
  title: "Hanging Pawns",
  description: "A structure where two pawns stand side by side without support from adjacent pawns.",
  explanation: [
    "The c3 and d4 pawns form a hanging pawn structure",
    "These pawns can advance to control central squares",
    "They provide excellent support for piece activity",
    "However, they can become weak if forced to advance or separate",
    "Proper timing of pawn advances is critical in such positions"
  ],
},
{
  fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3P4/2N1P3/PPP2PPP/R1BQKBNR b KQkq - 0 1",
  title: "Pawn Chain",
  description: "A diagonal formation of pawns protecting each other.",
  explanation: [
    "The e3-d4 pawns form a classic pawn chain",
    "The base of the chain (e3) is typically the strongest point",
    "The advance point (d4) can become a target",
    "Pawn chains define the character of the position",
    "They often indicate which side of the board to play on"
  ],
},
{
  fen: "rnbqkbnr/ppp3pp/4p3/3p1p2/3P4/2N1P3/PPP2PPP/R1BQKBNR w KQkq - 0 1",
  title: "Backward Pawn",
  description: "A pawn that has fallen behind its neighbors and cannot be safely advanced.",
  explanation: [
    "The e6 pawn is backward, unable to advance safely",
    "It requires constant protection from pieces",
    "The square in front of a backward pawn is often weak",
    "Opponents can establish strong pieces in front of backward pawns",
    "Understanding how to create and exploit backward pawns is crucial"
  ],
},
]

const pawnStructurePrinciples = [
  {
    title: "Central Control",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Control the center with pawns when possible",
      "Use pawn chains to establish central presence",
      "Consider the balance between central control and pawn weaknesses",
      "Prepare pawn breaks to challenge opponent's central control",
      "Understand when to exchange central pawns",
    ],
  },
  {
    title: "Pawn Weaknesses",
    icon: <Shield className="h-6 w-6" />,
    points: [
      "Identify and create pawn weaknesses in opponent's camp",
      "Protect against the creation of weak pawns in your position",
      "Use pieces to attack enemy pawn weaknesses",
      "Consider long-term implications of pawn weaknesses",
      "Know how to minimize the impact of your own weak pawns",
    ],
  },
  {
    title: "Pawn Breaks",
    icon: <PuzzlePiece className="h-6 w-6" />,
    points: [
      "Identify key pawn breaks in different structures",
      "Time your pawn breaks correctly",
      "Prepare pawn breaks with piece play",
      "Understand which pawn breaks favor your position",
      "React appropriately to opponent's pawn breaks",
    ],
  },
]

const commonPawnStructures = [
  {
    title: "Carlsbad Structure",
    description: "A common structure arising from the Queen's Gambit, characterized by a central pawn mass.",
    key_points: [
      "Central pawns on e3/c3 vs e6/c6",
      "Focus on minority attack on the queenside",
      "Control of the e5 square is crucial",
      "Understanding piece placement around the structure",
      "Typical plans and strategies for both sides",
    ],
  },
  {
    title: "Hedgehog Structure",
    description: "A flexible pawn structure where Black adopts a solid, defensive setup.",
    key_points: [
      "Pawns on a6, b6, d6, and e6",
      "Emphasis on piece activity within the structure",
      "Preparation of ...b5 and ...d5 breaks",
      "Understanding when to strike with pawn breaks",
      "Proper piece placement within the structure",
    ],
  },
  {
    title: "Maroczy Bind",
    description: "A pawn structure with pawns on c4 and e4, controlling central squares.",
    key_points: [
      "Strong control over the d5 square",
      "Restricted piece mobility for the opponent",
      "Understanding typical piece placements",
      "Key pawn breaks to challenge the structure",
      "Plans for both sides in this formation",
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
          Understanding pawn structures is fundamental to positional chess. Pawns are often called the 'soul of chess'
          because they create a framework that influences every aspect of the game. Learning to analyze and work with
          different pawn structures will significantly improve your strategic understanding and results.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Pawn structures are relatively permanent and determine the character of the position. They influence piece
          placement, potential attacks, and the overall strategic direction of the game. Every pawn move creates a
          lasting impact on the position.
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
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
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
          <TabsTrigger value="principles">Core Principles</TabsTrigger>
          <TabsTrigger value="structures">Common Structures</TabsTrigger>
          <TabsTrigger value="practice">Practice Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
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
          <div className="grid gap-6 md:grid-cols-3">
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

        <TabsContent value="practice">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify Weaknesses</h3>
                <p className="text-gray-600 mb-4">
                  Study this position and identify the pawn weaknesses for both sides. Consider how they might be
                  exploited.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pp1p1ppp/4p3/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR w KQkq - 0 1"
                  title="Pawn Weakness Analysis"
                  description="Analyze the pawn weaknesses in this position."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Plan Formation</h3>
                <p className="text-gray-600 mb-4">
                  Given this pawn structure, develop a plan for both sides. Consider pawn breaks and piece placement.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/ppp2ppp/4p3/3p4/3P4/4P3/PPP2PPP/RNBQKBNR w KQkq - 0 1"
                  title="Strategic Planning"
                  description="Develop plans based on the pawn structure."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Concepts</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Dynamic Pawn Play</h4>
            <p className="text-gray-600 mb-4">
              Understanding when to maintain pawn tension and when to release it is crucial. Consider these factors:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Piece activity and coordination</li>
              <li>Control of key squares</li>
              <li>Potential pawn breaks</li>
              <li>King safety implications</li>
              <li>Long-term structural considerations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Transformation of Advantages</h4>
            <p className="text-gray-600 mb-4">
              Learn how to convert pawn structure advantages into other types of advantages:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Converting space advantage into attacking chances</li>
              <li>Using pawn weaknesses to gain positional control</li>
              <li>Exploiting better pawn structure in the endgame</li>
              <li>Creating passed pawns through structural advantages</li>
              <li>Timing of tactical opportunities based on structure</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

