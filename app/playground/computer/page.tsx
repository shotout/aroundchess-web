'use client'

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ComputerHeader } from "@/components/playground/src/chess/computer-header";
import { ComputerCheckMate } from "@/components/playground/src/chess/computer-checkmate";
import ComputerChessBoard from "@/components/playground/src/chess/computer-chessboard";
import { ChoosePiece } from "@/components/playground/src/chess/choose-piece";
import { ComputerControls } from "@/components/playground/src/chess/computer-controls";
import { WhitePlayer } from "@/components/playground/src/chess/white-player";
import { ELOSelector } from "@/components/playground/src/chess/elo-selector";
import { ComputerPlayerName } from "@/components/playground/src/chess/computer-player-name";
import { motion } from "framer-motion";
import { Cpu, History, Settings, Trophy, Lightbulb, Settings2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useComputerChessStore, mapELOToStockfishSettings } from "@/components/playground/src/store/computerChessStore";
import { useLayoutEffect, useEffect, useState } from "react";
import { ComputerWhitePlayer } from "@/components/playground/src/chess/computer-white-player";
import { ComputerMoveNotation } from "@/components/playground/src/chess/computer-move-notation";
import { CurrentPlayers } from "@/components/playground/src/chess/current-players";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComputerEliminatedPieces } from "@/components/playground/src/chess/computer-eliminated-pieces";
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ColorSelectionDialog } from "@/components/playground/src/chess/color-selection-dialog";
import { ComputerHintPopup } from "@/components/playground/src/chess/computer-hint-popup"
import { ComputerGameMenu } from "@/components/playground/src/chess/computer-game-menu"
import { ComputerResignDialog } from "@/components/playground/src/chess/computer-resign-dialog"
import type { Square } from 'react-chessboard/dist/chessboard/types'
import { ChessTheme } from "@/components/playground/src/Components/themes/chess-theme";
import Image from "next/image";
import { useThemeStore } from "@/components/playground/src/store/playground/theme-store";
import { PawnPromotionDialog } from "@/components/playground/src/chess/pawn-promotion-dialog";

interface CapturedPieces {
  white: string[];
  black: string[];
}

const getPieceValue = (piece: string) => {
  const values: { [key: string]: number } = {
    'p': 1,  // pawn
    'n': 3,  // knight
    'b': 3,  // bishop
    'r': 5,  // rook
    'q': 9,  // queen
    'k': 0   // king
  };
  return values[piece.toLowerCase()] || 0;
};

