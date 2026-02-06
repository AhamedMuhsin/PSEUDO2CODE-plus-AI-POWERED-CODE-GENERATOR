export function generateLinearSearchSteps(arr, target) {

  // 🚨 Defensive checks
  if (target === null || target === undefined || Number.isNaN(target)) {
    return [{
      array: [...arr],
      explanation: "⚠️ Please enter a value to search in the array"
    }]
  }

  if (arr.length === 0) {
    return [{
      array: [],
      explanation: "⚠️ Array is empty"
    }]
  }

  const steps = []

  // Initial step
  steps.push({
    array: [...arr],
    activeIndex: null,
    foundIndex: null,
    explanation: `Start linear search for value ${target}`
  })

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      activeIndex: i,
      foundIndex: null,
      explanation: `Compare target ${target} with element at index ${i} (value = ${arr[i]})`
    })

    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        activeIndex: i,
        foundIndex: i,
        explanation: `✅ Target ${target} found at index ${i}`
      })
      return steps
    }
  }

  steps.push({
    array: [...arr],
    activeIndex: null,
    foundIndex: null,
    explanation: `❌ Target ${target} not found in the array`
  })

  return steps
}
