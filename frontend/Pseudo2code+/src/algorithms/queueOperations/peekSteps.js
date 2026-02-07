export function peekSteps(initialQueue) {
  const queue = [...initialQueue]
  const steps = []

  // Step 1: Check if empty
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 0,
    explanation: queue.length === 0 ? "Queue is empty" : "Check if queue is empty"
  })

  if (queue.length === 0) {
    steps.push({
      queue: [...queue],
      highlight: [],
      frontIndex: -1,
      backIndex: -1,
      activeLine: 1,
      explanation: "Queue is empty. Return null"
    })
    return steps
  }

  // Step 2: Get front element
  const frontValue = queue[0]
  steps.push({
    queue: [...queue],
    highlight: [0],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 1,
    explanation: `Access front element: ${frontValue}`
  })

  // Step 3: Return front (no removal)
  steps.push({
    queue: [...queue],
    highlight: [0],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 2,
    explanation: `Front element is ${frontValue}. Queue unchanged`
  })

  // Step 4: Complete
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 3,
    explanation: `Peek complete. Front value: ${frontValue}`
  })

  return steps
}
