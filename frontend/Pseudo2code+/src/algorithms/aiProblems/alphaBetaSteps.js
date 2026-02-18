export function alphaBetaSteps() {
  const steps = []
  
  // Generate a random mid-game board position
  const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]

  const allPositions = []
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      allPositions.push([i, j])

  // Shuffle positions
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]]
  }

  // Place 3 moves: X, O, X
  const players = ['X', 'O', 'X']
  for (let k = 0; k < 3; k++) {
    const [r, c] = allPositions[k]
    board[r][c] = players[k]
  }

  steps.push({
    board: JSON.parse(JSON.stringify(board)),
    activePseudoLine: 1,
    explanation: 'Starting Alpha-Beta Pruning. Optimization of MinMax with branch pruning.',
    player: 'X',
    alpha: -Infinity,
    beta: Infinity,
    depth: 0,
    pruned: false,
    status: 'start'
  })

  function alphaBeta(b, depth, alpha, beta, isMaximizing, path = []) {
    // Check terminal state
    const winner = checkWinner(b)
    
    if (winner === 'X') return 10 - depth
    if (winner === 'O') return depth - 10
    if (winner === 'draw') return 0

    if (depth > 6) return 0 // Depth limit

    if (isMaximizing) {
      let maxScore = -Infinity

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (b[i][j] === '') {
            b[i][j] = 'X'

            steps.push({
              board: JSON.parse(JSON.stringify(b)),
              activePseudoLine: 6,
              explanation: `Max trying (${i},${j}). α=${alpha.toFixed(1)}, β=${beta.toFixed(1)}`,
              player: 'X',
              alpha,
              beta,
              depth,
              currentMove: { row: i, col: j },
              pruned: false,
              status: 'maximizing'
            })

            const score = alphaBeta(b, depth + 1, alpha, beta, false, [...path, `(${i},${j})`])
            b[i][j] = ''

            maxScore = Math.max(maxScore, score)
            alpha = Math.max(alpha, score)

            if (beta <= alpha) {
              steps.push({
                board: JSON.parse(JSON.stringify(b)),
                activePseudoLine: 8,
                explanation: `✂️ Pruned! β(${beta.toFixed(1)}) ≤ α(${alpha.toFixed(1)}). Skip remaining branches.`,
                player: 'X',
                alpha,
                beta,
                depth,
                currentMove: { row: i, col: j },
                pruned: true,
                status: 'pruned'
              })
              break // Prune
            }
          }
        }
        if (beta <= alpha) break
      }

      return maxScore
    } else {
      let minScore = Infinity

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (b[i][j] === '') {
            b[i][j] = 'O'

            steps.push({
              board: JSON.parse(JSON.stringify(b)),
              activePseudoLine: 10,
              explanation: `Min trying (${i},${j}). α=${alpha.toFixed(1)}, β=${beta.toFixed(1)}`,
              player: 'O',
              alpha,
              beta,
              depth,
              currentMove: { row: i, col: j },
              pruned: false,
              status: 'minimizing'
            })

            const score = alphaBeta(b, depth + 1, alpha, beta, true, [...path, `(${i},${j})`])
            b[i][j] = ''

            minScore = Math.min(minScore, score)
            beta = Math.min(beta, score)

            if (beta <= alpha) {
              steps.push({
                board: JSON.parse(JSON.stringify(b)),
                activePseudoLine: 12,
                explanation: `✂️ Pruned! β(${beta.toFixed(1)}) ≤ α(${alpha.toFixed(1)}). Skip remaining branches.`,
                player: 'O',
                alpha,
                beta,
                depth,
                currentMove: { row: i, col: j },
                pruned: true,
                status: 'pruned'
              })
              break // Prune
            }
          }
        }
        if (beta <= alpha) break
      }

      return minScore
    }
  }

  function checkWinner(b) {
    for (let i = 0; i < 3; i++) {
      if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0]
      if (b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i]) return b[0][i]
    }
    if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0]
    if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2]
    
    let empty = false
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (b[i][j] === '') empty = true
      }
    }
    return empty ? null : 'draw'
  }

  const finalScore = alphaBeta(board, 0, -Infinity, Infinity, true)

  steps.push({
    board: JSON.parse(JSON.stringify(board)),
    activePseudoLine: 14,
    explanation: `✅ Alpha-Beta pruning complete. Best score: ${finalScore}. Pruned branches saved computation!`,
    player: 'X',
    alpha: finalScore,
    beta: finalScore,
    depth: 0,
    pruned: false,
    status: 'success'
  })

  return steps
}
