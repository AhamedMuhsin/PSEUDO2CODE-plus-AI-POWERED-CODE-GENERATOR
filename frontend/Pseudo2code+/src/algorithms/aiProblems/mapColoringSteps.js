export function mapColoringSteps() {
  const steps = []
  
  // Define Australia map (classic CSP example)
  const regions = ['WA', 'NT', 'SA', 'QLD', 'NSW', 'VIC', 'TAS']
  const colors = ['RED', 'GREEN', 'BLUE']
  const assignments = {}
  
  // Adjacency list
  const neighbors = {
    'WA': ['NT', 'SA'],
    'NT': ['WA', 'SA', 'QLD'],
    'SA': ['WA', 'NT', 'QLD', 'NSW', 'VIC'],
    'QLD': ['NT', 'SA', 'NSW'],
    'NSW': ['QLD', 'SA', 'VIC'],
    'VIC': ['SA', 'NSW'],
    'TAS': [] // Tasmania - no neighbors
  }

  steps.push({
    assignments: { ...assignments },
    adjacency: neighbors,
    activePseudoLine: 1,
    explanation: `Starting Map Coloring CSP. 7 regions, 3 colors (Red, Green, Blue). No adjacent regions can have same color.`,
    currentRegion: null,
    conflicts: [],
    status: 'start'
  })

  function isConsistent(region, color) {
    for (const neighbor of neighbors[region]) {
      if (assignments[neighbor] === color) {
        return false
      }
    }
    return true
  }

  function backtrack(regionIndex) {
    if (regionIndex === regions.length) {
      return true // All regions colored
    }

    const region = regions[regionIndex]

    steps.push({
      assignments: { ...assignments },
      adjacency: neighbors,
      activePseudoLine: 3,
      explanation: `Trying to color region: ${region}`,
      currentRegion: region,
      conflicts: [],
      status: 'selecting'
    })

    for (const color of colors) {
      steps.push({
        assignments: { ...assignments },
        adjacency: neighbors,
        activePseudoLine: 5,
        explanation: `Trying color ${color} for ${region}...`,
        currentRegion: region,
        tryingColor: color,
        conflicts: [],
        status: 'trying'
      })

      if (isConsistent(region, color)) {
        assignments[region] = color

        steps.push({
          assignments: { ...assignments },
          adjacency: neighbors,
          activePseudoLine: 7,
          explanation: `✓ ${color} is valid for ${region}! No conflicts with neighbors.`,
          currentRegion: region,
          tryingColor: color,
          conflicts: [],
          status: 'assigned'
        })

        if (backtrack(regionIndex + 1)) {
          return true
        }

        // Backtrack
        delete assignments[region]

        steps.push({
          assignments: { ...assignments },
          adjacency: neighbors,
          activePseudoLine: 10,
          explanation: `✗ Backtracking! Removing ${color} from ${region}`,
          currentRegion: region,
          conflicts: [],
          status: 'backtrack'
        })
      } else {
        const conflictingNeighbors = neighbors[region].filter(n => assignments[n] === color)
        
        steps.push({
          assignments: { ...assignments },
          adjacency: neighbors,
          activePseudoLine: 6,
          explanation: `✗ ${color} conflicts with neighbors: ${conflictingNeighbors.join(', ')}`,
          currentRegion: region,
          tryingColor: color,
          conflicts: conflictingNeighbors,
          status: 'conflict'
        })
      }
    }

    return false
  }

  backtrack(0)

  steps.push({
    assignments: { ...assignments },
    adjacency: neighbors,
    activePseudoLine: 12,
    explanation: `✅ Map coloring complete! All regions colored with no conflicts.`,
    currentRegion: null,
    conflicts: [],
    status: 'success'
  })

  return steps
}
