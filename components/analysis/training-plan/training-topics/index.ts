// Types
import { OpeningTopic, MiddlegameTopic, EndgameTopic, TrainingTopic } from './types'
export * from './types'

// Openings
import { sicilianDefense } from './openings/sicilian-defense'
import { ruyLopez } from './openings/ruy-lopez'
import { queensGambit } from './openings/queens-gambit'
import { kingsIndian } from './openings/kings-indian'
import { frenchDefense } from './openings/french-defense'
import { caroKann } from './openings/caro-kann'
import { italianGame } from './openings/italian-game'
import { basicOpeningPrinciples } from './openings/basic-opening-principles'
import { najdorfSicilian } from './openings/najdorf-sicilian'
import { grunfeldDefense } from './openings/grunfeld-defense'
import { scandinavianDefense } from './openings/scandinavian-defense'
import { dutchDefense } from './openings/dutch-defense'
import { modernDefense } from './openings/modern-defense'
import { kingsIndianAttack } from './openings/kings-indian-attack'
import { nimzoIndian } from './openings/nimzo-indian'
import { viennaGame } from './openings/vienna-game'
import { alekhineDefense } from './openings/alekhine-defense'
import { benoniDefense } from './openings/benoni-defense'
import { trompowskyAttack } from './openings/trompowsky-attack'
import { benkoGambit } from './openings/benko-gambit'
import { colleSystem } from './openings/colle-system'
import { pircDefense } from './openings/pirc-defense'
import { englishOpening } from './openings/english-opening'
import { londonSystem } from './openings/london-system'
import { pieceMovement } from './openings/piece-movement'

// Middlegame
import { attackingTheKing } from './middlegame/attacking-the-king'
import { pawnStructures } from './middlegame/pawn-structures'
import { basicPrinciples } from './middlegame/basic-principles'
import { pieceCoordination } from './middlegame/piece-coordination'
import { positionalPlay } from './middlegame/positional-play'
import { basicTactics } from './middlegame/basic-tactics'
import { complexSacrifices } from './middlegame/complex-sacrifices'
import { dynamicPlay } from './middlegame/dynamic-play'
import { minorPieceStrategy } from './middlegame/minor-piece-strategy'
import { prophylaxis } from './middlegame/prophylaxis'
import { spaceAdvantage } from './middlegame/space-advantage'
import { calculationSkills } from './middlegame/calculation-skills'
import { pieceActivity } from './middlegame/piece-activity'
import { strategicPlanning } from './middlegame/strategic-planning'
import { attackingPatterns } from './middlegame/attacking-patterns'
import { defenseTechnique } from './middlegame/defense-technique'
import { initiative } from './middlegame/initiative'
import { transformation } from './middlegame/transformation'
import { compensation } from './middlegame/compensation'
import { materialCounting } from './middlegame/material-counting'
import { patternRecognition } from './middlegame/pattern-recognition'
import { pawnBreaks } from './middlegame/pawn-breaks'
import { exchangeDecisions } from './middlegame/exchange-decisions'
import { tacticalCombinations } from './middlegame/tactical-combinations'
import { defensiveResources } from './middlegame/defensive-resources'
import { bishopPair } from './middlegame/bishop-pair'
import { rookHandling } from './middlegame/rook-handling'

// Endgame
import { rookEndgames } from './endgame/rook-endgames'
import { pawnEndgames } from './endgame/pawn-endgames'
import { basicCheckmates } from './endgame/basic-checkmates'
import { basicEndgamePrinciples } from './endgame/basic-endgame-principles'
import { theoreticalEndgames } from './endgame/theoretical-endgames'
import { fortressPositions } from './endgame/fortress-positions'
import { minorPieceEndgames } from './endgame/minor-piece-endgames'
import { queenEndgames } from './endgame/queen-endgames'
import { oppositeColoredBishops } from './endgame/opposite-colored-bishops'
import { sameColoredBishops } from './endgame/same-colored-bishops'
import { knightVsBishop } from './endgame/knight-vs-bishop'
import { queenVsPawn } from './endgame/queen-vs-pawn'
import { rookVsMinor } from './endgame/rook-vs-minor'
import { technicalConversion } from './endgame/technical-conversion'
import { endgameTactics } from './endgame/endgame-tactics'
import { kingActivity } from './endgame/king-activity'
import { zugzwangPositions } from './endgame/zugzwang-positions'
import { kingAndPawn } from './endgame/king-and-pawn'
import { basicRookEndgames } from './endgame/basic-rook-endgames'
import { basicMinorPiece } from './endgame/basic-minor-piece'
import { queenEndgamePrinciples } from './endgame/queen-endgame-principles'
import { advancedPawnEndgames } from './endgame/advanced-pawn-endgames'
import { complexRookEndgames } from './endgame/complex-rook-endgames'
import { complexMinorPiece } from './endgame/complex-minor-piece'
import { complexQueenEndgames } from './endgame/complex-queen-endgames'
import { endgameStudies } from './endgame/endgame-studies'
import { theoreticalPositions } from './endgame/theoretical-positions'
import { endgameCalculation } from './endgame/endgame-calculation'
import { practicalEndgame } from './endgame/practical-endgame'

// Re-export openings
export {
  sicilianDefense,
  ruyLopez,
  queensGambit,
  kingsIndian,
  frenchDefense,
  caroKann,
  italianGame,
  basicOpeningPrinciples,
  najdorfSicilian,
  grunfeldDefense,
  scandinavianDefense,
  dutchDefense,
  modernDefense,
  kingsIndianAttack,
  nimzoIndian,
  viennaGame,
  alekhineDefense,
  benoniDefense,
  trompowskyAttack,
  benkoGambit,
  colleSystem,
  pircDefense,
  englishOpening,
  londonSystem,
  pieceMovement
}

