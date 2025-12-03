"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Sword, Target, Shield, Crosshair } from "lucide-react"
import { ChessExample } from "../../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const attackingExamples = [
  {
    fen: "r1bqk2r/ppp2ppp/2n1pn2/3p4/1b1PP3/2N2N2/PPP1BPPP/R1BQ1RK1 w kq - 0 1",
    title: "Kingside Attack",
    description: "A classic kingside attack setup with pieces coordinated towards the opponent's king.",
    explanation: [
      "White's pieces are positioned to attack Black's kingside",
      "The bishop on e2 supports a potential f4-f5 push",
      "Knights can quickly reposition to attack key squares",
      "The queen and rook can quickly join the attack",
    ],
  },
  {
    fen: "r1b2rk1/pp3ppp/2n1pn2/q2p4/1b1P4/2N1PN2/PPQB1PPP/R3KB1R w KQ - 0 1",
    title: "Piece Coordination Attack",
    description: "Multiple pieces working together to create attacking chances.",
    explanation: [
      "White's pieces are coordinated to attack the center and queenside",
      "The bishop pair provides long-range control",
      "Knights support key central squares",
      "Pressure on the c-file can be exploited",
    ],
  },
  {
    fen: "rnbqk2r/ppp2ppp/4pn2/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 1",
    title: "Center Break Attack",
    description: "Using pawn breaks to open lines for an attack.",
    explanation: [
      "The e4-e5 push can break open the position",
      "Pieces are ready to exploit opened lines",
      "The attack can transition to either flank",
      "Multiple piece combinations become possible",
    ],
  },
  {
    fen: "r2qk2r/ppp2ppp/2n1pn2/3p1b2/1b1P4/2NBPN2/PP3PPP/R1BQ1RK1 w kq - 0 1",
    title: "Positional Attack",
    description: "Building up pressure before the decisive breakthrough.",
    explanation: [
      "White has a space advantage and better piece placement",
      "The pawn structure supports piece advancement",
      "Multiple attacking options are available",
      "The position can be improved systematically",
    ],
  },
]

const attackingPrinciples = [
  {
    title: "Piece Coordination",
    icon: <Sword className="h-6 w-6" />,
    points: [
      "Ensure all attacking pieces work together",
      "Create multiple threats simultaneously",
      "Maintain pressure on key squares",
      "Keep pieces protected while attacking",
    ],
  },
  {
    title: "King Safety",
    icon: <Shield className="h-6 w-6" />,
    points: [
      "Secure your own king before attacking",
      "Look for weaknesses around enemy king",
      "Create pawn weaknesses near enemy king",
      "Prevent counterplay against your king",
    ],
  },
  {
    title: "Attack Preparation",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Build up pressure gradually",
      "Create weaknesses in enemy position",
      "Improve piece positions systematically",
      "Prepare decisive breakthroughs",
    ],
  },
  {
    title: "Calculation",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Calculate concrete variations",
      "Consider opponent's defensive resources",
      "Evaluate position after planned attack",
      "Look for tactical opportunities",
    ],
  },
]

const commonAttackingPatterns = [
  {
    title: "Greek Gift Sacrifice",
    description: "The sacrifice of a bishop on h7/h2 to expose the enemy king.",
    key_points: [
      "Usually involves Bxh7+ followed by Ng5+",
      "Works best when opponent's king is poorly defended",
      "Requires careful calculation of follow-up moves",
      "Can lead to decisive attacks",
    ],
  },
  {
    title: "Pawn Storm",
    description: "Advancing pawns to break open the opponent's king position.",
    key_points: [
      "Usually involves advancing f, g, and h pawns",
      "Creates weaknesses around enemy king",
      "Opens lines for major pieces",
      "Requires proper piece support",
    ],
  },
  {
    title: "Piece Sacrifice",
    description: "Sacrificing material to open lines or create attacking chances.",
    key_points: [
      "Common sacrifices include Nxf7/Nxf2",
      "Often leads to exposed king",
      "Requires precise follow-up play",
      "Position evaluation is crucial",
    ],
  },
  {
    title: "Kingside Pawn Storm",
    description: "A coordinated advance of kingside pawns to break open the opponent's king position.",
    key_points: [
      "Typically involves advancing the f, g, and h pawns",
      "Aims to create weaknesses in the opponent's kingside pawn structure",
      "Often combined with piece pressure for maximum effect",
      "Requires careful timing to avoid overextension",
    ],
  },
]

export function AttackConstruction() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % attackingExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + attackingExamples.length) % attackingExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Attack Construction</h2>
        <p className="text-gray-600 mb-6">
          Building a successful attack is a crucial skill in chess. Learn how to coordinate your pieces, create
          weaknesses in the opponent's position, and execute decisive combinations.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          A successful attack requires proper preparation, accurate calculation, and good piece coordination. Rushing an
          attack without adequate support often leads to a worse position.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={attackingExamples[currentExample].fen}
          initialFen={attackingExamples[currentExample].fen}
          title={attackingExamples[currentExample].title}
          description={attackingExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Position Analysis</h4>
          <ul className="list-disc pl-5 space-y-2">
            {attackingExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {attackingExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="principles">Attacking Principles</TabsTrigger>
          <TabsTrigger value="patterns">Common Patterns</TabsTrigger>
          <TabsTrigger value="calculation">Attack Calculation</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-2">
            {attackingPrinciples.map((principle, index) => (
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
            {commonAttackingPatterns.map((pattern, index) => (
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

        <TabsContent value="calculation">
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Step 1: Evaluate the Position</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Identify weaknesses in opponent's position</li>
                    <li>Assess piece coordination and activity</li>
                    <li>Consider pawn structure implications</li>
                    <li>Evaluate king safety for both sides</li>
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
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Step 2: Calculate Variations</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Calculate forced variations first</li>
                    <li>Consider opponent's defensive resources</li>
                    <li>Look for intermediate moves</li>
                    <li>Evaluate resulting positions</li>
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
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Step 3: Execute the Attack</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Choose the most promising variation</li>
                    <li>Consider practical playing chances</li>
                    <li>Maintain flexibility when possible</li>
                    <li>Be prepared to shift plans if needed</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Successful Attacks</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always ensure your own king is safe before launching an attack</li>
          <li>Build up your attack gradually, improving piece positions step by step</li>
          <li>Look for ways to create and exploit weaknesses in the opponent's position</li>
          <li>Calculate variations thoroughly, including your opponent's defensive resources</li>
          <li>Maintain flexibility and be ready to adapt your plan based on your opponent's moves</li>
        </ul>
      </motion.div>
    </div>
  )
}

