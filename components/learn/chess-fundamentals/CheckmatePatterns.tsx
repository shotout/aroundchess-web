import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'

const checkmatePatterns = [
  { 
    name: 'Back Rank Mate', 
    description: 'A checkmate delivered by a rook or queen along the back rank, often exploiting the king\'s restricted movement due to its own pawns.',
    example: 'R7/8/8/8/8/8/5PPP/5RK1 w - - 0 1'
  },
  { 
    name: 'Fool\'s Mate', 
    description: 'The fastest possible checkmate, occurring in just two moves. It exploits White\'s weakened kingside.',
    example: '4k3/8/8/8/8/8/5P2/6K1 w - - 0 1'
  },
  { 
    name: 'Scholar\'s Mate', 
    description: 'A quick checkmate targeting the f7 square (f2 for Black), usually achieved with queen and bishop in the opening.',
    example: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4'
  },
  { 
    name: 'Smothered Mate', 
    description: 'A checkmate where the king is surrounded by its own pieces, usually delivered by a knight.',
    example: '5rk1/5ppp/5Q2/8/8/8/8/6NK w - - 0 1'
  },
]

export function CheckmatePatterns() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Checkmate Patterns</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            Understanding common checkmate patterns is crucial for both attacking and defensive play. 
            These patterns often occur in games and recognizing them can help you spot opportunities 
            or avoid falling into traps.
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Practice Makes Perfect</AlertTitle>
        <AlertDescription>
          Familiarize yourself with these patterns by setting them up on a board and playing them out. 
          This will help you recognize similar positions in your games.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-4">
        {checkmatePatterns.map((pattern) => (
          <Card key={pattern.name} className="h-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{pattern.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{pattern.description}</p>
              <div className="bg-gray-100 p-2 rounded">
                <p className="text-xs text-gray-500">Example position (FEN):</p>
                <code className="text-xs">{pattern.example}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="prose max-w-none mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Principles</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Always be aware of your king's safety and potential escape squares.</li>
          <li>Look for opportunities to restrict your opponent's king movement.</li>
          <li>Practice visualizing these patterns to improve your tactical awareness.</li>
          <li>Remember that most checkmates involve cooperation between multiple pieces.</li>
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="checkmate" />
      </div>
    </div>
  )
}

