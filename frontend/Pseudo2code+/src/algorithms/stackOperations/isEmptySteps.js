export function generateIsEmptySteps(stack) {
  const steps = []

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length > 0 ? stack.length - 1 : -1,
    activeLine: 0,
    explanation: `Initialize. Stack has ${stack.length} element(s). We need to check if it is empty.`
  })

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length > 0 ? stack.length - 1 : -1,
    activeLine: 1,
    explanation: `Check if top pointer is at -1 (indicating empty stack) or if size is 0.`
  })

  const isEmpty = stack.length === 0
  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length > 0 ? stack.length - 1 : -1,
    activeLine: 2,
    explanation: `Result: Stack is ${isEmpty ? "EMPTY" : "NOT EMPTY"}. Return ${isEmpty ? "true" : "false"}.`
  })

  return steps
}
