export function nQueensSteps(n = 4) {
  const steps = []
  const board = Array(n).fill(null).map(() => Array(n).fill(0))
  const queens = []

  steps.push({
    board: JSON.parse(JSON.stringify(board)),
    queens: [...queens],
    activePseudoLine: 1,
    explanation: `Starting N-Queens problem with ${n}×${n} board. Goal: Place ${n} queens so no two attack each other.`,
    attemptRow: null,
    attemptCol: null,
    status: 'start'
  })

  function isSafe(row, col) {
    // Check row
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 1) return false
    }
    
    // Check upper diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false
    }
    
    // Check lower diagonal
    for (let i = row, j = col; i < n && j >= 0; i++, j--) {
      if (board[i][j] === 1) return false
    }
    
    return true
  }

  function solveNQueens(col) {
    if (col >= n) {
      steps.push({
        board: JSON.parse(JSON.stringify(board)),
        queens: [...queens],
        activePseudoLine: 10,
        explanation: `✅ Solution found! All ${n} queens placed successfully.`,
        attemptRow: null,
        attemptCol: null,
        status: 'success'
      })
      return true
    }

    for (let row = 0; row < n; row++) {
      steps.push({
        board: JSON.parse(JSON.stringify(board)),
        queens: [...queens],
        activePseudoLine: 3,
        explanation: `Trying to place queen at position (${row}, ${col})...`,
        attemptRow: row,
        attemptCol: col,
        status: 'checking'
      })

      if (isSafe(row, col)) {
        board[row][col] = 1
        queens.push({ row, col })

        steps.push({
          board: JSON.parse(JSON.stringify(board)),
          queens: [...queens],
          activePseudoLine: 5,
          explanation: `✓ Position (${row}, ${col}) is safe! Queen placed.`,
          attemptRow: row,
          attemptCol: col,
          status: 'placed'
        })

        if (solveNQueens(col + 1)) {
          return true
        }

        // Backtrack
        board[row][col] = 0
        queens.pop()

        steps.push({
          board: JSON.parse(JSON.stringify(board)),
          queens: [...queens],
          activePseudoLine: 8,
          explanation: `✗ Backtracking! Removing queen from (${row}, ${col})`,
          attemptRow: row,
          attemptCol: col,
          status: 'backtrack'
        })
      } else {
        steps.push({
          board: JSON.parse(JSON.stringify(board)),
          queens: [...queens],
          activePseudoLine: 4,
          explanation: `✗ Position (${row}, ${col}) is not safe (conflict detected)`,
          attemptRow: row,
          attemptCol: col,
          status: 'conflict'
        })
      }
    }

    return false
  }

  const solved = solveNQueens(0)

  if (!solved) {
    steps.push({
      board: JSON.parse(JSON.stringify(board)),
      queens: [...queens],
      activePseudoLine: 11,
      explanation: `No solution exists for a ${n}x${n} board.`,
      attemptRow: null,
      attemptCol: null,
      status: 'failed'
    })
  }

  return steps
}
