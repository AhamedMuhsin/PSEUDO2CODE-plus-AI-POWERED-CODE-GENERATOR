export function generateInsertAtEndSteps(arr, value) {

  if (value === null || value === undefined || Number.isNaN(value)) {
    return [{
      array: [...arr],
      explanation: "⚠️ Please enter a value to insert at the end"
    }]
  }

  const steps = []
  const a = [...arr]

  steps.push({
    array: [...a],
    explanation: "Initial array"
  })

  a.push(value)

  steps.push({
    array: [...a],
    insertedIndex: a.length - 1,
    explanation: `Insert ${value} at the end of the array`
  })

  return steps
}
