import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'

const historicalGames = [
  {
    title: "The Immortal Game",
    players: "Adolf Anderssen vs Lionel Kieseritzky",
    year: 1851,
    opening: "King's Gambit Accepted",
    description: "This game is famous for Anderssen's sacrificial attacking play and the final position where he delivers checkmate with only three minor pieces against Kieseritzky's full army.",
    key_moves: [
      "1.e4 e5 2.f4 (King's Gambit)",
      "5...Bc5 (declining the gambit pawn)",
      "11.Na3 (unusual knight development)",
      "17.Bxg7 (the first of many sacrifices)",
      "22.Qf6!! (the brilliant queen sacrifice)"
    ]
  },
  {
    title: "The Opera Game",
    players: "Paul Morphy vs Duke of Brunswick and Count Isouard",
    year: 1858,
    opening: "Philidor Defense",
    description: "This game showcases Morphy's genius in exploiting poor development and the importance of piece activity over material.",
    key_moves: [
      "1.e4 e5 2.Nf3 d6 (Philidor Defense)",
      "5...Bg4? (a mistake, pinning the knight but neglecting development)",
      "8.Qb3! (attacking f7 and b7)",
      "9.Bxb5+! (a classic bishop sacrifice to open lines)",
      "14.Rd1 (activating the last piece before the final combination)"
    ]
  },
  {
    title: "The Evergreen Game",
    players: "Adolf Anderssen vs Jean Dufresne",
    year: 1852,
    opening: "Evans Gambit",
    description: "Another masterpiece by Anderssen, this game features a series of sacrifices leading to a beautiful checkmate.",
    key_moves: [
      "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 (Evans Gambit)",
      "9.d4 (central break, typical in the Evans Gambit)",
      "18.Bxd7+! (starting the final combination)",
      "22.Qxf7+!! (the brilliant queen sacrifice leading to checkmate)"
    ]
  },
  {
    title: "The Game of the Century",
    players: "Donald Byrne vs Bobby Fischer",
    year: 1956,
    opening: "Grünfeld Defense",
    description: "This game, played by 13-year-old Bobby Fischer, is renowned for its brilliant queen sacrifice and complex tactical play.",
    key_moves: [
      "1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 (Grünfeld Defense)",
      "11...Na4! (Fischer's brilliant move, sacrificing a knight for long-term compensation)",
      "17.Qb3?? (a blunder that Fischer immediately punishes)",
      "17...Bxc3! (Fischer's famous queen sacrifice)",
      "25...Rd1+ (the final blow, leading to mate or huge material gain)"
    ]
  }
]

export function HistoricalAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Historical Opening Analysis</h2>
      <p className="text-gray-600 mb-6">
        Studying famous historical games provides invaluable insights into opening principles and their practical application. These games showcase how great players of the past handled opening positions and transitioned into the middlegame.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Learning from the Masters</AlertTitle>
        <AlertDescription>
          While studying these games, focus on understanding the ideas behind the moves rather than memorizing them. Pay attention to how the players develop their pieces, control the center, and create plans based on the opening.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {historicalGames.map((game, index) => (
          <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-blue-600">{game.title}</span>
              </div>
              <div className="space-y-3 flex-grow">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-500">Players</p>
                  <p className="text-gray-900">{game.players}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-500">Year</p>
                  <p className="text-gray-900">{game.year}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-500">Opening</p>
                  <p className="text-gray-900">{game.opening}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-600">{game.description}</p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Key Moves</h4>
                  <ul className="list-none space-y-2">
                    {game.key_moves.map((move, moveIndex) => (
                      <li key={moveIndex} className="text-sm text-gray-600 pl-3 border-l-2 border-blue-200">{move}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Lessons from Historical Games</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>The importance of rapid development and fighting for the center in the opening</li>
          <li>How strong players punish slow or incorrect development</li>
          <li>The power of sacrifices to gain initiative or expose the enemy king</li>
          <li>The relationship between pawn structures established in the opening and subsequent middlegame plans</li>
          <li>How tactical opportunities often arise from superior piece placement achieved in the opening</li>
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="historical-analysis" />
      </div>
    </div>
  )
}

