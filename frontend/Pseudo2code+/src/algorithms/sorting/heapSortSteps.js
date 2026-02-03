export function generateHeapSortSteps(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length
  const sorted = []

  function heapify(heapSize, i) {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    // Compare left
    if (left < heapSize) {
      steps.push({
        array: [...a],
        active: [i, left],
        swap: false,
        pivot: 0,
        range: [0, heapSize - 1],
        sorted: [...sorted],
        codeLine: 3,
        explanation: `Compare parent ${a[i]} with left child ${a[left]}`
      })

      if (a[left] > a[largest]) largest = left
    }

    // Compare right
    if (right < heapSize) {
      steps.push({
        array: [...a],
        active: [largest, right],
        swap: false,
        pivot: 0,
        range: [0, heapSize - 1],
        sorted: [...sorted],
        codeLine: 3,
        explanation: `Compare with right child ${a[right]}`
      })

      if (a[right] > a[largest]) largest = right
    }

    // Swap if needed
    if (largest !== i) {
      ;[a[i], a[largest]] = [a[largest], a[i]]

      steps.push({
        array: [...a],
        active: [i, largest],
        swap: true,
        pivot: 0,
        range: [0, heapSize - 1],
        sorted: [...sorted],
        codeLine: 3,
        explanation: `Swap ${a[largest]} with ${a[i]}`
      })

      heapify(heapSize, largest)
    }
  }

  // BUILD MAX HEAP
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: [...a],
      active: [i],
      swap: false,
      pivot: 0,
      range: [0, n - 1],
      sorted: [...sorted],
      codeLine: 0,
      explanation: `Heapify subtree rooted at index ${i}`
    })

    heapify(n, i)
  }

  // EXTRACT ELEMENTS
  for (let end = n - 1; end > 0; end--) {
    ;[a[0], a[end]] = [a[end], a[0]]

    sorted.unshift(end)

    steps.push({
      array: [...a],
      active: [0, end],
      swap: true,
      pivot: 0,
      range: [0, end - 1],
      sorted: [...sorted],
      codeLine: 2,
      explanation: `Move max ${a[end]} to sorted position`
    })

    heapify(end, 0)
  }

  // Final
  steps.push({
    array: [...a],
    active: [],
    swap: false,
    pivot: null,
    range: null,
    sorted: Array.from({ length: n }, (_, i) => i),
    codeLine: 4,
    explanation: "Array is fully sorted 🎉"
  })

  return steps
}
