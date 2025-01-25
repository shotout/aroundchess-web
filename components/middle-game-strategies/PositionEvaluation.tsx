"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Info,
  Scale,
  CastleIcon as ChessKnight,
  PianoIcon as ChessPawn,
  CastleIcon as ChessKing,
  DiamondIcon as ChessQueen,
} from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const positionEvaluationExamples = [
  {
    fen: "r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 10",
    title: "Balanced Position",
    description: "A position where both sides have relatively equal chances.",
    explanation: [
      "Material is even between both sides",
      "Both kings are safely castled",
      "Pawn structures are symmetrical and healthy",
      "Piece activity is roughly equal for both sides",
      "Neither side has significant weaknesses to exploit",
    ],
  },
  {
    fen: "r1bq1rk1/ppp2ppp/2n2n2/3pp1B1/2PP4/2N1PN2/PP3PPP/R2QKB1R b KQ - 0 7",
    title: "White's Slight Advantage",
    description: "White has a small edge due to better piece coordination and central control.",
    explanation: [
      "White has slightly better control of the center with pawns on c4 and d4",
      "White's light-squared bishop is more active on g5",
      "Black's queenside development is slightly behind",
      "White has more space and options for piece maneuvers",
      "However, Black's position is solid with no major weaknesses",
    ],
  },
  {
    fen: "r4rk1/ppp2ppp/2n1b3/3p4/3Pn3/2PB1N2/PP3PPP/R1B2RK1 w - - 0 11",
    title: "Black's Positional Advantage",
    description: "Black has a positional edge due to better piece placement and pawn structure.",
    explanation: [
      "Black's knight on e4 is strongly placed and can't be easily dislodged",
      "Black's pawn structure is healthier with no weaknesses",
      "White's isolated d-pawn could become a target in the long run",
      "Black's pieces are more harmoniously placed",
      "White lacks active counterplay in this position",
    ],
  },
  {
    fen: "r1b2rk1/pp2qppp/2n5/3p4/3P4/2PB1Q2/P4PPP/R3R1K1 w - - 0 15",
    title: "Material Imbalance",
    description: "White has a material advantage, but Black has some positional compensation.",
    explanation: [
      "White is up a pawn (material advantage)",
      "Black has better piece activity, especially the centralized queen",
      "Black's knight on c6 is well-placed and controls important central squares",
      "White's extra pawn is isolated and could be weak in the long term",
      "The position is dynamically balanced despite the material difference",
    ],
  },
]

const evaluationFactors = [
  {
    title: "Material Count",
    icon: <Scale className="h-6 w-6" />,
    points: [
      "Count the value of pieces for both sides",
      "Consider standard piece values (P=1, N/B=3, R=5, Q=9)",
      "Be aware of piece quality (e.g., good knight vs. bad bishop)",
      "Factor in potential material gains or losses",
    ],
  },
  {
    title: "Piece Activity",
    icon: <ChessKnight className="h-6 w-6" />,
    points: [
      "Assess the placement and mobility of each piece",
      "Consider control of key squares and diagonals",
      "Evaluate piece coordination and teamwork",
      "Look for potential piece improvements",
    ],
  },
  {
    title: "Pawn Structure",
    icon: <ChessPawn className="h-6 w-6" />,
    points: [
      "Identify pawn weaknesses (isolated, doubled, backward pawns)",
      "Evaluate pawn chains and their influence on the position",
      "Consider potential pawn breaks and advances",
      "Assess control of key central squares by pawns",
    ],
  },
  {
    title: "King Safety",
    icon: <ChessKing className="h-6 w-6" />,
    points: [
      "Evaluate the pawn shield around each king",
      "Consider potential attacking chances against the kings",
      "Assess the proximity of enemy pieces to the kings",
      "Factor in open files or diagonals near the kings",
    ],
  },
  {
    title: "Space and Control",
    icon: <ChessQueen className="h-6 w-6" />,
    points: [
      "Assess control of key squares and regions of the board",
      "Evaluate space advantage and piece maneuverability",
      "Consider control of open files and diagonals",
      "Factor in potential outposts for pieces",
    ],
  },
]

