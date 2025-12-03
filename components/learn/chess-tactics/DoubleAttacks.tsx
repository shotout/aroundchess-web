"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Swords } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const doubleAttackExamples = [
  {
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    title: "Queen Double Attack",
    description: "A double attack using the queen to target two pieces simultaneously.",
    explanation: [
      "White can play Qh5, attacking both the f7 pawn and the e5 pawn",
      "This move creates two threats that Black must address",
      "If Black defends one threat, White can capitalize on the other",
      "Double attacks with the queen are powerful due to the queen's mobility",
    ],
  },
  {
    fen: "r1bqkb1r/ppp2ppp/2n2n2/3pp3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5",
    title: "Knight Double Attack",
    description: "A double attack using a knight to target two pieces or squares.",
    explanation: [
      "White can play Ng5, attacking both the f7 pawn and the e6 square",
      "This move threatens both a fork on e6 and an attack on the weak f7 pawn",
      "Knight double attacks are often unexpected and hard to defend against",
      "This type of attack showcases the knight's unique movement capabilities",
    ],
  },
]

const doubleAttackPrinciples = [
  {
    title: "Creating Double Attacks",
    icon: <Swords className="h-6 w-6" />,
    points: [
      "Look for opportunities to attack multiple targets with a single move",
      "Consider using pieces with long-range movement like queens and rooks",
      "Knights can create powerful double attacks due to their unique movement",
      "Combine pawn moves with piece attacks for unexpected double threats",
    ],
  },
  {
    title: "Exploiting Double Attacks",
    icon: <Swords className="h-6 w-6" />,
    points: [
      "Force your opponent to choose between two unfavorable options",
      "Use double attacks to gain material or positional advantages",
      "Create double attacks that include a check for maximum effectiveness",
      "Combine double attacks with other tactical motifs for complex threats",
    ],
  },
  {
    title: "Defending Against Double Attacks",
    icon: <Swords className="h-6 w-6" />,
    points: [
      "Be aware of potential double attack threats in your opponent's position",
      "Look for moves that can defend against both threats simultaneously",
      "Consider counter-attacking to shift the initiative",
      "Sometimes sacrificing the lesser piece is the best defensive option",
    ],
  },
]

export function DoubleAttacks() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % doubleAttackExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + doubleAttackExamples.length) % doubleAttackExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Double Attacks</h2>
        <p className="text-gray-600 mb-6">
          A double attack is a powerful tactical motif in chess where a single move creates two simultaneous threats.
          This forces the opponent to address multiple issues at once, often leading to material gain or a significant
          positional advantage.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Double attacks are most effective when the two threats are difficult to address with a single move. The
          strength of a double attack lies in forcing the opponent to choose between two unfavorable options.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={doubleAttackExamples[currentExample].fen}
          initialFen={doubleAttackExamples[currentExample].fen}
          title={doubleAttackExamples[currentExample].title}
          description={doubleAttackExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-2">
            {doubleAttackExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {doubleAttackExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Double Attack Principles</TabsTrigger>
          <TabsTrigger value="exercises">Double Attack Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-3">
            {doubleAttackPrinciples.map((principle, index) => (
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 1: Identify the Double Attack</h3>
                <p className="text-gray-600 mb-4">
                  In the following position, identify the best double attack opportunity for White.
                </p>
                <ChessExample
                  initialFen="r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4"
                  title="Double Attack Identification"
                  description="White to move. Find the best double attack."
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Exercise 2: Create a Double Attack</h3>
                <p className="text-gray-600 mb-4">
                  In this position, find the move that creates a powerful double attack for Black.
                </p>
                <ChessExample
                  initialFen="r1bqkb1r/ppp2ppp/2n2n2/3pp3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 0 5"
                  title="Creating a Double Attack"
                  description="Black to move. Create a strong double attack."
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Mastering Double Attack Tactics</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always be on the lookout for opportunities to create multiple threats with a single move</li>
          <li>Practice identifying and creating double attacks in tactical puzzles</li>
          <li>Consider how different pieces can be used to create double attacks</li>
          <li>Look for ways to combine double attacks with other tactical motifs for maximum effect</li>
          <li>Be aware of potential double attacks against your own pieces and take preventive measures</li>
          <li>
            When defending against a double attack, prioritize the more critical threat if both can't be addressed
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

