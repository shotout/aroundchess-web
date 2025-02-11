"use client"

import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface OpeningIdea {
  type: 'strategic' | 'tactical'
  description: string
}

interface OpeningIdeasProps {
  ideas: OpeningIdea[]
}

export const openingIdeas: Record<string, OpeningIdea[]> = {
  'basic-opening-principles': [
    { type: 'strategic', description: 'Control the center with e4/d4 pawns' },
    { type: 'strategic', description: 'Develop knights before bishops' },
    { type: 'tactical', description: 'Watch for early tactical opportunities on f2/f7' }
  ],
  'piece-movement': [
    { type: 'strategic', description: 'Understand optimal piece placement' },
    { type: 'strategic', description: 'Learn piece coordination patterns' },
    { type: 'tactical', description: 'Recognize basic tactical patterns' }
  ],
  'london-system': [
    { type: 'strategic', description: 'Build a solid pawn structure with d4, Bf4, e3' },
    { type: 'strategic', description: 'Control dark squares with bishop and knights' },
    { type: 'tactical', description: 'Look for kingside attacking opportunities' }
  ],
  'colle-system': [
    { type: 'strategic', description: 'Establish control with d4, e3, Nf3 setup' },
    { type: 'strategic', description: 'Prepare e4 breakthrough' },
    { type: 'tactical', description: 'Watch for bishop sacrifice on h7' }
  ],
  'kings-indian-attack': [
    { type: 'strategic', description: 'Build kingside attacking formation' },
    { type: 'strategic', description: 'Control e4/e5 with Nf3 and g3' },
    { type: 'tactical', description: 'Look for g4-g5 pawn breaks' }
  ],
  'ruy-lopez': [
    { type: 'strategic', description: 'Control the center while pressuring e5' },
    { type: 'strategic', description: 'Create tension with Bb5 against Nc6' },
    { type: 'tactical', description: 'Watch for pin-based tactics' }
  ],
  'italian-game': [
    { type: 'strategic', description: 'Control central light squares with Bc4' },
    { type: 'strategic', description: 'Develop pieces toward the center' },
    { type: 'tactical', description: 'Look for f7 attacking patterns' }
  ],
  'sicilian-defense': [
    { type: 'strategic', description: 'Fight for d5 square with c5 pawn' },
    { type: 'tactical', description: 'Create counterplay on c-file' },
    { type: 'strategic', description: 'Prepare ...d6 and ...e5 advances' }
  ],
  'french-defense': [
    { type: 'strategic', description: 'Control dark squares with e6-d5 chain' },
    { type: 'strategic', description: 'Prepare ...f6 and ...e5 breaks' },
    { type: 'tactical', description: 'Watch for light-squared bishop tactics' }
  ],
  'caro-kann': [
    { type: 'strategic', description: 'Build solid pawn structure with c6-d5' },
    { type: 'strategic', description: 'Develop light-squared bishop actively' },
    { type: 'tactical', description: 'Look for counterplay in the center' }
  ],
  'pirc-defense': [
    { type: 'strategic', description: 'Allow center control while developing flexibly' },
    { type: 'strategic', description: 'Prepare ...e5 and ...c5 breaks' },
    { type: 'tactical', description: 'Watch for kingside counterplay' }
  ],
  'alekhine-defense': [
    { type: 'strategic', description: 'Provoke pawn advances to create targets' },
    { type: 'tactical', description: 'Use overextended pawns as weaknesses' },
    { type: 'strategic', description: 'Fight for central control with pawns' }
  ],
  'scandinavian-defense': [
    { type: 'strategic', description: 'Early queen development with ...Qa5' },
    { type: 'tactical', description: 'Create pressure on d4 square' },
    { type: 'strategic', description: 'Develop pieces actively' }
  ],
  'philidor-defense': [
    { type: 'strategic', description: 'Maintain flexible pawn structure' },
    { type: 'strategic', description: 'Prepare ...d6 and ...e5 setup' },
    { type: 'tactical', description: 'Look for central breaks' }
  ],
  'four-knights': [
    { type: 'strategic', description: 'Develop all knights to active squares' },
    { type: 'strategic', description: 'Control central squares equally' },
    { type: 'tactical', description: 'Watch for knight forks' }
  ],
  'scotch-game': [
    { type: 'strategic', description: 'Early d4 break in the center' },
    { type: 'tactical', description: 'Create pressure on e4/e5 pawns' },
    { type: 'strategic', description: 'Active piece play in open positions' }
  ],
  'vienna-game': [
    { type: 'strategic', description: 'Early Nc3 development' },
    { type: 'tactical', description: 'Look for f4 pawn break' },
    { type: 'strategic', description: 'Control central light squares' }
  ],
  'najdorf-sicilian': [
    { type: 'strategic', description: 'Control d5 with ...e6 and ...d6' },
    { type: 'tactical', description: 'Prepare ...e5 break' },
    { type: 'strategic', description: 'Fight for control of b5 square' }
  ],
  'queens-gambit': [
    { type: 'strategic', description: 'Control center with d4 and c4' },
    { type: 'strategic', description: 'Create pressure on d5 pawn' },
    { type: 'tactical', description: 'Look for c4-c5 breaks' }
  ],
  'kings-indian': [
    { type: 'strategic', description: 'Build kingside fianchetto' },
    { type: 'strategic', description: 'Prepare ...e5 and ...f5 breaks' },
    { type: 'tactical', description: 'Look for kingside attacking patterns' }
  ],
  'nimzo-indian': [
    { type: 'strategic', description: 'Pin Nc3 with ...Bb4' },
    { type: 'strategic', description: 'Control e4 square' },
    { type: 'tactical', description: 'Create doubled pawns for compensation' }
  ],
  'grunfeld-defense': [
    { type: 'strategic', description: 'Challenge center immediately with d5' },
    { type: 'tactical', description: 'Create pressure on d4' },
    { type: 'strategic', description: 'Active piece play' }
  ],
  'benoni-defense': [
    { type: 'strategic', description: 'Early c5 break against d4' },
    { type: 'strategic', description: 'Fight for control of e4 square' },
    { type: 'tactical', description: 'Look for ...b5 breaks' }
  ],
  'dutch-defense': [
    { type: 'strategic', description: 'Control e4 with f5' },
    { type: 'strategic', description: 'Build kingside attacking formation' },
    { type: 'tactical', description: 'Watch for e4 breaks' }
  ],
  'english-opening': [
    { type: 'strategic', description: 'Control d5 with c4 and Nc3' },
    { type: 'strategic', description: 'Flexible pawn structure' },
    { type: 'tactical', description: 'Look for b4 breaks' }
  ],
  'reti-opening': [
    { type: 'strategic', description: 'Control center flexibly with Nf3' },
    { type: 'strategic', description: 'Prepare c4 and d4 advances' },
    { type: 'tactical', description: 'Watch for fianchetto tactics' }
  ],
  'catalan-opening': [
    { type: 'strategic', description: 'Control long diagonal with g3 and Bg2' },
    { type: 'strategic', description: 'Maintain flexible center' },
    { type: 'tactical', description: 'Look for bishop tactics on long diagonal' }
  ],
  'birds-opening': [
    { type: 'strategic', description: 'Early f4 to control e5' },
    { type: 'strategic', description: 'Build kingside attacking formation' },
    { type: 'tactical', description: 'Watch for e4 breaks' }
  ],
  'accelerated-dragon': [
    { type: 'strategic', description: 'Quick g6 and Bg7 fianchetto' },
    { type: 'strategic', description: 'Control d5 with c5 and Nc6' },
    { type: 'tactical', description: 'Look for ...d5 breaks' }
  ],
  'kings-gambit': [
    { type: 'tactical', description: 'Sacrifice f4 pawn for initiative' },
    { type: 'strategic', description: 'Create attacking chances on f-file' },
    { type: 'tactical', description: 'Look for piece sacrifices' }
  ],
  'benko-gambit': [
    { type: 'strategic', description: 'Sacrifice b5 pawn for queenside pressure' },
    { type: 'tactical', description: 'Create play on a and b files' },
    { type: 'strategic', description: 'Control long diagonal with ...Bg7' }
  ],
  'modern-defense': [
    { type: 'strategic', description: 'Flexible development with g6 and Bg7' },
    { type: 'strategic', description: 'Prepare ...c5 and ...e5 breaks' },
    { type: 'tactical', description: 'Look for counterplay in the center' }
  ],
  'trompowsky-attack': [
    { type: 'strategic', description: 'Early Bg5 to pin Nf6' },
    { type: 'strategic', description: 'Control dark squares' },
    { type: 'tactical', description: 'Watch for e4-e5 breaks' }
  ]
}

export function OpeningIdeas({ ideas }: OpeningIdeasProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Opening Analysis</AlertTitle>
        <AlertDescription>
          Key strategic and tactical ideas in this opening
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Strategic Ideas</h3>
          <ul className="space-y-2">
            {ideas.filter(idea => idea.type === 'strategic').map((idea, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                • {idea.description}
              </li>
            ))}
          </ul>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Tactical Ideas</h3>
          <ul className="space-y-2">
            {ideas.filter(idea => idea.type === 'tactical').map((idea, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                • {idea.description}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
} 