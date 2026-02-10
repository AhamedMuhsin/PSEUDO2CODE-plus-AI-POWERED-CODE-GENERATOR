import { nQueensSteps } from "./nQueensSteps"
import { towerOfHanoiSteps } from "./towerOfHanoiSteps"
import { waterJugSteps } from "./waterJugSteps"
import { minimaxSteps } from "./minimaxSteps"
import { missionariesCannibalsSteps } from "./missionariesCannibalsSteps"
import { numberPuzzleSteps } from "./numberPuzzleSteps"
import { vacuumCleanerSteps } from "./vacuumCleanerSteps"
import { alphaBetaSteps } from "./alphaBetaSteps"
import { hillClimbingSteps } from "./hillClimbingSteps"
import { simulatedAnnealingSteps } from "./simulatedAnnealingSteps"
import { mapColoringSteps } from "./mapColoringSteps"
import { geneticAlgorithmSteps } from "./geneticAlgorithmSteps"
import { 
  nQueensPseudo, 
  towerOfHanoiPseudo, 
  waterJugPseudo, 
  minimaxPseudo, 
  missionariesCannibalsPseudo, 
  numberPuzzlePseudo,
  vacuumCleanerPseudo,
  alphaBetaPseudo,
  hillClimbingPseudo,
  simulatedAnnealingPseudo,
  mapColoringPseudo,
  geneticAlgorithmPseudo
} from "./pseudocode/aiPseudocodes"
import { aiProblemsMeta } from "./aiProblemsMeta"

export const aiProblems = {
  nQueens: {
    key: "nQueens",
    label: "N-Queens Problem",
    algorithmName: "N-Queens",
    description: "Place N queens on an N×N chessboard so that no two queens threaten each other",
    generateSteps: nQueensSteps,
    pseudocode: nQueensPseudo,
    info: aiProblemsMeta.nQueens,
    requiresParams: true
  },
  towerOfHanoi: {
    key: "towerOfHanoi",
    label: "Tower of Hanoi",
    algorithmName: "Tower of Hanoi",
    description: "Move all disks from source rod to destination rod following the rules",
    generateSteps: towerOfHanoiSteps,
    pseudocode: towerOfHanoiPseudo,
    info: aiProblemsMeta.towerOfHanoi,
    requiresParams: true
  },
  waterJug: {
    key: "waterJug",
    label: "Water Jug Problem",
    algorithmName: "Water Jug",
    description: "Measure exact amount of water using two jugs of different capacities",
    generateSteps: waterJugSteps,
    pseudocode: waterJugPseudo,
    info: aiProblemsMeta.waterJug,
    requiresParams: true
  },
  minimax: {
    key: "minimax",
    label: "MinMax Algorithm",
    algorithmName: "MinMax",
    description: "Game theory algorithm for optimal decision making in two-player games",
    generateSteps: minimaxSteps,
    pseudocode: minimaxPseudo,
    info: aiProblemsMeta.minimax,
    requiresParams: false
  },
  missionariesCannibals: {
    key: "missionariesCannibals",
    label: "Missionaries & Cannibals",
    algorithmName: "Missionaries and Cannibals",
    description: "Transport all missionaries and cannibals across river safely",
    generateSteps: missionariesCannibalsSteps,
    pseudocode: missionariesCannibalsPseudo,
    info: aiProblemsMeta.missionariesCannibals,
    requiresParams: false
  },
  numberPuzzle: {
    key: "numberPuzzle",
    label: "8-Puzzle Problem",
    algorithmName: "Number Puzzle",
    description: "Sliding tile puzzle - arrange tiles in correct order",
    generateSteps: numberPuzzleSteps,
    pseudocode: numberPuzzlePseudo,
    info: aiProblemsMeta.numberPuzzle,
    requiresParams: false
  },
  vacuumCleaner: {
    key: "vacuumCleaner",
    label: "Vacuum Cleaner Agent",
    algorithmName: "Vacuum Cleaner Agent",
    description: "Simple reflex agent navigating and cleaning a grid world",
    generateSteps: vacuumCleanerSteps,
    pseudocode: vacuumCleanerPseudo,
    info: aiProblemsMeta.vacuumCleaner,
    requiresParams: true
  },
  alphaBeta: {
    key: "alphaBeta",
    label: "Alpha-Beta Pruning",
    algorithmName: "Alpha-Beta Pruning",
    description: "Optimized minimax with branch pruning for game trees",
    generateSteps: alphaBetaSteps,
    pseudocode: alphaBetaPseudo,
    info: aiProblemsMeta.alphaBeta,
    requiresParams: false
  },
  hillClimbing: {
    key: "hillClimbing",
    label: "Hill Climbing",
    algorithmName: "Hill Climbing",
    description: "Local search optimization - climb to peak by choosing best neighbor",
    generateSteps: hillClimbingSteps,
    pseudocode: hillClimbingPseudo,
    info: aiProblemsMeta.hillClimbing,
    requiresParams: false
  },
  simulatedAnnealing: {
    key: "simulatedAnnealing",
    label: "Simulated Annealing",
    algorithmName: "Simulated Annealing",
    description: "Probabilistic optimization that can escape local maxima",
    generateSteps: simulatedAnnealingSteps,
    pseudocode: simulatedAnnealingPseudo,
    info: aiProblemsMeta.simulatedAnnealing,
    requiresParams: false
  },
  mapColoring: {
    key: "mapColoring",
    label: "Map Coloring CSP",
    algorithmName: "Map Coloring",
    description: "Constraint satisfaction - color map regions with no adjacent conflicts",
    generateSteps: mapColoringSteps,
    pseudocode: mapColoringPseudo,
    info: aiProblemsMeta.mapColoring,
    requiresParams: false
  },
  geneticAlgorithm: {
    key: "geneticAlgorithm",
    label: "Genetic Algorithm",
    algorithmName: "Genetic Algorithm",
    description: "Evolutionary algorithm using selection, crossover, and mutation",
    generateSteps: geneticAlgorithmSteps,
    pseudocode: geneticAlgorithmPseudo,
    info: aiProblemsMeta.geneticAlgorithm,
    requiresParams: false
  }
}
