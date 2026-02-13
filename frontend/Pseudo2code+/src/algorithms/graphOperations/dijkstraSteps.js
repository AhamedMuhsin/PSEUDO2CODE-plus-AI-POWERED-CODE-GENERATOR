/**
 * Dijkstra's Algorithm Steps Generator
 * Works on weighted graphs to find shortest paths from a start node.
 */
export function dijkstraSteps(graph, params) {
  const steps = []
  const startNode = params?.startNode || graph.nodes[0]

  if (!startNode) {
    return [{
      type: "info",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: [],
      activeNode: null,
      activePseudoLine: 0,
      explanation: "Empty graph. Nothing to do."
    }]
  }

  // If graph isn't weighted, treat all edges as weight 1
  const getWeight = (neighbor) => neighbor.weight !== undefined ? neighbor.weight : 1

  const distances = {}
  const previousNodes = {}
  const unvisited = new Set()

  // Initialize distances
  for (const node of graph.nodes) {
    distances[node] = node === startNode ? 0 : Infinity
    previousNodes[node] = null
    unvisited.add(node)
  }

  steps.push({
    type: "init",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: [],
    activeNode: startNode,
    highlightedEdges: [],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
    unvisited: Array.from(unvisited),
    activePseudoLine: 0,
    explanation: `Initialize Dijkstra from node ${startNode}. Distance to ${startNode} = 0, all others = ∞.`
  })

  const visitOrder = []

  while (unvisited.size > 0) {
    // Pick unvisited node with smallest distance
    let currentNode = null
    let minDistance = Infinity

    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node]
        currentNode = node
      }
    }

    if (currentNode === null || minDistance === Infinity) break

    unvisited.delete(currentNode)
    visitOrder.push(currentNode)

    steps.push({
      type: "select",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: visitOrder.slice(),
      activeNode: currentNode,
      highlightedEdges: [],
      distances: { ...distances },
      previousNodes: { ...previousNodes },
      unvisited: Array.from(unvisited),
      activePseudoLine: 5,
      explanation: `Select node ${currentNode} (shortest unvisited distance = ${distances[currentNode]}).`
    })

    const neighbors = graph.getNeighbors(currentNode)
    for (const neighbor of neighbors) {
      const nextNode = neighbor.node || neighbor
      const weight = getWeight(neighbor)

      if (unvisited.has(nextNode)) {
        const newDistance = distances[currentNode] + weight
        const oldDistance = distances[nextNode]
        const willUpdate = newDistance < oldDistance

        steps.push({
          type: "relax",
          graph: graph.nodes.map(n => ({ id: n, label: n })),
          edges: graph.edges,
          visitedNodes: visitOrder.slice(),
          activeNode: currentNode,
          highlightedEdges: [{ from: currentNode, to: nextNode }],
          distances: { ...distances },
          previousNodes: { ...previousNodes },
          unvisited: Array.from(unvisited),
          activePseudoLine: 8,
          explanation: willUpdate
            ? `Relax ${currentNode} → ${nextNode}: dist[${currentNode}](${distances[currentNode]}) + weight(${weight}) = ${newDistance} < dist[${nextNode}](${oldDistance === Infinity ? '∞' : oldDistance}). Update!`
            : `Check ${currentNode} → ${nextNode}: dist[${currentNode}](${distances[currentNode]}) + weight(${weight}) = ${newDistance} ≥ dist[${nextNode}](${oldDistance === Infinity ? '∞' : oldDistance}). No update.`,
          isUpdate: willUpdate
        })

        if (willUpdate) {
          distances[nextNode] = newDistance
          previousNodes[nextNode] = currentNode

          steps.push({
            type: "update",
            graph: graph.nodes.map(n => ({ id: n, label: n })),
            edges: graph.edges,
            visitedNodes: visitOrder.slice(),
            activeNode: currentNode,
            highlightedEdges: [{ from: currentNode, to: nextNode }],
            distances: { ...distances },
            previousNodes: { ...previousNodes },
            unvisited: Array.from(unvisited),
            activePseudoLine: 9,
            explanation: `Updated dist[${nextNode}] = ${newDistance}, previous[${nextNode}] = ${currentNode}.`
          })
        }
      }
    }
  }

  steps.push({
    type: "complete",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: visitOrder,
    activeNode: null,
    highlightedEdges: [],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
    unvisited: [],
    activePseudoLine: 12,
    explanation: `✓ Dijkstra Complete! Shortest distances from ${startNode}: ${graph.nodes.map(n => `${n}: ${distances[n] === Infinity ? '∞' : distances[n]}`).join(', ')}.`,
    result: { distances, previousNodes }
  })

  return steps
}
