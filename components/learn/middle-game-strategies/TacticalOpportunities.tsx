"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Zap, Target, Crosshair, Sword } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tacticalExamples = [
  {
    fen: "r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1P4/2N5/PP3PPP/R1BQK2R w KQkq - 0 9",
    title: "Fork",
    description: "A tactic where a single piece attacks two or more enemy pieces simultaneously.",
    explanation: [
      "White can play Nxd5, forking Black's queen and rook",
      "This fork forces Black to lose material",
      "If Black captures the knight, White can recapture with the bishop",
      "This tactic demonstrates the power of centralized pieces",
    ],
  },
  {
    fen: "r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1n4/2N5/PP3PPP/R1BQK2R w KQkq - 0 10",
    title: "Pin",
    description: "A situation where a piece can't move because it would expose a more valuable piece to capture.",
    explanation: [
      "Black's knight on d4 is pinning White's c3 knight to the king",
      "White can't move the c3 knight without exposing the king to check",
      "This pin limits White's options and creates tactical opportunities for Black",
      "Pins are powerful because they restrict the opponent's piece mobility",
    ],
  },
  {
    fen: "r1bq1rk1/ppp2ppp/2n5/1B1pP3/1b1R4/2N5/PP3PPP/R1BQ2K1 b - - 0 11",
    title: "Skewer",
    description:
      "Similar to a pin, but the more valuable piece is in front. When it moves, the piece behind it can be captured.",
    explanation: [
      "Black can play Bxd4, creating a skewer",
      "This move attacks White's rook, forcing it to move",
      "When the rook moves, it exposes the knight behind it to capture",
      "Skewers often lead to material gain or positional advantages",
    ],
  },
  {
    fen: "r1bq1rk1/ppp2ppp/2n5/1B1pP3/3R4/2N5/PP3PPP/R1BQ2K1 w - - 0 12",
    title: "Discovered Attack",
    description: "An attack that is revealed when one piece moves out of the way of another.",
    explanation: [
      "White can play Nxd5, revealing an attack by the rook on Black's queen",
      "This move simultaneously threatens Black's queen and creates a knight fork",
      "Discovered attacks are powerful because they often create multiple threats",
      "They can be hard to spot, making them a potent tactical weapon",
    ],
  },
]

const tacticalMotifs = [
  {
    title: "Double Attack",
    icon: <Zap className="h-6 w-6" />,
    description: "Creating two threats simultaneously, forcing the opponent to address both.",
    key_points: [
      "Can involve different pieces or a combination of piece attacks and checkmate threats",
      "Often leads to material gain or significant positional advantage",
      "Requires careful calculation to ensure both threats are genuine",
      "Can be set up through piece maneuvers or pawn pushes",
    ],
  },
  {
    title: "Zwischenzug",
    icon: <Target className="h-6 w-6" />,
    description: "An 'in-between' move that changes the situation on the board before making an expected move.",
    key_points: [
      "Can disrupt opponent's plans or create unexpected threats",
      "Often used to improve one's position before capturing a piece or making an expected defensive move",
      "Requires thinking beyond the obvious moves",
      "Can lead to significant material or positional gains",
    ],
  },
  {
    title: "Overloaded Piece",
    icon: <Crosshair className="h-6 w-6" />,
    description: "Exploiting a piece that is responsible for defending multiple important elements.",
    key_points: [
      "Identify pieces that are crucial for defending multiple targets",
      "Create threats that force the overloaded piece to abandon one of its defensive duties",
      "Can lead to material gain or positional collapse",
      "Often combined with other tactical motifs for maximum effect",
    ],
  },
  {
    title: "Clearance Sacrifice",
    icon: <Sword className="h-6 w-6" />,
    description: "Sacrificing a piece to clear a square or line for another piece.",
    key_points: [
      "Often used to open lines for attacking pieces",
      "Can be used to expose the enemy king or create mating threats",
      "Requires accurate calculation of the resulting position",
      "The sacrificed piece is usually less valuable than the resulting attack",
    ],
  },
]

