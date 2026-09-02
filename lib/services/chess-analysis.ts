import { Chess, Square } from 'chess.js'

interface ChessComGame {
  url: string
  pgn: string
  time_control: string
  end_time: number
  rated: boolean
  accuracy?: {
    white: number
    black: number
  }
}

interface MoveAnalysis {
  move: string
  position: string
  evaluation: number
  bestMove: string
  moveClassification: 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'miss' | 'blunder' | 'normal'
  improvement: string
  lessonType: 'tactical' | 'positional' | 'opening' | 'endgame'
  explanation: string
}

interface ThreatAnalysis {
  position: string
  moveNumber: number
  threats: {
    type: 'mate' | 'fork' | 'pin' | 'discovery' | 'skewer' | 'hanging' | 'trapped'
    description: string
    severity: 'critical' | 'serious' | 'moderate'
    piece: string
    square: string
  }[]
}

interface GameAnalysis {
  moves: MoveAnalysis[]
  summary: {
    accuracy: number
    brilliantMoves: number
    greatMoves: number
    bestMoves: number
    excellentMoves: number
    goodMoves: number
    inaccuracies: number
    mistakes: number
    misses: number
    blunders: number
    criticalMistakes: MoveAnalysis[]
    recommendedLessons: {
      type: string
      topic: string
      priority: number
      reason: string
    }[]
  }
  threats: ThreatAnalysis[]
}

export class ChessAnalysisService {
  private stockfish: Worker | null = null
  private isEngineReady = false
  private messageQueue: {
    resolve: (value: any) => void
    message: string
    result?: { evaluation: number, bestMove: string }
  }[] = []
  private isUsingNNUE = false

  constructor() {
    try {
      if (this.stockfish) {
        return
      }
      
      // Try NNUE first
      try {
        const nnueWorkerUrl = '/stockfish/stockfish.js'  // Use standard Stockfish for now
        this.stockfish = new Worker(nnueWorkerUrl)
        this.isUsingNNUE = false  // Set to false since we're using standard Stockfish
      } catch (nnueError) {
        console.warn('Failed to initialize Stockfish, trying fallback:', nnueError)
        // Fallback to standard Stockfish
        const standardWorkerUrl = '/stockfish/stockfish.js'
        this.stockfish = new Worker(standardWorkerUrl)
        this.isUsingNNUE = false
      }
      
      if (!this.stockfish) {
        throw new Error('Failed to initialize any Stockfish engine')
      }
      
      this.stockfish.onerror = (error) => {
        console.error(`Stockfish worker error:`, error)
        this.isEngineReady = false
        this.stockfish = null
      }
      
      this.initializeEngine()
    } catch (error) {
      console.error('Failed to initialize Stockfish:', error)
      this.stockfish = null
    }
  }

  private initializeEngine() {
    if (!this.stockfish) {
      console.error('Cannot initialize engine: Stockfish worker is null')
      return
    }
    
    let initializationTimeout: NodeJS.Timeout | null = null
    
    this.stockfish.onmessage = (e) => {
      const msg = e.data?.toString() || ''
      
      if (msg === 'uciok' || msg.includes('readyok')) {
        if (initializationTimeout) {
          clearTimeout(initializationTimeout)
          initializationTimeout = null
        }
        this.isEngineReady = true
        this.processNextCommand()
        return
      }
      
      const currentMessage = this.messageQueue[0]
      if (!currentMessage) return
      
      if (msg.includes('info depth') && msg.includes('score cp')) {
        const scoreMatch = msg.match(/score cp (-?\d+)/)
        if (scoreMatch) {
          const score = parseInt(scoreMatch[1])
          currentMessage.result = {
            evaluation: score / 100,
            bestMove: currentMessage.result?.bestMove || 'none'
          }
        }
      }

      if (msg.includes('bestmove') && this.stockfish) {
        const bestMove = msg.split(' ')[1] || 'none'
        const result = {
          evaluation: currentMessage.result?.evaluation || 0,
          bestMove
        }
        currentMessage.resolve(result)
        this.messageQueue.shift()
        this.processNextCommand()
      }
    }

    // Set a longer timeout for initialization
    initializationTimeout = setTimeout(() => {
      console.error('Engine initialization is taking too long, restarting...')
      if (this.stockfish) {
        this.stockfish.terminate()
        this.stockfish = new Worker('/stockfish/stockfish.js')
        this.initializeEngine()
      }
    }, 30000) // 30 second timeout

    // Initialize UCI mode with basic settings
    this.stockfish.postMessage('uci')
    this.stockfish.postMessage('setoption name MultiPV value 1')
    this.stockfish.postMessage('setoption name Threads value 1')
    this.stockfish.postMessage('setoption name Hash value 16')
    this.stockfish.postMessage('isready')
  }

