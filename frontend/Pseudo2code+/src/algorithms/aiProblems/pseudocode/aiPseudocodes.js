export const nQueensPseudo = `function solveNQueens(col, n):
  if col >= n:
    return true  // All queens placed
  
  for row from 0 to n-1:
    if isSafe(row, col):
      placeQueen(row, col)
      
      if solveNQueens(col+1, n):
        return true
      
      removeQueen(row, col)  // Backtrack
  
  return false

function isSafe(row, col):
  // Check row, diagonals for conflicts
  for each previous column:
    if queen in same row or diagonal:
      return false
  return true`

export const towerOfHanoiPseudo = `function hanoi(n, source, destination, auxiliary):
  if n == 1:
    move disk from source to destination
    return
  
  hanoi(n-1, source, auxiliary, destination)
  move disk n from source to destination
  hanoi(n-1, auxiliary, destination, source)

// Time: O(2^n)
// Minimum moves = 2^n - 1`

export const waterJugPseudo = `function waterJug(jug1Cap, jug2Cap, target):
  queue = [(0, 0)]
  visited = set()
  
  while queue not empty:
    (j1, j2) = dequeue()
    
    if j1 == target or j2 == target:
      return solution found
    
    if (j1, j2) in visited:
      continue
    
    add (j1, j2) to visited
    
    // Try all 6 operations:
    // Fill, Empty, Pour between jugs
    for each operation:
      enqueue new state
  
  return no solution`

export const minimaxPseudo = `function minimax(node, depth, isMaximizing):
  if node is terminal:
    return evaluate(node)
  
  if isMaximizing:
    maxScore = -Infinity
    for each child of node:
      score = minimax(child, depth+1, false)
      maxScore = max(maxScore, score)
    return maxScore
  
  else:  // Minimizing
    minScore = Infinity
    for each child of node:
      score = minimax(child, depth+1, true)
      minScore = min(minScore, score)
    return minScore`

export const missionariesCannibalsPseudo = `function missionariesCannibals():
  queue = [(3, 3, 'left', [])]
  visited = set()
  
  while queue not empty:
    (mLeft, cLeft, boat, path) = dequeue()
    
    if mLeft == 0 and cLeft == 0:
      return path  // Success
    
    if state in visited:
      continue
    
    for each valid move:
      if isValidState(newState):
        enqueue newState
  
  return no solution`

export const numberPuzzlePseudo = `function solvePuzzle(start, goal):
  openSet = [start]
  closedSet = set()
  
  while openSet not empty:
    current = node with lowest f(n)
    
    if current == goal:
      return reconstructPath()
    
    add current to closedSet
    
    for each neighbor of current:
      if neighbor in closedSet:
        continue
      
      g = cost from start
      h = manhattan(neighbor, goal)
      f = g + h
      
      add neighbor to openSet
  
  return no solution`

export const vacuumCleanerPseudo = `function vacuumAgent(percept):
  if percept.location is dirty:
    return SUCK
  
  if percept.location == A:
    return MOVE_RIGHT
  else:
    return MOVE_LEFT

// Model-based agent
function modelBasedAgent(percept):
  updateState(state, action, percept)
  
  if currentLocation is dirty:
    return SUCK
  
  if allClean(model):
    return NO_OP
  
  return chooseNextMove(model)`

export const alphaBetaPseudo = `function alphaBeta(node, depth, α, β, isMax):
  if node is terminal:
    return evaluate(node)
  
  if isMax:
    maxScore = -∞
    for each child of node:
      score = alphaBeta(child, depth+1, α, β, false)
      maxScore = max(maxScore, score)
      α = max(α, score)
      if β ≤ α:
        break  // β cutoff - prune!
    return maxScore
  
  else:
    minScore = ∞
    for each child of node:
      score = alphaBeta(child, depth+1, α, β, true)
      minScore = min(minScore, score)
      β = min(β, score)
      if β ≤ α:
        break  // α cutoff - prune!
    return minScore`

export const hillClimbingPseudo = `function hillClimbing(problem):
  current = makeInitialState(problem)
  
  loop:
    neighbors = getNeighbors(current)
    nextEval = -∞
    next = null
    
    for each neighbor in neighbors:
      if value(neighbor) > nextEval:
        next = neighbor
        nextEval = value(neighbor)
    
    if nextEval ≤ value(current):
      return current  // Local maximum
    
    current = next`

export const simulatedAnnealingPseudo = `function simulatedAnnealing(problem):
  current = makeInitialState(problem)
  T = initialTemperature
  
  while T > minTemp:
    next = randomNeighbor(current)
    ΔE = value(next) - value(current)
    
    if ΔE > 0:
      current = next  // Better solution
    else:
      probability = e^(ΔE / T)
      if random() < probability:
        current = next  // Accept worse
    
    T = T × coolingRate
  
  return current`

export const mapColoringPseudo = `function mapColoring(regions, colors):
  assignments = {}
  
  function backtrack(region):
    if all regions assigned:
      return true
    
    for each color in colors:
      if isConsistent(region, color):
        assign color to region
        
        if backtrack(nextRegion):
          return true
        
        remove color from region
    
    return false
  
  return backtrack(firstRegion)

function isConsistent(region, color):
  for each neighbor of region:
    if neighbor.color == color:
      return false
  return true`

export const geneticAlgorithmPseudo = `function geneticAlgorithm(popSize, generations):
  population = initializePopulation(popSize)
  
  for gen = 1 to generations:
    fitness = evaluate(population)
    
    if maxFitness == target:
      return bestIndividual
    
    parents = selection(population, fitness)
    offspring = crossover(parents)
    offspring = mutate(offspring)
    
    population = nextGeneration(offspring)
  
  return bestIndividual

function crossover(parent1, parent2):
  point = random(0, length)
  child1 = parent1[0:point] + parent2[point:]
  child2 = parent2[0:point] + parent1[point:]
  return [child1, child2]

function mutate(chromosome):
  for each gene in chromosome:
    if random() < mutationRate:
      flip gene
  return chromosome`

