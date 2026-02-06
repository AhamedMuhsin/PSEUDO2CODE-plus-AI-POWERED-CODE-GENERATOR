export function generateInsertAtIndexSteps(arr, value, index) {

  if (value === null || value === undefined || Number.isNaN(value)) {
    return [{
      array: [...arr],
      explanation: "⚠️ Please enter a value to insert"
    }]
  }

  if (index === null || index === undefined || Number.isNaN(index)) {
    return [{
      array: [...arr],
      explanation: "⚠️ Please enter a valid index"
    }]
  }

  if (index < 0 || index > arr.length) {
    return [{
      array: [...arr],
      explanation: `⚠️ Index ${index} is out of bounds (0 to ${arr.length})`
    }]
  }

  const steps = []
  const a = [...arr]

  steps.push({
    array: [...a],
    targetIndex: index,
    explanation: `Target index for insertion is ${index}`
  })

  for (let i = a.length - 1; i >= index; i--) {
    a[i + 1] = a[i]

    steps.push({
      array: [...a],
      activeIndex: i,
      targetIndex: index,
      explanation: `Shift element at index ${i} to the right`
    })
  }

  a[index] = value

  steps.push({
    array: [...a],
    insertedIndex: index,
    explanation: `Insert ${value} at index ${index}`
  })

  return steps
}
