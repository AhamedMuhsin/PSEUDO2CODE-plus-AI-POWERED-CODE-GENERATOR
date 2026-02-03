export function generateInsertionSortSteps(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length

  for (let i = 1; i < n; i++) {
    let key = a[i]
    let j = i - 1

    const sortedBefore = Array.from({ length: i }, (_, k) => k)

    // Select key
    steps.push({
      array: [...a],
      active: [i],
      swap: false,
      codeLine: 0,
      sorted: sortedBefore,
      explanation: `Select ${key} as key`
    })

    while (j >= 0 && a[j] > key) {
      steps.push({
        array: [...a],
        active: [j, j + 1],
        swap: false,
        codeLine: 3,
        sorted: sortedBefore,
        explanation: `Compare ${a[j]} > ${key}, shift ${a[j]} right`
      })

      a[j + 1] = a[j]

      steps.push({
        array: [...a],
        active: [j, j + 1],
        swap: true,
        codeLine: 4,
        sorted: sortedBefore,
        explanation: `Move ${a[j]} to position ${j + 1}`
      })

      j--
    }

    a[j + 1] = key

    // Insert key → sorted section grows
    steps.push({
      array: [...a],
      active: [j + 1],
      swap: false,
      codeLine: 6,
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      explanation: `Insert ${key} into sorted section`
    })
  }

  // Final step
  steps.push({
    array: [...a],
    active: [],
    swap: false,
    codeLine: 7,
    sorted: Array.from({ length: n }, (_, i) => i),
    explanation: "Array is fully sorted 🎉"
  })

  return steps
}
