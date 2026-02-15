export function geneticAlgorithmSteps() {
  const steps = []
  
  // Target: evolve binary string to all 1s
  const targetLength = 8
  const target = '11111111'
  const populationSize = 6
  const mutationRate = 0.1
  const generations = 15

  function calculateFitness(chromosome) {
    let score = 0
    for (let i = 0; i < targetLength; i++) {
      if (chromosome[i] === target[i]) score++
    }
    // Scale to 0-100
    return (score / targetLength) * 100
  }

  function toPopulationObjects(pop) {
    return pop.map(chrStr => ({
      chromosome: chrStr.split(''),
      fitness: calculateFitness(chrStr)
    }))
  }

  function getStats(pop) {
    const fitnesses = pop.map(c => calculateFitness(c))
    const best = Math.max(...fitnesses)
    const avg = fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length
    return { bestFitness: best, avgFitness: avg }
  }

  // Initialize population
  let population = []
  for (let i = 0; i < populationSize; i++) {
    let chromosome = ''
    for (let j = 0; j < targetLength; j++) {
      chromosome += Math.random() > 0.5 ? '1' : '0'
    }
    population.push(chromosome)
  }

  const initStats = getStats(population)
  steps.push({
    population: toPopulationObjects(population),
    generation: 0,
    activePseudoLine: 1,
    explanation: `Initialized population of ${populationSize} chromosomes. Target: ${target}`,
    bestFitness: initStats.bestFitness,
    avgFitness: initStats.avgFitness,
    status: 'start'
  })

  function selectParent(pop, fitnesses) {
    // Tournament selection
    const i1 = Math.floor(Math.random() * pop.length)
    const i2 = Math.floor(Math.random() * pop.length)
    return fitnesses[i1] > fitnesses[i2] ? pop[i1] : pop[i2]
  }

  function crossover(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * (targetLength - 1)) + 1
    const child1 = parent1.substring(0, crossoverPoint) + parent2.substring(crossoverPoint)
    const child2 = parent2.substring(0, crossoverPoint) + parent1.substring(crossoverPoint)
    return [child1, child2]
  }

  function mutate(chromosome) {
    let mutated = ''
    for (let i = 0; i < chromosome.length; i++) {
      if (Math.random() < mutationRate) {
        mutated += chromosome[i] === '0' ? '1' : '0'
      } else {
        mutated += chromosome[i]
      }
    }
    return mutated
  }

  for (let gen = 1; gen <= generations; gen++) {
    const fitnessScores = population.map(c => calculateFitness(c))
    const bestFitness = Math.max(...fitnessScores)
    const avgFitness = fitnessScores.reduce((a, b) => a + b, 0) / fitnessScores.length
    const bestIndex = fitnessScores.indexOf(bestFitness)
    const bestChromosome = population[bestIndex]

    steps.push({
      population: toPopulationObjects(population),
      generation: gen,
      activePseudoLine: 3,
      explanation: `Generation ${gen}: Evaluating fitness. Best: ${bestFitness.toFixed(1)}% | Avg: ${avgFitness.toFixed(1)}%`,
      bestFitness,
      avgFitness,
      status: 'evaluating'
    })

    if (bestFitness >= 100) {
      steps.push({
        population: toPopulationObjects(population),
        generation: gen,
        activePseudoLine: 12,
        explanation: `✅ Target reached! Chromosome ${bestChromosome} matches ${target}`,
        bestFitness,
        avgFitness,
        status: 'success'
      })
      break
    }

    // Selection
    steps.push({
      population: toPopulationObjects(population),
      generation: gen,
      activePseudoLine: 5,
      explanation: `Selecting parents based on fitness (tournament selection)...`,
      bestFitness,
      avgFitness,
      status: 'selection'
    })

    // Create new generation
    const newPopulation = []
    
    // Elitism - keep best
    newPopulation.push(bestChromosome)

    while (newPopulation.length < populationSize) {
      const parent1 = selectParent(population, fitnessScores)
      const parent2 = selectParent(population, fitnessScores)

      steps.push({
        population: toPopulationObjects(population),
        generation: gen,
        activePseudoLine: 7,
        explanation: `Crossover: ${parent1} × ${parent2}`,
        bestFitness,
        avgFitness,
        status: 'crossover'
      })

      const [child1, child2] = crossover(parent1, parent2)

      const mutatedChild1 = mutate(child1)
      const mutatedChild2 = mutate(child2)

      if (mutatedChild1 !== child1 || mutatedChild2 !== child2) {
        steps.push({
          population: toPopulationObjects(population),
          generation: gen,
          activePseudoLine: 9,
          explanation: `Mutation applied! ${child1} → ${mutatedChild1}`,
          bestFitness,
          avgFitness,
          status: 'mutation'
        })
      }

      newPopulation.push(mutatedChild1)
      if (newPopulation.length < populationSize) {
        newPopulation.push(mutatedChild2)
      }
    }

    population = newPopulation.slice(0, populationSize)
    const newStats = getStats(population)

    steps.push({
      population: toPopulationObjects(population),
      generation: gen,
      activePseudoLine: 11,
      explanation: `New generation created. Population evolved.`,
      bestFitness: newStats.bestFitness,
      avgFitness: newStats.avgFitness,
      status: 'new_generation'
    })
  }

  return steps
}
