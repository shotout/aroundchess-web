"use client"

import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PositionIdea {
  type: 'strategic' | 'tactical'
  description: string
}

interface PositionIdeasProps {
  ideas: PositionIdea[]
}

export const positionIdeas: Record<string, PositionIdea[]> = {
  'basic-principles': [
    { type: 'strategic', description: 'Control the center with pawns and pieces' },
    { type: 'strategic', description: 'Develop knights before bishops for optimal piece coordination' },
    { type: 'tactical', description: 'Watch for early tactical opportunities involving e4/e5 squares' }
  ],
  'basic-tactics': [
    { type: 'tactical', description: 'Look for pins against the king or queen' },
    { type: 'tactical', description: 'Control the center diagonals with the light-squared bishop' },
    { type: 'strategic', description: 'Maintain piece activity while looking for combinations' }
  ],
  'pattern-recognition': [
    { type: 'tactical', description: 'Common tactical patterns involving the c3 knight and c4 bishop' },
    { type: 'strategic', description: 'Control of dark squares in the center' },
    { type: 'tactical', description: 'Potential discovered attacks with the bishop pair' }
  ],
  'attacking-patterns': [
    { type: 'tactical', description: 'Direct attacks against the kingside with piece coordination' },
    { type: 'strategic', description: 'Use pawn breaks to open lines for attacking pieces' },
    { type: 'tactical', description: 'Look for sacrificial themes on f7/f2' }
  ],
  'attacking-the-king': [
    { type: 'tactical', description: 'Classic bishop sacrifice on h7/h2' },
    { type: 'strategic', description: 'Build up pressure on the kingside' },
    { type: 'tactical', description: 'Use the queen and bishop battery for mating attacks' }
  ],
  'breakthrough-sacrifices': [
    { type: 'tactical', description: 'Piece sacrifices to expose the enemy king' },
    { type: 'strategic', description: 'Create weaknesses around the enemy king' },
    { type: 'tactical', description: 'Open lines with pawn breaks followed by sacrifices' }
  ],
  'piece-coordination': [
    { type: 'strategic', description: 'Coordinate bishops and knights to control key squares' },
    { type: 'strategic', description: 'Support pieces with pawns for optimal positioning' },
    { type: 'tactical', description: 'Look for tactical shots based on piece coordination' }
  ],
  'piece-activity': [
    { type: 'strategic', description: 'Active pieces control important central squares' },
    { type: 'tactical', description: 'Use active pieces to create tactical threats' },
    { type: 'strategic', description: 'Maintain piece mobility and flexibility' }
  ],
  'piece-domination': [
    { type: 'strategic', description: 'Dominate key squares with well-placed pieces' },
    { type: 'tactical', description: 'Create outposts for knights in enemy territory' },
    { type: 'strategic', description: 'Restrict enemy piece movement' }
  ],
  'pawn-structures': [
    { type: 'strategic', description: 'Create and exploit pawn weaknesses' },
    { type: 'strategic', description: 'Control key squares with pawn chains' },
    { type: 'tactical', description: 'Use pawn breaks to open lines for pieces' }
  ],
  'pawn-breaks': [
    { type: 'strategic', description: 'Time pawn breaks to maximize their effect' },
    { type: 'tactical', description: 'Calculate concrete variations after pawn breaks' },
    { type: 'strategic', description: 'Prepare supporting pieces before executing breaks' }
  ],
  'pawn-majority': [
    { type: 'strategic', description: 'Create and advance passed pawns' },
    { type: 'strategic', description: 'Use the pawn majority to gain space' },
    { type: 'tactical', description: 'Look for tactical opportunities while advancing pawns' }
  ],
  'doubled-pawns': [
    { type: 'strategic', description: 'Use doubled pawns to control key squares' },
    { type: 'strategic', description: 'Compensate for pawn weaknesses with piece activity' },
    { type: 'tactical', description: 'Create open files for rook play' }
  ],
  'isolated-queen-pawn': [
    { type: 'strategic', description: 'Control key squares in front of the IQP' },
    { type: 'tactical', description: 'Use the open files for tactical opportunities' },
    { type: 'strategic', description: 'Time the advance of the IQP carefully' }
  ],
  'hanging-pawns': [
    { type: 'strategic', description: 'Maintain tension with hanging pawns' },
    { type: 'tactical', description: 'Create tactical opportunities with pawn advances' },
    { type: 'strategic', description: 'Support hanging pawns with active pieces' }
  ],
  'bishop-pair': [
    { type: 'strategic', description: 'Control both color complexes with the bishop pair' },
    { type: 'tactical', description: 'Create tactical shots along diagonals' },
    { type: 'strategic', description: 'Open the position to maximize bishop power' }
  ],
  'knight-outposts': [
    { type: 'strategic', description: 'Establish and maintain strong knight outposts' },
    { type: 'tactical', description: 'Use knights as springboards for attacks' },
    { type: 'strategic', description: 'Support outposts with pawn chains' }
  ],
  'minor-piece-strategy': [
    { type: 'strategic', description: 'Choose optimal squares for minor pieces' },
    { type: 'tactical', description: 'Create tactical opportunities with piece placement' },
    { type: 'strategic', description: 'Coordinate minor pieces effectively' }
  ]
  // Add more position ideas for other topics...
}

export function PositionIdeas({ ideas }: PositionIdeasProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Position Analysis</AlertTitle>
        <AlertDescription>
          Key strategic and tactical ideas in this position
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