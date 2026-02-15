export function waterJugSteps(jug1Capacity = 4, jug2Capacity = 3, target = 2, jug3Capacity = 0) {
  const steps = []
  const visited = new Set()
  const useThreeJugs = jug3Capacity > 0
  const queue = [useThreeJugs ? [0, 0, 0, []] : [0, 0, []]]

  function makeStep(j1, j2, j3, extra) {
    return {
      jug1: j1,
      jug2: j2,
      jug3: j3,
      jug1Capacity,
      jug2Capacity,
      jug3Capacity,
      target,
      useThreeJugs,
      ...extra
    }
  }

  const startLabel = useThreeJugs
    ? `Starting Water Jug Problem. Jug1: ${jug1Capacity}L, Jug2: ${jug2Capacity}L, Jug3: ${jug3Capacity}L, Target: ${target}L`
    : `Starting Water Jug Problem. Jug1: ${jug1Capacity}L, Jug2: ${jug2Capacity}L, Target: ${target}L`

  steps.push(makeStep(0, 0, 0, {
    activePseudoLine: 1,
    explanation: startLabel,
    operation: 'start',
    path: [],
    status: 'start'
  }))

  function getKey(state) {
    return useThreeJugs ? `${state[0]},${state[1]},${state[2]}` : `${state[0]},${state[1]}`
  }

  while (queue.length > 0) {
    const item = queue.shift()
    let jug1, jug2, jug3, path
    if (useThreeJugs) {
      ;[jug1, jug2, jug3, path] = item
    } else {
      ;[jug1, jug2, path] = item
      jug3 = 0
    }
    const key = getKey(useThreeJugs ? [jug1, jug2, jug3] : [jug1, jug2])

    if (visited.has(key)) continue
    visited.add(key)

    const exploreLabel = useThreeJugs
      ? `Exploring state: Jug1=${jug1}L, Jug2=${jug2}L, Jug3=${jug3}L`
      : `Exploring state: Jug1=${jug1}L, Jug2=${jug2}L`

    steps.push(makeStep(jug1, jug2, jug3, {
      activePseudoLine: 2,
      explanation: exploreLabel,
      operation: 'exploring',
      path: [...path],
      status: 'exploring'
    }))

    const isTarget = jug1 === target || jug2 === target || (useThreeJugs && jug3 === target)
    if (isTarget) {
      steps.push(makeStep(jug1, jug2, jug3, {
        activePseudoLine: 10,
        explanation: `✅ Solution found! Target ${target}L reached in ${path.length} steps.`,
        operation: 'success',
        path: [...path],
        status: 'success'
      }))
      return steps
    }

    // Build all possible operations
    const operations = [
      // Fill jug1
      [jug1Capacity, jug2, jug3, [...path, `Fill Jug1 (${jug1Capacity}L)`]],
      // Fill jug2
      [jug1, jug2Capacity, jug3, [...path, `Fill Jug2 (${jug2Capacity}L)`]],
      // Empty jug1
      [0, jug2, jug3, [...path, 'Empty Jug1']],
      // Empty jug2
      [jug1, 0, jug3, [...path, 'Empty Jug2']],
      // Pour jug1 → jug2
      [
        Math.max(0, jug1 - (jug2Capacity - jug2)),
        Math.min(jug2Capacity, jug1 + jug2),
        jug3,
        [...path, 'Pour Jug1→Jug2']
      ],
      // Pour jug2 → jug1
      [
        Math.min(jug1Capacity, jug1 + jug2),
        Math.max(0, jug2 - (jug1Capacity - jug1)),
        jug3,
        [...path, 'Pour Jug2→Jug1']
      ]
    ]

    // Add 3rd jug operations if enabled
    if (useThreeJugs) {
      operations.push(
        // Fill jug3
        [jug1, jug2, jug3Capacity, [...path, `Fill Jug3 (${jug3Capacity}L)`]],
        // Empty jug3
        [jug1, jug2, 0, [...path, 'Empty Jug3']],
        // Pour jug1 → jug3
        [
          Math.max(0, jug1 - (jug3Capacity - jug3)),
          jug2,
          Math.min(jug3Capacity, jug1 + jug3),
          [...path, 'Pour Jug1→Jug3']
        ],
        // Pour jug3 → jug1
        [
          Math.min(jug1Capacity, jug1 + jug3),
          jug2,
          Math.max(0, jug3 - (jug1Capacity - jug1)),
          [...path, 'Pour Jug3→Jug1']
        ],
        // Pour jug2 → jug3
        [
          jug1,
          Math.max(0, jug2 - (jug3Capacity - jug3)),
          Math.min(jug3Capacity, jug2 + jug3),
          [...path, 'Pour Jug2→Jug3']
        ],
        // Pour jug3 → jug2
        [
          jug1,
          Math.min(jug2Capacity, jug2 + jug3),
          Math.max(0, jug3 - (jug2Capacity - jug2)),
          [...path, 'Pour Jug3→Jug2']
        ]
      )
    }

    for (const op of operations) {
      const [newJug1, newJug2, newJug3, newPath] = op
      const newKey = getKey(useThreeJugs ? [newJug1, newJug2, newJug3] : [newJug1, newJug2])
      if (!visited.has(newKey)) {
        if (useThreeJugs) {
          queue.push([newJug1, newJug2, newJug3, newPath])
        } else {
          queue.push([newJug1, newJug2, newPath])
        }

        const tryLabel = useThreeJugs
          ? `Try: ${newPath[newPath.length - 1]} → Jug1=${newJug1}L, Jug2=${newJug2}L, Jug3=${newJug3}L`
          : `Try: ${newPath[newPath.length - 1]} → Jug1=${newJug1}L, Jug2=${newJug2}L`

        steps.push(makeStep(newJug1, newJug2, newJug3, {
          activePseudoLine: 5,
          explanation: tryLabel,
          operation: newPath[newPath.length - 1],
          path: newPath,
          status: 'trying'
        }))
      }
    }
  }

  const failLabel = useThreeJugs
    ? `✗ No solution exists for target ${target}L with jugs of ${jug1Capacity}L, ${jug2Capacity}L, and ${jug3Capacity}L`
    : `✗ No solution exists for target ${target}L with jugs of ${jug1Capacity}L and ${jug2Capacity}L`

  steps.push(makeStep(0, 0, 0, {
    activePseudoLine: 11,
    explanation: failLabel,
    operation: 'no_solution',
    path: [],
    status: 'failed'
  }))

  return steps
}
