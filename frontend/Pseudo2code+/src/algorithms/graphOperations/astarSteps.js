/**
 * A* Algorithm Steps Generator
 * Works on weighted graphs to find shortest path using heuristic function.
 * A* = Dijkstra + Heuristic
 */
export function astarSteps(graph, params) {
  const steps = []
  const startNode = params?.startNode || graph.nodes[0]
  const goalNode = params?.goalNode || graph.nodes[graph.nodes.length - 1]

  if (!startNode || !goalNode) {
    return [{
      type: "info",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: [],
      activeNode: null,
      activePseudoLine: 0,
      explanation: "Please provide valid start and goal nodes."
    }]
  }

  // Heuristic function (estimated cost from node to goal)
  // For simplicity, use a basic heuristic based on node distance in alphabet/number
  const heuristic = (node) => {
    // Simple heuristic: alphabetical/numerical distance
    if (node === goalNode) return 0
    // If nodes are letters, use char code distance
    if (typeof node === 'string' && node.length === 1 && typeof goalNode === 'string' && goalNode.length === 1) {
      return Math.abs(node.charCodeAt(0) - goalNode.charCodeAt(0))
    }
    // If nodes are numbers
    if (!isNaN(node) && !isNaN(goalNode)) {
      return Math.abs(parseInt(node) - parseInt(goalNode))
    }
    // Default heuristic
    return 1
  }

  // If graph isn't weighted, treat all edges as weight 1
  const getWeight = (neighbor) => neighbor.weight !== undefined ? neighbor.weight : 1

  const gScore = {} // Cost from start to node
  const fScore = {} // gScore + heuristic
  const previousNodes = {}
  const openSet = new Set()
  const closedSet = new Set()

  // Initialize scores
  for (const node of graph.nodes) {
    gScore[node] = node === startNode ? 0 : Infinity
    fScore[node] = node === startNode ? heuristic(startNode) : Infinity
    previousNodes[node] = null
  }

  openSet.add(startNode)

  steps.push({
    type: "init",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: [],
    activeNode: startNode,
    highlightedEdges: [],
    gScore: { ...gScore },
    fScore: { ...fScore },
    heuristic: Object.fromEntries(graph.nodes.map(n => [n, heuristic(n)])),
    previousNodes: { ...previousNodes },
    openSet: Array.from(openSet),
    closedSet: Array.from(closedSet),
    activePseudoLine: 0,
    explanation: `Initialize A* from ${startNode} to ${goalNode}. g(${startNode}) = 0, h(${startNode}) = ${heuristic(startNode)}, f(${startNode}) = ${heuristic(startNode)}.`
  })

  const visitOrder = []

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let currentNode = null
    let lowestF = Infinity

    for (const node of openSet) {
      if (fScore[node] < lowestF) {
        lowestF = fScore[node]
        currentNode = node
      }
    }

    if (currentNode === null) break

    // Found the goal
    if (currentNode === goalNode) {
      visitOrder.push(currentNode)
      closedSet.add(currentNode)
      
      // Reconstruct path
      const path = []
      let temp = currentNode
      while (temp !== null) {
        path.unshift(temp)
        temp = previousNodes[temp]
      }

      steps.push({
        type: "success",
        graph: graph.nodes.map(n => ({ id: n, label: n })),
        edges: graph.edges,
        visitedNodes: visitOrder.slice(),
        activeNode: currentNode,
        highlightedEdges: [],
        gScore: { ...gScore },
        fScore: { ...fScore },
        heuristic: Object.fromEntries(graph.nodes.map(n => [n, heuristic(n)])),
        previousNodes: { ...previousNodes },
        openSet: Array.from(openSet),
        closedSet: Array.from(closedSet),
        path: path,
        activePseudoLine: 15,
        explanation: `🎯 Goal reached! Path found: ${path.join(' → ')}. Total cost: ${gScore[goalNode]}.`
      })

      return steps
    }

    openSet.delete(currentNode)
    closedSet.add(currentNode)
    visitOrder.push(currentNode)

    steps.push({
      type: "select",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: visitOrder.slice(),
      activeNode: currentNode,
      highlightedEdges: [],
      gScore: { ...gScore },
      fScore: { ...fScore },
      heuristic: Object.fromEntries(graph.nodes.map(n => [n, heuristic(n)])),
      previousNodes: { ...previousNodes },
      openSet: Array.from(openSet),
      closedSet: Array.from(closedSet),
      activePseudoLine: 5,
      explanation: `Select ${currentNode} from open set (lowest f = ${fScore[currentNode].toFixed(2)}). g = ${gScore[currentNode]}, h = ${heuristic(currentNode)}.`
    })

    const neighbors = graph.getNeighbors(currentNode)
    for (const neighbor of neighbors) {
      const nextNode = neighbor.node || neighbor
      const weight = getWeight(neighbor)

      if (closedSet.has(nextNode)) continue

      const tentativeGScore = gScore[currentNode] + weight

      if (!openSet.has(nextNode)) {
        openSet.add(nextNode)
      } else if (tentativeGScore >= gScore[nextNode]) {
        // This path is not better
        steps.push({
          type: "skip",
          graph: graph.nodes.map(n => ({ id: n, label: n })),
          edges: graph.edges,
          visitedNodes: visitOrder.slice(),
          activeNode: currentNode,
          highlightedEdges: [{ from: currentNode, to: nextNode }],
          gScore: { ...gScore },
          fScore: { ...fScore },
          heuristic: Object.fromEntries(graph.nodes.map(n => [n, heuristic(n)])),
          previousNodes: { ...previousNodes },
          openSet: Array.from(openSet),
          closedSet: Array.from(closedSet),
          activePseudoLine: 9,
          explanation: `Check ${currentNode} → ${nextNode} (weight ${weight}). New g would be ${tentativeGScore}, current g is ${gScore[nextNode]}. Keep current path.`
        })
        continue
      }

      // This is a better path
      const oldGScore = gScore[nextNode]
      const oldFScore = fScore[nextNode]
      
      previousNodes[nextNode] = currentNode
      gScore[nextNode] = tentativeGScore
      fScore[nextNode] = tentativeGScore + heuristic(nextNode)

      steps.push({
        type: "update",
        graph: graph.nodes.map(n => ({ id: n, label: n })),
        edges: graph.edges,
        visitedNodes: visitOrder.slice(),
        activeNode: currentNode,
        highlightedEdges: [{ from: currentNode, to: nextNode }],
        gScore: { ...gScore },
        fScore: { ...fScore },
        heuristic: Object.fromEntries(graph.nodes.map(n => [n, heuristic(n)])),
        previousNodes: { ...previousNodes },
        openSet: Array.from(openSet),
        closedSet: Array.from(closedSet),
        activePseudoLine: 11,
        explanation: `Update ${nextNode}: g = ${gScore[nextNode]} (was ${oldGScore === Infinity ? '∞' : oldGScore}), h = ${heuristic(nextNode)}, f = ${fScore[nextNode].toFixed(2)} (was ${oldFScore === Infinity ? '∞' : oldFScore.toFixed(2)}).`
      })
    }
  }

  // No path found
  steps.push({
    type: "failure",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: visitOrder.slice(),
    activeNode: null,
    highlightedEdges: [],
    gScore: { ...gScore },
    fScore: { ...fScore },
    heuristic: Object.fromEntries(graph.nodes.map(n => [n, heuristic(n)])),
    previousNodes: { ...previousNodes },
    openSet: Array.from(openSet),
    closedSet: Array.from(closedSet),
    activePseudoLine: 16,
    explanation: `❌ No path found from ${startNode} to ${goalNode}.`
  })

  return steps
}
