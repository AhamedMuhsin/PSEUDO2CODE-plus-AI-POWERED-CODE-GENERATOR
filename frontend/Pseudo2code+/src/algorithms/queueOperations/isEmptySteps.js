export function isEmptySteps(initialQueue) {
  const queue = [...initialQueue]
  const steps = []

  // Step 1: Initial check
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: -1,
    backIndex: -1,
    activeLine: 0,
    explanation: "Check if queue is empty by comparing size to 0"
  })

  // Step 2: Get size
  const size = queue.length
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: -1,
    backIndex: -1,
    activeLine: 1,
    explanation: `Queue size: ${size}`
  })

  // Step 3: Compare with 0
  const isEmpty = size === 0
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: -1,
    backIndex: -1,
    activeLine: 2,
    explanation: `${size} === 0? Result: ${isEmpty}`
  })

  // Step 4: Complete
  steps.push({
    queue: [...queue],
    highlight: [],
    frontIndex: -1,
    backIndex: -1,
    activeLine: 3,
    explanation: `isEmpty() returns ${isEmpty}`
  })

  return steps
}
