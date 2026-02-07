export function generatePeekSteps(stack) {
  const steps = []

  if (stack.length === 0) {
    steps.push({
      stack: [],
      highlight: [],
      topIndex: -1,
      activeLine: 0,
      explanation: "Stack is empty. Cannot peek an empty stack."
    })
    return steps
  }

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length - 1,
    activeLine: 0,
    explanation: `Initialize stack with ${stack.length} element(s). We need to peek at the top element.`
  })

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length - 1,
    activeLine: 1,
    explanation: `Check if stack is empty. Stack is not empty (size: ${stack.length}).`
  })

  steps.push({
    stack: [...stack],
    highlight: [stack.length - 1],
    topIndex: stack.length - 1,
    activeLine: 2,
    explanation: `Access the top element: ${stack[stack.length - 1]}. Remember: peek does NOT remove the element.`
  })

  steps.push({
    stack: [...stack],
    highlight: [stack.length - 1],
    topIndex: stack.length - 1,
    activeLine: 3,
    explanation: `Return the top element ${stack[stack.length - 1]}. Peek operation completed successfully.`
  })

  return steps
}