export default function ComputerGamePage() {
  const { pieceTheme } = useThemeStore((state) => state);
  const isColorSelectionOpen = useComputerChessStore((state) => state.isColorSelectionOpen);
  const eliminatedPieces = useComputerChessStore((state) => state.eliminatedPieces);
  const gameResults = useComputerChessStore((state) => state.gameResults);
  const moveHistory = useComputerChessStore((state) => state.moveHistory);
  const currentPlayer = useComputerChessStore((state) => state.currentPlayer);

  // Initialize state once on mount using useLayoutEffect
  useLayoutEffect(() => {
    const currentState = useComputerChessStore.getState();
    if (!currentState.initialized) {
      useComputerChessStore.setState({
        ...currentState,
        initialized: true,
        eliminatedPieces: { white: [], black: [] },
        isColorSelectionOpen: true, // Show on first visit
      });
    } else {
      // Check if a game is in progress by looking at the board state
      const isGameStarted = currentState.moves.length > 0;
      useComputerChessStore.setState({
        ...currentState,
        isColorSelectionOpen: !isGameStarted, // Only show if no game in progress
      });
    }
  }, []);

  // Add board size state
  const [boardSize, setBoardSize] = useState(700); // Default size
  const [mounted, setMounted] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({ white: [], black: [] });
  const [materialAdvantage, setMaterialAdvantage] = useState(0); // positive for white advantage

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle all window-dependent effects
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;
      const minPadding = 16;
      const maxSize = 700;

      if (isPortrait) {
        // In portrait mode, use screen width as the primary constraint
        const availableWidth = width - (minPadding * 2);
        // Use 85% of available width for mobile, 90% for tablets
        const sizeFactor = width <= 430 ? 0.85 : 0.9;
        setBoardSize(Math.min(maxSize, availableWidth * sizeFactor));
      } else {
        // In landscape, use height as the primary constraint
        const availableHeight = height - (minPadding * 2);
        // Use 80% of available height
        setBoardSize(Math.min(maxSize, availableHeight * 0.8));
      }
    };

    // Initial size calculation
    handleResize();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted]);

  // Add new state for dialogs
  const [showHintPopup, setShowHintPopup] = useState(false)
  const [showGameMenu, setShowGameMenu] = useState(false)
  const [showResignConfirm, setShowResignConfirm] = useState(false)
  const [hintArrow, setHintArrow] = useState<[Square, Square] | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Add handler for hint generation
  const handleHintGenerated = (from: string, to: string) => {
    setHintArrow([from as Square, to as Square])
  }

  // Clear hint arrow when a move is made
  useEffect(() => {
    setHintArrow(null)
  }, [moveHistory])

  // Clear hint arrow when dialog closes
  useEffect(() => {
    if (!showHintPopup && !hintArrow) {
      setHintArrow(null)
    }
  }, [showHintPopup, hintArrow])

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <SiteHeader />
      <PawnPromotionDialog />
      {/* Enhanced Background Pattern */}
      <div 
        className="absolute inset-0 w-full h-full opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgb(99 102 241 / 0.15) 2px, transparent 0),
            radial-gradient(circle at center, rgb(99 102 241 / 0.1) 1px, transparent 0)
          `,
          backgroundSize: '40px 40px, 20px 20px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />
      
      {/* Enhanced Animated Gradient Orbs */}
      <div className="absolute top-0 -left-1/4 w-[1000px] h-[1000px] bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow delay-300" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-purple-200/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow delay-500" />
      
      <div className="relative">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent)] animate-pulse-slow" />
          <div className="absolute inset-0" style={{ backgroundImage: 'url("/chess-pattern.png")', opacity: 0.1 }} />
          
          <MaxWidthWrapper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-md animate-pulse" />
                  <Cpu className="w-14 h-14 text-white relative" />
                </motion.div>
                <h1 className={cn(
                  "text-5xl md:text-6xl font-bold",
                  "bg-clip-text text-transparent",
                  "bg-gradient-to-r from-blue-100 via-white to-indigo-100",
                  "drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                )}>
                  Play vs Computer
                </h1>
              </div>
              <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
                Challenge Stockfish, one of the world's strongest chess engines
              </p>
            </motion.div>
          </MaxWidthWrapper>
        </div>

        {/* Game Section */}
        <div className="relative min-h-[calc(100vh-25vh)] py-8 sm:py-12">
          <MaxWidthWrapper>
            <div className="container mx-auto px-4">
              <div className="flex flex-col xl:flex-row gap-8 items-start">
                {/* Main Game Area - Left Side */}
                <div className="w-full lg:w-auto xl:flex-1">
                  {/* Chess Board Container with improved styling */}
                  <div className="relative bg-white/90 rounded-2xl p-6 backdrop-blur-sm shadow-xl border border-blue-100/50">
                    {/* Computer Player Label */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <ComputerHeader />
                        <ComputerEliminatedPieces color="black" pieces={eliminatedPieces.black} />
                      </div>
                    </div>

                    {/* Chess Board */}
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl shadow-lg" />
                      <div className="relative w-full h-full" style={{ aspectRatio: '1 / 1' }}>
                        <ComputerChessBoard 
                          onCapture={(piece, color) => {
                            setCapturedPieces(prev => ({
                              ...prev,
                              [color]: [...prev[color], piece]
                            }));
                            const value = getPieceValue(piece);
                            setMaterialAdvantage(prev => color === 'white' ? prev - value : prev + value);
                          }}
                        />
                      </div>
                    </div>

                    {/* Player Name and Eliminated Pieces */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <ComputerPlayerName />
                        <ComputerEliminatedPieces color="white" pieces={eliminatedPieces.white} />
                      </div>
                    </div>
                  </div>

                  {/* Controls - Separate card */}
                  <div className="mt-6 bg-white/90 rounded-xl p-4 backdrop-blur-sm shadow-lg border border-blue-100/50">
                    <ComputerControls />
                  </div>
                </div>

                {/* Side Panel - Right Side */}
                <div className="w-full lg:w-[400px] flex-shrink-0 space-y-4">
                  {/* Game Information Box */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Tabs defaultValue="history" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 gap-1">
                        <TabsTrigger value="history" className="flex items-center gap-2">
                          <History className="w-4 h-4" />
                          History
                        </TabsTrigger>
                        <TabsTrigger value="results" className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          Results
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="history" className="mt-2 sm:mt-4">
                        <div className="bg-white/90 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-lg border border-blue-100/50 space-y-6">
                          {/* Game Information */}
                          <div className="space-y-4">
                            {/* Current Turn */}
                            <div className="bg-gray-50/50 p-3 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Current Turn</span>
                                <span className="text-sm font-medium text-blue-600">
                                  {currentPlayer === 'white' ? 'White' : 'Black'}
                                </span>
                              </div>
                            </div>

                            {/* Material Advantage */}
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 mb-3">Material Advantage</h3>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-white border border-gray-300" />
                                    <span className="text-sm text-gray-600">White</span>
                                  </div>
                                  <span className="text-sm font-medium">{eliminatedPieces.black.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-900" />
                                    <span className="text-sm text-gray-600">Black</span>
                                  </div>
                                  <span className="text-sm font-medium">{eliminatedPieces.white.length || 0}</span>
                                </div>
                              </div>
                            </div>

                            {/* Move History */}
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 mb-3">Move History</h3>
                              <div className="bg-gray-50/50 p-3 rounded-lg">
                                <ComputerMoveNotation />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="results" className="mt-2 sm:mt-4">
                        <div className="bg-white/90 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-lg border border-blue-100/50">
                          <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-semibold text-gray-800">Game Results</h3>
                          </div>
                          <ScrollArea className="h-[250px] sm:h-[300px] pr-4">
                            <div className="space-y-4">
                              {gameResults.length === 0 ? (
                                <div className="text-gray-500 text-center py-4">
                                  No games played yet
                                </div>
                              ) : (
                                gameResults.map((result, index) => (
                                  <div 
                                    key={index}
                                    className="p-4 bg-white/50 rounded-lg border border-indigo-100/50"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">
                                        {result.winner === 'white' ? 'You' : 'Computer'} won
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {new Date(result.date).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {result.moveCount} moves • {result.duration} minutes
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </motion.div>

                  {/* Game Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowHintPopup(true)}
                      disabled={isAnalyzing}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:bg-amber-400"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-5 h-5" />
                          <span>Hint</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowGameMenu(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:from-indigo-600 hover:to-purple-600"
                    >
                      <Settings2 className="w-5 h-5" />
                      <span>Menu</span>
                    </button>

                    <button 
                      onClick={() => setShowResignConfirm(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors col-span-2"
                    >
                      <Flag className="w-5 h-5" />
                      <span>Resign</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>

        {/* Modals and Overlays */}
        <ChoosePiece />
        <ComputerCheckMate />
        <ColorSelectionDialog />

        {/* Add dialogs */}
        <ComputerHintPopup
          isOpen={showHintPopup}
          onClose={() => {
            setShowHintPopup(false)
            setHintArrow(null)
          }}
          onHintGenerated={handleHintGenerated}
        />

        <ComputerGameMenu
          isOpen={showGameMenu}
          onClose={() => setShowGameMenu(false)}
        />

        <ComputerResignDialog
          isOpen={showResignConfirm}
          onClose={() => setShowResignConfirm(false)}
        />
      </div>

      <SiteFooter />
    </div>
  );
}