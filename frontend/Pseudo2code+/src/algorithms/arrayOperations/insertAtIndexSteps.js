export function generateInsertAtIndexSteps(arr, value, index) {

  if (value === null || value === undefined || Number.isNaN(value)) {
    return [{
      array: [...arr],
      activeLine: 0,
      explanation: "⚠️ Please enter a value to insert"
    }]
  }

  if (index === null || index === undefined || Number.isNaN(index)) {
    return [{
      array: [...arr],
      activeLine: 0,
      explanation: "⚠️ Please enter a valid index"
    }]
  }

  if (index < 0 || index > arr.length) {
    return [{
      array: [...arr],
      activeLine: 0,
      explanation: `⚠️ Index ${index} is out of bounds (0 to ${arr.length})`
    }]
  }

  const steps = []
  const a = [...arr]

  // for i from n - 1 down to index
  steps.push({
    array: [...a],
    targetIndex: index,
    activeLine: 0,
    explanation: `Prepare to insert ${value} at index ${index}`
  })

  // array[i + 1] = array[i] - shift elements
  for (let i = a.length - 1; i >= index; i--) {
    a[i + 1] = a[i]

    steps.push({
      array: [...a],
      activeIndex: i,
      targetIndex: index,
      activeLine: 1,
      explanation: `Shift element at index ${i} (value = ${a[i]}) to index ${i + 1}`
    })
  }

  // array[index] = newValue
  a[index] = value

  steps.push({
    array: [...a],
    insertedIndex: index,
    activeLine: 2,
    explanation: `Insert ${value} at index ${index}`
  })

  // n = n + 1 (implicitly done by array length)
  steps.push({
    array: [...a],
    insertedIndex: index,
    activeLine: 3,
    explanation: `✅ Successfully inserted ${value} at index ${index}`
  })

  return steps
}
