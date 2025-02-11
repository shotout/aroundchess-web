import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import mermaid from 'mermaid'
import { useEffect, useRef } from 'react'

const commonMistakes = [
  {
    title: "Moving the same piece multiple times",
    description: "In the opening, it's crucial to develop different pieces rather than moving the same piece multiple times. This helps you control more of the board and prepare for the middlegame.",
    example: "Moving your knight back and forth instead of developing other pieces."
  },
  {
    title: "Bringing the queen out too early",
    description: "While the queen is the most powerful piece, bringing it out too early can make it vulnerable to attacks, wasting valuable tempo.",
    example: "Moving the queen to h5 on the second or third move, exposing it to potential threats."
  },
  {
    title: "Neglecting king safety",
    description: "Failing to castle or weakening the pawn structure around your king can leave you vulnerable to early attacks.",
    example: "Pushing the pawns in front of your castled king without a good reason."
  },
  {
    title: "Ignoring the center",
    description: "Control of the center is crucial in chess. Neglecting to fight for central control can give your opponent a significant advantage.",
    example: "Developing all your pieces on the flanks while your opponent controls e4, d4, e5, and d5."
  },
  {
    title: "Developing bishops before knights",
    description: "Generally, it's better to develop knights before bishops in the opening. Knights are less flexible, so determining their best squares early is beneficial.",
    example: "Moving both bishops out before developing any knights."
  },
  {
    title: "Making too many pawn moves",
    description: "While some pawn moves are necessary, making too many can slow down your development and give your opponent time to gain an advantage.",
    example: "Moving multiple pawns in the first few moves without developing any pieces."
  }
]

const mermaidDiagram = `
graph TD
    A[Start Game] --> B{Develop a Piece?}
    B -->|Yes| C{Central Square?}
    B -->|No| D[Reconsider Move]
    C -->|Yes| E[Good Move!]
    C -->|No| F{Improves Position?}
    F -->|Yes| E
    F -->|No| D
    E --> G{All Pieces Developed?}
    G -->|Yes| H[Proceed to Middlegame]
    G -->|No| B

    classDef default fill:#f1f5f9,stroke:#3b82f6,stroke-width:2px;
    classDef decision fill:#dbeafe,stroke:#3b82f6,stroke-width:2px;
    classDef success fill:#dcfce7,stroke:#22c55e,stroke-width:2px;
    classDef warning fill:#fee2e2,stroke:#ef4444,stroke-width:2px;
    
    class A,H default;
    class B,C,F,G decision;
    class E success;
    class D warning;
`

const MermaidDiagram = ({ chart }: { chart: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'neutral',
        flowchart: {
          curve: 'basis',
          padding: 20,
          nodeSpacing: 50,
          rankSpacing: 50,
          htmlLabels: true,
        },
        themeVariables: {
          fontFamily: 'inherit',
          fontSize: '16px',
          primaryColor: '#3b82f6',
          primaryTextColor: '#fff',
          primaryBorderColor: '#2563eb',
          lineColor: '#64748b',
          secondaryColor: '#f1f5f9',
          tertiaryColor: '#f8fafc',
        }
      })

      try {
        mermaid.render('mermaid-diagram', chart).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg
          }
        })
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error)
      }
    }
  }, [chart])

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <div ref={containerRef} className="mermaid overflow-x-auto" />
    </div>
  )
}

export function CommonMistakes() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Opening Mistakes</h2>
      <p className="text-gray-600 mb-6">
        Understanding common mistakes in chess openings is crucial for improving your game. By recognizing and avoiding these errors, you can significantly enhance your opening play and set yourself up for success in the middlegame.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Learning from Mistakes</AlertTitle>
        <AlertDescription>
          Remember, everyone makes these mistakes at some point. The key is to learn from them and gradually improve your opening play.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {commonMistakes.map((mistake, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{mistake.title}</h3>
              <p className="text-gray-600 mb-4">{mistake.description}</p>
              <div className="bg-gray-100 p-3 rounded-md">
                <span className="font-semibold">Example: </span>
                <span className="text-gray-700">{mistake.example}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Process for Avoiding Common Mistakes</h3>
      
      <div className="w-full overflow-x-auto">
        <MermaidDiagram chart={mermaidDiagram} />
      </div>

      <p className="text-gray-600 mt-4">
        This flowchart illustrates a simple decision-making process to help avoid common opening mistakes. 
        By following this process, you can ensure that each move in the opening contributes to your overall development and position.
      </p>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Avoid These Mistakes</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Study opening principles thoroughly and apply them consistently.</li>
          <li>Analyze your games, focusing on the opening phase, to identify recurring mistakes.</li>
          <li>Practice with purpose, setting specific goals for your opening play in each game.</li>
          <li>Learn from master games, paying attention to how strong players handle the opening.</li>
          <li>Be patient and resist the urge to make aggressive moves without proper development.</li>
        </ul>
      </div>
    </div>
  )
}
