"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Eraser } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const clearanceSacrificeExamples = [
  {
    fen: "r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1P4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 7",
    title: "Bishop Clearance Sacrifice",
    description: "A sacrifice to clear a square or line for another piece.",
    explanation: [
      "White can play Bxc6, sacrificing the bishop to clear the b5 square",
      "After Black recaptures with bxc6, White can play Qb3, attacking the b4 bishop and the f7 pawn",
      "This clearance sacrifice opens up powerful attacking possibilities for White",
      "The sacrifice demonstrates how clearing a key square can lead to a strong initiative",
    ],
  },
  {
    fen: "r1bqk2r/ppp2ppp/2n5/3pP3/1b1P4/2N5/PPP2PPP/R1BQK1NR w KQkq - 0 7",
    title: "Pawn Clearance Sacrifice",
    description: "A pawn sacrifice to open a file or diagonal for a major piece.",
    explanation: [
      "White can play e6, sacrificing the pawn to open the e-file",
      "If Black captures fxe6, White can follow up with Bg5, pinning the queen to the king",
      "This clearance sacrifice creates immediate attacking chances for White",
      "It demonstrates how even a pawn sacrifice can dramatically change the position",
    ],
  },
]

const clearanceSacrificePrinciples = [
  {
    title: "Identifying Clearance Opportunities",
    icon: <Eraser className="h-6 w-6" />,
    points: [
      "Look for pieces blocking important squares or lines",
      "Consider how removing a piece could improve your position",
      "Evaluate the potential gains against the material sacrificed",
      "Think several moves ahead to see the full potential of the clearance",
    ],
  },
  {
    title: "Executing Clearance Sacrifices",
    icon: <Eraser className="h-6 w-6" />,
    points: [
      "Calculate the variations carefully before committing to the sacrifice",
      "Ensure you have sufficient compensation for the sacrificed material",
      "Look for forcing moves that make the clearance sacrifice more effective",
      "Be prepared to follow up the sacrifice with aggressive play",
    ],
  },
  {
    title: "Defending Against Clearance Sacrifices",
    icon: <Eraser className="h-6 w-6" />,
    points: [
      "Be aware of potential clearance sacrifices in your opponent's position",
      "Consider declining the sacrifice if accepting would worsen your position",
      "Look for defensive moves that nullify the purpose of the clearance",
      "Be prepared to return material to ease the pressure if necessary",
    ],
  },
]

export function ClearanceSacrifices() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % clearanceSacrificeExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + clearanceSacrificeExamples.length) % clearanceSacrificeExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Clearance Sacrifices</h2>
        <p className="text-gray-600 mb-6">
          Clearance sacrifices are powerful tactical motifs in chess where a piece is sacrificed to clear a square,
          file, or diagonal for another piece. These sacrifices can lead to devastating attacks or positional advantages
          when executed correctly.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          The essence of a clearance sacrifice is to improve the position of your remaining pieces at the cost of
          material. The key is to ensure that the resulting position offers sufficient compensation for the sacrificed
          material.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={clearanceSacrificeExamples[currentExample].fen}
          initialFen={clearanceSacrificeExamples[currentExample].fen}
          title={clearanceSacrificeExamples[currentExample].title}
          description={clearanceSacrificeExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {clearanceSacrificeExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {clearanceSacrificeExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Clearance Sacrifice Principles</TabsTrigger>
          <TabsTrigger value="exercises">Clearance Sacrifice Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {clearanceSacrificePrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  Exercise 1: Identify the Clearance Sacrifice
                </h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the best clearance sacrifice for White.
                </p>
                <ChessExample
                  initialFen="r1bqk2r/ppp2ppp/2n5/1B1pP3/1b1P4/2N5/PPP2PPP/R1BQK2R w KQkq - 0 7"
                  title="Clearance Sacrifice Identification"
                  description="White to move. Find the best clearance sacrifice."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Execute a Clearance Sacrifice</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the move that creates a powerful clearance sacrifice for Black.
                </p>
                <ChessExample
                  initialFen="r1bqk2r/ppp2ppp/2n5/3pP3/1b1P4/2N5/PPP2PPP/R1BQK1NR b KQkq - 0 7"
                  title="Executing a Clearance Sacrifice"
                  description="Black to move. Create a strong clearance sacrifice."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Clearance Sacrifices</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always look for pieces that are blocking important squares or lines for your other pieces</li>
          <li>Practice identifying potential clearance sacrifices in tactical puzzles and your own games</li>
          <li>Calculate the variations carefully before committing to a clearance sacrifice</li>
          <li>Ensure you have sufficient compensation for the sacrificed material</li>
          <li>Look for forcing moves that make the clearance sacrifice more effective</li>
          <li>Be prepared to follow up the sacrifice with aggressive play to maximize its impact</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="clearance-sacrifices" />
      </div>
    </div>
  )
}

