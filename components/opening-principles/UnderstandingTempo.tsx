import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'

const tempoExamples = [
  {
    title: "Developing with a threat",
    description: "Moving a piece to a square where it attacks an enemy piece or creates a threat, forcing the opponent to respond.",
    example: "1.e4 e5 2.Nf3 (developing the knight and attacking e5)"
  },
  {
    title: "Unnecessary piece moves",
    description: "Moving a piece multiple times in the opening without clear purpose, allowing the opponent to develop freely.",
    example: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 b5 5.Bb3 (White has moved the bishop three times while Black has developed)"
  },
  {
    title: "Pawn breaks",
    description: "Using a pawn move to challenge the opponent's pawn structure, often gaining tempo by forcing a response.",
    example: "In the Queen's Gambit: 1.d4 d5 2.c4 (challenging Black's central pawn)"
  },
  {
    title: "Zwischenzug (In-between move)",
    description: "Making an unexpected move that forces a specific response before making the expected move, often gaining tempo.",
    example: "In a position where the opponent expects you to recapture a piece, first making a check or threat before recapturing"
  }
]

export function UnderstandingTempo() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Tempo</h2>
      <p className="text-gray-600 mb-6">
        In chess, tempo refers to a "turn" or a single move. Understanding and managing tempo is crucial in the opening phase and throughout the game. Gaining or losing tempo can significantly impact your position and chances of success.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Key Concept</AlertTitle>
        <AlertDescription>
          Gaining tempo means making a move that forces your opponent to respond in a way that doesn't improve their position, effectively giving you an extra move.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {tempoExamples.map((example, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{example.title}</h3>
              <p className="text-gray-600 mb-4">{example.description}</p>
              <div className="bg-gray-100 p-3 rounded-md">
                <span className="font-semibold">Example: </span>
                <span className="text-gray-700">{example.example}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Importance of Tempo in Openings</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Faster development: Efficient use of tempo allows you to develop your pieces more quickly.</li>
          <li>Initiative: Gaining tempo often means gaining the initiative, allowing you to dictate the flow of the game.</li>
          <li>Positional advantages: Tempo gains can translate into lasting positional advantages, such as control of key squares or open files.</li>
          <li>Psychological edge: Consistently gaining tempo can put pressure on your opponent, potentially leading to mistakes.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Managing Tempo</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Develop with purpose: Each move in the opening should contribute to your overall plan.</li>
          <li>Look for forcing moves: Moves that create threats or force specific responses can help you gain tempo.</li>
          <li>Avoid unnecessary retreats: Moving a piece back to where it came from often loses tempo.</li>
          <li>Be wary of early queen moves: While powerful, early queen moves can often be exploited by the opponent to gain tempo.</li>
          <li>Study master games: Analyze how strong players manage tempo in the opening and try to apply those principles in your games.</li>
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="understanding-tempo" />
      </div>
    </div>
  )
}