const tacticalPrinciples = [
  {
    title: "Calculation",
    description: "The process of visualizing and evaluating future positions.",
    steps: [
      "Identify candidate moves",
      "Visualize the resulting position after each move",
      "Evaluate the opponent's best responses",
      "Continue this process several moves deep",
      "Compare the end positions of different variations",
    ],
  },
  {
    title: "Pattern Recognition",
    description: "Identifying common tactical motifs and positional patterns.",
    steps: [
      "Study classic tactical patterns (forks, pins, skewers, etc.)",
      "Practice tactical puzzles regularly",
      "Analyze master games focusing on tactical moments",
      "Look for piece configurations that resemble known patterns",
      "Consider how patterns can be combined or modified in a given position",
    ],
  },
  {
    title: "Threat Assessment",
    description: "Identifying and evaluating threats from both sides.",
    steps: [
      "After each move, ask 'What is my opponent threatening?'",
      "Identify which pieces are under attack or could be attacked",
      "Consider potential tactical motifs your opponent might employ",
      "Evaluate the severity of each threat",
      "Prioritize addressing the most critical threats",
    ],
  },
  {
    title: "Creating Weaknesses",
    description: "Deliberately creating or exploiting weaknesses in the opponent's position.",
    steps: [
      "Identify potential weaknesses in pawn structure or piece placement",
      "Look for ways to force the opponent to create weaknesses",
      "Use pawn levers to open lines or create targets",
      "Consider sacrifices that might expose the opponent's king",
      "Create multiple weaknesses to overload the opponent's defense",
    ],
  },
]

export function TacticalOpportunities() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % tacticalExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + tacticalExamples.length) % tacticalExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tactical Opportunities</h2>
        <p className="text-gray-600 mb-6">
          Tactical opportunities are short-term combinations that can lead to material gain, positional advantage, or
          even checkmate. Recognizing and capitalizing on these opportunities is crucial for success in chess,
          particularly in the dynamic middlegame phase.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          While looking for tactical opportunities, it's important to balance tactical play with strategic
          considerations. A tactic that wins material but worsens your overall position might not always be the best
          choice. Always evaluate the resulting position after a tactical sequence.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={tacticalExamples[currentExample].fen}
          initialFen={tacticalExamples[currentExample].fen}
          title={tacticalExamples[currentExample].title}
          description={tacticalExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Tactical Analysis</h4>
          <ul className="list-disc pl-5 space-y-2">
            {tacticalExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {tacticalExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="motifs" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="motifs">Tactical Motifs</TabsTrigger>
          <TabsTrigger value="principles">Tactical Principles</TabsTrigger>
        </TabsList>

        <TabsContent value="motifs">
          <div className="grid gap-6 md:grid-cols-2">
            {tacticalMotifs.map((motif, index) => (
              <motion.div
                key={motif.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-blue-600">{motif.icon}</div>
                      <h3 className="text-lg font-semibold text-blue-600">{motif.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{motif.description}</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {motif.key_points.map((point, pointIndex) => (
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

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-2">
            {tacticalPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{principle.title}</h3>
                    <p className="text-gray-600 mb-4">{principle.description}</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      {principle.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-[14px] --sm text-gray-600">
                          {step}
                        </li>
                      ))}
                    </ol>
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
          Tips for Spotting and Exploiting Tactical Opportunities
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always consider your opponent's last move and what weaknesses it might have created</li>
          <li>Look for loose (undefended) pieces that could be targeted</li>
          <li>Check for alignment of pieces that could lead to pins, skewers, or discovered attacks</li>
          <li>Consider how your pieces could work together to create threats</li>
          <li>Practice tactical puzzles regularly to improve your pattern recognition</li>
          <li>Analyze your games to identify missed tactical opportunities</li>
          <li>Study classic games focusing on how strong players create and exploit tactical chances</li>
          <li>Develop a mental checklist of tactical motifs to look for in each position</li>
          <li>Don't forget to consider your opponent's tactical possibilities as well</li>
          <li>Remember that tactics often arise from good positional play and piece coordination</li>
        </ul>
      </motion.div>
    </div>
  )
}

