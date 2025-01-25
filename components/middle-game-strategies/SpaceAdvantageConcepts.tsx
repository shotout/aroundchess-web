"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Maximize2, ExpandIcon as ArrowsExpand, Target, Crosshair } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const spaceAdvantageExamples = [
  {
    fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4",
    title: "Central Space Advantage",
    description: "White has established a strong pawn center, controlling more space in the middle of the board.",
    explanation: [
      "White's pawns on e4 and d4 control key central squares",
      "Black's pieces have less room to maneuver",
      "White can use this space to develop pieces more actively",
      "This central control can be used as a base for attacks on either flank",
    ],
  },
  {
    fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQkq - 0 5",
    title: "Queenside Space Advantage",
    description: "White has gained space on the queenside with the c4 pawn push.",
    explanation: [
      "The c4 pawn gives White more room on the queenside",
      "Black's pieces are somewhat cramped on the queenside",
      "White can exploit this space for piece maneuvers or pawn breaks",
      "This space advantage can be used to launch a queenside attack",
    ],
  },
  {
    fen: "rnbqkb1r/pp2pppp/2p2n2/3p4/3P1B2/2N1P3/PPP2PPP/R2QKBNR w KQkq - 0 5",
    title: "Fluid Space Advantage",
    description: "White has a flexible pawn structure that can create space advantages on either flank.",
    explanation: [
      "White's pawns are positioned to push on either flank",
      "The e3 and d4 pawns provide a solid center",
      "White can choose to expand on the kingside with f4 or on the queenside with c4",
      "This flexibility allows White to adapt to Black's setup and create space where it's most advantageous",
    ],
  },
  {
    fen: "r1bqk2r/pppp1ppp/2n2n2/1B2p3/1b2P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6",
    title: "Dynamic Space Balance",
    description: "Both sides have space in different areas, creating a dynamic struggle for territory.",
    explanation: [
      "White has more space on the kingside due to the e4 pawn",
      "Black has countered with space in the center (e5 pawn)",
      "The position is balanced but tense, with both sides having different areas of influence",
      "The side that can better exploit their space advantage may gain the upper hand",
    ],
  },
]

const spaceAdvantagePrinciples = [
  {
    title: "Pawn Advances",
    icon: <ArrowsExpand className="h-6 w-6" />,
    points: [
      "Use pawn pushes to gain territory",
      "Create pawn chains to control space",
      "Be cautious of overextension",
      "Use pawn breaks to fight for space",
    ],
  },
  {
    title: "Piece Mobility",
    icon: <Maximize2 className="h-6 w-6" />,
    points: [
      "Utilize the extra space for piece maneuvers",
      "Restrict opponent's piece mobility",
      "Create outposts for your pieces",
      "Use the space to improve piece coordination",
    ],
  },
  {
    title: "Attacking Opportunities",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Use space advantage to launch attacks",
      "Create threats on multiple parts of the board",
      "Force opponent into a defensive posture",
      "Open lines for your major pieces",
    ],
  },
  {
    title: "Strategic Planning",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Plan long-term based on your space advantage",
      "Prepare pawn breaks to increase space",
      "Anticipate and prevent opponent's space gains",
      "Balance space advantage with other factors",
    ],
  },
]

const spaceAdvantageApplications = [
  {
    title: "Kingside Attack",
    description: "Using a space advantage on the kingside to launch an attack against the opponent's king.",
    key_points: [
      "Advance pawns to gain space on the kingside",
      "Use the extra space to maneuver attacking pieces",
      "Look for pawn breaks to open lines for attack",
      "Be prepared for counterplay in the center or queenside",
    ],
  },
  {
    title: "Queenside Expansion",
    description: "Exploiting extra space on the queenside to create weaknesses and attack.",
    key_points: [
      "Use pawn majority to push for space on the queenside",
      "Create passed pawns or isolate opponent's pawns",
      "Use the space to activate rooks on open files",
      "Be mindful of potential counterplay on the kingside",
    ],
  },
  {
    title: "Central Domination",
    description: "Controlling the center with pawns and pieces to restrict opponent's options.",
    key_points: [
      "Establish and maintain strong central pawns",
      "Use the space to place pieces on strong central squares",
      "Prevent opponent's attempts to challenge your center",
      "Prepare to expand on either flank based on the position",
    ],
  },
  {
    title: "Flexible Pawn Structure",
    description: "Maintaining a flexible pawn structure to create space advantages as needed.",
    key_points: [
      "Keep pawns flexible to respond to opponent's plans",
      "Prepare multiple pawn breaks to gain space",
      "Use pawn levers to fight for key squares",
      "Adapt your space creation based on opponent's setup",
    ],
  },
]

