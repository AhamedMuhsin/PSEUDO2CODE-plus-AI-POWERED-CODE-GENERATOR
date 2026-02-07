export function generatePopSteps(stack) {
  const steps = []

  if (stack.length === 0) {
    steps.push({
      stack: [],
      highlight: [],
      topIndex: -1,
      activeLine: 0,
      explanation: "Stack is empty. Cannot pop from an empty stack."
    })
    return steps
  }

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length - 1,
    activeLine: 0,
    explanation: `Initialize stack with ${stack.length} element(s). We need to pop the top element.`
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
    explanation: `Store the top element ${stack[stack.length - 1]} to return it.`
  })

  const newStack = stack.slice(0, -1)
  steps.push({
    stack: newStack,
    highlight: [],
    topIndex: newStack.length - 1,
    activeLine: 3,
    explanation: `Remove the top element from stack. Stack now contains ${newStack.length} element(s).`
  })

  steps.push({
    stack: newStack,
    highlight: [],
    topIndex: newStack.length - 1,
    activeLine: 4,
    explanation: `Return the popped element. Pop operation completed successfully.`
  })

  return steps
}