  private processNextCommand() {
    if (this.messageQueue.length > 0 && this.stockfish) {
      const nextCommand = this.messageQueue[0]
      this.stockfish.postMessage(nextCommand.message)
    }
  }

  private async waitForEngineReady(): Promise<void> {
    if (!this.stockfish) throw new Error('Stockfish engine not initialized')
    
    if (this.isEngineReady) return
    
    return new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 3
      
      const timeoutId = setTimeout(() => {
        reject(new Error('Engine initialization timed out'))
      }, 30000)  // 30 second timeout for initial setup
      
      const checkReady = setInterval(() => {
        if (this.isEngineReady) {
          clearTimeout(timeoutId)
          clearInterval(checkReady)
          resolve()
        } else {
          attempts++
          if (attempts >= maxAttempts) {
            clearTimeout(timeoutId)
            clearInterval(checkReady)
            // Try to reinitialize the engine
            if (this.stockfish) {
              this.stockfish.terminate()
              this.stockfish = new Worker('/stockfish/stockfish.js')
              this.initializeEngine()
              resolve() // Resolve anyway to let the analysis continue
            } else {
              reject(new Error('Failed to initialize engine after multiple attempts'))
            }
          } else {
            // Send isready command again
            this.stockfish?.postMessage('isready')
          }
        }
      }, 2000) // Check every 2 seconds
    })
  }

  private async analyzePosition(fen: string): Promise<{ evaluation: number, bestMove: string }> {
    if (!this.stockfish) throw new Error('Stockfish engine not initialized')
    
    await this.waitForEngineReady()
    
    // Set position and start analysis
    await this.sendCommand(`position fen ${fen}`)
    await this.sendCommand('isready')
    return this.sendCommand('go movetime 500')  // Reduced analysis time for better performance
  }

  private async sendCommand(command: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.stockfish) {
        reject(new Error('Stockfish engine not initialized'))
        return
      }

      const timeoutId = setTimeout(() => {
        if (command.startsWith('go ')) {
          resolve({ evaluation: 0, bestMove: 'none' })
        } else {
          resolve(undefined)  // Don't reject, just resolve with no result
        }
        
        // Process next command
        this.messageQueue.shift()
        this.processNextCommand()
      }, 2000)  // 2 second timeout for commands

      this.messageQueue.push({ 
        resolve: (value: any) => {
          clearTimeout(timeoutId)
          resolve(value)
        }, 
        message: command,
        result: undefined
      })
      
      if (this.messageQueue.length === 1) {
        this.stockfish.postMessage(command)
      }
    })
  }

  async analyzeGame(pgn: string): Promise<GameAnalysis> {
    try {
      // console.time('Total Analysis Time')
      await this.waitForEngineReady()
      
      const chess = new Chess()
      const movesSection = pgn.split('\n\n').pop() || ''
      
      // Improved PGN cleaning
      const cleanPgn = movesSection
        .replace(/\[\w+\s+"[^"]*"\]/g, '')
        .replace(/\{[%\s]*clk[^}]*\}/g, '')
        .replace(/\s*\{[^}]*\}\s*/g, ' ')
        .replace(/(\d+)\.{3}/g, '')
        .replace(/\s+/g, ' ')
        .replace(/(\d+)\.\s+/g, '$1. ')
        .trim()
      
      try {
        chess.loadPgn(cleanPgn)
      } catch (error) {
        throw new Error('Invalid PGN format')
      }
      
      const moves = chess.history({ verbose: true })
      const analysis: MoveAnalysis[] = []
      const threats: ThreatAnalysis[] = []
      
      chess.reset()
      let lastEvaluation = 0
      let currentPosition = chess.fen()
      let totalEvalChanges = 0
      let moveCount = 0
      
      console.log(`Starting analysis of ${moves.length} moves...`)
      
      for (const move of moves) {
        try {
          // console.time(`Move ${moveCount + 1}`)
          const { evaluation, bestMove } = await this.analyzePosition(currentPosition)
          
          // Analyze threats before making the move
          const threatAnalysis = await this.analyzeThreat(currentPosition, chess.moveNumber())
          if (threatAnalysis.threats.length > 0) {
            threats.push(threatAnalysis)
          }
          
          chess.move(move)
          currentPosition = chess.fen()
          
          const evaluationChange = chess.turn() === 'w' ? 
            lastEvaluation - evaluation :
            evaluation - lastEvaluation
          
          totalEvalChanges += Math.abs(evaluationChange)
          moveCount++
          
          // Chess.com-style move classification
          const moveClassification = this.classifyMove(evaluationChange, lastEvaluation, evaluation, move.san)
          
          const moveAnalysis: MoveAnalysis = {
            move: move.san,
            position: currentPosition,
            evaluation,
            bestMove,
            moveClassification,
            improvement: await this.generateImprovement(currentPosition, move.san, bestMove),
            lessonType: await this.classifyMistake(currentPosition, move.san, bestMove),
            explanation: await this.explainMistake(currentPosition, move.san, bestMove)
          }
          analysis.push(moveAnalysis)
          
          lastEvaluation = evaluation
          // console.timeEnd(`Move ${moveCount}`)
          console.log(`Move ${moveCount}/${moves.length} analyzed: ${move.san} (${moveClassification})`)
        } catch (error) {
          console.error(`Error analyzing move ${move.san}:`, error)
        }
      }
      
      const result = {
        moves: analysis,
        summary: this.generateSummary(analysis, totalEvalChanges, moveCount),
        threats
      }
      
      // console.timeEnd('Total Analysis Time')
      console.log(`Analysis complete: ${moveCount} moves analyzed`)
      
      return result
      
    } catch (error) {
      console.error('Error analyzing game:', error)
      throw error
    }
  }

  private evaluationToExpectedPoints(evaluation: number): number {
    // Convert Stockfish evaluation to winning probability (0.0 to 1.0)
    // Using a logistic function similar to chess.com
    return 1 / (1 + Math.exp(-0.5 * evaluation));
  }

  private classifyMove(evaluationChange: number, previousEval: number, newEval: number, moveSan: string): MoveAnalysis['moveClassification'] {
    // Convert evaluations to expected points (winning probability)
    const prevWinChance = this.evaluationToExpectedPoints(previousEval);
    const newWinChance = this.evaluationToExpectedPoints(newEval);
    const expectedPointsLost = Math.max(0, prevWinChance - newWinChance);

    // Great move (!) - Only for truly exceptional moves
    if (
      (previousEval <= -2.0 && newEval >= 0.5) || // Turn around a clearly lost position
      (moveSan.includes('x') && evaluationChange >= 3.0) || // Winning capture with huge gain
      (moveSan.includes('#') && previousEval < 1.0) // Finding mate in a non-winning position
    ) {
      return 'great'
    }

    // Miss - For very poor moves that lose significant advantage
    if (evaluationChange <= -3.0 || expectedPointsLost >= 0.3) {
      return 'miss'
    }

    // Mistake - For clear mistakes that lose moderate advantage
    if (evaluationChange <= -1.5 || expectedPointsLost >= 0.15) {
      return 'mistake'
    }

    // All other moves are considered normal
    return 'normal'
  }

  private generateSummary(analysis: MoveAnalysis[], totalEvalChanges: number, moveCount: number) {
    // Count moves by classification
    const brilliantMoves = analysis.filter(m => m.moveClassification === 'brilliant').length
    const greatMoves = analysis.filter(m => m.moveClassification === 'great').length
    const bestMoves = analysis.filter(m => m.moveClassification === 'best').length
    const excellentMoves = analysis.filter(m => m.moveClassification === 'excellent').length
    const goodMoves = analysis.filter(m => m.moveClassification === 'good').length
    const inaccuracies = analysis.filter(m => m.moveClassification === 'inaccuracy').length
    const mistakes = analysis.filter(m => m.moveClassification === 'mistake').length
    const misses = analysis.filter(m => m.moveClassification === 'miss').length
    const blunders = analysis.filter(m => m.moveClassification === 'blunder').length

    const criticalMistakes = analysis
      .filter(m => ['blunder', 'miss', 'mistake'].includes(m.moveClassification))
      .sort((a, b) => Math.abs(b.evaluation) - Math.abs(a.evaluation))
      .slice(0, 3)

    // Group mistakes by type to identify patterns
    const mistakePatterns = analysis
      .filter(m => ['blunder', 'miss', 'mistake'].includes(m.moveClassification))
      .reduce((acc, move) => {
        acc[move.lessonType] = (acc[move.lessonType] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    // Generate personalized lesson recommendations
    const recommendedLessons = Object.entries(mistakePatterns)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({
        type,
        topic: this.getLessonTopic(type, analysis),
        priority: count,
        reason: this.getLessonReason(type, analysis)
      }))

    return {
      accuracy: this.calculateAccuracy(analysis),
      brilliantMoves,
      greatMoves,
      bestMoves,
      excellentMoves,
      goodMoves,
      inaccuracies,
      mistakes,
      misses,
      blunders,
      criticalMistakes,
      recommendedLessons
    }
  }

  private calculateAccuracy(moves: MoveAnalysis[]): number {
    if (moves.length === 0) return 0
    
    const weights: Record<MoveAnalysis['moveClassification'], number> = {
      brilliant: 1.0,  // 100%
      great: 1.0,     // 100%
      best: 1.0,      // 100%
      excellent: 0.9,  // 90%
      good: 0.8,      // 80%
      inaccuracy: 0.6, // 60%
      mistake: 0.3,    // 30%
      miss: 0.1,      // 10%
      blunder: 0,     // 0%
      normal: 0.8     // 80% for normal moves
    }
    
    // Filter out first 5 moves (assumed book moves)
    const nonBookMoves = moves.slice(5)
    if (nonBookMoves.length === 0) return 100
    
    let totalScore = 0
    nonBookMoves.forEach(move => {
      totalScore += weights[move.moveClassification]
    })
    
    let accuracy = (totalScore / nonBookMoves.length) * 100
    accuracy = Math.min(98, accuracy)
    
    return Math.round(accuracy * 10) / 10
  }

  private generateImprovement = async (position: string, move: string, bestMove: string): Promise<string> => {
    try {
      const chess = new Chess(position);
      
      const legalMoves = chess.moves({ verbose: true });
      
      const bestMoveObj = legalMoves.find(m => 
        (m.from + m.to) === bestMove.toLowerCase() ||
        m.san === bestMove
      );
      
      if (!bestMoveObj) {
        return `Consider finding a better move in this position.`;
      }

      return `Instead of ${move}, consider ${bestMoveObj.san} which gives better chances.`;
    } catch (error) {
      console.error('Error generating improvement:', error);
      return `Consider looking for a stronger continuation in this position.`;
    }
  };

  private classifyMistake = async (position: string, move: string, bestMove: string): Promise<'tactical' | 'positional' | 'opening' | 'endgame'> => {
    const chess = new Chess(position);
    const moveNumber = Math.floor((chess.moveNumber() - 1) / 2) + 1;
    
    if (moveNumber <= 10) return 'opening';
    if (this.isEndgame(chess)) return 'endgame';
    if (this.isTacticalPosition(chess, move, bestMove)) return 'tactical';
    return 'positional';
  };

  private isEndgame = (chess: Chess): boolean => {
    const fen = chess.fen();
    const pieceCount = fen.split(' ')[0].match(/[PNBRQK]/g)?.length || 0;
    return pieceCount <= 10;
  };

  private isTacticalPosition = (chess: Chess, move: string, bestMove: string): boolean => {
    return chess.inCheck() || move.includes('x') || bestMove.includes('x');
  };

  private explainMistake = async (position: string, move: string, bestMove: string): Promise<string> => {
    const chess = new Chess(position);
    const type = await this.classifyMistake(position, move, bestMove);
    
    switch (type) {
      case 'tactical':
        return 'You missed a tactical opportunity. Look for forcing moves and combinations.';
      case 'positional':
        return 'This move weakens your pawn structure and piece coordination.';
      case 'opening':
        return 'This move deviates from opening principles. Focus on development and center control.';
      case 'endgame':
        return 'In endgames, every move is crucial. Calculate carefully and keep your pieces active.';
    }
  };

  private getLessonTopic = (type: string, analysis: MoveAnalysis[]): string => {
    switch (type) {
      case 'tactical':
        return 'Pattern Recognition and Calculation';
      case 'positional':
        return 'Pawn Structure and Piece Placement';
      case 'opening':
        return 'Opening Principles and Development';
      case 'endgame':
        return 'Essential Endgame Techniques';
      default:
        return 'General Chess Improvement';
    }
  };

  private getLessonReason = (type: string, analysis: MoveAnalysis[]): string => {
    const mistakes = analysis.filter(m => m.lessonType === type);
    const count = mistakes.length;
    
    switch (type) {
      case 'tactical':
        return `You missed ${count} tactical opportunities. Focus on improving calculation and pattern recognition.`;
      case 'positional':
        return `${count} positional mistakes indicate a need to study pawn structures and piece coordination.`;
      case 'opening':
        return `${count} early game mistakes suggest reviewing opening principles and common patterns.`;
      case 'endgame':
        return `${count} endgame errors show the importance of studying fundamental endgame positions.`;
      default:
        return 'General improvement in chess principles is recommended.';
    }
  };

  async fetchChessComGames(username: string): Promise<ChessComGame[]> {
    // Get dates for the last week
    const dates = Array.from({length: 7}, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().slice(0, 7).replace('-', '/')
    })

    try {
      // Fetch games from each day of the last week
      const allGamesPromises = dates.map(async (monthYear) => {
        const response = await fetch(
          `https://api.chess.com/pub/player/${username}/games/${monthYear}`
        )
        const data = await response.json()
        return data.games || []
      })

      const allGamesArrays = await Promise.all(allGamesPromises)
      const allGames = allGamesArrays.flat()

      // Filter games from the last 7 days and sort by date
      const lastWeekGames = allGames.filter(game => {
        const gameDate = new Date(game.end_time * 1000)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return gameDate >= weekAgo
      }).sort((a, b) => b.end_time - a.end_time)

      return lastWeekGames
    } catch (error) {
      console.error('Error fetching games:', error)
      throw error
    }
  }

  private analyzeThreat = async (position: string, moveNumber: number): Promise<ThreatAnalysis> => {
    const chess = new Chess(position)
    const threats: ThreatAnalysis['threats'] = []
    const turn = chess.turn()
    const opponent = turn === 'w' ? 'b' : 'w'
    
    // Get all pieces positions
    const board = chess.board()
    
    // 1. Check for direct attacks on pieces
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j]
        if (!piece || piece.color !== turn) continue
        
        const square = String.fromCharCode(97 + j) + (8 - i) as Square
        const attackers = this.getAttackers(chess, square, opponent)
        const defenders = this.getAttackers(chess, square, turn)
        
        // Piece is under attack with fewer defenders than attackers
        if (attackers.length > defenders.length) {
          threats.push({
            type: 'hanging' as const,
            description: `${this.getPieceName(piece.type)} can be captured`,
            severity: this.getPieceSeverity(piece.type),
            piece: piece.type,
            square: square
          })
        }
      }
    }
    
    // 2. Check for absolute pins
    const kingSquare = this.findKingSquare(chess, turn)
    if (kingSquare) {
      const pinnedPieces = this.findPinnedPieces(chess, kingSquare, turn)
      threats.push(...pinnedPieces.map(pin => ({
        type: 'pin' as const,
        description: `${this.getPieceName(pin.piece)} is pinned to the king`,
        severity: 'serious' as const,
        piece: pin.piece,
        square: pin.square
      })))
    }

    return {
      position,
      moveNumber,
      threats: threats.filter(t => t.severity !== 'moderate')
    }
  }

  private getAttackers(chess: Chess, targetSquare: Square, attackerColor: 'w' | 'b'): Square[] {
    const attackers: Square[] = []
    const board = chess.board()
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j]
        if (!piece || piece.color !== attackerColor) continue
        
        const square = String.fromCharCode(97 + j) + (8 - i) as Square
        const moves = chess.moves({ square, verbose: true })
        
        if (moves.some(move => move.to === targetSquare)) {
          attackers.push(square)
        }
      }
    }
    
    return attackers
  }

  private findKingSquare(chess: Chess, color: 'w' | 'b'): Square | null {
    const board = chess.board()
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j]
        if (piece && piece.type === 'k' && piece.color === color) {
          return String.fromCharCode(97 + j) + (8 - i) as Square
        }
      }
    }
    return null
  }

  private findPinnedPieces(chess: Chess, kingSquare: Square, color: 'w' | 'b'): Array<{ piece: string, square: Square }> {
    const pinnedPieces: Array<{ piece: string, square: Square }> = []
    const board = chess.board()
    
    // Check all pieces of our color
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j]
        if (!piece || piece.color !== color || piece.type === 'k') continue
        
        const square = String.fromCharCode(97 + j) + (8 - i) as Square
        
        // Try to move the piece
        const moves = chess.moves({ square, verbose: true })
        if (moves.length === 0) {
          // Remove the piece temporarily
          const capturedPiece = chess.remove(square)
          // If king is now attacked, the piece was pinned
          if (chess.isAttacked(kingSquare, color === 'w' ? 'b' : 'w')) {
            pinnedPieces.push({ piece: piece.type, square })
          }
          // Put the piece back
          if (capturedPiece) {
            chess.put(capturedPiece, square)
          }
        }
      }
    }
    
    return pinnedPieces
  }

  private getPieceName(pieceType: string): string {
    const names: Record<string, string> = {
      'p': 'Pawn',
      'n': 'Knight',
      'b': 'Bishop',
      'r': 'Rook',
      'q': 'Queen',
      'k': 'King'
    }
    return names[pieceType] || pieceType.toUpperCase()
  }

  private getPieceSeverity(pieceType: string): 'critical' | 'serious' | 'moderate' {
    switch (pieceType) {
      case 'q':
        return 'critical'
      case 'r':
      case 'b':
      case 'n':
        return 'serious'
      default:
        return 'moderate'
    }
  }
}