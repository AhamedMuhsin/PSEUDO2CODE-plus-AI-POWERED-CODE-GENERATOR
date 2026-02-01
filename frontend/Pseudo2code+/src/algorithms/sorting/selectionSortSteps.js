export function generateSelectionSortSteps(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i
    const sorted = Array.from({ length: i }, (_, k) => k)

    // Assume minimum
    steps.push({
      array: [...a],
      active: [i],
      swap: false,
      codeLine: 2,
      sorted,
      explanation: `Assume ${a[i]} is the minimum`
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...a],
        active: [minIndex, j],
        swap: false,
        codeLine: 3,
        sorted,
        explanation: `Compare ${a[j]} with current minimum ${a[minIndex]}`
      })

      if (a[j] < a[minIndex]) {
        minIndex = j

        steps.push({
          array: [...a],
          active: [minIndex],
          swap: false,
          codeLine: 5,
          sorted,
          explanation: `New minimum found: ${a[minIndex]}`
        })
      }
    }

    if (minIndex !== i) {
      ;[a[i], a[minIndex]] = [a[minIndex], a[i]]

      steps.push({
        array: [...a],
        active: [i, minIndex],
        swap: true,
        codeLine: 7,
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        explanation: `Place ${a[i]} in sorted position`
      })
    }
  }

  // Final
  steps.push({
    array: [...a],
    active: [],
    swap: false,
    codeLine: 0,
    sorted: Array.from({ length: n }, (_, i) => i),
    explanation: 'Array is fully sorted 🎉'
  })

  return steps
}
