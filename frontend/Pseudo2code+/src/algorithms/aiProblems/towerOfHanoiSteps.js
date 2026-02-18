export function towerOfHanoiSteps(n = 3) {
  const steps = []
  const towers = {
    A: Array.from({ length: n }, (_, i) => n - i),
    B: [],
    C: []
  }

  steps.push({
    towers: JSON.parse(JSON.stringify(towers)),
    activePseudoLine: 1,
    explanation: `Starting Tower of Hanoi with ${n} disks. Goal: Move all disks from A to C.`,
    moveFrom: null,
    moveTo: null,
    moveCount: 0,
    status: 'start'
  })

  let moveCount = 0

  function moveDisk(from, to) {
    const disk = towers[from].pop()
    towers[to].push(disk)
    moveCount++

    steps.push({
      towers: JSON.parse(JSON.stringify(towers)),
      activePseudoLine: 5,
      explanation: `Move ${moveCount}: Disk ${disk} from rod ${from} to rod ${to}`,
      moveFrom: from,
      moveTo: to,
      disk: disk,
      moveCount: moveCount,
      status: 'moving'
    })
  }

  function hanoi(n, source, destination, auxiliary) {
    if (n <= 0) return
    if (n === 1) {
      steps.push({
        towers: JSON.parse(JSON.stringify(towers)),
        activePseudoLine: 2,
        explanation: `Base case: Only 1 disk to move from ${source} to ${destination}`,
        moveFrom: source,
        moveTo: destination,
        moveCount: moveCount,
        status: 'base_case'
      })
      moveDisk(source, destination)
      return
    }

    steps.push({
      towers: JSON.parse(JSON.stringify(towers)),
      activePseudoLine: 3,
      explanation: `Move ${n-1} disks from ${source} to ${auxiliary} using ${destination}`,
      moveFrom: source,
      moveTo: auxiliary,
      moveCount: moveCount,
      status: 'recursive'
    })
    hanoi(n - 1, source, auxiliary, destination)

    steps.push({
      towers: JSON.parse(JSON.stringify(towers)),
      activePseudoLine: 4,
      explanation: `Move largest disk (${n}) from ${source} to ${destination}`,
      moveFrom: source,
      moveTo: destination,
      moveCount: moveCount,
      status: 'recursive'
    })
    moveDisk(source, destination)

    steps.push({
      towers: JSON.parse(JSON.stringify(towers)),
      activePseudoLine: 6,
      explanation: `Move ${n-1} disks from ${auxiliary} to ${destination} using ${source}`,
      moveFrom: auxiliary,
      moveTo: destination,
      moveCount: moveCount,
      status: 'recursive'
    })
    hanoi(n - 1, auxiliary, destination, source)
  }

  hanoi(n, 'A', 'C', 'B')

  steps.push({
    towers: JSON.parse(JSON.stringify(towers)),
    activePseudoLine: 7,
    explanation: `✅ Puzzle solved! All ${n} disks moved to rod C in ${moveCount} moves (Minimum: ${Math.pow(2, n) - 1})`,
    moveFrom: null,
    moveTo: null,
    moveCount: moveCount,
    status: 'success'
  })

  return steps
}
