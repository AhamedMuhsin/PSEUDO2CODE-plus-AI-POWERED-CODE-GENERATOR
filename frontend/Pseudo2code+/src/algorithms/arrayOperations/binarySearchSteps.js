export function generateBinarySearchSteps(arr, target) {

  // 🚨 Defensive checks
  if (target === null || target === undefined || Number.isNaN(target)) {
    return [{
      array: [...arr],
      explanation: "⚠️ Please enter a value to search using Binary Search"
    }]
  }

  if (arr.length === 0) {
    return [{
      array: [],
      explanation: "⚠️ Array is empty"
    }]
  }

  if (target < arr[0] || target > arr[arr.length - 1]) {
    return [{
      array: [...arr],
      explanation: `❌ Target ${target} is outside the array range`
    }]
  }

  const steps = []
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    steps.push({
      array: [...arr],
      activeIndex: mid,
      midIndex: mid,
      range: [low, high],
      foundIndex: null,
      explanation: `Check middle element at index ${mid}`
    })

    if (arr[mid] === target) {
      steps.push({
        array: [...arr],
        midIndex: mid,
        foundIndex: mid,
        explanation: `✅ Target ${target} found at index ${mid}`
      })
      return steps
    }

    if (arr[mid] < target) {
      low = mid + 1
      steps.push({
        array: [...arr],
        range: [low, high],
        explanation: `Discard left half`
      })
    } else {
      high = mid - 1
      steps.push({
        array: [...arr],
        range: [low, high],
        explanation: `Discard right half`
      })
    }
  }

  steps.push({
    array: [...arr],
    explanation: `❌ Target ${target} not found`
  })

  return steps
}
