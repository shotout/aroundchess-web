'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { CompleteButton } from './CompleteButton'

type OpeningEntry = {
  name: string;
  moves: string;
  notes: string;
}

export function RepertoireBuilder() {
  const [repertoire, setRepertoire] = useState<OpeningEntry[]>([])
  const [newOpening, setNewOpening] = useState<OpeningEntry>({ name: '', moves: '', notes: '' })

  const addOpening = () => {
    if (newOpening.name && newOpening.moves) {
      setRepertoire([...repertoire, newOpening])
      setNewOpening({ name: '', moves: '', notes: '' })
    }
  }

  const removeOpening = (index: number) => {
    const updatedRepertoire = repertoire.filter((_, i) => i !== index)
    setRepertoire(updatedRepertoire)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Opening Repertoire Builder</h2>
      <p className="text-gray-600 mb-6">
        Develop your personal opening repertoire with this interactive tool. A well-crafted repertoire helps you feel confident in the opening phase and allows you to reach familiar positions consistently.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Building Your Repertoire</AlertTitle>
        <AlertDescription>
          Focus on understanding the ideas behind each opening rather than memorizing moves. Your repertoire should evolve as you grow as a player.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Opening</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="opening-name">Opening Name</Label>
              <Input
                id="opening-name"
                value={newOpening.name}
                onChange={(e) => setNewOpening({...newOpening, name: e.target.value})}
                placeholder="e.g., Sicilian Defense"
              />
            </div>
            <div>
              <Label htmlFor="opening-moves">Moves</Label>
              <Input
                id="opening-moves"
                value={newOpening.moves}
                onChange={(e) => setNewOpening({...newOpening, moves: e.target.value})}
                placeholder="e.g., 1.e4 c5 2.Nf3"
              />
            </div>
            <div>
              <Label htmlFor="opening-notes">Notes</Label>
              <Textarea
                id="opening-notes"
                value={newOpening.notes}
                onChange={(e) => setNewOpening({...newOpening, notes: e.target.value})}
                placeholder="Add your thoughts, plans, or key ideas for this opening"
              />
            </div>
            <Button onClick={addOpening}>Add to Repertoire</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Repertoire</h3>
        {repertoire.length === 0 ? (
          <p className="text-gray-600">Your repertoire is empty. Add some openings to get started!</p>
        ) : (
          <div className="space-y-4">
            {repertoire.map((opening, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600">{opening.name}</h4>
                      <p className="text-gray-600 mt-1">{opening.moves}</p>
                    </div>
                    <Button variant="outline" onClick={() => removeOpening(index)}>Remove</Button>
                  </div>
                  {opening.notes && (
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-700">Notes:</h5>
                      <p className="text-gray-600">{opening.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Building Your Repertoire</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Start with a small, focused repertoire and expand gradually.</li>
          <li>Choose openings that suit your playing style and strengths.</li>
          <li>Include at least one opening for White and responses to common Black defenses.</li>
          <li>Study the middlegame positions that arise from your chosen openings.</li>
          <li>Regularly review and update your repertoire based on your experiences and growth as a player.</li>
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <CompleteButton sectionId="repertoire-builder" />
      </div>
    </div>
  )
}