export function SpaceAdvantageConcepts() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % spaceAdvantageExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + spaceAdvantageExamples.length) % spaceAdvantageExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Space Advantage Concepts</h2>
        <p className="text-gray-600 mb-6">
          Understanding and utilizing space advantage is a crucial aspect of chess strategy. A space advantage allows
          for greater piece mobility, creates attacking opportunities, and can restrict your opponent's options.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          While a space advantage can be powerful, it's important not to overextend. An overextended position can create
          weaknesses that your opponent can exploit. Always balance your space advantage with other positional factors.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={spaceAdvantageExamples[currentExample].fen}
          initialFen={spaceAdvantageExamples[currentExample].fen}
          title={spaceAdvantageExamples[currentExample].title}
          description={spaceAdvantageExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Position Analysis</h4>
          <ul className="list-disc pl-5 space-y-2">
            {spaceAdvantageExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {spaceAdvantageExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="principles">Space Advantage Principles</TabsTrigger>
          <TabsTrigger value="applications">Practical Applications</TabsTrigger>
          <TabsTrigger value="countering">Countering Space Advantage</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-2">
            {spaceAdvantagePrinciples.map((principle, index) => (
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

        <TabsContent value="applications">
          <div className="grid gap-6 md:grid-cols-2">
            {spaceAdvantageApplications.map((application, index) => (
              <motion.div
                key={application.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{application.title}</h3>
                    <p className="text-gray-600 mb-4">{application.description}</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {application.key_points.map((point, pointIndex) => (
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

        <TabsContent value="countering">
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Pawn Breaks</h3>
                  <p className="text-gray-600 mb-4">
                    Use pawn breaks to challenge your opponent's space advantage and open up the position.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Identify key pawn breaks to challenge opponent's structure</li>
                    <li>Prepare breaks carefully to avoid weakening your own position</li>
                    <li>Time your breaks to coincide with optimal piece placement</li>
                    <li>Be prepared for the resulting changes in pawn structure</li>
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
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Piece Activity</h3>
                  <p className="text-gray-600 mb-4">
                    Focus on maximizing the activity of your pieces within the limited space available.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Find active squares for your pieces despite space limitations</li>
                    <li>Look for opportunities to exchange pieces and relieve cramping</li>
                    <li>Use prophylactic moves to prevent further space gains by your opponent</li>
                    <li>Create threats to force your opponent to use moves defensively</li>
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
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Counterattack</h3>
                  <p className="text-gray-600 mb-4">
                    Look for opportunities to counterattack, exploiting any weaknesses created by your opponent's space
                    advantage.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Identify overextended pawns or pieces in your opponent's position</li>
                    <li>Create threats that force your opponent to defend rather than expand</li>
                    <li>Look for tactical opportunities arising from your opponent's advanced position</li>
                    <li>Be patient and wait for the right moment to strike</li>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Utilizing Space Advantage</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always consider the balance between space and other positional factors</li>
          <li>Use your space advantage to improve piece placement and coordination</li>
          <li>Look for opportunities to create weaknesses in your opponent's position</li>
          <li>Be prepared to defend against counterplay in other areas of the board</li>
          <li>Practice recognizing and creating space advantages in your games</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="space-advantage-concepts" />
      </div>
    </div>
  )
}

