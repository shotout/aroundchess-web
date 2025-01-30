'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import dynamic from 'next/dynamic'

const Chessboard = dynamic(() => import('react-chessboard').then((mod) => mod.Chessboard), {
  ssr: false,
  loading: () => <div>Loading Chessboard...</div>,
})

const popularOpenings = [
  {
    name: "Ruy Lopez",
    description: "One of the oldest and most popular openings, the Ruy Lopez aims to control the center and put pressure on Black's e5 pawn.",
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    key_ideas: [
      "Control the center with e4 and prepare d4",
      "Develop pieces quickly",
      "Put pressure on Black's e5 pawn"
    ]
  },
  {
    name: "Sicilian Defense",
    description: "A sharp, asymmetrical defense against 1.e4 that leads to complex positions with many tactical opportunities.",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
    key_ideas: [
      "Counter White's e4 with c5, fighting for the d4 square",
      "Prepare for an unbalanced game with chances for both sides",
      "Often leads to a delayed center battle"
    ]
  },
  {
    name: "Queen's Gambit",
    description: "A popular opening for White that offers a pawn to gain control of the center and rapid development.",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    key_ideas: [
      "Offer the c4 pawn to gain central control",
      "Rapid development of pieces",
      "Prepare for a strong pawn center with e4"
    ]
  },
  {
    name: "King's Indian Defense",
    description: "A hypermodern defense that allows White to establish a broad center, with plans to counterattack it later.",
    fen: "rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4",
    key_ideas: [
      "Allow White to establish a pawn center",
      "Develop the king's bishop via fianchetto",
      "Prepare for a kingside attack or central break"
    ]
  },
  {
    name: "French Defense",
    description: "A solid defense against 1.e4 that leads to closed positions with a locked center pawn chain.",
    fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    key_ideas: [
      "Counter e4 with e6, preparing to challenge the center with d5",
      "Often leads to a closed center and maneuvering play",
      "Black often plays for breaks with ...c5 or ...f6"
    ]
  }
]

export function PopularOpenings() {
  const [currentOpening, setCurrentOpening] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  console.log('Rendering PopularOpenings component');
  console.log('popularOpenings:', popularOpenings);
  console.log('currentOpening:', currentOpening);

  const nextOpening = () => {
    console.log('Next opening clicked');
    setCurrentOpening((prev) => (prev + 1) % popularOpenings.length)
  }

  const prevOpening = () => {
    console.log('Previous opening clicked');
    setCurrentOpening((prev) => (prev - 1 + popularOpenings.length) % popularOpenings.length)
  }

  console.log('Current opening:', popularOpenings[currentOpening]);
  console.log('FEN:', popularOpenings[currentOpening].fen);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Opening Families</h2>
        <p className="text-gray-600 mb-6">
          Explore some of the most popular chess openings. Understanding these common opening families 
          will give you a solid foundation for your chess games and help you recognize typical patterns 
          and ideas.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-blue-600">
                {popularOpenings[currentOpening].name}
              </h3>
              <p className="text-gray-600">
                {popularOpenings[currentOpening].description}
              </p>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Key Ideas:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {popularOpenings[currentOpening].key_ideas.map((idea, index) => (
                    <li key={index} className="text-sm text-gray-600">{idea}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-gray-100 p-4 flex items-center justify-center">
              <div className="w-full max-w-[300px]">
                {isClient ? (
                  <Chessboard 
                    position={popularOpenings[currentOpening].fen}
                    boardWidth={300}
                  />
                ) : (
                  <div>Loading Chessboard...</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button onClick={prevOpening} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={nextOpening} variant="outline">
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Studying Opening Families</h3>
        <p className="text-gray-600 mb-4">
          When studying these opening families, focus on understanding the main ideas and plans rather 
          than memorizing specific move orders. Key aspects to consider include:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Pawn structures and how they influence the middlegame</li>
          <li>Typical piece placements and their roles</li>
          <li>Common tactical motifs that arise from the opening</li>
          <li>Potential transpositions into other openings</li>
          <li>Historical context and famous games featuring the opening</li>
        </ul>
      </div>
    </div>
  )
}

