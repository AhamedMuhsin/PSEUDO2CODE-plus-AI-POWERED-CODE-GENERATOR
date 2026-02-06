export function generateTraverseSteps(arr) {

  // 🚨 STEP 2: Defensive check
  if (!arr || arr.length === 0) {
    return [{
      array: [],
      activeIndex: null,
      explanation: "⚠️ Cannot traverse an empty array"
    }]
  }

  const steps = []

  // Initial step
  steps.push({
    array: [...arr],
    activeIndex: null,
    explanation: "Start traversing the array from the first element"
  })

  // Traverse each element
  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      activeIndex: i,
      explanation: `Visiting element at index ${i} (value = ${arr[i]})`
    })
  }

  // Final step
  steps.push({
    array: [...arr],
    activeIndex: null,
    explanation: "Traversal completed 🎉"
  })

  return steps
}
