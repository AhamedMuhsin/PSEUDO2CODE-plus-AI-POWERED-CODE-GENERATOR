export function hillClimbingSteps() {
  const steps = []
  
  // Objective function: maximize f(x) = -(x-5)^2 + 25 (peak at x=5)
  const objectiveFunction = (x) => {
    return -((x - 5) ** 2) + 25
  }

  let currentState = Math.floor(Math.random() * 10) // Start random 0-9
  let currentValue = objectiveFunction(currentState)
  const stateHistory = []

  steps.push({
    currentState,
    currentValue: currentValue.toFixed(2),
    neighbors: [],
    activePseudoLine: 1,
    explanation: `Starting Hill Climbing at state ${currentState}. Value: ${currentValue.toFixed(2)}`,
    stateHistory: [...stateHistory],
    status: 'start'
  })

  let iterations = 0
  const maxIterations = 20

  while (iterations < maxIterations) {
    iterations++
    stateHistory.push({ state: currentState, value: currentValue })

    // Generate neighbors (left and right)
    const neighbors = []
    if (currentState > 0) {
      neighbors.push({
        state: currentState - 1,
        value: objectiveFunction(currentState - 1)
      })
    }
    if (currentState < 10) {
      neighbors.push({
        state: currentState + 1,
        value: objectiveFunction(currentState + 1)
      })
    }

    steps.push({
      currentState,
      currentValue: currentValue.toFixed(2),
      neighbors: neighbors.map(n => ({ ...n, value: n.value.toFixed(2) })),
      activePseudoLine: 3,
      explanation: `Exploring neighbors of state ${currentState}. Checking better options...`,
      stateHistory: [...stateHistory],
      status: 'exploring'
    })

    // Find best neighbor
    let bestNeighbor = null
    for (const neighbor of neighbors) {
      if (!bestNeighbor || neighbor.value > bestNeighbor.value) {
        bestNeighbor = neighbor
      }
    }

    if (!bestNeighbor || bestNeighbor.value <= currentValue) {
      steps.push({
        currentState,
        currentValue: currentValue.toFixed(2),
        neighbors: neighbors.map(n => ({ ...n, value: n.value.toFixed(2) })),
        activePseudoLine: 8,
        explanation: `🏔️ Local maximum found at state ${currentState} with value ${currentValue.toFixed(2)}`,
        stateHistory: [...stateHistory],
        status: 'local_max'
      })
      break
    }

    steps.push({
      currentState,
      currentValue: currentValue.toFixed(2),
      neighbors: neighbors.map(n => ({ ...n, value: n.value.toFixed(2) })),
      bestNeighbor: { state: bestNeighbor.state, value: bestNeighbor.value.toFixed(2) },
      activePseudoLine: 6,
      explanation: `Moving from ${currentState} to ${bestNeighbor.state}. Value: ${currentValue.toFixed(2)} → ${bestNeighbor.value.toFixed(2)} ⬆️`,
      stateHistory: [...stateHistory],
      status: 'climbing'
    })

    currentState = bestNeighbor.state
    currentValue = bestNeighbor.value
  }

  const globalOptimum = 5
  const isGlobalMax = currentState === globalOptimum

  steps.push({
    currentState,
    currentValue: currentValue.toFixed(2),
    neighbors: [],
    activePseudoLine: 10,
    explanation: isGlobalMax 
      ? `✅ Global maximum reached! State ${currentState}, Value: ${currentValue.toFixed(2)}`
      : `⚠️ Stuck at local maximum. State ${currentState}, Value: ${currentValue.toFixed(2)} (Global optimum is at ${globalOptimum})`,
    stateHistory: [...stateHistory],
    status: isGlobalMax ? 'success' : 'stuck'
  })

  return steps
}
