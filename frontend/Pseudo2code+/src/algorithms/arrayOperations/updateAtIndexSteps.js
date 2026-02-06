export function generateUpdateAtIndexSteps(arr, index, newValue) {

  // 🚨 STEP 2: Defensive checks
  if (!arr || arr.length === 0) {
    return [{
      array: [],
      activeIndex: null,
      explanation: "⚠️ Cannot update an empty array"
    }]
  }

  if (index === null || index === undefined) {
    return [{
      array: [...arr],
      activeIndex: null,
      explanation: "⚠️ Please provide an index to update"
    }]
  }

  if (index < 0 || index >= arr.length) {
    return [{
      array: [...arr],
      activeIndex: null,
      explanation: `⚠️ Index ${index} is out of bounds`
    }]
  }

  if (newValue === null || newValue === undefined) {
    return [{
      array: [...arr],
      activeIndex: index,
      explanation: "⚠️ Please provide a new value to update"
    }]
  }

  const steps = []
  const a = [...arr]

  // Step 1: Highlight target index
  steps.push({
    array: [...a],
    activeIndex: index,
    explanation: `Select index ${index} for update`
  })

  // Step 2: Show current value
  steps.push({
    array: [...a],
    activeIndex: index,
    explanation: `Current value at index ${index} is ${a[index]}`
  })

  // Step 3: Update value
  a[index] = newValue

  steps.push({
    array: [...a],
    activeIndex: index,
    insertedIndex: index,
    explanation: `Update value at index ${index} to ${newValue}`
  })

  return steps
}
