import { OpeningTopic, MiddlegameTopic, EndgameTopic, TrainingTopic } from './types'
export * from './types'

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

import { rookendgames } from './endgame/rook-endgames'
import { pawnendgames } from './endgame/pawn-endgames'
import { basiccheckmates } from './endgame/basic-checkmates'
import { basicendgameprinciples } from './endgame/basic-endgame-principles'
import { theoreticalendgames } from './endgame/theoretical-endgames'
import { fortresspositions } from './endgame/fortress-positions'
import { minorpieceendgames } from './endgame/minor-piece-endgames'
import { queenendgames } from './endgame/queen-endgames'
import { oppositecoloredbishops } from './endgame/opposite-colored-bishops'
import { samecoloredbishops } from './endgame/same-colored-bishops'
import { knightvsbishop } from './endgame/knight-vs-bishop'
import { queenvspawn } from './endgame/queen-vs-pawn'
import { rookvsminor } from './endgame/rook-vs-minor'
import { technicalconversion } from './endgame/technical-conversion'
import { endgametactics } from './endgame/endgame-tactics'
import { kingactivity } from './endgame/king-activity'
import { zugzwangpositions } from './endgame/zugzwang-positions'
import { kingandpawn } from './endgame/king-and-pawn'
import { basicrookendgames } from './endgame/basic-rook-endgames'
import { basicminorpiece } from './endgame/basic-minor-piece'
import { queenendgameprinciples } from './endgame/queen-endgame-principles'
import { advancedpawnendgames } from './endgame/advanced-pawn-endgames'
import { complexrookendgames } from './endgame/complex-rook-endgames'
import { complexminorpiece } from './endgame/complex-minor-piece'
import { complexqueenendgames } from './endgame/complex-queen-endgames'
import { endgamestudies } from './endgame/endgame-studies'
import { theoreticalpositions } from './endgame/theoretical-positions'
import { endgamecalculation } from './endgame/endgame-calculation'
import { practicalendgame } from './endgame/practical-endgame'

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

export {
  rookendgames as rookEndgames,
  pawnendgames as pawnEndgames,
  basiccheckmates as basicCheckmates,
  basicendgameprinciples as basicEndgamePrinciples,
  theoreticalendgames as theoreticalEndgames,
  fortresspositions as fortressPositions,
  minorpieceendgames as minorPieceEndgames,
  queenendgames as queenEndgames,
  oppositecoloredbishops as oppositeColoredBishops,
  samecoloredbishops as sameColoredBishops,
  knightvsbishop as knightVsBishop,
  queenvspawn as queenVsPawn,
  rookvsminor as rookVsMinor,
  technicalconversion as technicalConversion,
  endgametactics as endgameTactics,
  kingactivity as kingActivity,
  zugzwangpositions as zugzwangPositions,
  kingandpawn as kingAndPawn,
  basicrookendgames as basicRookEndgames,
  basicminorpiece as basicMinorPiece,
  queenendgameprinciples as queenEndgamePrinciples,
  advancedpawnendgames as advancedPawnEndgames,
  complexrookendgames as complexRookEndgames,
  complexminorpiece as complexMinorPiece,
  complexqueenendgames as complexQueenEndgames,
  endgamestudies as endgameStudies,
  theoreticalpositions as theoreticalPositions,
  endgamecalculation as endgameCalculation,
  practicalendgame as practicalEndgame
}

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
  'basic-endgame-principles': basicendgameprinciples,
  'basic-checkmates': basiccheckmates,
  'pawn-endgames': pawnendgames,
  'rook-endgames': rookendgames,
  'minor-piece-endgames': minorpieceendgames,
  'theoretical-endgames': theoreticalendgames,
  'fortress-positions': fortresspositions,
  'queen-endgames': queenendgames,
  'opposite-colored-bishops': oppositecoloredbishops,
  'same-colored-bishops': samecoloredbishops,
  'knight-vs-bishop': knightvsbishop,
  'queen-vs-pawn': queenvspawn,
  'rook-vs-minor': rookvsminor,
  'technical-conversion': technicalconversion,
  'endgame-tactics': endgametactics,
  'king-activity': kingactivity,
  'zugzwang-positions': zugzwangpositions,
  'king-and-pawn': kingandpawn,
  'basic-rook-endgames': basicrookendgames,
  'basic-minor-piece': basicminorpiece,
  'queen-endgame-principles': queenendgameprinciples,
  'advanced-pawn-endgames': advancedpawnendgames,
  'complex-rook-endgames': complexrookendgames,
  'complex-minor-piece': complexminorpiece,
  'complex-queen-endgames': complexqueenendgames,
  'endgame-studies': endgamestudies,
  'theoretical-positions': theoreticalpositions,
  'endgame-calculation': endgamecalculation,
  'practical-endgame': practicalendgame
}

export const allTopics = {
  ...openingTopics,
  ...middlegameTopics,
  ...endgameTopics
} 