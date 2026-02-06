export function generateDeleteAtIndexSteps(arr, index) {

  if (!arr || arr.length === 0) {
    return [{
      array: [],
      activeLine: 0,
      explanation: "⚠️ Cannot delete from an empty array"
    }]
  }

  if (index === null || index === undefined || Number.isNaN(index)) {
    return [{
      array: [...arr],
      activeLine: 0,
      explanation: "⚠️ Please enter a valid index to delete"
    }]
  }

  if (index < 0 || index >= arr.length) {
    return [{
      array: [...arr],
      activeLine: 0,
      explanation: `⚠️ Index ${index} is out of bounds (0 to ${arr.length - 1})`
    }]
  }

  const steps = []
  const a = [...arr]
  const removedValue = a[index]

  // removedValue = array[index]
  steps.push({
    array: [...a],
    activeIndex: index,
    activeLine: 0,
    explanation: `Target element at index ${index} (value = ${removedValue})`
  })

  // for i from index to n - 2
  steps.push({
    array: [...a],
    removedIndex: index,
    activeLine: 1,
    explanation: `Prepare to shift elements left from index ${index}`
  })

  // array[i] = array[i + 1]
  for (let i = index; i < a.length - 1; i++) {
    a[i] = a[i + 1]

    steps.push({
      array: [...a],
      activeIndex: i,
      activeLine: 2,
      explanation: `Shift element from index ${i + 1} (value = ${a[i]}) to index ${i}`
    })
  }

  // n = n - 1
  a.pop()

  steps.push({
    array: [...a],
    activeLine: 3,
    explanation: `Reduce array size by 1`
  })

  // return removedValue
  steps.push({
    array: [...a],
    activeLine: 4,
    explanation: `✅ Successfully deleted ${removedValue} at index ${index}`
  })

  return steps
}
