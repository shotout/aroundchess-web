import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'

const phases = [
  {
    name: "Opening",
    description: "The first phase of the game, typically lasting 10-15 moves.",
    principles: [
      "Control the center with pawns and pieces",
      "Develop your pieces efficiently",
      "Castle early to protect your king",
      "Connect your rooks",
      "Don't move the same piece twice",
    ],
    common_mistakes: [
      "Moving too many pawns",
      "Bringing the queen out too early",
      "Not developing minor pieces",
      "Neglecting king safety",
    ]
  },
  {
    name: "Middlegame",
    description: "The longest phase where most tactical and strategic battles occur.",
    principles: [
      "Create and execute strategic plans",
      "Look for tactical opportunities",
      "Maintain pawn structure",
      "Control open files and diagonals",
      "Keep pieces active and coordinated",
    ],
    common_mistakes: [
      "Losing piece coordination",
      "Weakening pawn structure",
      "Ignoring opponent's threats",
      "Poor piece placement",
    ]
  },
  {
    name: "Endgame",
    description: "The final phase with fewer pieces, where pawns become crucial.",
    principles: [
      "Activate your king",
      "Create passed pawns",
      "Centralize your pieces",
      "Cut off enemy king",
      "Know basic checkmate patterns",
    ],
    common_mistakes: [
      "Passive king play",
      "Poor pawn management",
      "Rushing to promote pawns",
      "Trading into losing positions",
    ]
  }
]

const phaseIcons = {
  Opening: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 18v-6" />
      <path d="M8 18v-1" />
      <path d="M16 18v-3" />
    </svg>
  ),
  Middlegame: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12a15.3 15.3 0 0 1 10-4 15.3 15.3 0 0 1 10 4 15.3 15.3 0 0 1-10 4 15.3 15.3 0 0 1-10-4z" />
    </svg>
  ),
  Endgame: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m4.93 4.93 4.24 4.24" />
      <path d="m14.83 14.83 4.24 4.24" />
      <path d="m14.83 9.17-4.24 4.24" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
}

export function GamePhases() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chess Game Phases</h2>
        <p className="text-gray-600 mb-6">
          A chess game is typically divided into three main phases: opening, middlegame, and endgame. 
          Understanding these phases and their characteristics is crucial for developing a strong chess strategy.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Strategic Transition</AlertTitle>
        <AlertDescription>
          The transitions between phases are not always clear-cut. Being able to recognize when one phase 
          ends and another begins is a crucial skill in chess.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((phase) => (
          <Card key={phase.name} className="bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-blue-600">
                    {phaseIcons[phase.name as keyof typeof phaseIcons]}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">{phase.name}</h3>
                    <p className="text-gray-600 text-sm">{phase.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Key Principles</h4>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      {phase.principles.map((principle, index) => (
                        <li key={index} className="text-gray-600 text-sm">{principle}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Common Mistakes</h4>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      {phase.common_mistakes.map((mistake, index) => (
                        <li key={index} className="text-gray-600 text-sm">{mistake}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Phase Transitions</h3>
        <div className="space-y-4">
          <p className="text-gray-600">
            Recognizing phase transitions helps you adjust your strategy accordingly:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Opening → Middlegame: Pieces are developed, kings are castled, and direct confrontation begins.</li>
            <li>Middlegame → Endgame: Several pieces are exchanged, queens are often off the board, and kings become active.</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end">
        <CompleteButton sectionId="game-phases" />
      </div>
    </div>
  )
}

