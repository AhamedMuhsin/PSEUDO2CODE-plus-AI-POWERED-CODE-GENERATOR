/**
 * Dijkstra's Algorithm Steps Generator
 */
export function dijkstraSteps(graph, params) {
  const steps = []
  const startNode = params?.startNode || graph.nodes[0]

  if (!startNode || !graph.isWeighted) {
    return [{
      type: "info",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: [],
      activeNode: null,
      activePseudoLine: 0,
      explanation: "Dijkstra's algorithm requires a weighted graph."
    }]
  }

  const distances = {}
  const previousNodes = {}
  const unvisited = new Set()

  // Initialize
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
    unvisited: Array.from(unvisited),
    activePseudoLine: 0,
    explanation: `Initializing Dijkstra from node ${startNode}. Set distance to 0, others to infinity.`
  })

  const visitOrder = []

  while (unvisited.size > 0) {
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
      unvisited: Array.from(unvisited),
      activePseudoLine: 5,
      explanation: `Selected node ${currentNode} with distance ${distances[currentNode]}.`
    })

    const neighbors = graph.getNeighbors(currentNode)
    for (const neighbor of neighbors) {
      const nextNode = neighbor.node
      const weight = neighbor.weight

      if (unvisited.has(nextNode)) {
        const newDistance = distances[currentNode] + weight

        steps.push({
          type: "relax",
          graph: graph.nodes.map(n => ({ id: n, label: n })),
          edges: graph.edges,
          visitedNodes: visitOrder.slice(),
          activeNode: currentNode,
          highlightedEdges: [{ from: currentNode, to: nextNode }],
          distances: { ...distances },
          unvisited: Array.from(unvisited),
          activePseudoLine: 8,
          explanation: `Relaxing edge ${currentNode} → ${nextNode} (weight ${weight}). New distance: ${newDistance}.`,
          isUpdate: newDistance < distances[nextNode]
        })

        if (newDistance < distances[nextNode]) {
          distances[nextNode] = newDistance
          previousNodes[nextNode] = currentNode
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
    distances,
    previousNodes,
    activePseudoLine: 12,
    explanation: `✓ Dijkstra Complete! Shortest distances from ${startNode}: ${Object.entries(distances).map(([n, d]) => `${n}:${d}`).join(", ")}`,
    result: { distances, previousNodes }
  })

  return steps
}
