import { bfsSteps } from "./bfsSteps"
import { dfsSteps } from "./dfsSteps"
import { detectCycleSteps } from "./detectCycleSteps"
import { checkPathSteps } from "./checkPathSteps"
import { dijkstraSteps } from "./dijkstraSteps"
import { astarSteps } from "./astarSteps"
import { kruskalSteps } from "./kruskalSteps"
import { primSteps } from "./primSteps"
import { bfsPseudo, dfsPseudo, detectCyclePseudo, checkPathPseudo, dijkstraPseudo, astarPseudo, kruskalPseudo, primPseudo } from "./pseudocode/graphPseudocodes"
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
    requiresParams: false,
    requiresWeighted: true
  },
  astar: {
    key: "astar",
    label: "A* Algorithm",
    algorithmName: "A* Pathfinding",
    description: "Find optimal path using heuristic-guided search (Dijkstra + estimated cost to goal)",
    generateSteps: astarSteps,
    pseudocode: astarPseudo,
    info: graphOperationsMeta.astar,
    requiresParams: true,
    requiresWeighted: true,
    requiresGoal: true
  },
  kruskal: {
    key: "kruskal",
    label: "Kruskal's Algorithm",
    algorithmName: "Kruskal's MST",
    description: "Find Minimum Spanning Tree by sorting edges and adding lightest non-cycle edges",
    generateSteps: kruskalSteps,
    pseudocode: kruskalPseudo,
    info: graphOperationsMeta.kruskal,
    requiresParams: false,
    requiresWeighted: true
  },
  prim: {
    key: "prim",
    label: "Prim's Algorithm",
    algorithmName: "Prim's MST",
    description: "Find Minimum Spanning Tree by greedily adding cheapest edge to a new vertex",
    generateSteps: primSteps,
    pseudocode: primPseudo,
    info: graphOperationsMeta.prim,
    requiresParams: false,
    requiresWeighted: true
  }
}
