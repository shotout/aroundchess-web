import { Lightbulb, Download, FileSearch, Settings2, Sparkles, Brain } from "lucide-react"

const tips = [
  {
    icon: <Download className="h-5 w-5 text-yellow-500" />,
    title: "Exporting PGN Files",
    description:
      "Most chess platforms (chess.com, lichess.org) allow you to export your games. Look for the 'Export' or 'Download' option in your game history.",
  },
  {
    icon: <FileSearch className="h-5 w-5 text-blue-500" />,
    title: "Clean PGN Format",
    description:
      "Ensure your PGN includes essential game information like player names, dates, and moves. Clean, well-formatted PGN files provide better analysis results.",
  },
  {
    icon: <Settings2 className="h-5 w-5 text-green-500" />,
    title: "Batch Processing",
    description:
      "You can import multiple games at once by including them in a single PGN file. Each game should be separated by proper PGN tags.",
  },
  {
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
    title: "Analysis Features",
    description:
      "After importing, you'll get access to detailed analysis including opening identification, tactical opportunities, and strategic assessments.",
  },
  {
    icon: <Brain className="h-5 w-5 text-red-500" />,
    title: "Learning Opportunities",
    description:
      "Use the analysis to identify patterns in your play, understand your strengths and weaknesses, and focus your training efforts.",
  },
]

export function ProTips() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-primary">
        <Lightbulb className="h-5 w-5" />
        <h3 className="font-semibold">Pro Tips</h3>
      </div>

      <div className="space-y-6">
        {tips.map((tip, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              {tip.icon}
              <h4 className="font-medium">{tip.title}</h4>
            </div>
            <p className="text-[14px] --sm text-muted-foreground pl-7">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 