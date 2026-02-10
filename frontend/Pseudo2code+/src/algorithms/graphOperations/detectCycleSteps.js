/**
 * Detect Cycle Steps Generator
 */
export function detectCycleSteps(graph, params) {
  const steps = []

  steps.push({
    type: "info",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: [],
    activeNode: null,
    highlightedEdges: [],
    activePseudoLine: 0,
    explanation: "Starting cycle detection using DFS. Tracking back edges."
  })

  const visited = new Set()
  let cycleFound = false
  let cycleEdges = []

  const dfsHelper = (node, parent = null) => {
    visited.add(node)

    steps.push({
      type: "visit",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: Array.from(visited),
      activeNode: node,
      highlightedEdges: parent ? [{ from: parent, to: node }] : [],
      activePseudoLine: 5,
      explanation: `Visiting node ${node}${parent ? ` (from ${parent})` : " (start)"}`,
      cycleDetected: cycleFound
    })

    const neighbors = graph.getNeighbors(node)
    for (const neighbor of neighbors) {
      const nextNode = neighbor.node || neighbor

      if (!visited.has(nextNode)) {
        dfsHelper(nextNode, node)
      } else if (nextNode !== parent) {
        // Back edge found - cycle exists
        cycleFound = true
        cycleEdges.push({ from: node, to: nextNode, isBackEdge: true })

        steps.push({
          type: "cycle",
          graph: graph.nodes.map(n => ({ id: n, label: n })),
          edges: graph.edges,
          visitedNodes: Array.from(visited),
          activeNode: node,
          highlightedEdges: [{ from: node, to: nextNode, isBackEdge: true }],
          activePseudoLine: 8,
          explanation: `⚠️ Back edge found: ${node} → ${nextNode}. CYCLE DETECTED!`,
          cycleDetected: true
        })
      }
    }
  }

  for (const node of graph.nodes) {
    if (!visited.has(node)) {
      dfsHelper(node)
    }
  }

  steps.push({
    type: "complete",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: Array.from(visited),
    activeNode: null,
    highlightedEdges: cycleEdges,
    activePseudoLine: 12,
    explanation: cycleFound ? `✓ Cycle Detected! Back edges: [${cycleEdges.map(e => `${e.from}→${e.to}`).join(", ")}]` : "✓ No cycle found. Graph is acyclic.",
    cycleDetected: cycleFound,
    result: cycleFound
  })

  return steps
}
