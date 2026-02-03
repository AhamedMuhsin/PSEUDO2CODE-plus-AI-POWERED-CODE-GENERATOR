export function generateMergeSortSteps(arr) {
  const steps = []
  const a = [...arr]

  function merge(l, mid, r) {
    const left = a.slice(l, mid + 1)
    const right = a.slice(mid + 1, r + 1)

    let i = 0, j = 0, k = l

    while (i < left.length && j < right.length) {
      steps.push({
        array: [...a],
        active: [k],
        sorted: [],
        range: [l, r],
        codeLine: 5,
        explanation: `Compare ${left[i]} and ${right[j]}`
      })

      if (left[i] <= right[j]) {
        a[k] = left[i++]
      } else {
        a[k] = right[j++]
      }

      steps.push({
        array: [...a],
        active: [k],
        sorted: Array.from({ length: k - l + 1 }, (_, x) => l + x),
        range: [l, r],
        codeLine: 5,
        explanation: `Place value at index ${k}`
      })

      k++
    }

    while (i < left.length) {
      a[k] = left[i++]
      steps.push({
        array: [...a],
        active: [k],
        sorted: [k],
        range: [l, r],
        codeLine: 5,
        explanation: `Copy remaining left value`
      })
      k++
    }

    while (j < right.length) {
      a[k] = right[j++]
      steps.push({
        array: [...a],
        active: [k],
        sorted: [k],
        range: [l, r],
        codeLine: 5,
        explanation: `Copy remaining right value`
      })
      k++
    }
  }

  function mergeSort(l, r) {
    steps.push({
      array: [...a],
      active: [],
      sorted: [],
      range: [l, r],
      codeLine: 0,
      explanation: `Divide array [${l}…${r}]`
    })

    if (l >= r) return

    const mid = Math.floor((l + r) / 2)

    mergeSort(l, mid)
    mergeSort(mid + 1, r)
    merge(l, mid, r)
  }

  mergeSort(0, a.length - 1)

  steps.push({
    array: [...a],
    active: [],
    sorted: Array.from({ length: a.length }, (_, i) => i),
    range: [0, a.length - 1],
    codeLine: 6,
    explanation: "Array is fully sorted 🎉"
  })

  return steps
}
