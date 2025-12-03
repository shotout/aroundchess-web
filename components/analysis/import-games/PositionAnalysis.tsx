import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Crown, Castle, Target, Swords } from "lucide-react"

interface PositionMetrics {
  pieceActivity: {
    white: number
    black: number
  }
  pawnStructure: {
    white: number
    black: number
    weaknesses: string[]
  }
  kingSafety: {
    white: number
    black: number
    threats: string[]
  }
  spaceAdvantage: {
    white: number
    black: number
    controlledSquares: number
  }
  keySquares: {
    controlled: string[]
    contested: string[]
    weak: string[]
  }
}

interface PositionAnalysisProps {
  metrics: PositionMetrics
}

export function PositionAnalysis({ metrics }: PositionAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Position-Specific Analysis</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Piece Activity */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium">Piece Activity</h4>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] --sm">White</span>
                <span className={`text-[14px] --sm font-medium ${getScoreColor(metrics.pieceActivity.white)}`}>
                  {metrics.pieceActivity.white}%
                </span>
              </div>
              <Progress value={metrics.pieceActivity.white} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] --sm">Black</span>
                <span className={`text-[14px] --sm font-medium ${getScoreColor(metrics.pieceActivity.black)}`}>
                  {metrics.pieceActivity.black}%
                </span>
              </div>
              <Progress value={metrics.pieceActivity.black} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Pawn Structure */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Castle className="h-5 w-5 text-green-500" />
            <h4 className="font-medium">Pawn Structure</h4>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] --sm">White</span>
                <span className={`text-[14px] --sm font-medium ${getScoreColor(metrics.pawnStructure.white)}`}>
                  {metrics.pawnStructure.white}%
                </span>
              </div>
              <Progress value={metrics.pawnStructure.white} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] --sm">Black</span>
                <span className={`text-[14px] --sm font-medium ${getScoreColor(metrics.pawnStructure.black)}`}>
                  {metrics.pawnStructure.black}%
                </span>
              </div>
              <Progress value={metrics.pawnStructure.black} className="h-2" />
            </div>
            {metrics.pawnStructure.weaknesses.length > 0 && (
              <div className="text-[14px] --sm text-muted-foreground mt-2">
                Weaknesses: {metrics.pawnStructure.weaknesses.join(", ")}
              </div>
            )}
          </div>
        </Card>

        {/* King Safety */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium">King Safety</h4>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] --sm">White</span>
                <span className={`text-[14px] --sm font-medium ${getScoreColor(metrics.kingSafety.white)}`}>
                  {metrics.kingSafety.white}%
                </span>
              </div>
              <Progress value={metrics.kingSafety.white} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] --sm">Black</span>
                <span className={`text-[14px] --sm font-medium ${getScoreColor(metrics.kingSafety.black)}`}>
                  {metrics.kingSafety.black}%
                </span>
              </div>
              <Progress value={metrics.kingSafety.black} className="h-2" />
            </div>
            {metrics.kingSafety.threats.length > 0 && (
              <div className="text-[14px] --sm text-red-500 mt-2">
                Threats: {metrics.kingSafety.threats.join(", ")}
              </div>
            )}
          </div>
        </Card>

        {/* Space Advantage */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            <h4 className="font-medium">Space & Control</h4>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] --sm">White</span>
                <span className={`text-[14px] --sm font-medium ${getScoreColor(metrics.spaceAdvantage.white)}`}>
                  {metrics.spaceAdvantage.white}%
                </span>
              </div>
              <Progress value={metrics.spaceAdvantage.white} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] --sm">Black</span>
                <span className={`text-[14px] --sm font-medium ${getScoreColor(metrics.spaceAdvantage.black)}`}>
                  {metrics.spaceAdvantage.black}%
                </span>
              </div>
              <Progress value={metrics.spaceAdvantage.black} className="h-2" />
            </div>
            <div className="text-[14px] --sm text-muted-foreground mt-2">
              Controlled squares: {metrics.spaceAdvantage.controlledSquares}
            </div>
          </div>
        </Card>

        {/* Key Squares */}
        <Card className="p-4 space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-red-500" />
            <h4 className="font-medium">Key Squares</h4>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h5 className="text-[14px] --sm font-medium mb-1">Controlled</h5>
              <p className="text-[14px] --sm text-muted-foreground">
                {metrics.keySquares.controlled.join(", ")}
              </p>
            </div>
            <div>
              <h5 className="text-[14px] --sm font-medium mb-1">Contested</h5>
              <p className="text-[14px] --sm text-muted-foreground">
                {metrics.keySquares.contested.join(", ")}
              </p>
            </div>
            <div>
              <h5 className="text-[14px] --sm font-medium mb-1">Weak</h5>
              <p className="text-[14px] --sm text-muted-foreground">
                {metrics.keySquares.weak.join(", ")}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 