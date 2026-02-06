export function generateInsertAtEndSteps(arr, value) {

  if (value === null || value === undefined || Number.isNaN(value)) {
    return [{
      array: [...arr],
      activeLine: 0,
      explanation: "⚠️ Please enter a value to insert at the end"
    }]
  }

  const steps = []
  const a = [...arr]

  steps.push({
    array: [...a],
    activeLine: 0,
    explanation: "Initial array"
  })

  // array[n] = newValue
  steps.push({
    array: [...a],
    insertedIndex: null,
    activeLine: 0,
    explanation: `Prepare to insert ${value} at position ${a.length}`
  })

  a.push(value)

  // n = n + 1
  steps.push({
    array: [...a],
    insertedIndex: a.length - 1,
    activeLine: 1,
    explanation: `✅ Successfully inserted ${value} at the end (index ${a.length - 1})`
  })

  return steps
}
