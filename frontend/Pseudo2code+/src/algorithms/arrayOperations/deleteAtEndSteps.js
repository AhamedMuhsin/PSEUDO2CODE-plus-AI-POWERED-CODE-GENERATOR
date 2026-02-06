export function generateDeleteAtEndSteps(arr) {

  if (!arr || arr.length === 0) {
    return [{
      array: [],
      explanation: "⚠️ Cannot delete from an empty array"
    }]
  }

  const steps = []
  const a = [...arr]
  const lastIndex = a.length - 1

  steps.push({
    array: [...a],
    activeIndex: lastIndex,
    explanation: `Target last element at index ${lastIndex}`
  })

  steps.push({
    array: [...a],
    removedIndex: lastIndex,
    explanation: `Remove element ${a[lastIndex]} from end`
  })

  a.pop()

  steps.push({
    array: [...a],
    explanation: "Array after deletion"
  })

  return steps
}
