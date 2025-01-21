'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'
import dynamic from 'next/dynamic'

const Chessboard = dynamic(() => import('react-chessboard').then((mod) => mod.Chessboard), {
  ssr: false,
  loading: () => <div>Loading Chessboard...</div>,
})

const openings = {
  'e4': {
    name: "King's Pawn Opening",
    moves: ['e4'],
    description: "White immediately stakes a claim in the center, opening lines for the queen and king's bishop.",
    continuations: ['e5', 'c5', 'e6', 'c6']
  },
  'e4 e5': {
    name: "Open Game",
    moves: ['e4', 'e5'],
    description: "Black mirrors White's move, leading to an open, tactical game with many possibilities.",
    continuations: ['Nf3', 'Nc3', 'Bc4', 'f4']
  },
  'e4 c5': {
    name: "Sicilian Defense",
    moves: ['e4', 'c5'],
    description: "Black counters asymmetrically, fighting for the d4 square and preparing for a complex strategic battle.",
    continuations: ['Nf3', 'Nc3', 'd4', 'c3']
  },
  'd4': {
    name: "Queen's Pawn Opening",
    moves: ['d4'],
    description: "White stakes a claim in the center and prepares to develop the queen's bishop.",
    continuations: ['d5', 'Nf6', 'f5', 'e6']
  },
  'd4 d5': {
    name: "Closed Game",
    moves: ['d4', 'd5'],
    description: "Black mirrors White's move, often leading to a more positional game with a closed center.",
    continuations: ['c4', 'Nf3', 'Bf4', 'e3']
  },
  'c4': {
    name: "English Opening",
    moves: ['c4'],
    description: "White begins with a flank attack, controlling the d5 square and preparing for a flexible setup.",
    continuations: ['e5', 'c5', 'Nf6', 'e6']
  }
}

export function OpeningExplorer() {
  const [currentOpening, setCurrentOpening] = useState('e4')
  const [customFen, setCustomFen] = useState('')

  const handleContinuation = (continuation: string) => {
    const newOpening = `${currentOpening} ${continuation}`.trim()
    if (openings[newOpening as keyof typeof openings]) {
      setCurrentOpening(newOpening)
    }
  }

  const resetOpening = () => {
    setCurrentOpening('e4')
  }

  const handleCustomFen = () => {
    // In a real application, you would validate the FEN string here
    setCurrentOpening(customFen)
  }

  const currentOpeningData = openings[currentOpening as keyof typeof openings]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Opening Explorer</h2>
      <p className="text-gray-600 mb-6">
        Explore various chess openings interactively. This tool allows you to visualize different opening moves and understand their strategic implications.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Explore and Learn</AlertTitle>
        <AlertDescription>
          Use this explorer to familiarize yourself with common opening positions. Remember, understanding the ideas behind the moves is more important than memorization.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{currentOpeningData?.name || 'Custom Position'}</h3>
              <p className="text-gray-600 mb-4">{currentOpeningData?.description || 'Explore this custom position'}</p>
              <div className="mb-4">
                <strong>Moves: </strong>
                <span className="font-mono">{currentOpeningData?.moves.join(', ') || currentOpening}</span>
              </div>
              {currentOpeningData?.continuations && (
                <div className="mb-4">
                  <strong>Possible continuations: </strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentOpeningData.continuations.map((move) => (
                      <Button key={move} onClick={() => handleContinuation(move)} variant="outline">
                        {move}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <Button onClick={resetOpening} className="mt-4">Reset to Initial Position</Button>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[300px]">
                <Chessboard 
                  position={currentOpening}
                  boardWidth={300}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Explore Custom Position</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fen-input">Enter FEN string</Label>
              <Input
                id="fen-input"
                value={customFen}
                onChange={(e) => setCustomFen(e.target.value)}
                placeholder="e.g., rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
              />
            </div>
            <Button onClick={handleCustomFen}>Load Position</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Using the Opening Explorer</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Experiment with different move orders to understand their implications.</li>
          <li>Pay attention to the central pawn structure in various openings.</li>
          <li>Notice how different openings lead to different types of positions (open, closed, semi-open).</li>
          <li>Use the custom FEN input to explore specific positions you've encountered in your games.</li>
          <li>Try to anticipate potential threats or opportunities in each position.</li>
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="opening-explorer" />
      </div>
    </div>
  )
}

