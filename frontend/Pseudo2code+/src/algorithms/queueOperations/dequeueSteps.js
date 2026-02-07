export function dequeueSteps(initialQueue) {
  const queue = [...initialQueue]
  const steps = []

  // Step 1: Check if empty
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 0,
    explanation: queue.length === 0 ? "Queue is empty. Cannot dequeue" : "Check if queue is empty"
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

  // Step 2: Save front element
  const removedValue = queue[0]
  steps.push({
    queue: [...queue],
    highlight: [0],
    frontIndex: 0,
    backIndex: queue.length - 1,
    activeLine: 1,
    explanation: `Save front element: ${removedValue}`
  })

  // Step 3: Remove from front
  queue.shift()
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length > 0 ? queue.length - 1 : -1,
    activeLine: 2,
    explanation: `Remove ${removedValue} from front. New front is ${queue.length > 0 ? queue[0] : 'empty'}`
  })

  // Step 4: Complete
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: 0,
    backIndex: queue.length > 0 ? queue.length - 1 : -1,
    activeLine: 3,
    explanation: `Dequeued value: ${removedValue}. Queue size: ${queue.length}`
  })

  return steps
}
