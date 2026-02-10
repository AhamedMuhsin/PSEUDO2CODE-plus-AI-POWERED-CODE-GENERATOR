import { bfsSteps } from "./bfsSteps"
import { dfsSteps } from "./dfsSteps"
import { detectCycleSteps } from "./detectCycleSteps"
import { checkPathSteps } from "./checkPathSteps"
import { dijkstraSteps } from "./dijkstraSteps"
import { bfsPseudo, dfsPseudo, detectCyclePseudo, checkPathPseudo, dijkstraPseudo } from "./pseudocode/graphPseudocodes"
import { graphOperationsMeta } from "./graphOperationsMeta"

export const graphOperations = {
  bfs: {
    key: "bfs",
    label: "Breadth-First Search",
    algorithmName: "BFS",
    description: "Visit nodes level by level, exploring all neighbors before going deeper",
    generateSteps: bfsSteps,
    pseudocode: bfsPseudo,
    info: graphOperationsMeta.bfs,
    requiresParams: false
  },
  dfs: {
    key: "dfs",
    label: "Depth-First Search",
    algorithmName: "DFS",
    description: "Recursively explore as far as possible along each branch before backtracking",
    generateSteps: dfsSteps,
    pseudocode: dfsPseudo,
    info: graphOperationsMeta.dfs,
    requiresParams: false
  },
  detectCycle: {
    key: "detectCycle",
    label: "Detect Cycle",
    algorithmName: "Cycle Detection",
    description: "Identify if the graph contains a cycle using DFS",
    generateSteps: detectCycleSteps,
    pseudocode: detectCyclePseudo,
    info: graphOperationsMeta.detectCycle,
    requiresParams: false
  },
  checkPath: {
    key: "checkPath",
    label: "Check Path",
    algorithmName: "Path Finding",
    description: "Determine if a path exists between two nodes",
    generateSteps: checkPathSteps,
    pseudocode: checkPathPseudo,
    info: graphOperationsMeta.checkPath,
    requiresParams: true
  },
  dijkstra: {
    key: "dijkstra",
    label: "Dijkstra's Algorithm",
    algorithmName: "Shortest Path",
    description: "Find shortest path from source to all other nodes in weighted graph",
    generateSteps: dijkstraSteps,
    pseudocode: dijkstraPseudo,
    info: graphOperationsMeta.dijkstra,
    requiresParams: false
  }
}
