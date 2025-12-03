import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const terms = {
  basic: [
    {
      term: "Check",
      definition: "A direct attack on the king. The king must get out of check immediately.",
    },
    {
      term: "Checkmate",
      definition: "A position where the king is in check and there is no legal way to get out of it. This ends the game.",
    },
    {
      term: "Stalemate",
      definition: "A position where the player to move has no legal moves but is not in check. Results in a draw.",
    },
    {
      term: "Castling",
      definition: "A special move involving the king and rook, used to protect the king and activate the rook.",
    },
    {
      term: "En Passant",
      definition: "A special pawn capture that can only occur immediately after a pawn moves two squares forward from its starting position, and an enemy pawn could have captured it had it moved only one square forward.",
    },
    {
      term: "Promotion",
      definition: "When a pawn reaches the opposite end of the board, it can be exchanged for a queen, rook, bishop, or knight of the same color.",
    },
  ],
  tactical: [
    {
      term: "Pin",
      definition: "When a piece cannot move because it would expose a more valuable piece to capture.",
    },
    {
      term: "Fork",
      definition: "A single piece attacking two or more enemy pieces simultaneously.",
    },
    {
      term: "Skewer",
      definition: "Similar to a pin, but the more valuable piece is in front.",
    },
    {
      term: "Discovery",
      definition: "An attack revealed when one piece moves out of the way of another.",
    },
    {
      term: "Double Check",
      definition: "A check delivered by two pieces simultaneously, often resulting from a discovered check.",
    },
    {
      term: "Zwischenzug",
      definition: "An 'in-between' move that changes the situation on the board before making an expected move.",
    },
  ],
  positional: [
    {
      term: "Zugzwang",
      definition: "A position where any move will worsen the position.",
    },
    {
      term: "Prophylaxis",
      definition: "A move that prevents the opponent from executing their plan.",
    },
    {
      term: "Tempo",
      definition: "A single move or turn in chess. Gaining or losing tempo refers to saving or wasting moves.",
    },
    {
      term: "Initiative",
      definition: "The ability to make threats and force the opponent to respond.",
    },
    {
      term: "Space Advantage",
      definition: "Control over a greater portion of the board, limiting the opponent's piece mobility.",
    },
    {
      term: "Pawn Chain",
      definition: "A diagonal line of pawns protecting each other.",
    },
  ],
  structural: [
    {
      term: "Doubled Pawns",
      definition: "Two pawns of the same color on the same file.",
    },
    {
      term: "Isolated Pawn",
      definition: "A pawn with no friendly pawns on adjacent files.",
    },
    {
      term: "Passed Pawn",
      definition: "A pawn with no opposing pawns ahead of it on the same file or adjacent files.",
    },
    {
      term: "Backward Pawn",
      definition: "A pawn that has fallen behind its neighbors and cannot be safely advanced.",
    },
    {
      term: "Pawn Island",
      definition: "A group of pawns of the same color separated from other pawns of the same color.",
    },
    {
      term: "Pawn Majority",
      definition: "Having more pawns than the opponent on one side of the board.",
    },
  ],
}

const categoryIcons = {
  basic: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m4.93 4.93 14.14 14.14" />
    </svg>
  ),
  tactical: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m19 5-7 7-7-7" />
    </svg>
  ),
  positional: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </svg>
  ),
  structural: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16" />
      <path d="M4 20v-4" />
      <path d="M20 20v-4" />
      <path d="M4 16h16" />
      <path d="M9 12v-4" />
      <path d="M15 12v-4" />
      <path d="M4 4h16" />
    </svg>
  ),
}

export function ChessTerminology() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chess Terminology</h2>
        <p className="text-gray-600 mb-6">
          Understanding chess terminology is essential for learning from chess literature, 
          discussing games with others, and improving your strategic thinking.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Learning Tip</AlertTitle><AlertDescription>
          Focus on understanding one category at a time. Start with basic terms and gradually 
          move to more complex concepts as you improve.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="tactical">Tactical</TabsTrigger>
          <TabsTrigger value="positional">Positional</TabsTrigger>
          <TabsTrigger value="structural">Structural</TabsTrigger>
        </TabsList>
        {Object.entries(terms).map(([category, items]) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-blue-600">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </div>
                  <h3 className="text-xl font-semibold text-blue-600">
                    {category.charAt(0).toUpperCase() + category.slice(1)} Terms
                  </h3>
                </div>
                <div className="grid gap-4">
                  {items.map((item) => (
                    <div key={item.term} className="border-b pb-4 last:border-0 last:pb-0">
                      <h4 className="font-semibold text-gray-900">{item.term}</h4>
                      <p className="text-gray-600 text-[14px] --sm">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end">
        <CompleteButton sectionId="terminology" />
      </div>
    </div>
  )
}

