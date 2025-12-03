'use client'

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { BlackPlayer } from "@/components/playground/src/chess/black-player";
import { CheckMate } from "@/components/playground/src/chess/checkmate";
import ChessBoard from "@/components/playground/src/chess/chessboard";
import { ChoosePiece } from "@/components/playground/src/Components/two-player/choose-piece";
import { WhitePlayer } from "@/components/playground/src/chess/white-player";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Palette, Clock, Flag, Timer, Settings2, Undo2, Redo2, RotateCcw, ArrowLeft, Lightbulb, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChessStore } from "@/components/playground/src/store/playground/chess-store";
import Link from "next/link";
import { MoveNotation } from "@/components/playground/src/chess/move-notation"
import { CurrentPlayers } from "@/components/playground/src/chess/current-players"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useState, useEffect, useRef } from "react";
import { useThemeStore } from "@/components/playground/src/store/playground/theme-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GameResult } from "@/components/playground/src/chess/game-result";
import { HintPopup } from "@/components/playground/src/chess/hint-popup"
import { Square } from "react-chessboard/dist/chessboard/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { getStockfishService } from '@/lib/stockfish/stockfish-service'

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

const EvaluationBar = ({ evaluation }: { evaluation: number | null }) => {
  const getBarHeight = () => {
    if (evaluation === null) return '50%';
    // Clamp evaluation between -5 and 5 for display purposes
    const clampedEval = Math.max(-5, Math.min(5, evaluation));
    // Convert to percentage (50% is neutral)
    // Black advantage (negative eval) moves up (less height)
    // White advantage (positive eval) moves down (more height)
    const percentage = 50 + (clampedEval * 10);
    return `${percentage}%`;
  };

  const formatEvaluation = (eval_: number | null) => {
    if (eval_ === null) return '0.0';
    // Invert the sign for display since we're showing from black's perspective
    const displayEval = -eval_;
    return displayEval > 0 ? `+${displayEval.toFixed(1)}` : displayEval.toFixed(1);
  };

  const barHeight = getBarHeight();

  return (
    <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#404040] rounded-sm overflow-hidden">
      <div 
        className="absolute left-0 bottom-0 w-full bg-white transition-all duration-300"
        style={{ 
          height: barHeight,
        }}
      />
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-[14px] --xs font-semibold text-[#404040] bg-white/90 px-1 rounded">
          {formatEvaluation(evaluation)}
        </span>
      </div>
    </div>
  );
};

export default function TwoPlayerPage() {
  const { undoMove, redoMove, resetGame } = useChessStore((state) => state);
  const { boardTheme, setBoardTheme } = useThemeStore((state) => state);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameTime, setGameTime] = useState({ white: 600, black: 600 }); // 10 minutes each
  const [isTimerActive, setIsTimerActive] = useState(true); // Changed to true for default enabled
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const currentPlayer = useChessStore((state) => state.currentPlayer);
  const movesCount = useChessStore((state) => state.moves.length);
  const gameResult = useChessStore((state) => state.gameResult);
  const [isBoardFlipped, setIsBoardFlipped] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({ white: [], black: [] });
  const [materialAdvantage, setMaterialAdvantage] = useState(0); // positive for white advantage
  const [boardSize, setBoardSize] = useState(700); // Default size, will be updated on client
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [hintArrow, setHintArrow] = useState<[Square, Square] | null>(null);
  const [hintElo, setHintElo] = useState(1500); // Default mid-range ELO
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const engine = getStockfishService();
  const { getFen } = useChessStore((state) => state);
  const [autoHintWhite, setAutoHintWhite] = useState(false);
  const [autoHintBlack, setAutoHintBlack] = useState(false);
  const [whiteElo, setWhiteElo] = useState(1500);
  const [blackElo, setBlackElo] = useState(1500);
  const [whiteMode, setWhiteMode] = useState<'beginner' | 'advanced' | 'expert' | 'gm'>('advanced');
  const [blackMode, setBlackMode] = useState<'beginner' | 'advanced' | 'expert' | 'gm'>('advanced');
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [isTabletPortrait, setIsTabletPortrait] = useState(false);

  const themes = [
    {
      id: 'classic',
      name: 'Classic',
      colors: {
        light: '#f0d9b5',
        dark: '#b58863',
        selected: 'rgba(20, 85, 30, 0.5)'
      }
    },
    {
      id: 'forest',
      name: 'Forest',
      colors: {
        light: '#EEEED2',
        dark: '#769656',
        selected: '#BACA44'
      }
    },
    {
      id: 'ocean',
      name: 'Ocean',
      colors: {
        light: '#DEE3E6',
        dark: '#4682B4',
        selected: '#B3CFDD'
      }
    },
    {
      id: 'wooden',
      name: 'Wooden',
      colors: {
        light: '#DEB887',
        dark: '#8B4513',
        selected: '#CD853F'
      }
    },
  ];

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

      // Update tablet portrait state
      setIsTabletPortrait(width <= 1024 && isPortrait);

      // Update board size
      if (isPortrait) {
        if (width <= 430) {
          setBoardSize(Math.min(400, width - 30));
        } else if (width <= 1024) {
          setBoardSize(Math.min(600, width - 124));
        }
      } else {
        if (width <= 932) {
          setBoardSize(Math.min(400, height - 30));
        } else if (width <= 1366) {
          setBoardSize(600);
        } else {
          setBoardSize(700);
        }
      }
    };

    // Initial size calculation
    handleResize();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted]);

  // Set classic theme as default
  useEffect(() => {
    const classicTheme = themes.find(theme => theme.id === 'classic');
    if (classicTheme) {
      setBoardTheme({
        light: classicTheme.colors.light,
        dark: classicTheme.colors.dark,
        selected: classicTheme.colors.selected
      });
    }
  }, [setBoardTheme]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (hasGameStarted && isTimerActive && !gameResult) {
      interval = setInterval(() => {
        setGameTime(prev => ({
          ...prev,
          [currentPlayer]: Math.max(0, prev[currentPlayer] - 1)
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, hasGameStarted, currentPlayer, gameResult]);

  // Watch for first move
  useEffect(() => {
    if (movesCount === 1) {
      setHasGameStarted(true);
      setIsTimerActive(true);
    }
  }, [movesCount]);

  // Stop timer when game ends
  useEffect(() => {
    if (gameResult) {
      setIsTimerActive(false);
    }
  }, [gameResult]);

  // Add useEffect for client-side initialization
  useEffect(() => {
    setIsClient(true);
    const handleInitialSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;

      if (isPortrait) {
        if (width <= 430) { // Mobile portrait (430x932)
          setBoardSize(Math.min(400, width - 30));
        } else if (width <= 1024) { // Tablet portrait (1024x1366)
          setBoardSize(Math.min(600, width - 124));
        }
      } else {
        if (width <= 932) { // Mobile landscape (932x430)
          setBoardSize(Math.min(400, height - 30));
        } else if (width <= 1366) { // Tablet landscape (1366x1024)
          setBoardSize(600);
        } else {
          setBoardSize(700); // Desktop default
        }
      }
    };

    handleInitialSize();
  }, []);

  // Update resize constraints to match the same dimensions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isPortrait = screenHeight > screenWidth;
      
      let minSize = 400;
      let maxSize = 1400;

      if (isPortrait && screenWidth <= 1024) { // Only affect tablet portrait mode
        minSize = 500;
        maxSize = screenWidth - 124;
      } else {
        // Keep original constraints for all other modes
        if (screenWidth <= 430) { // Mobile portrait
          minSize = 350;
          maxSize = screenWidth - 30;
        } else if (screenWidth <= 932) { // Mobile landscape
          minSize = 350;
          maxSize = screenHeight - 30;
        } else if (screenWidth <= 1366) { // Tablet landscape
          minSize = 500;
          maxSize = 800;
        } else { // Desktop
          minSize = 400;
          maxSize = 1400;
        }
      }
      
      const boardRect = resizeRef.current?.getBoundingClientRect();
      if (!boardRect) return;
      
      const newSize = Math.min(Math.max(e.clientX - boardRect.left, minSize), maxSize);
      setBoardSize(newSize);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizing.current) return;
      
      const touch = e.touches[0];
      if (!touch) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isPortrait = screenHeight > screenWidth;
      
      let minSize = 400;
      let maxSize = 1400;

      if (isPortrait && screenWidth <= 1024) { // Only affect tablet portrait mode
        minSize = 500;
        maxSize = screenWidth - 124;
      } else {
        // Keep original constraints for all other modes
        if (screenWidth <= 430) { // Mobile portrait
          minSize = 350;
          maxSize = screenWidth - 30;
        } else if (screenWidth <= 932) { // Mobile landscape
          minSize = 350;
          maxSize = screenHeight - 30;
        } else if (screenWidth <= 1366) { // Tablet landscape
          minSize = 500;
          maxSize = 800;
        } else { // Desktop
          minSize = 400;
          maxSize = 1400;
        }
      }
      
      const boardRect = resizeRef.current?.getBoundingClientRect();
      if (!boardRect) return;
      
      const newSize = Math.min(Math.max(touch.clientX - boardRect.left, minSize), maxSize);
      setBoardSize(newSize);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    };

    const handleTouchEnd = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleReset = () => {
    // Save current theme settings
    const themeSettings = localStorage.getItem('theme-store');
    
    // Clear specific game-related items
    localStorage.removeItem("whitePlayerName");
    localStorage.removeItem("blackPlayerName");
    localStorage.removeItem("chess-store");
    
    // Restore theme settings
    if (themeSettings) {
      localStorage.setItem('theme-store', themeSettings);
    }
    
    setGameTime({ white: 600, black: 600 }); // Reset timer to 10 minutes
    setIsTimerActive(false); // Stop the timer
    setHasGameStarted(false); // Reset game start state
    window.location.reload();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResign = () => {
    const currentPlayer = useChessStore.getState().currentPlayer;
    const winner = currentPlayer === 'white' ? 'black' : 'white';
    
    // Update the store with resignation status
    useChessStore.setState(state => ({
      ...state,
      winner,
      isCheckMate: "noCheckMate",
      gameResult: {
        winner,
        reason: 'resignation',
        message: `${currentPlayer} resigned`
      }
    }));
    
    // Stop the timer
    setIsTimerActive(false);
    
    setShowResignConfirm(false);
  };

  const handleHintGenerated = (from: string, to: string) => {
    setHintArrow([from as Square, to as Square])
  }

  // Clear hint arrow when a move is made
  useEffect(() => {
    if (movesCount > 0) {
      setHintArrow(null)
    }
  }, [movesCount])

  // Clear hint arrow when dialog closes
  useEffect(() => {
    if (!showHintPopup && !hintArrow) {
      setHintArrow(null)
    }
  }, [showHintPopup, hintArrow])

  const handleEloChange = (player: 'white' | 'black', value: number[]) => {
    const newElo = value[0];
    if (player === 'white') {
      setWhiteElo(newElo);
      localStorage.setItem('whiteHintElo', String(newElo));
    } else {
      setBlackElo(newElo);
      localStorage.setItem('blackHintElo', String(newElo));
    }
  };

  // Add ELO loading effect
  useEffect(() => {
    const savedWhiteElo = localStorage.getItem('whiteHintElo');
    const savedBlackElo = localStorage.getItem('blackHintElo');
    const savedWhiteMode = localStorage.getItem('whiteHintMode');
    const savedBlackMode = localStorage.getItem('blackHintMode');

    if (savedWhiteElo) setWhiteElo(Number(savedWhiteElo));
    if (savedBlackElo) setBlackElo(Number(savedBlackElo));
    if (savedWhiteMode) setWhiteMode(savedWhiteMode as any);
    if (savedBlackMode) setBlackMode(savedBlackMode as any);
  }, []);

  const handleShowHint = async () => {
    if (isAnalyzing || !isEngineReady) return;
    setIsAnalyzing(true);
    
    try {
      await engine.waitReady();
      const currentFen = getFen();
      // Use the appropriate ELO based on current player
      const playerElo = currentPlayer === 'white' ? whiteElo : blackElo;
      
      // Calculate randomness based on ELO (300-3200 range)
      const randomness = Math.max(0, Math.min(1, (3200 - playerElo) / 2900));
      const depth = Math.max(1, Math.floor(playerElo / 200));
      
      const bestMove = await engine.getBestMove(currentFen, depth, randomness);
      
      if (bestMove && bestMove.length >= 4) {
        const from = bestMove.substring(0, 2).toLowerCase();
        const to = bestMove.substring(2, 4).toLowerCase();
        setHintArrow([from as Square, to as Square]);
      }
    } catch (error) {
      console.error('Error getting hint:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add this effect to handle automatic hints
  useEffect(() => {
    if ((currentPlayer === 'white' && autoHintWhite) || 
        (currentPlayer === 'black' && autoHintBlack)) {
      handleShowHint();
    }
  }, [currentPlayer, autoHintWhite, autoHintBlack]);

  // Load saved hint preferences
  useEffect(() => {
    const savedAutoHintWhite = localStorage.getItem('autoHintWhite');
    const savedAutoHintBlack = localStorage.getItem('autoHintBlack');
    if (savedAutoHintWhite) setAutoHintWhite(savedAutoHintWhite === 'true');
    if (savedAutoHintBlack) setAutoHintBlack(savedAutoHintBlack === 'true');
  }, []);

  // Add these handlers
  const handleAutoHintWhiteChange = (enabled: boolean) => {
    setAutoHintWhite(enabled);
    localStorage.setItem('autoHintWhite', String(enabled));
  };

  const handleAutoHintBlackChange = (enabled: boolean) => {
    setAutoHintBlack(enabled);
    localStorage.setItem('autoHintBlack', String(enabled));
  };

  const handleModeChange = (player: 'white' | 'black', mode: 'beginner' | 'advanced' | 'expert' | 'gm') => {
    const modeRanges = {
      beginner: { min: 300, max: 800 },
      advanced: { min: 800, max: 1600 },
      expert: { min: 1600, max: 2200 },
      gm: { min: 2200, max: 3200 }
    };

    const range = modeRanges[mode];
    const defaultElo = Math.floor((range.min + range.max) / 2);

    if (player === 'white') {
      setWhiteMode(mode);
      setWhiteElo(defaultElo);
      localStorage.setItem('whiteHintMode', mode);
      localStorage.setItem('whiteHintElo', String(defaultElo));
    } else {
      setBlackMode(mode);
      setBlackElo(defaultElo);
      localStorage.setItem('blackHintMode', mode);
      localStorage.setItem('blackHintElo', String(defaultElo));
    }
  };

  // Modify the evaluation effect
  useEffect(() => {
    if (!isEngineReady) return;
    
    let isSubscribed = true;
    let timeoutId: NodeJS.Timeout;

    const updateEvaluation = async () => {
      if (isAnalyzing) return; // Don't update evaluation while analyzing hint

      try {
        await engine.waitReady();
        const currentFen = getFen();
        
        // Add a small delay to prevent rapid-fire analysis
        timeoutId = setTimeout(async () => {
          if (!isSubscribed) return;
          
          const score = await engine.getEvaluation(currentFen);
          if (isSubscribed) {
            setEvaluation(score);
          }
        }, 100); // Reduced delay to 100ms for more responsive updates

      } catch (error) {
        console.error('Error getting evaluation:', error);
        if (isSubscribed) {
          setEvaluation(null);
        }
      }
    };

    updateEvaluation();

    return () => {
      isSubscribed = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [getFen, movesCount, isEngineReady, isAnalyzing]); // Added isAnalyzing to dependencies

  // Initialize engine
  useEffect(() => {
    const initEngine = async () => {
      try {
        await engine.waitReady();
        setIsEngineReady(true);
      } catch (error) {
        console.error('Error initializing Stockfish:', error);
      }
    };
    initEngine();
  }, []);

  // Protect window usage in resize handler
  const handleResize = (e: MouseEvent | TouchEvent) => {
    if (typeof window === 'undefined') return;
    
    if (!isResizing.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newSize = Math.min(
      Math.max(clientX - resizeRef.current!.getBoundingClientRect().left, 350),
      Math.min(window.innerWidth - 48, 800)
    );
    setBoardSize(newSize);
  };

  // Add null checks for browser APIs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = (e: MouseEvent) => handleResize(e);
    const handleTouchMove = (e: TouchEvent) => handleResize(e);
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleResize]);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50/50 to-purple-50/30">
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <SiteHeader />
      </div>
      
      <main className="flex-1">
        {/* Hero Section with Animated Background */}
        <div className="relative h-[20vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/images/chess-pattern.png')] opacity-10 animate-slide-diagonal" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent" />
            </div>
          </div>

          <MaxWidthWrapper className="relative h-full">
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-8"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="relative shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse" />
                  <Users className="w-16 h-16 text-white relative z-10" />
                </motion.div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                    Two Player Chess
                  </h1>
                  <p className="text-xl text-white/90">
                    Challenge your friend to an epic battle of minds
                  </p>
                </div>
              </motion.div>
            </div>
          </MaxWidthWrapper>
        </div>

        {/* Game Section */}
        <div className="min-h-[calc(100vh-25vh)] flex justify-center py-8">
          <div className="flex flex-col xl:flex-row gap-8 max-w-[1800px] mx-auto px-4">
            {/* Left Column - Game Area */}
            <div className="w-full lg:w-auto space-y-6 min-w-[350px] max-w-full xl:min-w-[600px]" 
                 style={{ width: `${boardSize}px` }}>
              {/* Black Player Card with Timer */}
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <BlackPlayer />
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-xl font-mono">
                      {formatTime(gameTime.black)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chess Board */}
              <div className="relative" ref={resizeRef}>
                <div className="absolute left-0 top-0 bottom-0 w-8" style={{ left: '-48px' }}>
                  <EvaluationBar evaluation={evaluation} />
                </div>
                <ChessBoard 
                  isFlipped={isBoardFlipped}
                  showHints={true}
                  onCapture={(piece, color) => {
                    setCapturedPieces(prev => ({
                      ...prev,
                      [color === 'white' ? 'black' : 'white']: [...prev[color === 'white' ? 'black' : 'white'], piece]
                    }));
                    const value = getPieceValue(piece);
                    setMaterialAdvantage(prev => color === 'white' ? prev + value : prev - value);
                  }}
                  customArrows={hintArrow ? [
                    [hintArrow[0], hintArrow[1], "rgba(74, 222, 128, 1)"]
                  ] : []}
                />
                {/* Resize Handle */}
                <div
                  className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-32 flex items-center justify-center cursor-ew-resize touch-none group bg-white/50 hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 hover:border-gray-300"
                  onMouseDown={() => {
                    isResizing.current = true;
                    document.body.style.cursor = 'ew-resize';
                  }}
                  onTouchStart={() => {
                    isResizing.current = true;
                    document.body.style.cursor = 'ew-resize';
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1 h-12 bg-gray-400 rounded-full group-hover:bg-gray-600 transition-colors" />
                    <div className="flex items-center gap-0.5 text-gray-400 group-hover:text-gray-600 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                  </div>
                </div>
              </div>

              {/* White Player Card with Timer */}
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <WhitePlayer />
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-xl font-mono">
                      {formatTime(gameTime.white)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Game Controls */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="grid grid-cols-5 gap-4 p-4">
                  <Link
                    href="/playground"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                  </Link>
                  
                  <button
                    onClick={() => undoMove()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Undo2 className="w-5 h-5" />
                    <span>Undo</span>
                  </button>

                  <button
                    onClick={() => redoMove()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Redo2 className="w-5 h-5" />
                    <span>Redo</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={() => setIsBoardFlipped(!isBoardFlipped)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <RotateCw className="w-5 h-5" />
                    <span>Flip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Game Information */}
            <div className="w-full lg:w-[400px] flex-shrink-0 space-y-4">
              {/* Game Information Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Game Information</h3>
                </div>
                
                <div className="p-4">
                  <CurrentPlayers />
                </div>

                {/* Material Advantage */}
                <div className="p-4 border-t border-gray-200">
                  <h4 className="text-[14px] --sm font-medium text-gray-700 mb-2">Material Advantage</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border border-gray-200 rounded-full" />
                      <span className="text-[14px] --sm text-gray-600">White</span>
                    </div>
                    <div className="font-mono text-[14px] --sm">
                      {materialAdvantage > 0 ? `+${materialAdvantage}` : materialAdvantage}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-800 rounded-full" />
                      <span className="text-[14px] --sm text-gray-600">Black</span>
                    </div>
                    <div className="font-mono text-[14px] --sm">
                      {materialAdvantage < 0 ? `+${Math.abs(materialAdvantage)}` : -materialAdvantage}
                    </div>
                  </div>
                </div>

                {/* Captured Pieces */}
                <div className="p-4 border-t border-gray-200">
                  <h4 className="text-[14px] --sm font-medium text-gray-700 mb-2">Captured Pieces</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[14px] --sm text-gray-600 block mb-1">White captured:</span>
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const groupedPieces = capturedPieces.white.reduce((acc, piece) => {
                            acc[piece] = (acc[piece] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);

                          return Object.entries(groupedPieces).map(([piece, count], i) => (
                            <div key={i} className="relative group">
                              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:scale-105 transition-transform">
                                <Image
                                  src={`/pieces/black/${piece.toLowerCase()}.png`}
                                  alt={piece}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6"
                                  priority
                                  unoptimized
                                />
                                {count > 1 && (
                                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-[10px] font-semibold rounded-full bg-indigo-500 text-white shadow-sm">
                                    {count}
                                  </span>
                                )}
                              </div>
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-gray-800/90 text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {getPieceValue(piece)} pts
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                    <div>
                      <span className="text-[14px] --sm text-gray-600 block mb-1">Black captured:</span>
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const groupedPieces = capturedPieces.black.reduce((acc, piece) => {
                            acc[piece] = (acc[piece] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);

                          return Object.entries(groupedPieces).map(([piece, count], i) => (
                            <div key={i} className="relative group">
                              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:scale-105 transition-transform">
                                <Image
                                  src={`/pieces/white/${piece.toLowerCase()}.png`}
                                  alt={piece}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6"
                                  priority
                                  unoptimized
                                />
                                {count > 1 && (
                                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-[10px] font-semibold rounded-full bg-indigo-500 text-white shadow-sm">
                                    {count}
                                  </span>
                                )}
                              </div>
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-gray-800/90 text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {getPieceValue(piece)} pts
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <h4 className="text-[14px] --sm font-medium text-gray-700 mb-3">Move History</h4>
                  <MoveNotation />
                </div>
              </div>

              {/* Game Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShowHint}
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
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <Flag className="w-5 h-5" />
                  <span>Offer Draw</span>
                </button>

                <button 
                  onClick={() => setShowResignConfirm(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <Flag className="w-5 h-5" />
                  <span>Resign</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Menu Dialog */}
        <Dialog open={showGameMenu} onOpenChange={setShowGameMenu}>
          <DialogContent className="sm:max-w-[900px] p-0 gap-0">
            <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Game Settings
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Customize your game experience and preferences
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="board" className="flex flex-col h-full">
              <div className="border-b border-gray-100">
                <div className="px-6">
                  <TabsList className="h-12 p-0 bg-transparent gap-6">
                    <TabsTrigger value="board" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none relative h-12 px-4">
                      <span className={cn(
                        "text-[14px] --sm font-medium transition-colors",
                        "data-[state=active]:text-indigo-600 data-[state=active]:before:absolute",
                        "data-[state=active]:before:bottom-0 data-[state=active]:before:left-0",
                        "data-[state=active]:before:h-0.5 data-[state=active]:before:w-full",
                        "data-[state=active]:before:bg-indigo-600"
                      )}>
                        Board Theme
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="time" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none relative h-12 px-4">
                      <span className={cn(
                        "text-[14px] --sm font-medium transition-colors",
                        "data-[state=active]:text-indigo-600 data-[state=active]:before:absolute",
                        "data-[state=active]:before:bottom-0 data-[state=active]:before:left-0",
                        "data-[state=active]:before:h-0.5 data-[state=active]:before:w-full",
                        "data-[state=active]:before:bg-indigo-600"
                      )}>
                        Time Control
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="hint" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none relative h-12 px-4">
                      <span className={cn(
                        "text-[14px] --sm font-medium transition-colors",
                        "data-[state=active]:text-indigo-600 data-[state=active]:before:absolute",
                        "data-[state=active]:before:bottom-0 data-[state=active]:before:left-0",
                        "data-[state=active]:before:h-0.5 data-[state=active]:before:w-full",
                        "data-[state=active]:before:bg-indigo-600"
                      )}>
                        AI Hint
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="board" className="flex-1 px-6 py-4">
                <div className="space-y-3">
                  <label className="text-[14px] --sm font-medium text-gray-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-500" />
                    Board Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setBoardTheme({
                            light: theme.colors.light,
                            dark: theme.colors.dark,
                            selected: theme.colors.selected
                          });
                        }}
                        className={cn(
                          "p-2 rounded-xl flex flex-col items-center gap-2 border-2 transition-all duration-200",
                          boardTheme.light === theme.colors.light
                            ? "border-indigo-500 bg-indigo-50/50 shadow-sm" 
                            : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                        )}
                      >
                        {/* Theme preview grid */}
                        <div className="w-[120px] aspect-square rounded-lg overflow-hidden grid grid-cols-4 shadow-sm">
                          {[...Array(16)].map((_, i) => (
                            <div
                              key={i}
                              style={{
                                backgroundColor: (Math.floor(i / 4) + i % 4) % 2 === 0
                                  ? theme.colors.light
                                  : theme.colors.dark
                              }}
                              className="w-full h-full"
                            />
                          ))}
                        </div>
                        <span className="text-[14px] --sm font-medium text-gray-700">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="time" className="flex-1 px-6 py-4">
                <div className="space-y-6">
                  {/* Time Control Section */}
                  <div className="space-y-3">
                    <label className="text-[14px] --sm font-medium text-gray-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      Time Control
                    </label>
                    <select 
                      className="w-full rounded-lg border border-gray-200 p-3 text-[14px] --sm bg-white hover:border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      value={gameTime.white}
                      onChange={(e) => {
                        const time = parseInt(e.target.value);
                        setGameTime({ white: time, black: time });
                      }}
                    >
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                      <option value="900">15 minutes</option>
                      <option value="1800">30 minutes</option>
                    </select>
                  </div>

                  {/* Timer Toggle Section */}
                  <div className="space-y-3">
                    <label className="text-[14px] --sm font-medium text-gray-900 flex items-center gap-2">
                      <Timer className="w-4 h-4 text-indigo-500" />
                      Timer Settings
                    </label>
                    <div className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[14px] --sm text-gray-900">Enable Timer</span>
                          <p className="text-[14px] --sm text-gray-500">When enabled, each player has limited time to make their moves</p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setIsTimerActive(!isTimerActive)}
                            className={cn(
                              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                              isTimerActive ? "bg-blue-600" : "bg-gray-200"
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm border border-gray-200",
                                isTimerActive ? "translate-x-6" : "translate-x-0.5"
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hint" className="flex-1 px-6 py-4">
                <div className="space-y-6">
                  {/* White Player Hint Settings */}
                  <div className="space-y-3">
                    <label className="text-[14px] --sm font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-white border border-gray-300 rounded-full" />
                      White Player Hint Settings
                    </label>
                    <div className="space-y-4 p-4 rounded-lg border border-gray-200">
                      {/* Mode Selection */}
                      <div className="grid grid-cols-4 gap-2">
                        {['beginner', 'advanced', 'expert', 'gm'].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => handleModeChange('white', mode as any)}
                            className={cn(
                              "px-3 py-2 rounded-lg text-[14px] --sm font-medium transition-all",
                              whiteMode === mode
                                ? "bg-blue-100 text-blue-700 shadow-sm"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </button>
                        ))}
                      </div>
                      
                      {/* ELO Slider */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] --sm text-gray-600">ELO Rating</span>
                          <span className="text-[14px] --sm font-medium text-blue-600">{whiteElo}</span>
                        </div>
                        <Slider
                          value={[whiteElo]}
                          onValueChange={(value) => handleEloChange('white', value)}
                          min={300}
                          max={3200}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-[14px] --xs text-gray-500">
                          <span>300</span>
                          <span>3200</span>
                        </div>
                      </div>

                      {/* Auto Hint Toggle */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                          <span className="text-[14px] --sm text-gray-900">Auto Hint</span>
                          <p className="text-[14px] --xs text-gray-500">Automatically show hints during White's turns</p>
                        </div>
                        <button
                          onClick={() => handleAutoHintWhiteChange(!autoHintWhite)}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                            autoHintWhite ? "bg-blue-600" : "bg-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm border border-gray-200",
                              autoHintWhite ? "translate-x-6" : "translate-x-0.5"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Black Player Hint Settings */}
                  <div className="space-y-3">
                    <label className="text-[14px] --sm font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-900 rounded-full" />
                      Black Player Hint Settings
                    </label>
                    <div className="space-y-4 p-4 rounded-lg border border-gray-200">
                      {/* Mode Selection */}
                      <div className="grid grid-cols-4 gap-2">
                        {['beginner', 'advanced', 'expert', 'gm'].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => handleModeChange('black', mode as any)}
                            className={cn(
                              "px-3 py-2 rounded-lg text-[14px] --sm font-medium transition-all",
                              blackMode === mode
                                ? "bg-blue-100 text-blue-700 shadow-sm"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </button>
                        ))}
                      </div>
                      
                      {/* ELO Slider */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] --sm text-gray-600">ELO Rating</span>
                          <span className="text-[14px] --sm font-medium text-blue-600">{blackElo}</span>
                        </div>
                        <Slider
                          value={[blackElo]}
                          onValueChange={(value) => handleEloChange('black', value)}
                          min={300}
                          max={3200}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-[14px] --xs text-gray-500">
                          <span>300</span>
                          <span>3200</span>
                        </div>
                      </div>

                      {/* Auto Hint Toggle */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                          <span className="text-[14px] --sm text-gray-900">Auto Hint</span>
                          <p className="text-[14px] --xs text-gray-500">Automatically show hints during Black's turns</p>
                        </div>
                        <button
                          onClick={() => handleAutoHintBlackChange(!autoHintBlack)}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                            autoHintBlack ? "bg-blue-600" : "bg-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm border border-gray-200",
                              autoHintBlack ? "translate-x-6" : "translate-x-0.5"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowGameMenu(false)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-sm"
              >
                Done
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Resign Confirmation Dialog */}
        <Dialog open={showResignConfirm} onOpenChange={setShowResignConfirm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Resign Game</DialogTitle>
              <DialogDescription>
                Are you sure you want to resign? This will count as a loss.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowResignConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResign}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Resign
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modals */}
        <ChoosePiece />
        <CheckMate />
        <GameResult />
      </main>

      <div className="bg-white border-t border-gray-200">
        <SiteFooter />
      </div>

      {/* Dialogs */}
      <HintPopup
        isOpen={showHintPopup}
        onClose={() => {
          setShowHintPopup(false)
          setHintArrow(null)
        }}
        onHintGenerated={handleHintGenerated}
      />
    </div>
  );
}