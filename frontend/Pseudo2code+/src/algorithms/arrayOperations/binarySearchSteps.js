export function generateBinarySearchSteps(arr, target) {

  // 🚨 Defensive checks
  if (target === null || target === undefined || Number.isNaN(target)) {
    return [{
      array: [...arr],
      activeLine: 0,
      explanation: "⚠️ Please enter a value to search using Binary Search"
    }]
  }

  if (arr.length === 0) {
    return [{
      array: [],
      activeLine: 0,
      explanation: "⚠️ Array is empty"
    }]
  }

  if (target < arr[0] || target > arr[arr.length - 1]) {
    return [{
      array: [...arr],
      activeLine: 0,
      explanation: `❌ Target ${target} is outside the array range`
    }]
  }

  const steps = []
  let low = 0
  let high = arr.length - 1

  // low = 0, high = n - 1
  steps.push({
    array: [...arr],
    activeIndex: null,
    midIndex: null,
    range: [low, high],
    foundIndex: null,
    activeLine: 0,
    explanation: `Initialize: low = ${low}, high = ${high}`
  })

  // while low <= high
  while (low <= high) {
    // mid = (low + high) / 2
    const mid = Math.floor((low + high) / 2)

    steps.push({
      array: [...arr],
      activeIndex: mid,
      midIndex: mid,
      range: [low, high],
      foundIndex: null,
      activeLine: 2,
      explanation: `Calculate mid = ${mid}`
    })

    // if array[mid] == target
    steps.push({
      array: [...arr],
      midIndex: mid,
      activeIndex: mid,
      range: [low, high],
      foundIndex: null,
      activeLine: 3,
      explanation: `Compare: array[${mid}] = ${arr[mid]} with target ${target}`
    })

    if (arr[mid] === target) {
      // return mid
      steps.push({
        array: [...arr],
        midIndex: mid,
        foundIndex: mid,
        activeLine: 4,
        explanation: `✅ Match found! Target ${target} found at index ${mid}`
      })
      return steps
    }

    // else if array[mid] < target
    if (arr[mid] < target) {
      // low = mid + 1
      steps.push({
        array: [...arr],
        activeIndex: mid,
        range: [low, high],
        activeLine: 6,
        explanation: `${arr[mid]} < ${target}, search right half`
      })
      low = mid + 1
      steps.push({
        array: [...arr],
        range: [low, high],
        activeLine: 6,
        explanation: `Set low = ${low}`
      })
    } else {
      // high = mid - 1
      steps.push({
        array: [...arr],
        activeIndex: mid,
        range: [low, high],
        activeLine: 8,
        explanation: `${arr[mid]} > ${target}, search left half`
      })
      high = mid - 1
      steps.push({
        array: [...arr],
        range: [low, high],
        activeLine: 8,
        explanation: `Set high = ${high}`
      })
    }
  }

  // return -1
  steps.push({
    array: [...arr],
    activeLine: 9,
    explanation: `❌ Target ${target} not found in the array`
  })

  return steps
}
