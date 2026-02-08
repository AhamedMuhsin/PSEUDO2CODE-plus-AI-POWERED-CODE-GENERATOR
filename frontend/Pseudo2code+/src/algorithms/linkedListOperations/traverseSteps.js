export function generateTraverseSteps(list) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      highlight: [],
      currentIndex: -1,
      activeLine: 0,
      explanation: "List is empty. Nothing to traverse."
    })
    return steps
  }

  // Step 0: Initialize
  steps.push({
    list: [...list],
    highlight: [],
    currentIndex: -1,
    activeLine: 0,
    explanation: `Initialize traversal of linked list with ${list.length} node(s).`
  })

  // Step 1: Start from head
  steps.push({
    list: [...list],
    highlight: [0],
    currentIndex: 0,
    activeLine: 1,
    explanation: `Start traversal from head node. Value: ${list[0]}`
  })

  // Traverse through each node
  for (let i = 1; i < list.length; i++) {
    steps.push({
      list: [...list],
      highlight: Array.from({ length: i + 1 }, (_, idx) => idx),
      currentIndex: i,
      activeLine: 2,
      explanation: `Move to next node. Visited nodes: ${Array.from({ length: i + 1 }, (_, idx) => list[idx]).join(' → ')} Current value: ${list[i]}`
    })
  }

  // Final step
  const allNodes = list.map((val) => val).join(' → ')
  steps.push({
    list: [...list],
    highlight: Array.from({ length: list.length }, (_, idx) => idx),
    currentIndex: list.length - 1,
    activeLine: 3,
    explanation: `Traversal completed. Full list: ${allNodes} → NULL`
  })

  return steps
}
