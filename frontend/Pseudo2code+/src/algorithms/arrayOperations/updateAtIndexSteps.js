export function generateUpdateAtIndexSteps(arr, index, newValue) {

  // 🚨 STEP 2: Defensive checks
  if (!arr || arr.length === 0) {
    return [{
      array: [],
      activeIndex: null,
      activeLine: 0,
      explanation: "⚠️ Cannot update an empty array"
    }]
  }

  if (index === null || index === undefined) {
    return [{
      array: [...arr],
      activeIndex: null,
      activeLine: 0,
      explanation: "⚠️ Please provide an index to update"
    }]
  }

  if (index < 0 || index >= arr.length) {
    return [{
      array: [...arr],
      activeIndex: null,
      activeLine: 0,
      explanation: `⚠️ Index ${index} is out of bounds`
    }]
  }

  if (newValue === null || newValue === undefined) {
    return [{
      array: [...arr],
      activeIndex: index,
      activeLine: 0,
      explanation: "⚠️ Please provide a new value to update"
    }]
  }

  const steps = []
  const a = [...arr]
  const oldValue = a[index]

  // oldValue = array[index]
  steps.push({
    array: [...a],
    activeIndex: index,
    activeLine: 0,
    explanation: `Select index ${index} to update (current value = ${oldValue})`
  })

  // array[index] = newValue
  a[index] = newValue

  steps.push({
    array: [...a],
    activeIndex: index,
    insertedIndex: index,
    activeLine: 1,
    explanation: `Update value at index ${index} from ${oldValue} to ${newValue}`
  })

  // return oldValue
  steps.push({
    array: [...a],
    activeIndex: index,
    insertedIndex: index,
    activeLine: 2,
    explanation: `✅ Successfully updated index ${index}. Old value: ${oldValue}`
  })

  return steps
}
