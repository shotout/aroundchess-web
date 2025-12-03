'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button'
import { Info, ChevronRight, ChevronLeft } from 'lucide-react'
import { Chessboard } from 'react-chessboard'

const openingTraps = [
  {
    name: "Scholar's Mate",
    description: "A quick checkmate attempt targeting the f7 square.",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 3",
    analysis: "White aims for a quick checkmate, but it's easily defended if Black is aware of the threat.",
    defense: "Be aware of the f7 weakness and defend it early, typically with ...g6 or ...Nf6."
  },
  {
    name: "Fried Liver Attack",
    description: "An aggressive opening in the Two Knights Defense.",
    fen: "r1bqkb1r/ppp2ppp/2n5/3np3/2B5/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5",
    analysis: "White sacrifices a knight for a strong attack, but Black has several ways to defend or counter-attack.",
    defense: "Instead of 3...Nf6, Black can play 3...Bc5 or 3...d6 to avoid this line entirely."
  },
  {
    name: "Légal Trap",
    description: "A trap in the Italian Game involving a queen sacrifice.",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    analysis: "White lures Black into capturing the queen, leading to a quick checkmate if Black falls for it.",
    defense: "Be cautious of early queen moves and develop pieces to safe squares."
  },
  {
    name: "Blackburne Shilling Gambit",
    description: "A tricky gambit in the Italian Game.",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b5/2B1p3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 6",
    analysis: "Black sacrifices a pawn for quick development and attacking chances.",
    defense: "White should be cautious and not rush to capture the e-pawn without considering the consequences."
  },
  {
    name: "Elephant Trap",
    description: "A trap in the Queen's Gambit Declined.",
    fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4",
    analysis: "White tries to trap Black's bishop, but it can backfire if Black is prepared.",
    defense: "Black should be aware of the trap and avoid moving the light-squared bishop to b4 prematurely."
  }
]

export function OpeningTraps() {
  const [currentTrap, setCurrentTrap] = useState(0)

  const nextTrap = () => {
    setCurrentTrap((prev) => (prev + 1) % openingTraps.length)
  }

  const prevTrap = () => {
    setCurrentTrap((prev) => (prev - 1 + openingTraps.length) % openingTraps.length)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Opening Traps and Pitfalls</h2>
        <p className="text-gray-600 mb-6">
          Opening traps are tactical surprises that can catch unprepared opponents off guard. 
          While it's important to be aware of these traps, relying on them is not a sound strategy 
          for long-term improvement. Let's explore some common opening traps and how to avoid them.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          While knowing these traps can be useful, it's more important to understand the principles 
          behind them and focus on sound chess development rather than trying to set traps.
        </AlertDescription>
      </Alert>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-blue-600">
                {openingTraps[currentTrap].name}
              </h3>
              <p className="text-gray-600">
                {openingTraps[currentTrap].description}
              </p>
              <div className="text-[14px] --sm text-gray-500 italic">
                {openingTraps[currentTrap].analysis}
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">How to Defend:</h4>
                <p className="text-gray-600">{openingTraps[currentTrap].defense}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 flex items-center justify-center">
              <div className="w-full max-w-[300px]">
                <Chessboard 
                  position={openingTraps[currentTrap].fen}
                  boardWidth={300}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button onClick={prevTrap} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={nextTrap} variant="outline">
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">General Advice for Avoiding Traps</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Develop your pieces to active squares and control the center.</li>
          <li>Be cautious of early queen moves, especially to exposed squares.</li>
          <li>Castle early to ensure king safety.</li>
          <li>Pay attention to your opponent's threats and don't assume they've made a mistake.</li>
          <li>Study common patterns and tactics to recognize potential traps.</li>
        </ul>
      </div>

      <Alert variant="default" className="mt-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Remember</AlertTitle>
        <AlertDescription>
          The best defense against opening traps is a solid understanding of opening principles and 
          regular practice. Focus on developing your pieces, controlling the center, and ensuring 
          king safety rather than looking for quick wins or falling for tempting but unsound tactics.
        </AlertDescription>
      </Alert>
    </div>
  )
}
