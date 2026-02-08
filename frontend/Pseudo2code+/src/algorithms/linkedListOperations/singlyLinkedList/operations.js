export function generateSinglyTraverse(list) {
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
    explanation: `Initialize traversal. List has ${list.length} node(s).`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Start at head node. Value: ${list[0]}`
  })

  for (let i = 1; i < list.length; i++) {
    steps.push({
      list: [...list],
      activeNodeIndex: i,
      targetIndex: -1,
      activePseudoLine: 3,
      explanation: `Move to next node. Index ${i}, Value: ${list[i]}`
    })
  }

  steps.push({
    list: [...list],
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 4,
    explanation: `Reached end of list (NULL). Traversal complete.`
  })

  return steps
}

export function generateSinglyInsertHead(list, value) {
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

  const newList = [value, ...list]
  steps.push({
    list: newList,
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Set new node's next pointer to current head (node 0).`
  })

  steps.push({
    list: newList,
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `Update head to point to new node. Insert successful!`
  })

  return steps
}

export function generateSinglyInsertTail(list, value) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: `List is empty. Insert ${value} becomes new head.`
    })
    const newList = [value]
    steps.push({
      list: newList,
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 2,
      explanation: `New node created. Head now points to it.`
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
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Start at head. Traverse to find last node.`
  })

  for (let i = 0; i < list.length - 1; i++) {
    steps.push({
      list: [...list],
      activeNodeIndex: i,
      targetIndex: -1,
      activePseudoLine: 2,
      explanation: `At node ${i}. Next is not null, continue traversing.`
    })
  }

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 1,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Reached last node (index ${list.length - 1}). Next is NULL.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 1,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `Create new node with value ${value}.`
  })

  const newList = [...list, value]
  steps.push({
    list: newList,
    activeNodeIndex: newList.length - 1,
    targetIndex: -1,
    activePseudoLine: 4,
    explanation: `Link last node to new node. Insert at tail successful!`
  })

  return steps
}

export function generateSinglyInsertAtIndex(list, index, value) {
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
    steps.push({
      list: [...list],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 1,
      explanation: `Index is 0. Insert at head.`
    })
    const newList = [value, ...list]
    steps.push({
      list: newList,
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 2,
      explanation: `New node inserted at head.`
    })
    return steps
  }

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: validIndex,
    activePseudoLine: 1,
    explanation: `Start traversal. Need to reach node ${validIndex - 1}.`
  })

  for (let i = 0; i < validIndex - 1; i++) {
    steps.push({
      list: [...list],
      activeNodeIndex: i,
      targetIndex: validIndex,
      activePseudoLine: 2,
      explanation: `At node ${i}. Continue to node ${validIndex - 1}.`
    })
  }

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex - 1,
    targetIndex: validIndex,
    activePseudoLine: 3,
    explanation: `Reached node ${validIndex - 1}. Create new node.`
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
    activePseudoLine: 4,
    explanation: `New node inserted at index ${validIndex}. Pointers updated.`
  })

  return steps
}

export function generateSinglyDeleteHead(list) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: "List is empty. Cannot delete from empty list."
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
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Mark head node for deletion.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: 1,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Get next node as new head.`
  })

  const newList = list.slice(1)
  steps.push({
    list: newList,
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `Head deleted. New head is node with value ${newList.length > 0 ? newList[0] : 'NULL'}.`
  })

  return steps
}

export function generateSinglyDeleteTail(list) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: "List is empty. Cannot delete from empty list."
    })
    return steps
  }

  if (list.length === 1) {
    steps.push({
      list: [...list],
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: `Delete tail (only node, value: ${list[0]}).`
    })
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 1,
      explanation: `List is now empty.`
    })
    return steps
  }

  steps.push({
    list: [...list],
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 0,
    explanation: `Initialize. Delete tail node (value: ${list[list.length - 1]}).`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: list.length - 1,
    activePseudoLine: 1,
    explanation: `Start traversal to reach node before tail.`
  })

  for (let i = 0; i < list.length - 2; i++) {
    steps.push({
      list: [...list],
      activeNodeIndex: i,
      targetIndex: list.length - 1,
      activePseudoLine: 2,
      explanation: `At node ${i}. Moving to next...`
    })
  }

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 2,
    targetIndex: list.length - 1,
    activePseudoLine: 3,
    explanation: `Reached node before tail (index ${list.length - 2}).`
  })

  const newList = list.slice(0, -1)
  steps.push({
    list: newList,
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 4,
    explanation: `Tail deleted. New tail is node with value ${newList[newList.length - 1]}.`
  })

  return steps
}

export function generateSinglyDeleteAtIndex(list, index) {
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

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex,
    targetIndex: -1,
    activePseudoLine: 0,
    explanation: `Initialize. Delete node at index ${validIndex} (value: ${list[validIndex]}).`
  })

  if (validIndex === 0) {
    steps.push({
      list: [...list],
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 1,
      explanation: `Index is 0. Delete head.`
    })
    const newList = list.slice(1)
    steps.push({
      list: newList,
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 2,
      explanation: `Head deleted successfully.`
    })
    return steps
  }

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: validIndex,
    activePseudoLine: 1,
    explanation: `Traverse to find node before index ${validIndex}.`
  })

  for (let i = 0; i < validIndex - 1; i++) {
    steps.push({
      list: [...list],
      activeNodeIndex: i,
      targetIndex: validIndex,
      activePseudoLine: 2,
      explanation: `At node ${i}. Continue...`
    })
  }

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex - 1,
    targetIndex: validIndex,
    activePseudoLine: 3,
    explanation: `At node ${validIndex - 1}. Next node is target for deletion.`
  })

  const newList = [
    ...list.slice(0, validIndex),
    ...list.slice(validIndex + 1)
  ]

  steps.push({
    list: newList,
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 4,
    explanation: `Node deleted. Pointers updated.`
  })

  return steps
}

export function generateSinglySearch(list, value) {
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
    explanation: `Initialize search for value ${value}.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Start at head (value: ${list[0]}).`
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
      explanation: `Search successful! Value found at index ${foundIndex}.`
    })
  } else {
    steps.push({
      list: [...list],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 4,
      explanation: `Search complete. Value ${value} not found in list.`
    })
  }

  return steps
}