const evaluationTechniques = [
  {
    title: "Comparative Method",
    description: "Compare each element of the position for both sides.",
    steps: [
      "Assess material balance",
      "Compare piece activity and placement",
      "Evaluate pawn structures",
      "Consider king safety for both sides",
      "Weigh space and control factors",
    ],
  },
  {
    title: "Imbalances Analysis",
    description: "Identify and weigh the imbalances in the position.",
    steps: [
      "List all significant imbalances (e.g., material, structure, space)",
      "Determine which side benefits from each imbalance",
      "Assess the relative importance of each imbalance",
      "Consider potential changes to the imbalances",
    ],
  },
  {
    title: "Best-Piece/Worst-Piece",
    description: "Identify the best and worst pieces for each side.",
    steps: [
      "Find the most active and well-placed pieces",
      "Identify the least active or poorly placed pieces",
      "Consider how to improve the worst pieces",
      "Evaluate plans to neutralize the opponent's best pieces",
    ],
  },
  {
    title: "Static vs. Dynamic Factors",
    description: "Balance long-term structural factors with immediate tactical possibilities.",
    steps: [
      "Assess static factors (pawn structure, space)",
      "Evaluate dynamic factors (piece activity, immediate threats)",
      "Weigh the relative importance of static and dynamic elements",
      "Consider how static factors might influence future dynamics",
    ],
  },
]

export function PositionEvaluation() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % positionEvaluationExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + positionEvaluationExamples.length) % positionEvaluationExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Position Evaluation</h2>
        <p className="text-gray-600 mb-6">
          Position evaluation is a crucial skill in chess that involves assessing the strengths and weaknesses of both
          sides. It forms the basis for strategic decision-making and helps players choose the most appropriate plans
          and moves. Accurate position evaluation requires considering multiple factors and their complex interactions.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Remember that position evaluation is not just about counting material. Factors like piece activity, pawn
          structure, king safety, and control of key squares often outweigh small material imbalances. Always consider
          the position as a whole and how different elements interact.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={positionEvaluationExamples[currentExample].fen}
          initialFen={positionEvaluationExamples[currentExample].fen}
          title={positionEvaluationExamples[currentExample].title}
          description={positionEvaluationExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Position Analysis</h4>
          <ul className="list-disc pl-5 space-y-2">
            {positionEvaluationExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {positionEvaluationExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="factors" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="factors">Evaluation Factors</TabsTrigger>
          <TabsTrigger value="techniques">Evaluation Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="factors">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {evaluationFactors.map((factor, index) => (
              <motion.div
                key={factor.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-blue-600">{factor.icon}</div>
                      <h3 className="text-lg font-semibold text-blue-600">{factor.title}</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2">
                      {factor.points.map((point, pointIndex) => (
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
          <div className="grid gap-6 md:grid-cols-2">
            {evaluationTechniques.map((technique, index) => (
              <motion.div
                key={technique.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{technique.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{technique.description}</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      {technique.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-gray-600">
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Improving Position Evaluation Skills</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Practice evaluating positions regularly, both in your games and from master games</li>
          <li>Try to verbalize your evaluations, explaining your reasoning to yourself or others</li>
          <li>Compare your evaluations with those of stronger players or chess engines</li>
          <li>Study annotated games by grandmasters to understand their evaluation process</li>
          <li>Be objective and try to see the position from both sides' perspectives</li>
          <li>Regularly reassess the position as the game progresses and new factors come into play</li>
          <li>Don't rely solely on intuition; back up your evaluations with concrete analysis</li>
          <li>Consider both immediate tactical possibilities and long-term strategic factors</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="position-evaluation" />
      </div>
    </div>
  )
}

