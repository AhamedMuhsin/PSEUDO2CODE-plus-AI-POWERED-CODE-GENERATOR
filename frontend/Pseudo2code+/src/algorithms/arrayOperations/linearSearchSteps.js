export function generateLinearSearchSteps(arr, target) {

  // 🚨 Defensive checks
  if (target === null || target === undefined || Number.isNaN(target)) {
    return [{
      array: [...arr],
      activeLine: 0,
      explanation: "⚠️ Please enter a value to search in the array"
    }]
  }

  if (arr.length === 0) {
    return [{
      array: [],
      activeLine: 0,
      explanation: "⚠️ Array is empty"
    }]
  }

  const steps = []

  // for i from 0 to n - 1
  steps.push({
    array: [...arr],
    activeIndex: null,
    foundIndex: null,
    activeLine: 0,
    explanation: `Start linear search for value ${target}`
  })

  // Loop through and search
  for (let i = 0; i < arr.length; i++) {
    // if array[i] == target
    steps.push({
      array: [...arr],
      activeIndex: i,
      foundIndex: null,
      activeLine: 1,
      explanation: `Compare target ${target} with element at index ${i} (value = ${arr[i]})`
    })

    if (arr[i] === target) {
      // return i
      steps.push({
        array: [...arr],
        activeIndex: i,
        foundIndex: i,
        activeLine: 2,
        explanation: `✅ Target ${target} found at index ${i}`
      })
      return steps
    }
  }

  // return -1 (not found)
  steps.push({
    array: [...arr],
    activeIndex: null,
    foundIndex: null,
    activeLine: 3,
    explanation: `❌ Target ${target} not found in the array`
  })

  return steps
}
