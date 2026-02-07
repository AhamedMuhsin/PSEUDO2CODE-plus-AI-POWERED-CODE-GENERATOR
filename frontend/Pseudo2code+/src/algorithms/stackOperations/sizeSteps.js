export function generateSizeSteps(stack) {
  const steps = []

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length > 0 ? stack.length - 1 : -1,
    activeLine: 0,
    explanation: `Initialize. Stack has ${stack.length} element(s). We need to get the size.`
  })

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length > 0 ? stack.length - 1 : -1,
    activeLine: 1,
    explanation: `Count total number of elements currently in the stack.`
  })

  steps.push({
    stack: [...stack],
    highlight: Array.from({ length: stack.length }, (_, i) => i),
    topIndex: stack.length > 0 ? stack.length - 1 : -1,
    activeLine: 2,
    explanation: `All elements counted: Stack size is ${stack.length}.`
  })

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length > 0 ? stack.length - 1 : -1,
    activeLine: 3,
    explanation: `Return the size value: ${stack.length}. Size operation completed successfully.`
  })

  return steps
}
