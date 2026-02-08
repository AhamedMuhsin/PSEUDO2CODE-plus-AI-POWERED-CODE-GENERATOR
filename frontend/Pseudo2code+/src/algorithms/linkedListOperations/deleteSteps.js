export function generateDeleteSteps(list, position) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      highlight: [],
      currentIndex: -1,
      activeLine: 0,
      explanation: "List is empty. Cannot delete from an empty list."
    })
    return steps
  }

  const validPosition = Math.max(0, Math.min(position, list.length - 1))

  // Step 0: Initialize
  steps.push({
    list: [...list],
    highlight: [],
    currentIndex: -1,
    activeLine: 0,
    explanation: `Initialize linked list with ${list.length} node(s). Delete node at position ${validPosition}.`
  })

  if (validPosition === 0) {
    // Delete from beginning
    steps.push({
      list: [...list],
      highlight: [0],
      currentIndex: 0,
      activeLine: 1,
      explanation: `Position is 0 (beginning). Mark node at position 0 (value: ${list[0]}) for deletion.`
    })

    steps.push({
      list: [...list],
      highlight: [0],
      currentIndex: 0,
      activeLine: 2,
      explanation: `Update head pointer to point to the next node.`
    })

    const newList = list.slice(1)
    steps.push({
      list: newList,
      highlight: [],
      currentIndex: -1,
      activeLine: 3,
      explanation: `Node deleted successfully. New head points to node at position 0 (value: ${newList.length > 0 ? newList[0] : 'N/A'}).`
    })
  } else {
    // Delete from middle or end
    steps.push({
      list: [...list],
      highlight: [],
      currentIndex: -1,
      activeLine: 1,
      explanation: `Position is ${validPosition}. Traverse to find the node before deletion point.`
    })

    // Show traversal
    for (let i = 0; i < validPosition - 1; i++) {
      steps.push({
        list: [...list],
        highlight: [i],
        currentIndex: i,
        activeLine: 2,
        explanation: `Traversing... Currently at node ${i} (value: ${list[i]}). Moving to next node.`
      })
    }

    steps.push({
      list: [...list],
      highlight: [validPosition - 1, validPosition],
      currentIndex: validPosition,
      activeLine: 3,
      explanation: `Reached node before deletion point. Mark node ${validPosition} (value: ${list[validPosition]}) for deletion.`
    })

    steps.push({
      list: [...list],
      highlight: [validPosition - 1],
      currentIndex: validPosition - 1,
      activeLine: 4,
      explanation: `Update pointer: Node ${validPosition - 1} now points to node ${validPosition + 1 < list.length ? validPosition + 1 : 'NULL'}.`
    })

    const newList = [
      ...list.slice(0, validPosition),
      ...list.slice(validPosition + 1)
    ]

    steps.push({
      list: newList,
      highlight: [],
      currentIndex: -1,
      activeLine: 5,
      explanation: `Node deleted successfully. List now contains ${newList.length} node(s).`
    })
  }

  return steps
}
