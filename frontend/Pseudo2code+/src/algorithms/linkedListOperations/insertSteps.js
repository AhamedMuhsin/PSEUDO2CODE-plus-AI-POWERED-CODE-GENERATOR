export function generateInsertSteps(list, position, value) {
  const steps = []
  
  // Ensure position is valid
  const validPosition = Math.max(0, Math.min(position, list.length))

  // Step 0: Initialize
  steps.push({
    list: [...list],
    highlight: [],
    currentIndex: -1,
    activeLine: 0,
    explanation: `Initialize linked list with ${list.length} node(s). We need to insert value ${value} at position ${validPosition}.`
  })

  // Step 1: Check if list is empty or insert at beginning
  if (validPosition === 0) {
    steps.push({
      list: [...list],
      highlight: [],
      currentIndex: -1,
      activeLine: 1,
      explanation: `Position is 0 (beginning). Create new node with value ${value}.`
    })

    const newList = [value, ...list]
    steps.push({
      list: newList,
      highlight: [0],
      currentIndex: 0,
      activeLine: 2,
      explanation: `Insert new node at the beginning. Head pointer updated to point to the new node.`
    })

    steps.push({
      list: newList,
      highlight: [0],
      currentIndex: 0,
      activeLine: 3,
      explanation: `Insert operation completed. New node inserted at position 0.`
    })
  } else {
    // Step 2: Traverse to find insertion position
    steps.push({
      list: [...list],
      highlight: [],
      currentIndex: -1,
      activeLine: 1,
      explanation: `Position is ${validPosition}. Traverse to find the node before insertion point.`
    })

    // Show traversal progress
    for (let i = 0; i < validPosition - 1; i++) {
      steps.push({
        list: [...list],
        highlight: [i],
        currentIndex: i,
        activeLine: 2,
        explanation: `Traversing... Currently at node ${i} (value: ${list[i]}). Moving to next node.`
      })
    }

    // Step 3: Create new node
    steps.push({
      list: [...list],
      highlight: [validPosition - 1],
      currentIndex: validPosition - 1,
      activeLine: 3,
      explanation: `Reached node ${validPosition - 1}. Create new node with value ${value}.`
    })

    // Step 4: Insert node
    const newList = [
      ...list.slice(0, validPosition),
      value,
      ...list.slice(validPosition)
    ]

    steps.push({
      list: newList,
      highlight: [validPosition],
      currentIndex: validPosition,
      activeLine: 4,
      explanation: `Insert new node at position ${validPosition}. Update pointers to maintain list integrity.`
    })

    steps.push({
      list: newList,
      highlight: [validPosition],
      currentIndex: validPosition,
      activeLine: 5,
      explanation: `Insert operation completed. Node inserted successfully at position ${validPosition}.`
    })
  }

  return steps
}
