/**
 * Prim's Algorithm Steps Generator
 * Finds the Minimum Spanning Tree (MST) of a weighted, undirected graph.
 * Greedy approach: always pick the cheapest edge connecting MST to a non-MST node.
 */
export function primSteps(graph, params) {
  const steps = []
  const startNode = params?.startNode || graph.nodes[0]

  if (!startNode || graph.nodes.length === 0) {
    return [{
      type: "info",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: [],
      activeNode: null,
      highlightedEdges: [],
      activePseudoLine: 0,
      explanation: "Empty graph. Nothing to do."
    }]
  }

  if (graph.nodes.length === 1) {
    return [{
      type: "complete",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: [startNode],
      activeNode: startNode,
      highlightedEdges: [],
      mstEdges: [],
      mstCost: 0,
      key: Object.fromEntries([[startNode, 0]]),
      parent: Object.fromEntries([[startNode, null]]),
      activePseudoLine: 0,
      explanation: "Only one node in graph. MST is trivial (no edges)."
    }]
  }

  const getWeight = (neighbor) => neighbor.weight !== undefined ? neighbor.weight : 1

  // Key values: minimum weight to connect each node to MST
  const key = {}
  const parent = {}
  const inMST = new Set()
  const mstEdges = []
  let mstCost = 0

  // Initialize
  for (const node of graph.nodes) {
    key[node] = node === startNode ? 0 : Infinity
    parent[node] = null
  }

  steps.push({
    type: "init",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: [],
    activeNode: startNode,
    highlightedEdges: [],
    mstEdges: [],
    mstCost: 0,
    key: { ...key },
    parent: { ...parent },
    inMST: Array.from(inMST),
    activePseudoLine: 0,
    explanation: `Initialize Prim's from node ${startNode}. Key[${startNode}] = 0, all others = ∞.`
  })

  for (let i = 0; i < graph.nodes.length; i++) {
    // Pick node not in MST with minimum key value
    let currentNode = null
    let minKey = Infinity

    for (const node of graph.nodes) {
      if (!inMST.has(node) && key[node] < minKey) {
        minKey = key[node]
        currentNode = node
      }
    }

    if (currentNode === null) break

    // Add node to MST
    inMST.add(currentNode)

    // Add MST edge (except for starting node)
    if (parent[currentNode] !== null) {
      const edgeWeight = key[currentNode]
      mstEdges.push({ from: parent[currentNode], to: currentNode, weight: edgeWeight })
      mstCost += edgeWeight
    }

    steps.push({
      type: "select",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: Array.from(inMST),
      activeNode: currentNode,
      highlightedEdges: parent[currentNode]
        ? [{ from: parent[currentNode], to: currentNode }]
        : [],
      mstEdges: mstEdges.map(e => ({ ...e })),
      mstCost,
      key: { ...key },
      parent: { ...parent },
      inMST: Array.from(inMST),
      activePseudoLine: 5,
      explanation: parent[currentNode]
        ? `Add ${currentNode} to MST via edge ${parent[currentNode]} → ${currentNode} (weight ${key[currentNode]}). MST cost: ${mstCost}.`
        : `Start MST from node ${currentNode} (key = 0).`
    })

    // Update keys of adjacent nodes
    const neighbors = graph.getNeighbors(currentNode)
    for (const neighbor of neighbors) {
      const nextNode = neighbor.node || neighbor
      const weight = getWeight(neighbor)

      if (!inMST.has(nextNode)) {
        const oldKey = key[nextNode]
        const willUpdate = weight < oldKey

        steps.push({
          type: "check",
          graph: graph.nodes.map(n => ({ id: n, label: n })),
          edges: graph.edges,
          visitedNodes: Array.from(inMST),
          activeNode: currentNode,
          highlightedEdges: [{ from: currentNode, to: nextNode }],
          mstEdges: mstEdges.map(e => ({ ...e })),
          mstCost,
          key: { ...key },
          parent: { ...parent },
          inMST: Array.from(inMST),
          activePseudoLine: 8,
          explanation: willUpdate
            ? `Edge ${currentNode} → ${nextNode} (weight ${weight}) < current key[${nextNode}] (${oldKey === Infinity ? '∞' : oldKey}). Update key!`
            : `Edge ${currentNode} → ${nextNode} (weight ${weight}) ≥ current key[${nextNode}] (${oldKey === Infinity ? '∞' : oldKey}). No update.`
        })

        if (willUpdate) {
          key[nextNode] = weight
          parent[nextNode] = currentNode

          steps.push({
            type: "update",
            graph: graph.nodes.map(n => ({ id: n, label: n })),
            edges: graph.edges,
            visitedNodes: Array.from(inMST),
            activeNode: currentNode,
            highlightedEdges: [{ from: currentNode, to: nextNode }],
            mstEdges: mstEdges.map(e => ({ ...e })),
            mstCost,
            key: { ...key },
            parent: { ...parent },
            inMST: Array.from(inMST),
            activePseudoLine: 10,
            explanation: `Updated key[${nextNode}] = ${weight}, parent[${nextNode}] = ${currentNode}.`
          })
        }
      }
    }
  }

  // Final step
  steps.push({
    type: "complete",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: Array.from(inMST),
    activeNode: null,
    highlightedEdges: mstEdges.map(e => ({ from: e.from, to: e.to })),
    mstEdges: mstEdges.map(e => ({ ...e })),
    mstCost,
    key: { ...key },
    parent: { ...parent },
    inMST: Array.from(inMST),
    activePseudoLine: 12,
    explanation: `✅ MST Complete! Total cost: ${mstCost}. MST edges: ${mstEdges.map(e => `${e.from}—${e.to}(${e.weight})`).join(', ')}.`
  })

  return steps
}
