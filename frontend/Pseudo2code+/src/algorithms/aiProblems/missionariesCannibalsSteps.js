export function missionariesCannibalsSteps() {
  const steps = []
  const visited = new Set()
  const queue = [[0, 0, 'right', []]] // [missionaries_left, cannibals_left, boat_side, path]
  // Everyone starts on the RIGHT bank. Goal: move all to LEFT bank.
  
  steps.push({
    missionariesLeft: 0,
    cannibalsLeft: 0,
    missionariesRight: 3,
    cannibalsRight: 3,
    boatSide: 'right',
    activePseudoLine: 1,
    explanation: 'Starting Missionaries & Cannibals: 3M, 3C on right bank. Goal: All to left bank safely.',
    move: null,
    path: [],
    status: 'start'
  })

  function getKey(m, c, boat) {
    return `${m},${c},${boat}`
  }

  function isValidState(mLeft, cLeft) {
    const mRight = 3 - mLeft
    const cRight = 3 - cLeft
    
    // Cannibals can't outnumber missionaries on either side (unless no missionaries)
    if (mLeft > 0 && cLeft > mLeft) return false
    if (mRight > 0 && cRight > mRight) return false
    if (mLeft < 0 || cLeft < 0 || mLeft > 3 || cLeft > 3) return false
    
    return true
  }

  while (queue.length > 0) {
    const [mLeft, cLeft, boat, path] = queue.shift()
    const key = getKey(mLeft, cLeft, boat)

    if (visited.has(key)) continue
    visited.add(key)

    const mRight = 3 - mLeft
    const cRight = 3 - cLeft

    steps.push({
      missionariesLeft: mLeft,
      cannibalsLeft: cLeft,
      missionariesRight: mRight,
      cannibalsRight: cRight,
      boatSide: boat,
      activePseudoLine: 2,
      explanation: `State: L(${mLeft}M,${cLeft}C) | R(${mRight}M,${cRight}C) | Boat: ${boat}`,
      move: null,
      path: [...path],
      status: 'exploring'
    })

    // Check if we reached goal
    if (mLeft === 3 && cLeft === 3) {
      steps.push({
        missionariesLeft: 3,
        cannibalsLeft: 3,
        missionariesRight: 0,
        cannibalsRight: 0,
        boatSide: boat,
        activePseudoLine: 10,
        explanation: `✅ Solution found in ${path.length} moves!`,
        move: null,
        path: [...path],
        status: 'success'
      })
      return steps
    }

    // All possible boat moves: [missionaries, cannibals]
    const moves = [[1, 0], [2, 0], [0, 1], [0, 2], [1, 1]]

    for (const [m, c] of moves) {
      let newMLeft, newCLeft, newBoat, moveDesc

      if (boat === 'left') {
        // Move from left to right
        newMLeft = mLeft - m
        newCLeft = cLeft - c
        newBoat = 'right'
        moveDesc = `${m}M,${c}C →`
      } else {
        // Move from right to left
        newMLeft = mLeft + m
        newCLeft = cLeft + c
        newBoat = 'left'
        moveDesc = `← ${m}M,${c}C`
      }

      if (isValidState(newMLeft, newCLeft)) {
        const newKey = getKey(newMLeft, newCLeft, newBoat)
        if (!visited.has(newKey)) {
          queue.push([newMLeft, newCLeft, newBoat, [...path, moveDesc]])
          
          steps.push({
            missionariesLeft: newMLeft,
            cannibalsLeft: newCLeft,
            missionariesRight: 3 - newMLeft,
            cannibalsRight: 3 - newCLeft,
            boatSide: newBoat,
            activePseudoLine: 5,
            explanation: `Try move: ${moveDesc} → L(${newMLeft}M,${newCLeft}C) | R(${3-newMLeft}M,${3-newCLeft}C)`,
            move: moveDesc,
            path: [...path, moveDesc],
            status: 'trying'
          })
        }
      }
    }
  }

  steps.push({
    missionariesLeft: 0,
    cannibalsLeft: 0,
    missionariesRight: 3,
    cannibalsRight: 3,
    boatSide: 'right',
    activePseudoLine: 11,
    explanation: '✗ No solution found!',
    move: null,
    path: [],
    status: 'failed'
  })

  return steps.slice(0, 100) // Limit for performance
}
