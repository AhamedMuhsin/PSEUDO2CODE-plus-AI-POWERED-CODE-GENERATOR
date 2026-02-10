export function geneticAlgorithmSteps() {
  const steps = []
  
  // Target: evolve binary string to all 1s
  const targetLength = 8
  const target = '11111111'
  const populationSize = 6
  const mutationRate = 0.1
  const generations = 15

  // Initialize population
  let population = []
  for (let i = 0; i < populationSize; i++) {
    let chromosome = ''
    for (let j = 0; j < targetLength; j++) {
      chromosome += Math.random() > 0.5 ? '1' : '0'
    }
    population.push(chromosome)
  }

  steps.push({
    population: [...population],
    generation: 0,
    activePseudoLine: 1,
    explanation: `Initialized population of ${populationSize} chromosomes. Target: ${target}`,
    fitness: population.map(c => calculateFitness(c)),
    bestChromosome: null,
    status: 'start'
  })

  function calculateFitness(chromosome) {
    let score = 0
    for (let i = 0; i < targetLength; i++) {
      if (chromosome[i] === target[i]) score++
    }
    return score
  }

  function selectParent(population, fitnessScores) {
    // Tournament selection
    const i1 = Math.floor(Math.random() * population.length)
    const i2 = Math.floor(Math.random() * population.length)
    return fitnessScores[i1] > fitnessScores[i2] ? population[i1] : population[i2]
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
    const bestIndex = fitnessScores.indexOf(bestFitness)
    const bestChromosome = population[bestIndex]

    steps.push({
      population: [...population],
      generation: gen,
      activePseudoLine: 3,
      explanation: `Generation ${gen}: Evaluating fitness. Best fitness: ${bestFitness}/${targetLength}`,
      fitness: [...fitnessScores],
      bestChromosome,
      status: 'evaluating'
    })

    if (bestFitness === targetLength) {
      steps.push({
        population: [...population],
        generation: gen,
        activePseudoLine: 12,
        explanation: `✅ Target reached! Chromosome ${bestChromosome} matches ${target}`,
        fitness: [...fitnessScores],
        bestChromosome,
        status: 'success'
      })
      break
    }

    // Selection
    steps.push({
      population: [...population],
      generation: gen,
      activePseudoLine: 5,
      explanation: `Selecting parents based on fitness (tournament selection)...`,
      fitness: [...fitnessScores],
      bestChromosome,
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
        population: [...population],
        generation: gen,
        activePseudoLine: 7,
        explanation: `Crossover: ${parent1} + ${parent2}`,
        fitness: [...fitnessScores],
        bestChromosome,
        parents: [parent1, parent2],
        status: 'crossover'
      })

      const [child1, child2] = crossover(parent1, parent2)

      const mutatedChild1 = mutate(child1)
      const mutatedChild2 = mutate(child2)

      if (mutatedChild1 !== child1 || mutatedChild2 !== child2) {
        steps.push({
          population: [...population],
          generation: gen,
          activePseudoLine: 9,
          explanation: `Mutation applied! ${child1} → ${mutatedChild1}`,
          fitness: [...fitnessScores],
          bestChromosome,
          status: 'mutation'
        })
      }

      newPopulation.push(mutatedChild1)
      if (newPopulation.length < populationSize) {
        newPopulation.push(mutatedChild2)
      }
    }

    population = newPopulation.slice(0, populationSize)

    steps.push({
      population: [...population],
      generation: gen,
      activePseudoLine: 11,
      explanation: `New generation created. Population evolved.`,
      fitness: population.map(c => calculateFitness(c)),
      bestChromosome,
      status: 'new_generation'
    })
  }

  return steps
}
