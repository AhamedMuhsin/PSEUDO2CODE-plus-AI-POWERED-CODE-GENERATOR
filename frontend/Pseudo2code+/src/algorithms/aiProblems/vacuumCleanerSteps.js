export function vacuumCleanerSteps(gridSize = 2) {
  const steps = []
  const grid = []
  
  // Initialize grid (0 = clean, 1 = dirty)
  for (let i = 0; i < gridSize; i++) {
    grid[i] = []
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = Math.random() > 0.5 ? 1 : 0
    }
  }

  let agentPos = { row: 0, col: 0 }
  let totalMoves = 0
  let totalCleans = 0

  steps.push({
    grid: JSON.parse(JSON.stringify(grid)),
    agentPos: { ...agentPos },
    activePseudoLine: 1,
    explanation: `Starting Vacuum Cleaner Agent. Grid ${gridSize}×${gridSize}. 1 = Dirty, 0 = Clean`,
    action: 'start',
    totalMoves,
    totalCleans,
    status: 'start'
  })

  // Simple reflex agent - clean current, move systematically
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      agentPos = { row: i, col: j }

      steps.push({
        grid: JSON.parse(JSON.stringify(grid)),
        agentPos: { ...agentPos },
        activePseudoLine: 2,
        explanation: `Agent at position (${i}, ${j}). Perceiving environment...`,
        action: 'perceive',
        totalMoves,
        totalCleans,
        status: 'perceiving'
      })

      if (grid[i][j] === 1) {
        grid[i][j] = 0
        totalCleans++

        steps.push({
          grid: JSON.parse(JSON.stringify(grid)),
          agentPos: { ...agentPos },
          activePseudoLine: 4,
          explanation: `Position is dirty! Action: SUCK. Cleaned cell (${i}, ${j})`,
          action: 'suck',
          totalMoves,
          totalCleans,
          status: 'cleaning'
        })
      } else {
        steps.push({
          grid: JSON.parse(JSON.stringify(grid)),
          agentPos: { ...agentPos },
          activePseudoLine: 3,
          explanation: `Position is clean. No action needed.`,
          action: 'no_action',
          totalMoves,
          totalCleans,
          status: 'checking'
        })
      }

      // Move to next cell
      if (i < gridSize - 1 || j < gridSize - 1) {
        totalMoves++
        const nextRow = j === gridSize - 1 ? i + 1 : i
        const nextCol = j === gridSize - 1 ? 0 : j + 1

        steps.push({
          grid: JSON.parse(JSON.stringify(grid)),
          agentPos: { ...agentPos },
          activePseudoLine: 6,
          explanation: `Moving to next position (${nextRow}, ${nextCol})...`,
          action: 'move',
          totalMoves,
          totalCleans,
          status: 'moving'
        })
      }
    }
  }

  steps.push({
    grid: JSON.parse(JSON.stringify(grid)),
    agentPos: { ...agentPos },
    activePseudoLine: 8,
    explanation: `✅ All cells checked! Total moves: ${totalMoves}, Total cleans: ${totalCleans}`,
    action: 'complete',
    totalMoves,
    totalCleans,
    status: 'success'
  })

  return steps
}
