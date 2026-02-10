export function waterJugSteps(jug1Capacity = 4, jug2Capacity = 3, target = 2) {
  const steps = []
  const visited = new Set()
  const queue = [[0, 0, []]]
  
  steps.push({
    jug1: 0,
    jug2: 0,
    jug1Capacity,
    jug2Capacity,
    target,
    activePseudoLine: 1,
    explanation: `Starting Water Jug Problem. Jug1: ${jug1Capacity}L, Jug2: ${jug2Capacity}L, Target: ${target}L`,
    operation: 'start',
    path: [],
    status: 'start'
  })

  function getKey(state) {
    return `${state[0]},${state[1]}`
  }

  while (queue.length > 0) {
    const [jug1, jug2, path] = queue.shift()
    const key = getKey([jug1, jug2])

    if (visited.has(key)) continue
    visited.add(key)

    steps.push({
      jug1,
      jug2,
      jug1Capacity,
      jug2Capacity,
      target,
      activePseudoLine: 2,
      explanation: `Exploring state: Jug1=${jug1}L, Jug2=${jug2}L`,
      operation: 'exploring',
      path: [...path],
      status: 'exploring'
    })

    if (jug1 === target || jug2 === target) {
      steps.push({
        jug1,
        jug2,
        jug1Capacity,
        jug2Capacity,
        target,
        activePseudoLine: 10,
        explanation: `✅ Solution found! Target ${target}L reached in ${path.length} steps.`,
        operation: 'success',
        path: [...path],
        status: 'success'
      })
      return steps
    }

    // All possible operations
    const operations = [
      // Fill jug1
      [jug1Capacity, jug2, [...path, `Fill Jug1 (${jug1Capacity}L)`]],
      // Fill jug2
      [jug1, jug2Capacity, [...path, `Fill Jug2 (${jug2Capacity}L)`]],
      // Empty jug1
      [0, jug2, [...path, 'Empty Jug1']],
      // Empty jug2
      [jug1, 0, [...path, 'Empty Jug2']],
      // Pour jug1 to jug2
      [
        Math.max(0, jug1 - (jug2Capacity - jug2)),
        Math.min(jug2Capacity, jug1 + jug2),
        [...path, 'Pour Jug1→Jug2']
      ],
      // Pour jug2 to jug1
      [
        Math.min(jug1Capacity, jug1 + jug2),
        Math.max(0, jug2 - (jug1Capacity - jug1)),
        [...path, 'Pour Jug2→Jug1']
      ]
    ]

    for (const [newJug1, newJug2, newPath] of operations) {
      const newKey = getKey([newJug1, newJug2])
      if (!visited.has(newKey)) {
        queue.push([newJug1, newJug2, newPath])
        
        steps.push({
          jug1: newJug1,
          jug2: newJug2,
          jug1Capacity,
          jug2Capacity,
          target,
          activePseudoLine: 5,
          explanation: `Try: ${newPath[newPath.length - 1]} → Jug1=${newJug1}L, Jug2=${newJug2}L`,
          operation: newPath[newPath.length - 1],
          path: newPath,
          status: 'trying'
        })
      }
    }
  }

  steps.push({
    jug1: 0,
    jug2: 0,
    jug1Capacity,
    jug2Capacity,
    target,
    activePseudoLine: 11,
    explanation: `✗ No solution exists for target ${target}L with jugs of ${jug1Capacity}L and ${jug2Capacity}L`,
    operation: 'no_solution',
    path: [],
    status: 'failed'
  })

  return steps
}