// Re-export middlegame topics
export {
  attackingTheKing,
  pawnStructures,
  basicPrinciples,
  pieceCoordination,
  positionalPlay,
  basicTactics,
  complexSacrifices,
  dynamicPlay,
  minorPieceStrategy,
  prophylaxis,
  spaceAdvantage,
  calculationSkills,
  pieceActivity,
  strategicPlanning,
  attackingPatterns,
  defenseTechnique,
  initiative,
  transformation,
  compensation,
  materialCounting,
  patternRecognition,
  pawnBreaks,
  exchangeDecisions,
  tacticalCombinations,
  defensiveResources,
  bishopPair,
  rookHandling
}

// Re-export endgame topics
export {
  rookEndgames,
  pawnEndgames,
  basicCheckmates,
  basicEndgamePrinciples,
  theoreticalEndgames,
  fortressPositions,
  minorPieceEndgames,
  queenEndgames,
  oppositeColoredBishops,
  sameColoredBishops,
  knightVsBishop,
  queenVsPawn,
  rookVsMinor,
  technicalConversion,
  endgameTactics,
  kingActivity,
  zugzwangPositions,
  kingAndPawn,
  basicRookEndgames,
  basicMinorPiece,
  queenEndgamePrinciples,
  advancedPawnEndgames,
  complexRookEndgames,
  complexMinorPiece,
  complexQueenEndgames,
  endgameStudies,
  theoreticalPositions,
  endgameCalculation,
  practicalEndgame
}

// Topic Collections
export const openingTopics: { [key: string]: OpeningTopic } = {
  'basic-opening-principles': basicOpeningPrinciples,
  'italian-game': italianGame,
  'ruy-lopez': ruyLopez,
  'queens-gambit': queensGambit,
  'sicilian-defense': sicilianDefense,
  'french-defense': frenchDefense,
  'caro-kann': caroKann,
  'kings-indian': kingsIndian,
  'najdorf-sicilian': najdorfSicilian,
  'grunfeld-defense': grunfeldDefense,
  'scandinavian-defense': scandinavianDefense,
  'dutch-defense': dutchDefense,
  'modern-defense': modernDefense,
  'kings-indian-attack': kingsIndianAttack,
  'nimzo-indian': nimzoIndian,
  'vienna-game': viennaGame,
  'alekhine-defense': alekhineDefense,
  'benoni-defense': benoniDefense,
  'trompowsky-attack': trompowskyAttack,
  'benko-gambit': benkoGambit,
  'colle-system': colleSystem,
  'pirc-defense': pircDefense,
  'english-opening': englishOpening,
  'london-system': londonSystem,
  'piece-movement': pieceMovement
}

export const middlegameTopics: { [key: string]: MiddlegameTopic } = {
  'basic-principles': basicPrinciples,
  'basic-tactics': basicTactics,
  'piece-coordination': pieceCoordination,
  'pawn-structures': pawnStructures,
  'attacking-the-king': attackingTheKing,
  'positional-play': positionalPlay,
  'complex-sacrifices': complexSacrifices,
  'dynamic-play': dynamicPlay,
  'minor-piece-strategy': minorPieceStrategy,
  'prophylaxis': prophylaxis,
  'space-advantage': spaceAdvantage,
  'calculation-skills': calculationSkills,
  'piece-activity': pieceActivity,
  'strategic-planning': strategicPlanning,
  'attacking-patterns': attackingPatterns,
  'defense-technique': defenseTechnique,
  'initiative': initiative,
  'transformation': transformation,
  'compensation': compensation,
  'material-counting': materialCounting,
  'pattern-recognition': patternRecognition,
  'pawn-breaks': pawnBreaks,
  'exchange-decisions': exchangeDecisions,
  'tactical-combinations': tacticalCombinations,
  'defensive-resources': defensiveResources,
  'bishop-pair': bishopPair,
  'rook-handling': rookHandling
}

export const endgameTopics: { [key: string]: EndgameTopic } = {
  'basic-endgame-principles': basicEndgamePrinciples,
  'basic-checkmates': basicCheckmates,
  'pawn-endgames': pawnEndgames,
  'rook-endgames': rookEndgames,
  'minor-piece-endgames': minorPieceEndgames,
  'theoretical-endgames': theoreticalEndgames,
  'fortress-positions': fortressPositions,
  'queen-endgames': queenEndgames,
  'opposite-colored-bishops': oppositeColoredBishops,
  'same-colored-bishops': sameColoredBishops,
  'knight-vs-bishop': knightVsBishop,
  'queen-vs-pawn': queenVsPawn,
  'rook-vs-minor': rookVsMinor,
  'technical-conversion': technicalConversion,
  'endgame-tactics': endgameTactics,
  'king-activity': kingActivity,
  'zugzwang-positions': zugzwangPositions,
  'king-and-pawn': kingAndPawn,
  'basic-rook-endgames': basicRookEndgames,
  'basic-minor-piece': basicMinorPiece,
  'queen-endgame-principles': queenEndgamePrinciples,
  'advanced-pawn-endgames': advancedPawnEndgames,
  'complex-rook-endgames': complexRookEndgames,
  'complex-minor-piece': complexMinorPiece,
  'complex-queen-endgames': complexQueenEndgames,
  'endgame-studies': endgameStudies,
  'theoretical-positions': theoreticalPositions,
  'endgame-calculation': endgameCalculation,
  'practical-endgame': practicalEndgame
}

// All Topics Combined
export const allTopics = {
  ...openingTopics,
  ...middlegameTopics,
  ...endgameTopics
} 