export function minimaxSteps() {
  const steps = []
  
  // Simple Tic-Tac-Toe game tree example
  const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]

  // Generate a random mid-game board position (alternating X and O)
  // Place 2-3 random moves so the tree is small enough to visualize
  const allPositions = []
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      allPositions.push([i, j])

  // Shuffle positions
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]]
  }

  // Place 3 moves: X, O, X (so it's O's implied turn but we evaluate for X maximizer)
  const numMoves = 3
  const players = ['X', 'O', 'X']
  for (let k = 0; k < numMoves; k++) {
    const [r, c] = allPositions[k]
    board[r][c] = players[k]
  }

  steps.push({
    board: JSON.parse(JSON.stringify(board)),
    activePseudoLine: 1,
    explanation: 'Starting MinMax Algorithm for Tic-Tac-Toe. X is maximizer, O is minimizer.',
    player: 'X',
    bestMove: null,
    score: null,
    depth: 0,
    status: 'start'
  })

  function checkWinner(b) {
    // Check rows, columns, diagonals
    for (let i = 0; i < 3; i++) {
      if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0]
      if (b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i]) return b[0][i]
    }
    if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0]
    if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2]
    
    // Check if board is full
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (b[i][j] === '') return null
      }
    }
    return 'draw'
  }

  function minimax(b, depth, isMaximizing) {
    const winner = checkWinner(b)
    
    if (winner === 'X') {
      steps.push({
        board: JSON.parse(JSON.stringify(b)),
        activePseudoLine: 3,
        explanation: `Leaf node: X wins! Score = +10 (depth: ${depth})`,
        player: isMaximizing ? 'X' : 'O',
        bestMove: null,
        score: 10 - depth,
        depth,
        status: 'terminal'
      })
      return 10 - depth
    }
    if (winner === 'O') {
      steps.push({
        board: JSON.parse(JSON.stringify(b)),
        activePseudoLine: 4,
        explanation: `Leaf node: O wins! Score = -10 (depth: ${depth})`,
        player: isMaximizing ? 'X' : 'O',
        bestMove: null,
        score: depth - 10,
        depth,
        status: 'terminal'
      })
      return depth - 10
    }
    if (winner === 'draw') {
      steps.push({
        board: JSON.parse(JSON.stringify(b)),
        activePseudoLine: 5,
        explanation: `Leaf node: Draw! Score = 0 (depth: ${depth})`,
        player: isMaximizing ? 'X' : 'O',
        bestMove: null,
        score: 0,
        depth,
        status: 'terminal'
      })
      return 0
    }

    if (isMaximizing) {
      let maxScore = -Infinity
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (b[i][j] === '') {
            b[i][j] = 'X'
            steps.push({
              board: JSON.parse(JSON.stringify(b)),
              activePseudoLine: 6,
              explanation: `Maximizer trying move at (${i},${j})`,
              player: 'X',
              bestMove: { row: i, col: j },
              score: null,
              depth,
              status: 'maximizing'
            })
            const score = minimax(b, depth + 1, false)
            b[i][j] = ''
            maxScore = Math.max(maxScore, score)
          }
        }
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
              activePseudoLine: 8,
              explanation: `Minimizer trying move at (${i},${j})`,
              player: 'O',
              bestMove: { row: i, col: j },
              score: null,
              depth,
              status: 'minimizing'
            })
            const score = minimax(b, depth + 1, true)
            b[i][j] = ''
            minScore = Math.min(minScore, score)
          }
        }
      }
      return minScore
    }
  }

  // Find the best move for X (maximizer)
  steps.push({
    board: JSON.parse(JSON.stringify(board)),
    activePseudoLine: 2,
    explanation: 'Current game state. Finding best move for X (maximizer)...',
    player: 'X',
    bestMove: null,
    score: null,
    depth: 0,
    status: 'analyzing'
  })

  // Track the best move at the top level
  let bestScore = -Infinity
  let bestMove = null
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        board[i][j] = 'X'
        steps.push({
          board: JSON.parse(JSON.stringify(board)),
          activePseudoLine: 6,
          explanation: `Maximizer trying move at (${i},${j})`,
          player: 'X',
          bestMove: { row: i, col: j },
          score: null,
          depth: 0,
          status: 'maximizing'
        })
        const score = minimax(board, 1, false)
        board[i][j] = ''
        if (score > bestScore) {
          bestScore = score
          bestMove = { row: i, col: j }
        }
      }
    }
  }

  steps.push({
    board: JSON.parse(JSON.stringify(board)),
    activePseudoLine: 10,
    explanation: `✅ MinMax analysis complete! Best move: (${bestMove ? bestMove.row : '?'},${bestMove ? bestMove.col : '?'}) with score ${bestScore}`,
    player: 'X',
    bestMove,
    score: bestScore,
    depth: 0,
    status: 'success'
  })

  return steps
}
