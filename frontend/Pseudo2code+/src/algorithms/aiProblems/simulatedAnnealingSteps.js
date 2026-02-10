export function simulatedAnnealingSteps() {
  const steps = []
  
  // Objective: minimize f(x) = x^2 - 10x + 25 (minimum at x=5)
  const objectiveFunction = (x) => {
    return (x - 5) ** 2 // Energy to minimize
  }

  let currentState = Math.floor(Math.random() * 10)
  let currentEnergy = objectiveFunction(currentState)
  let temperature = 100
  const coolingRate = 0.95
  const minTemperature = 0.01
  
  const history = []

  steps.push({
    currentState,
    currentEnergy: currentEnergy.toFixed(2),
    temperature: temperature.toFixed(2),
    activePseudoLine: 1,
    explanation: `Starting Simulated Annealing at state ${currentState}. Initial temperature: ${temperature.toFixed(2)}`,
    history: [...history],
    accepted: null,
    probability: null,
    status: 'start'
  })

  let iterations = 0
  const maxIterations = 30

  while (temperature > minTemperature && iterations < maxIterations) {
    iterations++

    // Generate random neighbor
    const neighbor = currentState + (Math.random() > 0.5 ? 1 : -1)
    const clampedNeighbor = Math.max(0, Math.min(10, neighbor))
    const neighborEnergy = objectiveFunction(clampedNeighbor)

    const deltaE = neighborEnergy - currentEnergy

    steps.push({
      currentState,
      neighborState: clampedNeighbor,
      currentEnergy: currentEnergy.toFixed(2),
      neighborEnergy: neighborEnergy.toFixed(2),
      deltaE: deltaE.toFixed(2),
      temperature: temperature.toFixed(2),
      activePseudoLine: 3,
      explanation: `Generated neighbor: ${clampedNeighbor}. ΔE = ${deltaE.toFixed(2)}`,
      history: [...history],
      accepted: null,
      probability: null,
      status: 'exploring'
    })

    let accepted = false
    let probability = 0

    if (deltaE < 0) {
      // Better solution - always accept
      accepted = true
      probability = 1.0

      steps.push({
        currentState,
        neighborState: clampedNeighbor,
        currentEnergy: currentEnergy.toFixed(2),
        neighborEnergy: neighborEnergy.toFixed(2),
        deltaE: deltaE.toFixed(2),
        temperature: temperature.toFixed(2),
        activePseudoLine: 5,
        explanation: `✓ Better solution! Moving ${currentState} → ${clampedNeighbor} (Energy: ${currentEnergy.toFixed(2)} → ${neighborEnergy.toFixed(2)})`,
        history: [...history],
        accepted: true,
        probability: probability.toFixed(3),
        status: 'accepted_better'
      })

      currentState = clampedNeighbor
      currentEnergy = neighborEnergy
    } else {
      // Worse solution - accept with probability
      probability = Math.exp(-deltaE / temperature)
      const random = Math.random()
      accepted = random < probability

      if (accepted) {
        steps.push({
          currentState,
          neighborState: clampedNeighbor,
          currentEnergy: currentEnergy.toFixed(2),
          neighborEnergy: neighborEnergy.toFixed(2),
          deltaE: deltaE.toFixed(2),
          temperature: temperature.toFixed(2),
          activePseudoLine: 7,
          explanation: `⚡ Worse solution accepted! P=${probability.toFixed(3)} (escaped local minimum)`,
          history: [...history],
          accepted: true,
          probability: probability.toFixed(3),
          status: 'accepted_worse'
        })

        currentState = clampedNeighbor
        currentEnergy = neighborEnergy
      } else {
        steps.push({
          currentState,
          neighborState: clampedNeighbor,
          currentEnergy: currentEnergy.toFixed(2),
          neighborEnergy: neighborEnergy.toFixed(2),
          deltaE: deltaE.toFixed(2),
          temperature: temperature.toFixed(2),
          activePseudoLine: 8,
          explanation: `✗ Worse solution rejected. P=${probability.toFixed(3)} < ${random.toFixed(3)}`,
          history: [...history],
          accepted: false,
          probability: probability.toFixed(3),
          status: 'rejected'
        })
      }
    }

    history.push({ 
      state: currentState, 
      energy: currentEnergy, 
      temperature,
      accepted 
    })

    // Cool down
    temperature *= coolingRate

    steps.push({
      currentState,
      currentEnergy: currentEnergy.toFixed(2),
      temperature: temperature.toFixed(2),
      activePseudoLine: 10,
      explanation: `🌡️ Temperature cooled: ${(temperature / coolingRate).toFixed(2)} → ${temperature.toFixed(2)}`,
      history: [...history],
      accepted: null,
      probability: null,
      status: 'cooling'
    })
  }

  steps.push({
    currentState,
    currentEnergy: currentEnergy.toFixed(2),
    temperature: temperature.toFixed(2),
    activePseudoLine: 12,
    explanation: `✅ Annealing complete! Final state: ${currentState}, Energy: ${currentEnergy.toFixed(2)}`,
    history: [...history],
    accepted: null,
    probability: null,
    status: 'success'
  })

  return steps
}
