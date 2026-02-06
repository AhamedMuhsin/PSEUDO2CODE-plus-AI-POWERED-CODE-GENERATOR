export function generateTraverseSteps(arr) {

  // 🚨 STEP 2: Defensive check
  if (!arr || arr.length === 0) {
    return [{
      array: [],
      activeIndex: null,
      activeLine: 0,
      explanation: "⚠️ Cannot traverse an empty array"
    }]
  }

  const steps = []

  // Initial step - for i from 0 to n - 1
  steps.push({
    array: [...arr],
    activeIndex: null,
    activeLine: 0,
    explanation: "Start traversing the array from the first element"
  })

  // Traverse each element
  for (let i = 0; i < arr.length; i++) {
    // visit array[i]
    steps.push({
      array: [...arr],
      activeIndex: i,
      activeLine: 1,
      explanation: `Visiting element at index ${i} (value = ${arr[i]})`
    })

    // process array[i]
    steps.push({
      array: [...arr],
      activeIndex: i,
      activeLine: 2,
      explanation: `Processing element at index ${i} (value = ${arr[i]})`
    })
  }

  // Final step
  steps.push({
    array: [...arr],
    activeIndex: null,
    activeLine: 0,
    explanation: "Traversal completed 🎉"
  })

  return steps
}
