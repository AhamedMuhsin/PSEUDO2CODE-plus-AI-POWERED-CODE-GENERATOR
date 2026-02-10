export function numberPuzzleSteps() {
  const steps = []
  
  // Starting configuration (solvable)
  const start = [
    [1, 2, 3],
    [4, 0, 5],
    [7, 8, 6]
  ]
  
  // Goal configuration
  const goal = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ]

  steps.push({
    board: JSON.parse(JSON.stringify(start)),
    goal: JSON.parse(JSON.stringify(goal)),
    activePseudoLine: 1,
    explanation: 'Starting 8-Puzzle. Use A* search with Manhattan distance heuristic. 0 = empty tile.',
    move: null,
    cost: 0,
    heuristic: calculateManhattan(start, goal),
    path: [],
    status: 'start'
  })

  function calculateManhattan(board, goalBoard) {
    let distance = 0
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const value = board[i][j]
        if (value !== 0) {
          // Find goal position
          for (let gi = 0; gi < 3; gi++) {
            for (let gj = 0; gj < 3; gj++) {
              if (goalBoard[gi][gj] === value) {
                distance += Math.abs(i - gi) + Math.abs(j - gj)
              }
            }
          }
        }
      }
    }
    return distance
  }

  function getKey(board) {
    return board.flat().join(',')
  }

  function findEmpty(board) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === 0) return [i, j]
      }
    }
    return null
  }

  function getNeighbors(board) {
    const neighbors = []
    const [row, col] = findEmpty(board)
    const directions = [
      [-1, 0, 'UP'],
      [1, 0, 'DOWN'],
      [0, -1, 'LEFT'],
      [0, 1, 'RIGHT']
    ]

    for (const [dr, dc, direction] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        const newBoard = board.map(r => [...r])
        newBoard[row][col] = newBoard[newRow][newCol]
        newBoard[newRow][newCol] = 0
        neighbors.push([newBoard, direction])
      }
    }

    return neighbors
  }

  function boardsEqual(b1, b2) {
    return getKey(b1) === getKey(b2)
  }

  // A* Search
  const openSet = [[start, 0, []]] // [board, cost, path]
  const visited = new Set()
  let iterations = 0
  const maxIterations = 30

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++
    
    // Sort by f(n) = g(n) + h(n)
    openSet.sort((a, b) => {
      const fA = a[1] + calculateManhattan(a[0], goal)
      const fB = b[1] + calculateManhattan(b[0], goal)
      return fA - fB
    })

    const [current, cost, path] = openSet.shift()
    const key = getKey(current)

    if (visited.has(key)) continue
    visited.add(key)

    const h = calculateManhattan(current, goal)
    
    steps.push({
      board: JSON.parse(JSON.stringify(current)),
      goal: JSON.parse(JSON.stringify(goal)),
      activePseudoLine: 3,
      explanation: `Exploring state (cost=${cost}, h=${h}, f=${cost + h})`,
      move: path[path.length - 1] || null,
      cost,
      heuristic: h,
      path: [...path],
      status: 'exploring'
    })

    if (boardsEqual(current, goal)) {
      steps.push({
        board: JSON.parse(JSON.stringify(current)),
        goal: JSON.parse(JSON.stringify(goal)),
        activePseudoLine: 10,
        explanation: `✅ Puzzle solved in ${path.length} moves!`,
        move: null,
        cost,
        heuristic: 0,
        path: [...path],
        status: 'success'
      })
      return steps
    }

    const neighbors = getNeighbors(current)
    for (const [neighbor, direction] of neighbors) {
      const neighborKey = getKey(neighbor)
      if (!visited.has(neighborKey)) {
        const newCost = cost + 1
        const newPath = [...path, direction]
        openSet.push([neighbor, newCost, newPath])

        const h = calculateManhattan(neighbor, goal)
        steps.push({
          board: JSON.parse(JSON.stringify(neighbor)),
          goal: JSON.parse(JSON.stringify(goal)),
          activePseudoLine: 6,
          explanation: `Generated: Move ${direction} (cost=${newCost}, h=${h}, f=${newCost + h})`,
          move: direction,
          cost: newCost,
          heuristic: h,
          path: newPath,
          status: 'generated'
        })
      }
    }
  }

  steps.push({
    board: JSON.parse(JSON.stringify(start)),
    goal: JSON.parse(JSON.stringify(goal)),
    activePseudoLine: 11,
    explanation: `Search completed (explored ${iterations} states)`,
    move: null,
    cost: 0,
    heuristic: 0,
    path: [],
    status: 'finished'
  })

  return steps
}
