import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'

const pieceValues = [
  { 
    piece: '♙', 
    name: 'Pawn', 
    value: 1,
    description: 'The most numerous piece. While individually weak, pawns can control key squares and become powerful in groups.',
    tips: [
      'Keep your pawns connected when possible',
      'Avoid creating doubled or isolated pawns',
      'Advance pawns to control the center',
    ]
  },
  { 
    piece: '♘', 
    name: 'Knight', 
    value: 3,
    description: 'Unique L-shaped movement makes knights excellent for tactical plays and attacking weak squares.',
    tips: [
      'Use knights to control important squares',
      'Be aware of forks and pins',
      'Knights are strong in open positions',
    ]
  },
  { 
    piece: '♗', 
    name: 'Bishop', 
    value: 3,
    description: 'Long-range piece that moves diagonally. The pair of bishops can control many squares from a distance.',
    tips: [
      'Use bishops to control long diagonals',
      'Bishops are strong in open positions',
      'Coordinate your bishops for maximum effect',
    ]
  },
  { 
    piece: '♖', 
    name: 'Rook', 
    value: 5,
    description: 'Powerful piece that controls ranks and files. Especially strong in the endgame.',
    tips: [
      'Use rooks to control open files',
      'Connect your rooks for maximum effect',
      'Rooks are strong in the endgame',
    ]
  },
  { 
    piece: '♕', 
    name: 'Queen', 
    value: 9,
    description: 'The most powerful piece, combining the movement of rook and bishop.',
    tips: [
      'Use the queen to control the center',
      'Be careful not to overextend your queen',
      'The queen is a versatile piece',
    ]
  },
  { 
    piece: '♔', 
    name: 'King', 
    value: '∞',
    description: 'Must be protected at all costs. Becomes an active piece in the endgame.',
    tips: [
      'Keep your king safe in the opening',
      'Use your king to control the endgame',
      'King safety is paramount',
    ]
  },
]

export function PieceValues() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Piece Values</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            In chess, each piece has a relative value that helps players make strategic decisions about 
            captures, trades, and sacrifices. While these values are not absolute, they serve as a 
            useful guide for evaluating positions and making tactical decisions.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">The Point System</h3>
          <p className="text-gray-600 mb-4">
            Chess pieces are traditionally assigned point values to help players understand their relative 
            worth. The pawn is used as the basic unit of measurement, worth one point. All other pieces' 
            values are measured relative to the pawn.
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Remember that piece values are relative and can change based on the position. A well-placed knight 
          might be worth more than a rook in certain positions.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pieceValues.map((piece, index) => (
          <Card key={piece.name} className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl text-blue-600">{piece.piece}</div>
                <div>
                  <div className="font-bold text-gray-900">{piece.name}</div>
                  <div className="text-[14px] --sm text-blue-600">Value: {piece.value}</div>
                </div>
              </div>
              <p className="text-[14px] --sm text-gray-600 mb-4">{piece.description}</p>
              <ul className="text-[14px] --sm text-gray-600 list-disc pl-4 space-y-1">
                {piece.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="prose max-w-none mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Strategic Considerations</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Material Balance</h4>
            <p className="text-gray-600 text-[14px] --sm">
              Keep track of the total value of pieces on both sides. A material advantage often 
              (but not always) translates to better winning chances.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Positional Factors</h4>
            <p className="text-gray-600 text-[14px] --sm">
              Remember that piece values are relative. A well-placed knight might be worth more 
              than a trapped rook in certain positions.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="piece-values" />
      </div>
    </div>
  )
}

