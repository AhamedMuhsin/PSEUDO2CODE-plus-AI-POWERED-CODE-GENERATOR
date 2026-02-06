export function generateDeleteAtEndSteps(arr) {

  if (!arr || arr.length === 0) {
    return [{
      array: [],
      activeLine: 0,
      explanation: "⚠️ Cannot delete from an empty array"
    }]
  }

  const steps = []
  const a = [...arr]
  const lastIndex = a.length - 1
  const removedValue = a[lastIndex]

  // removedValue = array[n - 1]
  steps.push({
    array: [...a],
    activeIndex: lastIndex,
    activeLine: 0,
    explanation: `Target last element at index ${lastIndex} (value = ${removedValue})`
  })

  // n = n - 1
  steps.push({
    array: [...a],
    removedIndex: lastIndex,
    activeLine: 1,
    explanation: `Mark for removal: ${removedValue}`
  })

  a.pop()

  // return removedValue
  steps.push({
    array: [...a],
    activeLine: 2,
    explanation: `✅ Deleted ${removedValue} from end. Array updated.`
  })

  return steps
}
