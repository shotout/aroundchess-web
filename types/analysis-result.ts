export type AnalysisResult = { 
      gameInfo: {
        event: string
        date: string
        round: string
        time: string
        isPlayerWhite: boolean
        whiteWin: boolean
        blackWin: boolean
        draw: boolean
        pgn: string
        openings: {
          white: {
            eco: string
            name: string
            moves: string
          }
          black: {
            eco: string
            name: string
            moves: string
          }
        }
      }
      summary: {
        whiteSide: {
          profileInfo: {
            photo: string
            username: string
            gameRating: number
          }
          analysis: {
            accuracy: number
            moveQuality: {
              brilliant: number
              great: number
              best: number
              mistake: number
              miss: number
              blunder: number
            }
            opening: string
            middleGame: string
            endGame: string
          }
        }
        blackSide: {
          profileInfo: {
            photo: string
            username: string
            gameRating: number
          }
          analysis: {
            accuracy: number
            moveQuality: {
              brilliant: number
              great: number
              best: number
              mistake: number
              miss: number
              blunder: number
            }
            opening: string
            middleGame: string
            endGame: string
          }
        }
        overallGameAssessment: {
          gameAccuracy: number
          analysis: string
        }
        bestMoves: {
          middleGame: Array<{
            moveNumber: number
            move: string
            classification: string
            evaluation: number
            analysis: string
          }>
          endGame: Array<any>
        }
      }
      movementDetails: {
        white: Array<{
          moveNumber: number
          move: string
          classification: string
          evaluation: number
          gamePhase: string
        }>
        black: Array<{
          moveNumber: number
          move: string
          classification: string
          evaluation: number
          gamePhase: string
        }>
      }
      opening: {
        whiteOpening: {
          moves: string
          classification: string
          description: Array<string>
          explanation: string
        }
        blackOpening: {
          moves: string
          classification: string
          description: Array<string>
          explanation: string
        }
      }
      middleGame: {
        bestMoves: Array<{
          moveNumber: number
          move: string
          classification: string
          evaluation: number
          analysis: string
        }>
        badMoves: Array<{
          moveNumber: number
          move: string
          classification: string
          evaluation: number
          analysis: string
        }>
      }
      endGame: {
        bestMoves: Array<any>
        badMoves: Array<any>
      }
      improvementRecommendation: {
        keyWeaknesses: {
          tacticalAwareness: string
          openingPreparation: string
          middleGameTechnique: string
          endGameTechnique: string
        }
        gameAnalysis: {
          strength: string
          weaknesses: string
        }
        nextStepImprovement: string
      }
      training: {
        criticalMistakes: {
          opening: Array<any>
          middleGame: Array<{
            moveNumber: number
            move: string
            evaluation: number
            classification: string
            analysis: string
            recommendedTrainingExercise: string
          }>
          endGame: Array<any>
        }
        weaknessIdentification: {
          opening: Array<{
            moveNumber: number
            move: string
            evaluation: number
            classification: string
            analysis: string
            recommendedTrainingExercise: string
          }>
          middleGame: Array<{
            moveNumber: number
            move: string
            evaluation: number
            classification: string
            analysis: string
            recommendedTrainingExercise: string
          }>
          endGame: Array<any>
        }
      }
    } 
  