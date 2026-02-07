export function generatePushSteps(stack, value) {
  const steps = []

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length - 1,
    activeLine: 0,
    explanation: `Initialize stack with ${stack.length} element(s). We need to push ${value}.`
  })

  steps.push({
    stack: [...stack],
    highlight: [],
    topIndex: stack.length - 1,
    activeLine: 1,
    explanation: `Check available space in stack. Space is available.`
  })

  const newStack = [...stack, value]
  steps.push({
    stack: newStack,
    highlight: [newStack.length - 1],
    topIndex: newStack.length - 1,
    activeLine: 2,
    explanation: `Add element ${value} to the top of the stack at position ${newStack.length - 1}.`
  })

  steps.push({
    stack: newStack,
    highlight: [newStack.length - 1],
    topIndex: newStack.length - 1,
    activeLine: 3,
    explanation: `Push operation completed successfully. Stack now contains ${newStack.length} element(s).`
  })

  return steps
}
