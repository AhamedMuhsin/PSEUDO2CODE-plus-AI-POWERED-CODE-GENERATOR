export function generateSearchSteps(list, value) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      highlight: [],
      currentIndex: -1,
      activeLine: 0,
      explanation: "List is empty. Cannot search in an empty list."
    })
    return steps
  }

  // Step 0: Initialize
  steps.push({
    list: [...list],
    highlight: [],
    currentIndex: -1,
    activeLine: 0,
    explanation: `Initialize search for value ${value} in linked list with ${list.length} node(s).`
  })

  // Step 1: Start traversal
  steps.push({
    list: [...list],
    highlight: [],
    currentIndex: -1,
    activeLine: 1,
    explanation: `Start traversal from head. Current node: ${list[0]}`
  })

  // Find position
  let foundPosition = -1
  for (let i = 0; i < list.length; i++) {
    const isFound = list[i] === value

    steps.push({
      list: [...list],
      highlight: [i],
      currentIndex: i,
      activeLine: 2,
      explanation: `Checking node ${i} (value: ${list[i]}). ${
        isFound ? `✓ Found! Value matches.` : `Not a match. Continue to next node.`
      }`
    })

    if (isFound) {
      foundPosition = i
      break
    }
  }

  if (foundPosition !== -1) {
    steps.push({
      list: [...list],
      highlight: [foundPosition],
      currentIndex: foundPosition,
      activeLine: 3,
      explanation: `Search completed. Value ${value} found at position ${foundPosition}.`
    })
  } else {
    steps.push({
      list: [...list],
      highlight: [],
      currentIndex: -1,
      activeLine: 3,
      explanation: `Search completed. Value ${value} not found in the list.`
    })
  }

  return steps
}
