export function generateBubbleSortSteps(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length

  for (let i = 0; i < n - 1; i++) {
    const sorted = Array.from({ length: i }, (_, k) => n - 1 - k)

    // Outer loop
    steps.push({
      array: [...a],
      active: [],
      swap: false,
      codeLine: 0,
      sorted,
      explanation: `Start pass ${i + 1}`
    })

    for (let j = 0; j < n - i - 1; j++) {
      // Compare
      steps.push({
        array: [...a],
        active: [j, j + 1],
        swap: false,
        codeLine: 1,
        sorted,
        explanation: `Compare ${a[j]} and ${a[j + 1]}`
      })

      // Condition
      steps.push({
        array: [...a],
        active: [j, j + 1],
        swap: false,
        codeLine: 2,
        sorted,
        explanation: `Check if ${a[j]} > ${a[j + 1]}`
      })

      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]

        // Swap
        steps.push({
          array: [...a],
          active: [j, j + 1],
          swap: true,
          codeLine: 3,
          sorted,
          explanation: `Swap ${a[j + 1]} and ${a[j]}`
        })
      }
    }
  }

  // Final state
  steps.push({
    array: [...a],
    active: [],
    swap: false,
    codeLine: 4,
    sorted: Array.from({ length: n }, (_, i) => i),
    explanation: 'Array is fully sorted 🎉'
  })

  return steps
}
