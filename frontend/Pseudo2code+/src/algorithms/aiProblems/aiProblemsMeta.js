export const aiProblemsMeta = {
  nQueens: {
    time: "O(N!) worst case",
    space: "O(N²)",
    stable: true,
    description: "Uses backtracking to place N queens on NxN chessboard. Explores all possible configurations and backtracks when constraints are violated."
  },
  towerOfHanoi: {
    time: "O(2^N)",
    space: "O(N)",
    stable: true,
    description: "Recursive divide-and-conquer algorithm. To move N disks: move N-1 to auxiliary, move largest to destination, move N-1 from auxiliary to destination."
  },
  waterJug: {
    time: "O(M × N)",
    space: "O(M × N)",
    stable: true,
    description: "Uses BFS to explore all possible states of jugs. Each state represents current water levels. Finds shortest sequence of operations to reach target."
  },
  minimax: {
    time: "O(b^d) where b=branching factor, d=depth",
    space: "O(d)",
    stable: true,
    description: "Recursive algorithm for two-player games. Maximizing player tries to maximize score, minimizing player tries to minimize. Alpha-beta pruning optimizes it."
  },
  missionariesCannibals: {
    time: "O(N²)",
    space: "O(N²)",
    stable: true,
    description: "State-space search problem. Uses BFS/DFS to find valid sequence of moves. State = (missionaries_left, cannibals_left, boat_side)."
  },
  numberPuzzle: {
    time: "O(b^d) with heuristic",
    space: "O(b^d)",
    stable: true,
    description: "Uses A* search with Manhattan distance heuristic. Explores states with lowest f(n) = g(n) + h(n) where g=cost so far, h=estimated cost to goal."
  },
  vacuumCleaner: {
    time: "O(N²) for N×N grid",
    space: "O(N²)",
    stable: true,
    description: "Simple reflex agent: perceive environment, if dirty then suck, else move. Model-based agents maintain internal state. Demonstrates agent-environment interaction."
  },
  alphaBeta: {
    time: "O(b^(d/2)) best case vs O(b^d) minimax",
    space: "O(d)",
    stable: true,
    description: "Optimized minimax using alpha-beta pruning. Prunes branches that cannot influence final decision. Alpha tracks best maximizer score, beta tracks best minimizer score."
  },
  hillClimbing: {
    time: "O(∞) worst case, varies",
    space: "O(1)",
    stable: false,
    description: "Greedy local search. Always moves to best neighbor. Fast but can get stuck in local maxima. No backtracking. Used when solution quality matters less than speed."
  },
  simulatedAnnealing: {
    time: "O(∞) probabilistic",
    space: "O(1)",
    stable: false,
    description: "Probabilistic hill climbing. Accepts worse solutions with probability e^(-ΔE/T). Temperature T decreases over time. Can escape local maxima but not guaranteed to find global optimum."
  },
  mapColoring: {
    time: "O(d^n) where d=colors, n=regions",
    space: "O(n)",
    stable: true,
    description: "Classic CSP solved with backtracking. Uses constraint propagation and forward checking. Applications: scheduling, register allocation, frequency assignment."
  },
  geneticAlgorithm: {
    time: "O(g × p × f) g=generations, p=population, f=fitness eval",
    space: "O(p)",
    stable: false,
    description: "Evolutionary algorithm mimicking natural selection. Population evolves through selection, crossover, and mutation. Good for optimization problems with large search spaces."
  }
}
