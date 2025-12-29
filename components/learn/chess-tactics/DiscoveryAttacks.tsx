"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Eye } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const discoveryExamples = [
  {
    fen: "r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    title: "Discovered Attack",
    description: "A tactic where moving one piece reveals an attack by another piece.",
    explanation: [
      "White can play Bxf7+, a discovered attack on the black queen",
      "When the bishop moves, it reveals an attack by the queen on the c6 knight",
      "This move creates two threats: checkmate and capturing the knight",
      "Discovered attacks are powerful because they create multiple threats simultaneously",
    ],
  },
  {
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6",
    title: "Discovered Check",
    description: "A special type of discovered attack where the revealed attack is a check.",
    explanation: [
      "White can play Nxe5, revealing a check from the bishop on c4",
      "This move attacks the knight on c6 while simultaneously checking the king",
      "Discovered checks are particularly powerful as they force the opponent to deal with the check",
      "This often allows the moving piece to capture material or create additional threats",
    ],
  },
]

const discoveryPrinciples = [
  {
    title: "Creating Discoveries",
    icon: <Eye className="h-6 w-6" />,
    points: [
      "Look for pieces that are aligned with enemy pieces or the king",
      "Identify moves that can reveal attacks by other pieces",
      "Consider how the moving piece can create additional threats",
      "Use discoveries to create multiple threats simultaneously",
    ],
  },
  {
    title: "Exploiting Discoveries",
    icon: <Eye className="h-6 w-6" />,
    points: [
      "Use discovered attacks to gain material advantage",
      "Employ discovered checks to force the opponent's king to move",
      "Combine discoveries with other tactical motifs for maximum effect",
      "Use discoveries to create positional pressure and limit opponent's options",
    ],
  },
  {
    title: "Defending Against Discoveries",
    icon: <Eye className="h-6 w-6" />,
    points: [
      "Be aware of potential discovered attacks in your opponent's position",
      "Avoid aligning your pieces in ways that allow discoveries",
      "When faced with a discovery, look for counter-attacking possibilities",
      "Consider prophylactic moves to prevent discoveries before they happen",
    ],
  },
]

export function DiscoveryAttacks() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % discoveryExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + discoveryExamples.length) % discoveryExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Discovery Attacks</h2>
        <p className="text-gray-600 mb-6">
          A discovery attack is a powerful tactical motif in chess where moving one piece reveals an attack by another
          piece. This tactic can create multiple threats simultaneously, often leading to material gain or a decisive
          advantage.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Discovered attacks are particularly effective because they often create two threats at once: one from the
          piece being moved, and another from the piece being revealed. Discovered checks are especially powerful as
          they force the opponent to deal with the check immediately.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={discoveryExamples[currentExample].fen}
          initialFen={discoveryExamples[currentExample].fen}
          title={discoveryExamples[currentExample].title}
          description={discoveryExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {discoveryExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {discoveryExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Discovery Principles</TabsTrigger>
          <TabsTrigger value="exercises">Discovery Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {discoveryPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify the Discovery</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the best discovery opportunity for White.
                </p>
                <ChessExample
                  initialFen="r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6"
                  title="Discovery Identification"
                  description="White to move. Find the best discovery."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Create a Discovery</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the move that creates a powerful discovered attack for Black.
                </p>
                <ChessExample
                  initialFen="r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R b KQkq - 0 6"
                  title="Creating a Discovery"
                  description="Black to move. Create a strong discovered attack."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Discovery Tactics</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for pieces that are aligned with enemy pieces or the king</li>
          <li>Practice identifying and creating discoveries in tactical puzzles</li>
          <li>Consider how the moving piece can create additional threats in a discovery</li>
          <li>Remember that discovered checks are particularly powerful</li>
          <li>Combine discoveries with other tactical motifs for maximum effect</li>
          <li>Be aware of potential discoveries against your own pieces and take preventive measures</li>
        </ul>
      </motion.div>
    </div>
  )
}

