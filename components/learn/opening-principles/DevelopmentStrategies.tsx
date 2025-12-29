import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'

const developmentStrategies = [
  {
    title: "Control the Center",
    description: "Develop pieces towards the center to control key squares and limit your opponent's options.",
    tips: [
      "Use pawns to stake a claim in the center",
      "Develop knights to c3, f3, c6, or f6 to support central pawns",
      "Place bishops on active diagonals targeting the center"
    ]
  },
  {
    title: "Develop Knights Before Bishops",
    description: "Generally, it's beneficial to develop knights before bishops in the opening.",
    tips: [
      "Knights have fewer squares available, so determining their best squares early is advantageous",
      "Developing knights helps protect central pawns",
      "Knight development can influence your choice of bishop development"
    ]
  },
  {
    title: "Don't Move the Same Piece Twice",
    description: "In the opening, aim to develop a new piece with each move rather than moving the same piece multiple times.",
    tips: [
      "Each move should contribute to your overall development",
      "Moving the same piece multiple times gives your opponent free moves to develop",
      "Exceptions exist, but be sure you have a good reason for moving a piece twice"
    ]
  },
  {
    title: "Castle Early",
    description: "Castling is a crucial part of king safety and rook activation in the opening.",
    tips: [
      "Aim to castle within the first 10 moves",
      "Consider which side to castle based on pawn structure and piece placement",
      "Be cautious about pushing pawns in front of your castled king"
    ]
  },
  {
    title: "Connect Your Rooks",
    description: "Develop pieces in a way that allows your rooks to connect, usually on the first rank.",
    tips: [
      "Clear the back rank by developing minor pieces and castling",
      "Connected rooks support each other and control open files more effectively",
      "Look for opportunities to place rooks on open files or behind passed pawns"
    ]
  },
  {
    title: "Develop with a Purpose",
    description: "Each development move should contribute to your overall plan and create threats when possible.",
    tips: [
      "Look for moves that develop pieces while also creating threats",
      "Consider how each move fits into your overall strategic plan",
      "Try to anticipate your opponent's responses and plan accordingly"
    ]
  }
]

export function DevelopmentStrategies() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Development Strategies</h2>
      <p className="text-gray-600 mb-6">
        Efficient piece development is crucial in the opening phase of a chess game. A well-executed development strategy sets the foundation for a strong middlegame and increases your chances of success. Let's explore key strategies for effective piece development.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Remember</AlertTitle>
        <AlertDescription>
          While these strategies are generally sound, chess is a complex game with many exceptions. Always be ready to adapt your development plan based on your opponent's moves and the specific requirements of the position.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {developmentStrategies.map((strategy, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{strategy.title}</h3>
              <p className="text-gray-600 mb-4">{strategy.description}</p>
              <ul className="list-disc pl-5 space-y-1">
                {strategy.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="text-[14px] --sm text-gray-600">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Applying Development Strategies</h3>
        <p className="text-gray-600 mb-4">
          To effectively apply these development strategies in your games, consider the following approach:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
          <li>Start with a plan: Before making your first move, have a general idea of how you want to develop your pieces.</li>
          <li>Stay flexible: Be prepared to adjust your development plan based on your opponent's moves.</li>
          <li>Watch for tactical opportunities: While focusing on development, don't miss chances to exploit your opponent's mistakes.</li>
          <li>Practice regularly: The more you play and study openings, the more natural these development strategies will become.</li>
          <li>Analyze your games: After each game, review your opening to see if you applied these strategies effectively and where you can improve.</li>
        </ol>
      </div>
    </div>
  )
}

