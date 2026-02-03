export function generateQuickSortSteps(arr) {
  const steps = []
  const a = [...arr]
  const sorted = []

  function partition(low, high) {
    const pivot = a[high]
    let i = low - 1

    steps.push({
      array: [...a],
      active: [],
      swap: false,
      pivot: high,
      range: [low, high],
      sorted: [...sorted],
      codeLine: 2,
      explanation: `Choose ${pivot} as pivot`
    })

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...a],
        active: [j],
        swap: false,
        pivot: high,
        range: [low, high],
        sorted: [...sorted],
        codeLine: 2,
        explanation: `Compare ${a[j]} with pivot ${pivot}`
      })

      if (a[j] < pivot) {
        i++
        ;[a[i], a[j]] = [a[j], a[i]]

        steps.push({
          array: [...a],
          active: [i, j],
          swap: true,
          pivot: high,
          range: [low, high],
          sorted: [...sorted],
          codeLine: 2,
          explanation: `Swap ${a[i]} and ${a[j]}`
        })
      }
    }

    ;[a[i + 1], a[high]] = [a[high], a[i + 1]]

    steps.push({
      array: [...a],
      active: [i + 1, high],
      swap: true,
      pivot: i + 1,
      range: [low, high],
      sorted: [...sorted, i + 1],
      codeLine: 2,
      explanation: `Place pivot in correct position`
    })

    sorted.push(i + 1)
    return i + 1
  }

  function quickSort(low, high) {
    if (low < high) {
      steps.push({
        array: [...a],
        active: [],
        swap: false,
        pivot: null,
        range: [low, high],
        sorted: [...sorted],
        codeLine: 0,
        explanation: `Quick sort range [${low}…${high}]`
      })

      const pi = partition(low, high)
      quickSort(low, pi - 1)
      quickSort(pi + 1, high)
    }
  }

  quickSort(0, a.length - 1)

  steps.push({
    array: [...a],
    active: [],
    swap: false,
    pivot: null,
    range: null,
    sorted: Array.from({ length: a.length }, (_, i) => i),
    codeLine: 4,
    explanation: "Array is fully sorted 🎉"
  })

  return steps
}
