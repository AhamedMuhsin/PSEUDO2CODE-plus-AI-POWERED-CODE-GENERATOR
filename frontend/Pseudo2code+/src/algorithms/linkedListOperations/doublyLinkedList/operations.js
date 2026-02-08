export function generateDoublyTraverse(list) {
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
    explanation: `Initialize traversal. Doubly linked list with ${list.length} node(s).`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Start at head. Value: ${list[0]} (prev: NULL).`
  })

  for (let i = 1; i < list.length; i++) {
    steps.push({
      list: [...list],
      activeNodeIndex: i,
      targetIndex: -1,
      activePseudoLine: 3,
      explanation: `Move to next node (index ${i}). Value: ${list[i]} (prev ↔ next).`
    })
  }

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 1,
    targetIndex: -1,
    activePseudoLine: 4,
    explanation: `Reached tail node. Next is NULL. Traversal complete.`
  })

  return steps
}

export function generateDoublyInsertHead(list, value) {
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
    explanation: `New node's next points to current head.`
  })

  steps.push({
    list: newList,
    activeNodeIndex: 1,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `If old head exists, set its prev to new node.`
  })

  steps.push({
    list: newList,
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 4,
    explanation: `Update head pointer. Bidirectional links established.`
  })

  return steps
}

export function generateDoublyInsertTail(list, value) {
  const steps = []

  if (list.length === 0) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 0,
      explanation: `List is empty. Insert ${value} becomes head and tail.`
    })
    const newList = [value]
    steps.push({
      list: newList,
      activeNodeIndex: 0,
      targetIndex: -1,
      activePseudoLine: 2,
      explanation: `New node created as both head and tail.`
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
    explanation: `Direct access to tail node. Value: ${list[list.length - 1]}.`
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
    explanation: `Old tail's next points to new node.`
  })

  steps.push({
    list: newList,
    activeNodeIndex: newList.length - 1,
    targetIndex: -1,
    activePseudoLine: 4,
    explanation: `New node's prev points to old tail. Update tail pointer.`
  })

  return steps
}

export function generateDoublyInsertAtIndex(list, index, value) {
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
    return generateDoublyInsertHead(list, value)
  }

  if (validIndex === list.length) {
    return generateDoublyInsertTail(list, value)
  }

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Find node at index ${validIndex}. Value: ${list[validIndex]}.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex - 1,
    targetIndex: validIndex,
    activePseudoLine: 2,
    explanation: `Also reference previous node at index ${validIndex - 1}.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 3,
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
    activePseudoLine: 4,
    explanation: `Insert new node. Update all bidirectional pointers.`
  })

  return steps
}

export function generateDoublyDeleteHead(list) {
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

  steps.push({
    list: [...list],
    activeNodeIndex: 0,
    targetIndex: -1,
    activePseudoLine: 0,
    explanation: `Initialize. Delete head node (value: ${list[0]}).`
  })

  if (list.length === 1) {
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 1,
      explanation: `Only one node. List becomes empty.`
    })
    return steps
  }

  steps.push({
    list: [...list],
    activeNodeIndex: 1,
    targetIndex: -1,
    activePseudoLine: 1,
    explanation: `Get next node. Value: ${list[1]}.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: 1,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Set new head's prev pointer to NULL.`
  })

  const newList = list.slice(1)
  steps.push({
    list: newList,
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `Head deleted. New head updated.`
  })

  return steps
}

export function generateDoublyDeleteTail(list) {
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
      explanation: `Delete only node. List becomes empty.`
    })
    steps.push({
      list: [],
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 1,
      explanation: `Done.`
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
    explanation: `Direct access to node before tail. Value: ${list[list.length - 2]}.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: list.length - 2,
    targetIndex: -1,
    activePseudoLine: 2,
    explanation: `Set previous node's next to NULL.`
  })

  const newList = list.slice(0, -1)
  steps.push({
    list: newList,
    activeNodeIndex: -1,
    targetIndex: -1,
    activePseudoLine: 3,
    explanation: `Tail deleted. New tail updated.`
  })

  return steps
}

export function generateDoublyDeleteAtIndex(list, index) {
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
    return generateDoublyDeleteHead(list)
  }

  if (validIndex === list.length - 1) {
    return generateDoublyDeleteTail(list)
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
    explanation: `Access prev and next nodes of target.`
  })

  steps.push({
    list: [...list],
    activeNodeIndex: validIndex - 1,
    targetIndex: validIndex + 1,
    activePseudoLine: 2,
    explanation: `Link prev.next to next, and next.prev to prev.`
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
    explanation: `Node deleted. Bidirectional links maintained.`
  })

  return steps
}

export function generateDoublySearch(list, value) {
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
    explanation: `Initialize search for value ${value}. Can go forward or backward.`
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
      activeNodeIndex: -1,
      targetIndex: -1,
      activePseudoLine: 4,
      explanation: `Search complete. Value ${value} not found.`
    })
  }

  return steps
}
