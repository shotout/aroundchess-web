import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'

const pawnStructures = [
  {
    name: 'Isolated Pawn',
    description: 'A pawn with no friendly pawns on adjacent files. It can be weak because it can\'t be protected by other pawns.',
  },
  {
    name: 'Doubled Pawns',
    description: 'Two pawns of the same color on the same file. They can be weak because they can\'t protect each other.',
  },
  {
    name: 'Pawn Chain',
    description: 'A diagonal line of pawns protecting each other. It can be strong but inflexible.',
  },
  {
    name: 'Passed Pawn',
    description: 'A pawn with no opposing pawns ahead of it on the same file or adjacent files. It has potential to promote.',
  },
  {
    name: 'Backward Pawn',
    description: 'A pawn that has fallen behind its neighbors and can\'t be safely advanced. It\'s often weak.',
  },
]

export function PawnStructure() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Pawn Structure</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            Pawn structure is a crucial aspect of chess strategy. The arrangement of pawns greatly 
            influences the character of the position and the plans available to both sides. 
            Understanding different pawn structures can help you make better strategic decisions.
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Importance of Pawn Structure</AlertTitle>
        <AlertDescription>
          Pawns are often called the "soul of chess". They determine the battlefield and create 
          weaknesses or strengths in a position. Pay close attention to pawn moves, as they are permanent!
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-4">
        {pawnStructures.map((structure) => (
          <Card key={structure.name} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600">{structure.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[14px] --sm text-gray-600">{structure.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="prose max-w-none mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Principles of Pawn Structure</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Control the center with pawns or pieces</li>
          <li>Avoid creating weaknesses in your pawn structure</li>
          <li>Use pawn breaks to open up the position when advantageous</li>
          <li>Be aware of potential pawn levers that can change the structure</li>
          <li>In general, try to keep your pawns flexible and mobile</li>
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="pawn-structure" />
      </div>
    </div>
  )
}

