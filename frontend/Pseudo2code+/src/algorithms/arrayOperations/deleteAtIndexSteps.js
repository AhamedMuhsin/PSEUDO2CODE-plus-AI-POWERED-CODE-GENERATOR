export function generateDeleteAtIndexSteps(arr, index) {

  if (!arr || arr.length === 0) {
    return [{
      array: [],
      explanation: "⚠️ Cannot delete from an empty array"
    }]
  }

  if (index === null || index === undefined || Number.isNaN(index)) {
    return [{
      array: [...arr],
      explanation: "⚠️ Please enter a valid index to delete"
    }]
  }

  if (index < 0 || index >= arr.length) {
    return [{
      array: [...arr],
      explanation: `⚠️ Index ${index} is out of bounds (0 to ${arr.length - 1})`
    }]
  }

  const steps = []
  const a = [...arr]

  steps.push({
    array: [...a],
    activeIndex: index,
    explanation: `Target element at index ${index}`
  })

  steps.push({
    array: [...a],
    removedIndex: index,
    explanation: `Remove element ${a[index]}`
  })

  for (let i = index; i < a.length - 1; i++) {
    a[i] = a[i + 1]

    steps.push({
      array: [...a],
      activeIndex: i,
      explanation: `Shift element from index ${i + 1} to ${i}`
    })
  }

  a.pop()

  steps.push({
    array: [...a],
    explanation: "Array after deletion"
  })

  return steps
}
