"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useComputerChessStore } from '../store/computerChessStore'
import { useThemeStore } from '../store/playground/theme-store'
import { Palette, Settings2, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { defaultBoardTheme, greenWhiteBoardTheme, blueWhiteBoardTheme, woodBoardTheme } from '../utils/boardThemes/board-themes'
import { ComputerCharacterSelector } from "./computer-character-selector";

interface ComputerGameMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function ComputerGameMenu({ isOpen, onClose }: ComputerGameMenuProps) {
  const { boardTheme, setBoardTheme, pieceTheme, setPieceTheme } = useThemeStore((state) => state)
  const { targetELO, updateTargetELO, toggleTournamentMode, tournamentMode } = useComputerChessStore((state) => state)

  const themes = [
    { 
      id: 'default',
      name: 'Default',
      theme: defaultBoardTheme
    },
    {
      id: 'green-white',
      name: 'Green & White',
      theme: greenWhiteBoardTheme
    },
    {
      id: 'blue-white',
      name: 'Blue & White',
      theme: blueWhiteBoardTheme
    },
    {
      id: 'wood',
      name: 'Wooden',
      theme: woodBoardTheme
    },
  ]

  const pieceThemes = [
    {
      id: 'default',
      name: 'Default'
    },
    {
      id: 'classic',
      name: 'Classic'
    },
    {
      id: 'crownforge',
      name: 'Crownforge'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Game Settings
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Customize your game experience and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="board" className="flex flex-col min-h-[400px]">
          <div className="border-b border-gray-100">
            <div className="px-6">
              <TabsList className="h-12 p-0 bg-transparent border-b border-gray-100">
                <TabsTrigger value="board" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none relative h-12 px-4">
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    "data-[state=active]:text-indigo-600 data-[state=active]:before:absolute",
                    "data-[state=active]:before:bottom-0 data-[state=active]:before:left-0",
                    "data-[state=active]:before:h-0.5 data-[state=active]:before:w-full",
                    "data-[state=active]:before:bg-indigo-600"
                  )}>
                    Themes
                  </span>
                </TabsTrigger>
                <TabsTrigger value="engine" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none relative h-12 px-4">
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    "data-[state=active]:text-indigo-600 data-[state=active]:before:absolute",
                    "data-[state=active]:before:bottom-0 data-[state=active]:before:left-0",
                    "data-[state=active]:before:h-0.5 data-[state=active]:before:w-full",
                    "data-[state=active]:before:bg-indigo-600"
                  )}>
                    Engine Settings
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="board" className="flex-1 px-6 py-4">
            <div className="space-y-6">
              {/* Board Themes */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-500" />
                  Board Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setBoardTheme(theme.theme)}
                      className={cn(
                        "p-2 rounded-xl flex flex-col items-center gap-2 border-2 transition-all duration-200",
                        boardTheme.light === theme.theme.light
                          ? "border-indigo-500 bg-indigo-50/50 shadow-sm" 
                          : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                      )}
                    >
                      <div className="w-[120px] aspect-square rounded-lg overflow-hidden grid grid-cols-4 shadow-sm">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-full h-full",
                              (Math.floor(i / 4) + i % 4) % 2 === 0
                                ? theme.theme.light
                                : theme.theme.dark
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Piece Themes */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-indigo-500" />
                  Piece Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {pieceThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setPieceTheme(theme.id as any)}
                      className={cn(
                        "p-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all duration-200",
                        pieceTheme === theme.id
                          ? "border-indigo-500 bg-indigo-50/50 shadow-sm" 
                          : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                      )}
                    >
                      <div className="relative w-12 h-12">
                        <img
                          src={`/${theme.id}/white/K.png`}
                          alt={`${theme.name} King`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="engine" className="flex-1 px-6 py-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-indigo-500" />
                  Choose Your Opponent
                </label>
                <div className="rounded-lg border border-gray-200">
                  <ComputerCharacterSelector />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-sm"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 