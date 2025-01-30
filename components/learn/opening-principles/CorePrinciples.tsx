import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'

const principles = [
  {
    title: "Control the Center",
    description: "Aim to control the four central squares (e4, d4, e5, d5) with pawns and pieces.",
    tips: [
      "Use pawns to stake a claim in the center",
      "Develop pieces to attack and defend central squares",
      "Prevent your opponent from establishing a strong center"
    ]
  },
  {
    title: "Develop Pieces Quickly",
    description: "Bring your pieces into the game as efficiently as possible.",
    tips: [
      "Develop knights before bishops in most cases",
      "Avoid moving the same piece multiple times in the opening",
      "Try to develop with threats or attacks when possible"
    ]
  },
  {
    title: "King Safety",
    description: "Ensure your king is protected early in the game.",
    tips: [
      "Castle early, usually within the first 10 moves",
      "Avoid moving pawns in front of your castled king",
      "Be cautious about pushing pawns on the side you've castled"
    ]
  },
  {
    title: "Don't Bring the Queen Out Early",
    description: "Avoid moving your queen too soon, as it can become a target for your opponent.",
    tips: [
      "Develop minor pieces (knights and bishops) before the queen",
      "Use the queen to support your minor pieces rather than lead the attack",
      "Be aware of potential discovered attacks on your queen"
    ]
  },
  {
    title: "Connect Your Rooks",
    description: "Clear the back rank to connect your rooks and increase their power.",
    tips: [
      "Develop your pieces and castle to clear the back rank",
      "Avoid unnecessary pawn moves that block your rooks",
      "Look for opportunities to use open files with your connected rooks"
    ]
  },
  {
    title: "Create a Pawn Structure",
    description: "Develop a strong pawn structure to support your pieces and control space.",
    tips: [
      "Avoid creating doubled or isolated pawns early in the game",
      "Use pawn moves to open lines for your pieces",
      "Be mindful of creating pawn weaknesses in your position"
    ]
  }
]

export function CorePrinciples() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Opening Principles</h2>
        <p className="text-gray-600 mb-6">
          Mastering these fundamental principles will give you a solid foundation for playing strong chess openings. 
          These guidelines will help you develop your pieces efficiently, control the center, and set up a strong 
          position for the middlegame.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Remember</AlertTitle>
        <AlertDescription>
          While these principles are important, chess is a dynamic game. Be prepared to break these rules 
          when the position demands it, but make sure you understand why you're doing so.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {principles.map((principle, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{principle.title}</h3>
              <p className="text-gray-600 mb-4">{principle.description}</p>
              <ul className="list-disc pl-5 space-y-1">
                {principle.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="text-sm text-gray-600">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Putting It All Together</h3>
        <p className="text-gray-600 mb-4">
          Remember that these principles work together. As you play more games and study openings, 
          you'll develop a sense of how to balance these concepts and when to prioritize one over another.
        </p>
        <p className="text-gray-600">
          Practice applying these principles in your games, and analyze your openings afterwards to see 
          how well you followed them. Over time, they'll become second nature, allowing you to focus on 
          more advanced strategic concepts.
        </p>
      </div>
    </div>
  )
}

