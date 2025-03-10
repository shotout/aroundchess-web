import fs from 'fs'
import path from 'path'

const topics = [
  'advanced-pawn-endgames',
  'basic-checkmates',
  'basic-endgame-principles',
  'basic-minor-piece',
  'basic-rook-endgames',
  'bishop-knight-mate',
  'complex-minor-piece',
  'complex-queen-endgames',
  'complex-rook-endgames',
  'drawing-techniques',
  'endgame-calculation',
  'endgame-principles',
  'endgame-studies',
  'endgame-tactics',
  'fortress-positions',
  'king-activity',
  'king-and-pawn',
  'knight-vs-bishop',
  'minor-piece-endgames',
  'opposite-colored-bishops',
  'pawn-breakthroughs',
  'pawn-endgames',
  'practical-endgame',
  'queen-endgame-principles',
  'queen-endgames',
  'queen-vs-pawn',
  'queen-vs-rook',
  'rook-bishop-vs-rook',
  'rook-endgames',
  'rook-vs-minor',
  'rook-vs-pawns',
  'same-colored-bishops',
  'stalemate-patterns',
  'technical-conversion',
  'technical-winning',
  'theoretical-endgames',
  'theoretical-positions',
  'zugzwang-positions'
]

const template = (topic: string) => '"use client"\n\n' +
  'import { useState, useEffect } from "react"\n' +
  'import { Card } from "@/components/ui/card"\n' +
  'import { Badge } from "@/components/ui/badge"\n' +
  'import { ScrollArea } from "@/components/ui/scroll-area"\n' +
  'import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"\n' +
  'import { Button } from "@/components/ui/button"\n' +
  'import { BookOpen, Clock, Target, Book, ChevronLeft, RotateCcw } from "lucide-react"\n' +
  'import Link from "next/link"\n' +
  'import dynamic from "next/dynamic"\n' +
  `import { ${topic.replace(/-/g, '')} } from "@/components/analysis/training-plan/training-topics/endgame/${topic}"\n` +
  'import { endgamePositions } from "@/components/analysis/training-plan/training-topics/endgame/positions"\n' +
  'import { Chess, Square } from "chess.js"\n' +
  'import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"\n\n' +
  'interface ChessboardProps {\n' +
  '  position: string\n' +
  '  boardSize: number\n' +
  '  isDraggable: boolean\n' +
  '  onPieceDrop?: (sourceSquare: Square, targetSquare: Square, piece: string) => boolean\n' +
  '}\n\n' +
  'const Chessboard = dynamic<ChessboardProps>(() => import("@/components/chess/chessboard"), {\n' +
  '  ssr: false,\n' +
  '})\n\n' +
  `export default function ${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Page() {\n` +
  `  const initialPosition = endgamePositions['${topic}']\n` +
  '  const [game, setGame] = useState<Chess>(new Chess(initialPosition))\n' +
  '  const [position, setPosition] = useState(initialPosition)\n\n' +
  '  function onDrop(sourceSquare: Square, targetSquare: Square, piece: string) {\n' +
  '    try {\n' +
  '      const move = game.move({\n' +
  '        from: sourceSquare,\n' +
  '        to: targetSquare,\n' +
  '        promotion: piece[1].toLowerCase() === "p" ? "q" : undefined,\n' +
  '      })\n\n' +
  '      if (move === null) return false\n' +
  '      setPosition(game.fen())\n' +
  '      return true\n' +
  '    } catch (e) {\n' +
  '      return false\n' +
  '    }\n' +
  '  }\n\n' +
  '  function resetPosition() {\n' +
  '    const newGame = new Chess(initialPosition)\n' +
  '    setGame(newGame)\n' +
  '    setPosition(initialPosition)\n' +
  '  }\n\n' +
  '  useEffect(() => {\n' +
  '    resetPosition()\n' +
  '  }, [])\n\n' +
  '  return (\n' +
  '    <div className="container mx-auto py-6 space-y-6">\n' +
  '      <div className="flex items-center gap-4 mb-6">\n' +
  '        <Link href="/dashboard/learning/endgame">\n' +
  '          <Button variant="ghost" size="icon">\n' +
  '            <ChevronLeft className="h-6 w-6" />\n' +
  '          </Button>\n' +
  '        </Link>\n' +
  '        <div>\n' +
  `          <h1 className="text-3xl font-bold tracking-tight">{${topic.replace(/-/g, '')}.title}</h1>\n` +
  `          <p className="text-muted-foreground">{${topic.replace(/-/g, '')}.description}</p>\n` +
  '        </div>\n' +
  '      </div>\n\n' +
  '      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">\n' +
  '        <div className="lg:col-span-2 space-y-6">\n' +
  '          <Card className="p-6">\n' +
  '            <div className="flex justify-center mb-6">\n' +
  '              <div style={{ width: \'100%\', maxWidth: \'480px\', aspectRatio: \'1/1\' }}>\n' +
  '                <Chessboard\n' +
  '                  position={position}\n' +
  '                  boardSize={480}\n' +
  '                  isDraggable={true}\n' +
  '                  onPieceDrop={onDrop}\n' +
  '                />\n' +
  '              </div>\n' +
  '            </div>\n' +
  '            \n' +
  '            <div className="space-y-4">\n' +
  '              <div className="flex items-center justify-between gap-2">\n' +
  '                <div className="flex items-center gap-2">\n' +
  `                  <Badge variant="secondary">{${topic.replace(/-/g, '')}.difficulty}</Badge>\n` +
  '                  <div className="flex items-center gap-1 text-muted-foreground">\n' +
  '                    <Clock className="h-4 w-4" />\n' +
  `                    <span>{${topic.replace(/-/g, '')}.estimatedTime}</span>\n` +
  '                  </div>\n' +
  '                </div>\n' +
  '                <TooltipProvider>\n' +
  '                  <Tooltip>\n' +
  '                    <TooltipTrigger asChild>\n' +
  '                      <Button\n' +
  '                        variant="outline"\n' +
  '                        size="sm"\n' +
  '                        className="gap-2"\n' +
  '                        onClick={resetPosition}\n' +
  '                      >\n' +
  '                        <RotateCcw className="h-4 w-4" />\n' +
  '                        Reset Position\n' +
  '                      </Button>\n' +
  '                    </TooltipTrigger>\n' +
  '                    <TooltipContent>\n' +
  '                      <p>Reset to initial position</p>\n' +
  '                    </TooltipContent>\n' +
  '                  </Tooltip>\n' +
  '                </TooltipProvider>\n' +
  '              </div>\n\n' +
  '              <Tabs defaultValue="overview" className="w-full">\n' +
  '                <TabsList className="w-full">\n' +
  '                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>\n' +
  '                  <TabsTrigger value="patterns" className="flex-1">Patterns</TabsTrigger>\n' +
  '                  <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>\n' +
  '                </TabsList>\n\n' +
  '                <TabsContent value="overview" className="mt-6">\n' +
  '                  <div className="space-y-6">\n' +
  '                    <div>\n' +
  '                      <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>\n' +
  '                      <ul className="space-y-2">\n' +
  `                        {${topic.replace(/-/g, '')}.objectives?.map((objective, index) => (\n` +
  '                          <li key={index} className="text-muted-foreground flex items-start gap-2">\n' +
  '                            <span className="select-none">•</span>\n' +
  '                            <span>{objective}</span>\n' +
  '                          </li>\n' +
  '                        ))}\n' +
  '                      </ul>\n' +
  '                    </div>\n\n' +
  '                    <div>\n' +
  '                      <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>\n' +
  '                      <div className="flex gap-2">\n' +
  `                        {${topic.replace(/-/g, '')}.prerequisites?.map((prereq, index) => (\n` +
  '                          <Badge key={index} variant="outline">{prereq}</Badge>\n' +
  '                        ))}\n' +
  '                      </div>\n' +
  '                    </div>\n\n' +
  '                    <div>\n' +
  '                      <h3 className="text-lg font-semibold mb-3">Fundamental Positions</h3>\n' +
  '                      <ul className="space-y-2">\n' +
  `                        {${topic.replace(/-/g, '')}.fundamentalPositions?.map((position, index) => (\n` +
  '                          <li key={index} className="text-muted-foreground flex items-start gap-2">\n' +
  '                            <Target className="h-4 w-4 mt-1" />\n' +
  '                            <span>{position}</span>\n' +
  '                          </li>\n' +
  '                        ))}\n' +
  '                      </ul>\n' +
  '                    </div>\n' +
  '                  </div>\n' +
  '                </TabsContent>\n\n' +
  '                <TabsContent value="patterns" className="space-y-4">\n' +
  '                  <div className="space-y-6">\n' +
  '                    <div>\n' +
  '                      <h3 className="text-lg font-semibold mb-3">Winning Techniques</h3>\n' +
  '                      <ul className="space-y-2">\n' +
  `                        {${topic.replace(/-/g, '')}.winningTechniques?.map((technique, index) => (\n` +
  '                          <li key={index} className="text-muted-foreground flex items-start gap-2">\n' +
  '                            <Target className="h-4 w-4 mt-1" />\n' +
  '                            <span>{technique}</span>\n' +
  '                          </li>\n' +
  '                        ))}\n' +
  '                      </ul>\n' +
  '                    </div>\n\n' +
  '                    <div>\n' +
  '                      <h3 className="text-lg font-semibold mb-3">Common Mistakes</h3>\n' +
  '                      <ul className="space-y-2">\n' +
  `                        {${topic.replace(/-/g, '')}.commonMistakes?.map((mistake, index) => (\n` +
  '                          <li key={index} className="text-muted-foreground flex items-start gap-2">\n' +
  '                            <Target className="h-4 w-4 mt-1" />\n' +
  '                            <span>{mistake}</span>\n' +
  '                          </li>\n' +
  '                        ))}\n' +
  '                      </ul>\n' +
  '                    </div>\n' +
  '                  </div>\n' +
  '                </TabsContent>\n\n' +
  '                <TabsContent value="resources" className="space-y-4">\n' +
  `                  {${topic.replace(/-/g, '')}.resources?.map((resource, index) => (\n` +
  '                    <Card key={index} className="p-4">\n' +
  '                      <div className="flex items-start gap-4">\n' +
  '                        <Book className="h-5 w-5 mt-1" />\n' +
  '                        <div>\n' +
  '                          <h3 className="font-semibold">{resource.title}</h3>\n' +
  '                          <p className="text-sm text-muted-foreground">{resource.description}</p>\n' +
  '                          <a\n' +
  '                            href={resource.url}\n' +
  '                            target="_blank"\n' +
  '                            rel="noopener noreferrer"\n' +
  '                            className="text-sm text-primary hover:underline"\n' +
  '                          >\n' +
  '                            Visit {resource.platform}\n' +
  '                          </a>\n' +
  '                        </div>\n' +
  '                      </div>\n' +
  '                    </Card>\n' +
  '                  ))}\n' +
  '                </TabsContent>\n' +
  '              </Tabs>\n' +
  '            </div>\n' +
  '          </Card>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '  )\n' +
  '}\n'

// Generate pages for each topic
topics.forEach(topic => {
  const dir = path.join('app/dashboard/learning/endgame', topic)
  const file = path.join(dir, 'page.tsx')
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  fs.writeFileSync(file, template(topic))
})

console.log('Generated all endgame topic pages') 