"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Shield, Sword, Crosshair, Move } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const defensiveExamples = [
  {
    fen: "r1bqk2r/ppp2ppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQK2R b KQkq - 0 7",
    title: "Prophylaxis",
    description: "Anticipating and preventing the opponent's threats before they materialize.",
    explanation: [
      "Black's knight on f6 prevents White's e4 push",
      "The pawn on e6 controls the d5 square, limiting White's piece activity",
      "Black's pieces are ready to react to White's potential kingside expansion",
      "This prophylactic setup gives Black a solid defensive position",
    ],
  },
  {
    fen: "r1bq1rk1/ppp1nppp/3p1n2/3P4/1b2P3/2N1BN2/PP3PPP/R2QKB1R w KQ - 0 9",
    title: "Fortress",
    description: "Creating a strong defensive structure that's difficult for the opponent to break through.",
    explanation: [
      "Black has created a solid pawn chain with ...e6 and ...d6",
      "The knights on f6 and e7 form a strong defensive barrier",
      "The light-squared bishop on b4 pins the white knight, limiting its mobility",
      "This fortress-like structure is challenging for White to attack",
    ],
  },
  {
    fen: "r1bqk2r/pp2bppp/2n1pn2/2pp4/3P4/2N1PN2/PPP1BPPP/R1BQK2R w KQkq - 0 7",
    title: "Counter-Attack",
    description: "Responding to an attack with a counter-attack, often in a different part of the board.",
    explanation: [
      "Black has pushed ...c5 and ...d5, creating tension in the center",
      "The bishop on e7 is ready to support a potential kingside attack",
      "Black's pieces are actively placed, ready to exploit any weaknesses in White's position",
      "This counter-attacking stance puts pressure on White and complicates their attacking plans",
    ],
  },
  {
    fen: "r2qk2r/ppp1bppp/2n2n2/3p4/3P4/2N1BN2/PP2BPPP/R2QK2R b KQkq - 3 8",
    title: "Piece Exchange",
    description: "Exchanging pieces to relieve pressure and simplify the position.",
    explanation: [
      "Black has exchanged their light-squared bishop for White's knight",
      "This exchange has reduced White's attacking potential",
      "The simplified position is easier for Black to defend",
      "Black's remaining pieces are well-coordinated for defense",
    ],
  },
]

const defensivePrinciples = [
  {
    title: "Prophylaxis",
    icon: <Shield className="h-6 w-6" />,
    points: [
      "Anticipate opponent's plans",
      "Prevent threats before they occur",
      "Limit opponent's piece activity",
      "Create a solid pawn structure",
    ],
  },
  {
    title: "Active Defense",
    icon: <Sword className="h-6 w-6" />,
    points: [
      "Counter-attack when possible",
      "Maintain piece activity while defending",
      "Look for tactical opportunities",
      "Create threats to complicate opponent's plans",
    ],
  },
  {
    title: "Piece Coordination",
    icon: <Move className="h-6 w-6" />,
    points: [
      "Ensure pieces work together",
      "Cover weak squares",
      "Create a defensive network",
      "Maintain flexibility in your defense",
    ],
  },
  {
    title: "Evaluation",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Assess the nature of the threat",
      "Identify critical defensive resources",
      "Consider long-term implications of defensive moves",
      "Balance between over-defending and under-defending",
    ],
  },
]

const commonDefensivePatterns = [
  {
    title: "Fianchetto",
    description: "Developing the bishop to g2/g7 or b2/b7 for a strong defensive setup.",
    key_points: [
      "Provides long-range control over central squares",
      "Creates a solid pawn structure around the king",
      "Offers flexibility in pawn advances",
      "Can quickly transition to offense if needed",
    ],
  },
  {
    title: "Hedgehog",
    description: "A flexible defensive setup often used against 1.e4 openings.",
    key_points: [
      "Pawns on a6, b6, d6, and e6 create a solid structure",
      "Pieces are developed behind this pawn formation",
      "Allows for counter-attacking opportunities",
      "Difficult for opponents to create weaknesses",
    ],
  },
  {
    title: "King's Indian Defense",
    description: "A hypermodern defense that allows White to occupy the center with pawns.",
    key_points: [
      "Black develops pieces to solid squares (e.g., Nf6, Bg7)",
      "Prepares for a timely ...e5 or ...c5 break",
      "Often leads to dynamic middlegame positions",
      "Requires good understanding of pawn structures",
    ],
  },
  {
    title: "Stonewall Formation",
    description: "A solid pawn structure often used in Dutch Defense variations.",
    key_points: [
      "Pawns on d5, e6, and f5 create a wall",
      "Strong control over the e4 square",
      "Can be used as a defensive or attacking formation",
      "Requires careful piece placement to avoid weaknesses",
    ],
  },
]

export function DefenseTechniques() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % defensiveExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + defensiveExamples.length) % defensiveExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Defense Techniques</h2>
        <p className="text-gray-600 mb-6">
          Mastering defensive techniques is crucial in chess. A strong defense can frustrate your opponent's attacks,
          create opportunities for counterplay, and turn the tables in your favor.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Remember, good defense is not just about reacting to threats, but also about creating a solid position that's
          difficult to attack. Always look for ways to improve your position while defending.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={defensiveExamples[currentExample].fen}
          initialFen={defensiveExamples[currentExample].fen}
          title={defensiveExamples[currentExample].title}
          description={defensiveExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Position Analysis</h4>
          <ul className="list-disc pl-5 space-y-2">
            {defensiveExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {defensiveExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="principles">Defensive Principles</TabsTrigger>
          <TabsTrigger value="patterns">Common Patterns</TabsTrigger>
          <TabsTrigger value="techniques">Advanced Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-2">
            {defensivePrinciples.map((principle, index) => (
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

        <TabsContent value="patterns">
          <div className="grid gap-6 md:grid-cols-2">
            {commonDefensivePatterns.map((pattern, index) => (
              <motion.div
                key={pattern.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{pattern.title}</h3>
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

        <TabsContent value="techniques">
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Fortification</h3>
                  <p className="text-gray-600 mb-4">
                    Creating a strong defensive structure around your king or key squares.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Use pawns to create a shield</li>
                    <li>Position pieces to cover weak squares</li>
                    <li>Maintain flexibility in your fortress</li>
                    <li>Be prepared for potential sacrifices</li>
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
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Dynamic Defense</h3>
                  <p className="text-gray-600 mb-4">
                    Defending actively by creating counterplay and threats of your own.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Look for tactical opportunities</li>
                    <li>Create threats while defending</li>
                    <li>Maintain piece activity</li>
                    <li>Be ready to transition to attack</li>
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
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Prophylactic Defense</h3>
                  <p className="text-gray-600 mb-4">
                    Anticipating and preventing threats before they become dangerous.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Identify potential threats early</li>
                    <li>Make moves that limit opponent's options</li>
                    <li>Create a solid pawn structure</li>
                    <li>Position pieces to cover weak points</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Successful Defense</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Stay calm and assess the position objectively</li>
          <li>Look for ways to improve your position while defending</li>
          <li>Don't defend passively; seek counterplay when possible</li>
          <li>Be willing to sacrifice material for positional compensation</li>
          <li>Practice defensive techniques regularly to improve your skills</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="defense-techniques" />
      </div>
    </div>
  )
}

