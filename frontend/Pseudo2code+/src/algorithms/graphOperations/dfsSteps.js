/**
 * DFS (Depth-First Search) Steps Generator
 */
export function dfsSteps(graph, params) {
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
      explanation: "Empty graph. No DFS to perform."
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
    stackState: [startNode],
    activePseudoLine: 0,
    explanation: `Starting DFS from node ${startNode}. Initialize stack with start node.`
  })

  const visited = new Set()
  const result = []
  const visitedOrder = []

  const dfsHelper = (node, path = []) => {
    visited.add(node)
    result.push(node)
    visitedOrder.push(node)
    path = [...path, node]

    steps.push({
      type: "visit",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: visitedOrder.slice(),
      activeNode: node,
      highlightedEdges: [],
      stackState: path.slice(),
      activePseudoLine: 5,
      explanation: `Visiting node ${node}. Added to result.`,
      result: visitedOrder.slice()
    })

    const neighbors = graph.getNeighbors(node)
    for (const neighbor of neighbors) {
      const nextNode = neighbor.node || neighbor

      if (!visited.has(nextNode)) {
        steps.push({
          type: "explore",
          graph: graph.nodes.map(n => ({ id: n, label: n })),
          edges: graph.edges,
          visitedNodes: visitedOrder.slice(),
          activeNode: node,
          highlightedEdges: [{ from: node, to: nextNode }],
          stackState: [...path, nextNode],
          activePseudoLine: 7,
          explanation: `Exploring edge ${node} → ${nextNode}. Recursing to ${nextNode}.`,
          result: visitedOrder.slice()
        })

        dfsHelper(nextNode, path)
      }
    }

    steps.push({
      type: "backtrack",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: visitedOrder.slice(),
      activeNode: node,
      highlightedEdges: [],
      stackState: path.slice(),
      activePseudoLine: 10,
      explanation: `Backtracking from node ${node}. All neighbors explored.`,
      result: visitedOrder.slice()
    })
  }

  dfsHelper(startNode)

  // Complete
  steps.push({
    type: "complete",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: result,
    activeNode: null,
    highlightedEdges: [],
    stackState: [],
    activePseudoLine: 12,
    explanation: `✓ DFS Complete! Traversal order: [${result.join(" → ")}]`,
    result
  })

  return steps
}
