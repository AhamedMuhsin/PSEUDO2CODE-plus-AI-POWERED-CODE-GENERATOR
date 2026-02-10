/**
 * Check Path Between Nodes Steps Generator
 */
export function checkPathSteps(graph, params) {
  const steps = []
  const startNode = params?.startNode || graph.nodes[0]
  const endNode = params?.endNode || graph.nodes[graph.nodes.length - 1]

  if (!startNode || !endNode) {
    return [{
      type: "info",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: [],
      activeNode: null,
      activePseudoLine: 0,
      explanation: "Insufficient nodes to check path."
    }]
  }

  steps.push({
    type: "init",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: [],
    activeNode: startNode,
    highlightedEdges: [],
    sourceNode: startNode,
    targetNode: endNode,
    activePseudoLine: 0,
    explanation: `Checking if path exists from ${startNode} to ${endNode} using DFS.`
  })

  const visited = new Set()
  let pathFound = false
  const pathStack = []

  const dfsHelper = (node) => {
    if (node === endNode) {
      pathFound = true
      pathStack.push(node)

      steps.push({
        type: "found",
        graph: graph.nodes.map(n => ({ id: n, label: n })),
        edges: graph.edges,
        visitedNodes: Array.from(visited),
        activeNode: node,
        highlightedEdges: [],
        sourceNode: startNode,
        targetNode: endNode,
        pathStack: pathStack.slice(),
        activePseudoLine: 5,
        explanation: `✓ TARGET FOUND: Node ${endNode}!`,
        pathFound: true
      })

      return true
    }

    visited.add(node)
    pathStack.push(node)

    steps.push({
      type: "visit",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: Array.from(visited),
      activeNode: node,
      highlightedEdges: [],
      sourceNode: startNode,
      targetNode: endNode,
      pathStack: pathStack.slice(),
      activePseudoLine: 7,
      explanation: `Exploring node ${node}. Searching for ${endNode}...`
    })

    const neighbors = graph.getNeighbors(node)
    for (const neighbor of neighbors) {
      const nextNode = neighbor.node || neighbor

      if (!visited.has(nextNode)) {
        steps.push({
          type: "edge",
          graph: graph.nodes.map(n => ({ id: n, label: n })),
          edges: graph.edges,
          visitedNodes: Array.from(visited),
          activeNode: node,
          highlightedEdges: [{ from: node, to: nextNode }],
          sourceNode: startNode,
          targetNode: endNode,
          pathStack: pathStack.slice(),
          activePseudoLine: 8,
          explanation: `Following edge ${node} → ${nextNode}.`
        })

        if (dfsHelper(nextNode)) {
          return true
        }
      }
    }

    pathStack.pop()
    return false
  }

  dfsHelper(startNode)

  steps.push({
    type: "complete",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: Array.from(visited),
    activeNode: null,
    highlightedEdges: [],
    sourceNode: startNode,
    targetNode: endNode,
    pathStack: pathFound ? pathStack : [],
    activePseudoLine: 12,
    explanation: pathFound
      ? `✓ Path found: [${pathStack.join(" → ")}]`
      : `✗ No path exists from ${startNode} to ${endNode}`,
    pathFound,
    result: pathFound
  })

  return steps
}
