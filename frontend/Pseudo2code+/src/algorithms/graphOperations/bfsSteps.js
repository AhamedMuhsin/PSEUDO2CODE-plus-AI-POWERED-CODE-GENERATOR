/**
 * BFS (Breadth-First Search) Steps Generator
 */
export function bfsSteps(graph, params) {
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
      explanation: "Empty graph. No BFS to perform."
    }]
  }

  // Initialize
  steps.push({
    type: "init",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: [],
    activeNode: null,
    highlightedEdges: [],
    queueState: [startNode],
    activePseudoLine: 0,
    explanation: `Starting BFS from node ${startNode}. Initialize queue with start node.`
  })

  const visited = new Set([startNode])
  const queue = [startNode]
  const result = []
  const visitedOrder = []

  while (queue.length > 0) {
    const currentNode = queue.shift()
    result.push(currentNode)
    visitedOrder.push(currentNode)

    steps.push({
      type: "process",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: visitedOrder.slice(),
      activeNode: currentNode,
      highlightedEdges: [],
      queueState: queue.slice(),
      activePseudoLine: 5,
      explanation: `Processing node ${currentNode}. Dequeued from queue.`,
      result: visitedOrder.slice()
    })

    const neighbors = graph.getNeighbors(currentNode)
    for (const neighbor of neighbors) {
      const nextNode = neighbor.node || neighbor
      const weight = neighbor.weight

      if (!visited.has(nextNode)) {
        visited.add(nextNode)
        queue.push(nextNode)

        steps.push({
          type: "enqueue",
          graph: graph.nodes.map(n => ({ id: n, label: n })),
          edges: graph.edges,
          visitedNodes: visitedOrder.slice(),
          activeNode: currentNode,
          highlightedEdges: [{ from: currentNode, to: nextNode }],
          queueState: queue.slice(),
          activePseudoLine: 7,
          explanation: `Discovered unvisited neighbor ${nextNode}. Added to queue.`,
          result: visitedOrder.slice()
        })
      }
    }
  }

  // Complete
  steps.push({
    type: "complete",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: result,
    activeNode: null,
    highlightedEdges: [],
    queueState: [],
    activePseudoLine: 10,
    explanation: `✓ BFS Complete! Traversal order: [${result.join(" → ")}]`,
    result
  })

  return steps
}
