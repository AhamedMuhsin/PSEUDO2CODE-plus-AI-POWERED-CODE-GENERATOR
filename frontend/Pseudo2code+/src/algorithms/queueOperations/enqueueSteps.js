export function enqueueSteps(initialQueue, params) {
  const queue = [...initialQueue]
  const value = params?.value || 5
  const steps = []

  // Step 1: Initial state
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 0,
    explanation: `Enqueue operation will add value ${value} to the back of the queue`
  })

  // Step 2: Check if queue exists
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 1,
    explanation: "Initialize new node with the value"
  })

  // Step 3: Add to back
  queue.push(value)
  steps.push({
    queue: [...queue],
    highlight: [queue.length - 1],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 2,
    explanation: `Value ${value} added to the back of the queue at index ${queue.length - 1}`
  })

  // Step 4: Complete
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 3,
    explanation: `Enqueue complete. Queue size is now ${queue.length}`
  })

  return steps
}
