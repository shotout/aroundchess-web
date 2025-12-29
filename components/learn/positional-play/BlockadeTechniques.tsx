"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CircleDashedIcon as ListDashes, Target, Crosshair } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const blockadeExamples = [
  {
    fen: "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
    title: "Pawn Blockade",
    description: "White's knight on c3 blockades Black's e-pawn, preventing it from advancing.",
    explanation: [
      "The knight on c3 controls the d5 square, effectively blocking the e-pawn.",
      "Black's e-pawn cannot advance without being captured.",
      "This blockade restricts Black's central pawn expansion and can create weaknesses.",
      "Pawn blockades are common and can be a strong positional tool.",
      "Understanding how to create and utilize blockades is crucial in positional play.",
    ],
  },
  {
    fen: "rnbqk1nr/ppp2ppp/3b4/3pp3/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 4",
    title: "Piece Blockade",
    description: "White's bishop on d3 blockades Black's d-pawn, restricting its movement.",
    explanation: [
      "The bishop on d3 controls the e4 square, preventing the d-pawn from advancing.",
      "This blockade restricts Black's central pawn expansion and can create weaknesses.",
      "Piece blockades can be effective in controlling key squares and limiting opponent's options.",
      "Understanding how to create and utilize blockades is crucial in positional play.",
      "This blockade can be maintained by White's pieces, creating long-term positional pressure.",
    ],
  },
]

const blockadePrinciples = [
  {
    title: "Creating Blockades",
    icon: <ListDashes className="h-6 w-6" />,
    points: [
      "Use pieces to control key squares in front of enemy pawns.",
      "Target pawns that are difficult for your opponent to defend.",
      "Consider how the blockade affects the overall pawn structure.",
      "Look for opportunities to create blockades that restrict multiple pieces.",
    ],
  },
  {
    title: "Exploiting Blockades",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Attack the base of the blockade to undermine its strength.",
      "Use the blockade to create weaknesses in your opponent's position.",
      "Place pieces on strong squares that support the blockade.",
      "Consider pawn breaks that can challenge the blockade.",
    ],
  },
  {
    title: "Breaking Blockades",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Advance the blocked pawn if it can be supported effectively.",
      "Use pieces to attack the blockading piece.",
      "Consider exchanges that can remove the blockading piece.",
      "Look for pawn breaks that can circumvent the blockade.",
    ],
  },
]

export function BlockadeTechniques() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % blockadeExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + blockadeExamples.length) % blockadeExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Blockade Techniques</h2>
        <p className="text-gray-600 mb-6">
          Blockades are a powerful positional tool in chess, used to restrict your opponent's pieces and control key
          squares. A blockade involves using your pieces to prevent the advance of enemy pawns or to limit the movement
          of their pieces. Mastering blockade techniques can give you a significant positional advantage in your games.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Blockades are most effective when they target pawns that are difficult for your opponent to defend or when
          they restrict the movement of multiple pieces. A well-executed blockade can create weaknesses in your
          opponent's position and limit their options.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={blockadeExamples[currentExample].fen}
          initialFen={blockadeExamples[currentExample].fen}
          title={blockadeExamples[currentExample].title}
          description={blockadeExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {blockadeExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {blockadeExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Blockade Principles</TabsTrigger>
          <TabsTrigger value="exercises">Practice Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {blockadePrinciples.map((principle, index) => (
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

        <TabsContent value="exercises">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Create a Blockade</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, find the best way for White to create a blockade.
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
                  title="Creating a Blockade"
                  description="White to move. Create a blockade."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Exploit a Blockade</h3>
                <p className="text-gray-600 mb-4">
                  In this position, how can White best exploit the blockade on the e-file?
                </p>
                <ChessExample
                  initialFen="rnbqkbnr/ppp2ppp/3p4/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3"
                  title="Exploiting a Blockade"
                  description="White to move. Exploit the blockade."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Blockade Techniques</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for potential blockades in your games.</li>
          <li>Practice creating and exploiting blockades in tactical puzzles and your own games.</li>
          <li>Consider how blockades affect the overall pawn structure and piece activity.</li>
          <li>Look for opportunities to combine blockades with other positional and tactical concepts.</li>
          <li>Be aware of potential blockades against your own pieces and take preventive measures.</li>
          <li>Study master games to see how strong players utilize blockades in various situations.</li>
        </ul>
      </motion.div>
    </div>
  )
}

