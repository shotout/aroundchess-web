import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const notationExamples = [
  { move: "e4", explanation: "Pawn moves to e4", note: "Pawns are indicated by the destination square only" },
  { move: "Nf3", explanation: "Knight moves to f3", note: "N stands for Knight (K is reserved for King)" },
  { move: "Bxe5", explanation: "Bishop captures on e5", note: "x indicates a capture" },
  { move: "O-O", explanation: "Kingside castling", note: "Special notation for castling" },
  { move: "Qd1+", explanation: "Queen moves to d1, giving check", note: "+ indicates check" },
  { move: "Rfe1", explanation: "Rook from the f-file moves to e1", note: "Disambiguation when two pieces can move to the same square" }
]

const specialSymbols = [
  { symbol: "x", meaning: "Captures" },
  { symbol: "+", meaning: "Check" },
  { symbol: "#", meaning: "Checkmate" },
  { symbol: "O-O", meaning: "Kingside castling" },
  { symbol: "O-O-O", meaning: "Queenside castling" },
  { symbol: "=", meaning: "Pawn promotion" },
  { symbol: "!", meaning: "Good move" },
  { symbol: "?", meaning: "Poor move" },
  { symbol: "!!", meaning: "Brilliant move" },
  { symbol: "??", meaning: "Blunder" },
]

const ChessboardDiagram = () => (
  <svg width="240" height="240" viewBox="0 0 240 240" className="mx-auto my-4">
    <defs>
      <pattern id="smallGrid" width="30" height="30" patternUnits="userSpaceOnUse">
        <rect width="30" height="30" fill="#DBEAFE" />
        <rect width="30" height="30" fill="#2563EB" y="30" />
        <rect width="30" height="30" fill="#2563EB" x="30" />
      </pattern>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill="url(#smallGrid)" />
      </pattern>
    </defs>
    <rect width="240" height="240" fill="url(#grid)" />
    <g fill="#1F2937" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
      <text x="15" y="235">a</text>
      <text x="45" y="235">b</text>
      <text x="75" y="235">c</text>
      <text x="105" y="235">d</text>
      <text x="135" y="235">e</text>
      <text x="165" y="235">f</text>
      <text x="195" y="235">g</text>
      <text x="225" y="235">h</text>
    </g>
    <g fill="#1F2937" fontSize="10" fontFamily="sans-serif" textAnchor="end">
      <text x="10" y="195">1</text>
      <text x="10" y="165">2</text>
      <text x="10" y="135">3</text>
      <text x="10" y="105">4</text>
      <text x="10" y="75">5</text>
      <text x="10" y="45">6</text>
      <text x="10" y="15">7</text>
    </g>
  </svg>
)

export function ChessNotation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chess Notation</h2>
        <p className="text-gray-600 mb-6">
          Chess notation is the system used to record and communicate chess moves. The most common 
          system is algebraic notation, which is the official standard recognized by FIDE 
          (International Chess Federation).
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          Being able to read and write chess notation is essential for studying chess books, 
          recording your games, and communicating with other players.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>The Board</CardTitle>
          </CardHeader>
          <CardContent>
            <ChessboardDiagram />
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
              <li>Files (columns) are labeled a-h from left to right</li>
              <li>Ranks (rows) are numbered 1-8 from bottom to top</li>
              <li>Each square is identified by its file letter followed by its rank number</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>The Pieces</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Piece</TableHead>
                  <TableHead>Notation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>King</TableCell>
                  <TableCell>K</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Queen</TableCell>
                  <TableCell>Q</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rook</TableCell>
                  <TableCell>R</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bishop</TableCell>
                  <TableCell>B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Knight</TableCell>
                  <TableCell>N</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pawn</TableCell>
                  <TableCell>(no letter used)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Example Moves</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Notation</TableHead>
                <TableHead>Explanation</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notationExamples.map((example, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono">{example.move}</TableCell>
                  <TableCell>{example.explanation}</TableCell>
                  <TableCell>{example.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Symbols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {specialSymbols.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="font-mono text-blue-600 font-bold">{item.symbol}</span>
                <span className="text-gray-600">{item.meaning}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Game</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Here's how a famous game opening might be notated:</p>
          <div className="font-mono bg-gray-100 p-4 rounded border">
            <p className="text-[14px] --sm">1. e4 e5</p>
            <p className="text-[14px] --sm">2. Nf3 Nc6</p>
            <p className="text-[14px] --sm">3. Bb5 a6</p>
            <p className="text-[14px] --sm text-gray-500 mt-2">{"// This is the start of the Ruy Lopez opening"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <CompleteButton sectionId="notation" />
      </div>
    </div>
  )
}

