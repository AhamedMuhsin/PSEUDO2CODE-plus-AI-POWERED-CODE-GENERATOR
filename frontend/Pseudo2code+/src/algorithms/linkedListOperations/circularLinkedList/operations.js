export function generateCircularTraverse(list) {
  const steps = []

  if (!list || list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: "List is empty. Nothing to traverse."
    })
    return steps
  }

  steps.push({
    list: [...list],
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Initialize traversal. Circular linked list with ${list.length} node(s).`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Start at head. Value: ${list[0]}.`
  })

  for (let i = 1; i < list.length; i++) {
    steps.push({
      list: [...list],
      activeNodeIndex: i,
      targetIndex: -1,
      activePseudoLine: 3,
      explanation: `Move to next node (index ${i}). Value: ${list[i]}.`
    })
  }

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 4,
    explanation: `Returned to head! Circular loop detected. Traversal complete.`
  })

  return steps
}

export function generateCircularInsertHead(list, value) {
  const steps = []

  steps.push({
    list: [...list],
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 0,
    explanation: `Initialize. Insert value ${value} at head.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Create new node with value ${value}.`
  })

  if (list.length === 0) {
    steps.push({
      list: [value],
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 2,
      explanation: `List is empty. New node's next points to itself (circular).`
    })
    return steps
  }

  const newList = [value, ...list]
  steps.push({
    list: newList,
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `New node's next points to current head.`
  })

  steps.push({
    list: newList,
    activeNodeIndex: newList.length - 1,
    targetIndex: 0,
    activePseudoLine: 3,
    explanation: `Last node's next updated to point to new head (circular).`
  })

  steps.push({
    list: newList,
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 4,
    explanation: `Head pointer updated. Circular structure maintained.`
  })

  return steps
}

export function generateCircularInsertTail(list, value) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: `List is empty. Insert ${value} at tail = insert at head.`
    })
    const newList = [value]
    steps.push({
      list: newList,
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 2,
      explanation: `New node created. Points to itself (circular).`
    })
    return steps
  }

  steps.push({
    list: [...list],
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 0,
    explanation: `Initialize. Insert value ${value} at tail.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 1,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Access last node. Value: ${list[list.length - 1]}.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 1,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Create new node with value ${value}.`
  })

  const newList = [...list, value]
  steps.push({
    list: newList,
    activeNodeIndex: list.length - 1,
    targetIndex: newList.length - 1,
    activePseudoLine: 3,
    explanation: `Old last node's next points to new node.`
  })

  steps.push({
    list: newList,
    activeNodeIndex: newList.length - 1,
    targetIndex: 0,
    activePseudoLine: 4,
    explanation: `New node's next points back to head. Circular complete.`
  })

  return steps
}

export function generateCircularInsertAtIndex(list, index, value) {
  const steps = []
  const validIndex = Math.max(0, Math.min(index, list.length))

  steps.push({
    list: [...list],
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 0,
    explanation: `Initialize. Insert value ${value} at index ${validIndex}.`
  })

  if (validIndex === 0) {
    return generateCircularInsertHead(list, value)
  }

  if (validIndex === list.length) {
    return generateCircularInsertTail(list, value)
  }

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex - 1,
    targetIndex: validIndex,
    activePseudoLine: 1,
    explanation: `Navigate to node before index ${validIndex}.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex - 1,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Create new node with value ${value}.`
  })

  const newList = [
    ...list.slice(0, validIndex),
    value,
    ...list.slice(validIndex)
  ]

  steps.push({
    list: newList,
    activeNodeIndex: validIndex,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `Insert new node. Update pointers.`
  })

  steps.push({
    list: newList,
    activeNodeIndex: validIndex,
    targetIndex: 0,
    activePseudoLine: 4,
    explanation: `Circular structure maintained. All pointers updated.`
  })

  return steps
}

export function generateCircularDeleteHead(list) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: "List is empty. Cannot delete."
    })
    return steps
  }

  if (list.length === 1) {
    steps.push({
      list: [...list],
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: `Only one node. Delete makes list empty.`
    })
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 1,
      explanation: `Head deleted. List is now empty.`
    })
    return steps
  }

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 0,
    explanation: `Initialize. Delete head node (value: ${list[0]}).`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: 1,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Get next node (new head). Value: ${list[1]}.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 1,
    targetIndex: 1,
    activePseudoLine: 2,
    explanation: `Update last node's next to point to new head.`
  })

  const newList = list.slice(1)
  steps.push({
    list: newList,
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `Head deleted. Circular structure maintained.`
  })

  return steps
}

export function generateCircularDeleteTail(list) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: "List is empty. Cannot delete."
    })
    return steps
  }

  if (list.length === 1) {
    steps.push({
      list: [...list],
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: `Only one node. Delete makes list empty.`
    })
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 1,
      explanation: `Tail deleted. List is now empty.`
    })
    return steps
  }

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 1,
    targetIndex: -1,
    activePseudoLine: 0,
    explanation: `Initialize. Delete tail node (value: ${list[list.length - 1]}).`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 2,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Access node before tail. Value: ${list[list.length - 2]}.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 2,
    targetIndex: 0,
    activePseudoLine: 2,
    explanation: `Update previous node's next to point to head.`
  })

  const newList = list.slice(0, -1)
  steps.push({
    list: newList,
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `Tail deleted. Circular structure maintained.`
  })

  return steps
}

export function generateCircularDeleteAtIndex(list, index) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: "List is empty. Cannot delete."
    })
    return steps
  }

  const validIndex = Math.max(0, Math.min(index, list.length - 1))

  if (validIndex === 0) {
    return generateCircularDeleteHead(list)
  }

  if (validIndex === list.length - 1) {
    return generateCircularDeleteTail(list)
  }

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex,
    targetIndex: -1,
    activePseudoLine: 0,
    explanation: `Initialize. Delete node at index ${validIndex} (value: ${list[validIndex]}).`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex - 1,
    targetIndex: validIndex + 1,
    activePseudoLine: 1,
    explanation: `Access previous and next nodes.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex - 1,
    targetIndex: validIndex + 1,
    activePseudoLine: 2,
    explanation: `Update previous node's next to point to next node.`
  })

  const newList = [
    ...list.slice(0, validIndex),
    ...list.slice(validIndex + 1)
  ]

  steps.push({
    list: newList,
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `Node deleted. Circular structure maintained.`
  })

  return steps
}

export function generateCircularSearch(list, value) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: `Search for ${value}. List is empty.`
    })
    return steps
  }

  steps.push({
    list: [...list],
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Initialize search for value ${value}. (Circular list - be careful with infinite loops)`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Start at head. Value: ${list[0]}.`
  })

  let found = false
  let foundIndex = -1

  for (let i = 0; i < list.length; i++) {
    if (list[i] === value) {
      steps.push({
        list: [...list],
        activeNodeIndex: i,
        targetIndex: i,
        activePseudoLine: 3,
        explanation: `Found! Value ${value} at index ${i}.`
      })
      found = true
      foundIndex = i
      break
    } else {
      steps.push({
        list: [...list],
        activeNodeIndex: i,
        targetIndex: -1,
        activePseudoLine: 3,
        explanation: `At index ${i} (value: ${list[i]}). Not a match. Continue...`
      })
    }
  }

  if (found) {
    steps.push({
      list: [...list],
      activeNodeIndex: foundIndex,
      targetIndex: foundIndex,
      activePseudoLine: 4,
      explanation: `Search successful! Found at index ${foundIndex}.`
    })
  } else {
    steps.push({
      list: [...list],
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 4,
      explanation: `Wrapped around to head. Value ${value} not found.`
    })
  }

  return steps
}
