export function sizeSteps(initialQueue) {
  const queue = [...initialQueue]
  const steps = []

  // Step 1: Initialize counter
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length > 0 ? queue.length - 1 : -1,
    activeLine: 0,
    explanation: "Initialize counter to count queue elements"
  })

  // Step 2: Iterate through queue
  steps.push({
    queue: [...queue],
    highlight: queue.map((_, i) => i),
    frontIndex: 0,
    backIndex: queue.length > 0 ? queue.length - 1 : -1,
    activeLine: 1,
    explanation: `Iterate through all ${queue.length} elements`
  })

  // Step 3: Count elements
  const size = queue.length
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length > 0 ? queue.length - 1 : -1,
    activeLine: 2,
    explanation: `Total count: ${size}`
  })

  // Step 4: Return size
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length > 0 ? queue.length - 1 : -1,
    activeLine: 3,
    explanation: `size() returns ${size}`
  })

  return steps
}
