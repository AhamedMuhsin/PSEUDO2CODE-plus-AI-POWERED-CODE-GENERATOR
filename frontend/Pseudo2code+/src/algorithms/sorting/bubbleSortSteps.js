export function generateBubbleSortSteps(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...a],
        active: [j, j + 1],
        swap: false,
        explanation: `Compare ${a[j]} and ${a[j + 1]}`
      })

      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]

        steps.push({
          array: [...a],
          active: [j, j + 1],
          swap: true,
          explanation: `Swap ${a[j + 1]} and ${a[j]}`
        })
      }
    }
  }

  steps.push({
    array: [...a],
    active: [],
    swap: false,
    explanation: 'Array is fully sorted 🎉'
  })

  return steps
}
