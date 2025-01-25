"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Target, Crosshair, Map, Compass } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "../chess/ChessExample"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const strategicPlanningExamples = [
  {
    fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/3P1B2/2NBPN2/PPP2PPP/R2Q1RK1 w - - 0 8",
    title: "Kingside Attack Plan",
    description: "White has a solid pawn structure and well-placed pieces for a kingside attack.",
    explanation: [
      "White's pieces are well-positioned for a kingside attack",
      "The light-squared bishop on f4 is ready to support an advance of the g-pawn",
      "The knight on f3 can quickly move to g5 or h4 to join the attack",
      "White's plan could involve advancing the g-pawn, followed by h4-h5",
      "Black should be prepared to defend against this potential attack",
    ],
  },
  {
    fen: "r2qk2r/ppp1bppp/2n2n2/3p2B1/3P4/2NBP3/PPP2PPP/R2Q1RK1 b kq - 0 8",
    title: "Queenside Expansion",
    description: "Black has opportunities for queenside expansion and pressure.",
    explanation: [
      "Black's pieces are well-placed for queenside play",
      "The c6 knight can move to b4, pressuring White's queenside",
      "Black can consider pushing the b-pawn to b5 and then b4",
      "This plan aims to create weaknesses in White's queenside pawn structure",
      "White should be alert to this potential queenside expansion",
    ],
  },
  {
    fen: "r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 10",
    title: "Central Break",
    description: "White is preparing for a central pawn break to open up the position.",
    explanation: [
      "White's pieces are centralized and ready to support a central break",
      "The plan involves pushing the d-pawn to d5, opening up the center",
      "This break aims to expose Black's somewhat passive piece placement",
      "After the break, White can exploit open lines for the rooks and bishop",
      "Black should consider how to react to this impending central tension",
    ],
  },
  {
    fen: "r2q1rk1/1pp1ppbp/p1np1np1/8/2PP4/2N1PN2/PP2BPPP/R1BQ1RK1 w - - 0 9",
    title: "Prophylactic Play",
    description: "White employs prophylactic moves to limit Black's counterplay.",
    explanation: [
      "White's structure limits Black's piece activity and pawn breaks",
      "The plan involves making prophylactic moves to further restrict Black",
      "White might consider h3 to prevent Ng4, followed by a4 to stop b5",
      "This strategy aims to slowly improve position while denying counterplay",
      "Black needs to find ways to create active play despite the restrictions",
    ],
  },
]

const strategicPlanningPrinciples = [
  {
    title: "Position Assessment",
    icon: <Compass className="h-6 w-6" />,
    points: [
      "Evaluate pawn structures and piece placements",
      "Identify strengths and weaknesses in both positions",
      "Consider the overall balance of the position",
      "Assess potential pawn breaks and piece maneuvers",
    ],
  },
  {
    title: "Long-term Planning",
    icon: <Map className="h-6 w-6" />,
    points: [
      "Develop plans that span multiple moves",
      "Set achievable goals based on the position",
      "Anticipate and prepare for your opponent's plans",
      "Be flexible and ready to adjust your plan as needed",
    ],
  },
  {
    title: "Prophylaxis",
    icon: <Target className="h-6 w-6" />,
    points: [
      "Make moves that prevent your opponent's ideas",
      "Secure key squares before they become weaknesses",
      "Limit your opponent's piece activity and pawn breaks",
      "Balance prophylaxis with your own active plans",
    ],
  },
  {
    title: "Improvement of Position",
    icon: <Crosshair className="h-6 w-6" />,
    points: [
      "Gradually improve the placement of your pieces",
      "Create and exploit weaknesses in the opponent's camp",
      "Increase your control over key squares and files",
      "Prepare favorable pawn breaks to change the structure",
    ],
  },
]

const commonStrategicPlans = [
  {
    title: "Kingside Attack",
    description: "Launch an attack against the opponent's castled king.",
    steps: [
      "Centralize pieces and aim them towards the kingside",
      "Advance pawns (usually g and h) to open lines",
      "Bring heavy pieces (queen and rooks) into the attack",
      "Look for sacrifices to break open the king's defenses",
    ],
  },
  {
    title: "Queenside Expansion",
    description: "Create pressure and space on the queenside.",
    steps: [
      "Advance queenside pawns (usually b and c)",
      "Place rooks on open files created by pawn advances",
      "Use knights to occupy weak squares in opponent's camp",
      "Create passed pawns or isolate opponent's pawns",
    ],
  },
  {
    title: "Central Break",
    description: "Open up the center to activate pieces and create opportunities.",
    steps: [
      "Prepare pieces to support the central pawn break",
      "Time the break to maximize its effectiveness",
      "Be ready to occupy opened lines with rooks",
      "Follow up by increasing piece activity in the open center",
    ],
  },
  {
    title: "Minority Attack",
    description: "Use a pawn minority on one flank to create weaknesses.",
    steps: [
      "Advance minority pawns to provoke weaknesses",
      "Use pieces to apply pressure on the created weaknesses",
      "Be prepared to shift focus to other parts of the board if needed",
      "Aim to win a pawn or achieve a favorable pawn structure",
    ],
  },
  {
    title: "Prophylactic Play",
    description: "Prevent your opponent's plans while slowly improving your position.",
    steps: [
      "Identify and prevent your opponent's main ideas",
      "Secure key squares and prevent enemy piece improvements",
      "Gradually improve your own piece positions",
      "Maintain flexibility to switch to more active plans when possible",
    ],
  },
]

export function StrategicPlanning() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % strategicPlanningExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + strategicPlanningExamples.length) % strategicPlanningExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Strategic Planning</h2>
        <p className="text-gray-600 mb-6">
          Strategic planning in chess involves developing and executing long-term plans based on the characteristics of
          the position. It requires a deep understanding of chess principles, the ability to assess positions
          accurately, and the foresight to anticipate and prepare for your opponent's plans.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          While it's important to have a plan, remember that chess is a two-player game. Be prepared to adjust your
          strategy based on your opponent's moves and counter-plans. Flexibility and the ability to reassess the
          position regularly are crucial skills in strategic planning.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={strategicPlanningExamples[currentExample].fen}
          initialFen={strategicPlanningExamples[currentExample].fen}
          title={strategicPlanningExamples[currentExample].title}
          description={strategicPlanningExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Strategic Analysis</h4>
          <ul className="list-disc pl-5 space-y-2">
            {strategicPlanningExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {strategicPlanningExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <Tabs defaultValue="principles" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="principles">Strategic Principles</TabsTrigger>
          <TabsTrigger value="common-plans">Common Strategic Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="principles">
          <div className="grid gap-6 md:grid-cols-2">
            {strategicPlanningPrinciples.map((principle, index) => (
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

        <TabsContent value="common-plans">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {commonStrategicPlans.map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{plan.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      {plan.steps.map((step, stepIndex) => (
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Effective Strategic Planning</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Regularly reassess the position and be willing to adjust your plan</li>
          <li>Consider your opponent's potential plans and how to counter them</li>
          <li>Balance long-term strategic goals with short-term tactical opportunities</li>
          <li>Practice visualizing several moves ahead to improve your planning skills</li>
          <li>Study master games focusing on how they develop and execute strategic plans</li>
          <li>Don't be afraid to make prophylactic moves that prevent your opponent's ideas</li>
          <li>Remember that good strategy often involves improving your worst-placed piece</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="strategic-planning" />
      </div>
    </div>
  )
}

