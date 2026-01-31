export function bubbleSortSteps(input) {
  const arr = [...input]
  const steps = []
  const n = arr.length
  const sorted = []

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare step
      steps.push({
        array: [...arr],
        compare: [j, j + 1],
        swap: false,
        sortedIndices: [...sorted],
      })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]

        // Swap step
        steps.push({
          array: [...arr],
          compare: [j, j + 1],
          swap: true,
          sortedIndices: [...sorted],
        })
      }
    }

    // Mark last element as sorted
    sorted.push(n - i - 1)
  }

  return steps
}
