import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { CompleteButton } from "./CompleteButton"
import { ChessExample } from "./ChessExample"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const pieceCoordinationExamples = [
  {
    fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/1bPP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8",
    title: "Knight and Bishop Coordination",
    description:
      "In this position, White's pieces are well-coordinated. The knights support each other and control key central squares, while the bishops are ready to exert pressure on the kingside.",
    explanation: [
      "White's knights on d3 and f3 control important central squares (e5 and d5).",
      "The light-squared bishop on c4 is attacking the weak f7 square.",
      "The dark-squared bishop on d3 supports the e4 push and defends the c4 bishop.",
      "This coordination allows White to maintain central control and prepare for a kingside attack.",
    ],
  },
  {
    fen: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 1",
    title: "Bishop Pair Coordination",
    description:
      "Both sides have their bishop pairs working in harmony, controlling important diagonals. Notice how the bishops support each other's control of key squares.",
    explanation: [
      "White's bishops on c4 and g5 control long diagonals, putting pressure on Black's position.",
      "Black's bishops on c5 and g4 create a strong defensive structure and counter White's pressure.",
      "The bishop pairs for both sides cover each other's weaknesses, controlling both light and dark squares.",
      "This type of bishop coordination often leads to complex middlegame positions with many tactical opportunities.",
    ],
  },
  {
    fen: "2r2rk1/1bq1bppp/p2p1n2/1p2p3/4P3/1BN1B3/PPP2PPP/2RQ1RK1 w - - 0 1",
    title: "Rook Coordination",
    description:
      "The rooks are connected on the c-file and ready to penetrate into the opponent's position. This is a classic example of piece coordination.",
    explanation: [
      "White's rooks are connected on the c-file, creating a powerful battery.",
      "This rook coordination puts pressure on Black's c8 rook and potentially the c7 queen.",
      "The connected rooks can easily switch to other open files if needed.",
      "This type of rook coordination is often decisive in the middlegame and endgame phases.",
    ],
  },
  {
    fen: "r1b2rk1/pp2qppp/2n1pn2/2bp4/2P5/2N1PN2/PPQ1BPPP/R1B2RK1 w - - 0 1",
    title: "Queen and Bishop Battery",
    description:
      "The queen and bishop are aligned on the same diagonal, creating a powerful battery that threatens to break through the opponent's defenses.",
    explanation: [
      "White's queen on c2 and bishop on e2 form a powerful battery along the a2-g8 diagonal.",
      "This battery puts pressure on Black's kingside, particularly the g7 pawn.",
      "The queen-bishop battery can quickly switch to attack other targets if Black tries to defend g7.",
      "This coordination often forces the opponent to weaken their pawn structure or lose material.",
    ],
  },
  {
    fen: "r4rk1/ppp2ppp/2n1b3/q3p3/3nP3/2N2N2/PPP2PPP/R1BQR1K1 w - - 0 1",
    title: "Knight Outpost Coordination",
    description:
      "The knights are centralized and support each other while controlling key squares. This demonstrates effective minor piece coordination.",
    explanation: [
      "Black's knight on d4 is a strong outpost, supported by the e5 pawn and not easily attacked by White's pawns.",
      "The knight on c6 supports the d4 knight and controls important central squares.",
      "This knight coordination restricts White's piece movement and creates tactical opportunities for Black.",
      "The strong knight outpost often compensates for Black's slightly underdeveloped kingside.",
    ],
  },
]

export function PieceCoordination() {
  const [currentExample, setCurrentExample] = useState(0)

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % pieceCoordinationExamples.length)
  }

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + pieceCoordinationExamples.length) % pieceCoordinationExamples.length)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Piece Coordination</h2>
        <p className="text-gray-600 mb-6">
          Effective piece coordination is crucial in the middlegame. It involves arranging your pieces to work together
          harmoniously, supporting each other's strengths and covering for weaknesses.
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Remember, a well-coordinated set of pieces is often more powerful than a collection of individually strong but
          uncoordinated pieces.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <ChessExample
          key={pieceCoordinationExamples[currentExample].fen}
          initialFen={pieceCoordinationExamples[currentExample].fen}
          title={pieceCoordinationExamples[currentExample].title}
          description={pieceCoordinationExamples[currentExample].description}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gray-50 p-4 rounded-lg shadow"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Why This Works</h4>
          <ul className="list-disc pl-5 space-y-2">
            {pieceCoordinationExamples[currentExample].explanation.map((point, index) => (
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
            {currentExample + 1} of {pieceCoordinationExamples.length}
          </span>
          <Button onClick={nextExample} variant="outline" size="sm">
            Next Example
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Rook Coordination</h3>
              <p className="text-gray-600 mb-4">
                Align rooks on open files or half-open files to maximize their influence. Two rooks working together on
                the 7th rank can be particularly powerful.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Knight and Bishop Synergy</h3>
              <p className="text-gray-600 mb-4">
                Position knights and bishops to cover each other's weaknesses. Knights can protect weak squares that
                bishops can't reach, while bishops can control long diagonals.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Queen and Bishop Batteries</h3>
              <p className="text-gray-600 mb-4">
                Align your queen and bishop on the same diagonal to create a powerful attacking formation, often
                referred to as a "battery".
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Pawn and Piece Interaction</h3>
              <p className="text-gray-600 mb-4">
                Use pawns to support and protect your pieces, while your pieces defend key pawn structures. This
                symbiotic relationship is crucial for a strong position.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Improving Piece Coordination</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Always consider how your pieces can work together before making a move.</li>
          <li>Look for ways to improve the position of your least active piece.</li>
          <li>Avoid blocking your own pieces' lines of action.</li>
          <li>Practice visualizing how your pieces can cover each other's weaknesses.</li>
          <li>Study master games to see examples of excellent piece coordination in action.</li>
        </ul>
      </motion.div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="piece-coordination" />
      </div>
    </div>
  )
}

