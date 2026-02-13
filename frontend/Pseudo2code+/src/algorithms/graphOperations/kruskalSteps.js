/**
 * Kruskal's Algorithm Steps Generator
 * Finds the Minimum Spanning Tree (MST) of a weighted, undirected graph.
 * Uses Union-Find (Disjoint Set Union) to detect cycles.
 * Greedy approach: sort edges by weight and add them if they don't create a cycle.
 */

/**
 * Union-Find (Disjoint Set Union) Data Structure
 * Helps us track which nodes are connected and detect cycles efficiently.
 */
class UnionFind {
  constructor(nodes) {
    // Each node starts as its own parent (its own separate group)
    this.parent = {}
    // Rank helps keep the tree flat for faster operations
    this.rank = {}
    
    for (const node of nodes) {
      this.parent[node] = node  // Initially, each node is its own boss
      this.rank[node] = 0       // All groups start with rank 0
    }
  }

  /**
   * Find the root/boss of a node's group
   * Uses path compression to make future lookups faster
   */
  find(node) {
    if (this.parent[node] !== node) {
      // Recursively find the root and compress the path
      this.parent[node] = this.find(this.parent[node])
    }
    return this.parent[node]
  }

  /**
   * Merge two groups together
   * Returns true if they were separate (successful union), false if already connected
   */
  union(node1, node2) {
    const root1 = this.find(node1)
    const root2 = this.find(node2)

    // Already in the same group - would create a cycle!
    if (root1 === root2) {
      return false
    }

    // Merge smaller group into larger one (union by rank)
    if (this.rank[root1] < this.rank[root2]) {
      this.parent[root1] = root2
    } else if (this.rank[root1] > this.rank[root2]) {
      this.parent[root2] = root1
    } else {
      this.parent[root2] = root1
      this.rank[root1]++
    }

    return true
  }

  /**
   * Get current parent mapping for visualization
   */
  getParents() {
    const parents = {}
    for (const node in this.parent) {
      parents[node] = this.parent[node]
    }
    return parents
  }
}

/**
 * Generate step-by-step visualization of Kruskal's algorithm
 */
export function kruskalSteps(graph, params) {
  const steps = []

  if (!graph.nodes || graph.nodes.length === 0) {
    return [{
      type: "info",
      graph: [],
      edges: [],
      visitedNodes: [],
      activeNode: null,
      highlightedEdges: [],
      mstEdges: [],
      mstCost: 0,
      sortedEdges: [],
      currentEdgeIndex: -1,
      parent: {},
      activePseudoLine: 0,
      explanation: "Empty graph. Nothing to do."
    }]
  }

  if (graph.nodes.length === 1) {
    return [{
      type: "complete",
      graph: graph.nodes.map(n => ({ id: n, label: n })),
      edges: graph.edges,
      visitedNodes: graph.nodes,
      activeNode: graph.nodes[0],
      highlightedEdges: [],
      mstEdges: [],
      mstCost: 0,
      sortedEdges: [],
      currentEdgeIndex: -1,
      parent: Object.fromEntries([[graph.nodes[0], graph.nodes[0]]]),
      activePseudoLine: 0,
      explanation: "Only one node in graph. MST is trivial (no edges needed)."
    }]
  }

  // STEP 1: Collect and sort all edges by weight
  const allEdges = []
  const seen = new Set()
  
  // For undirected graphs, avoid duplicate edges
  for (const edge of graph.edges) {
    const key1 = `${edge.from}-${edge.to}`
    const key2 = `${edge.to}-${edge.from}`
    
    if (!seen.has(key1) && !seen.has(key2)) {
      allEdges.push({
        from: edge.from,
        to: edge.to,
        weight: edge.weight || 1
      })
      seen.add(key1)
      seen.add(key2)
    }
  }

  // Sort edges by weight (smallest first - greedy approach!)
  allEdges.sort((a, b) => a.weight - b.weight)

  const uf = new UnionFind(graph.nodes)
  const mstEdges = []
  let mstCost = 0

  // Initial step: show sorted edges
  steps.push({
    type: "init",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: [],
    activeNode: null,
    highlightedEdges: [],
    mstEdges: [],
    mstCost: 0,
    sortedEdges: allEdges.map(e => ({ ...e })),
    currentEdgeIndex: -1,
    parent: uf.getParents(),
    activePseudoLine: 0,
    explanation: `🎯 KRUSKAL'S ALGORITHM STARTS! We have ${graph.nodes.length} nodes and ${allEdges.length} edges. STEP 1: Sort all edges by weight (lightest first). Think of it like sorting prices from cheapest to most expensive. We'll pick the cheapest edges that don't create loops!`
  })

  // STEP 2: Process each edge in sorted order
  for (let i = 0; i < allEdges.length; i++) {
    const edge = allEdges[i]
    const { from, to, weight } = edge

    // Find which "group" each node belongs to
    const root1 = uf.find(from)
    const root2 = uf.find(to)

    // Check if adding this edge would create a cycle
    const wouldCreateCycle = root1 === root2

    if (wouldCreateCycle) {
      // SKIP: This edge would create a cycle
      steps.push({
        type: "skip",
        graph: graph.nodes.map(n => ({ id: n, label: n })),
        edges: graph.edges,
        visitedNodes: graph.nodes.filter(n => {
          // Mark nodes that are already in the MST
          return mstEdges.some(e => e.from === n || e.to === n)
        }),
        activeNode: null,
        highlightedEdges: [{ from, to }],
        mstEdges: mstEdges.map(e => ({ ...e })),
        mstCost,
        sortedEdges: allEdges.map(e => ({ ...e })),
        currentEdgeIndex: i,
        parent: uf.getParents(),
        activePseudoLine: 7,
        explanation: `❌ SKIP edge ${from}—${to} (weight ${weight}). Both ${from} and ${to} are already in the same group/tree (they're already connected). Adding this would create a LOOP/CYCLE, which trees can't have! Imagine: if you can already walk from ${from} to ${to}, adding another path creates a circle. Trees don't have circles!`
      })
    } else {
      // ACCEPT: This edge connects two separate groups
      // First show we're considering it
      steps.push({
        type: "consider",
        graph: graph.nodes.map(n => ({ id: n, label: n })),
        edges: graph.edges,
        visitedNodes: graph.nodes.filter(n => {
          return mstEdges.some(e => e.from === n || e.to === n)
        }),
        activeNode: null,
        highlightedEdges: [{ from, to }],
        mstEdges: mstEdges.map(e => ({ ...e })),
        mstCost,
        sortedEdges: allEdges.map(e => ({ ...e })),
        currentEdgeIndex: i,
        parent: uf.getParents(),
        activePseudoLine: 5,
        explanation: `🔍 CHECKING edge ${from}—${to} (weight ${weight}). Node ${from} is in group "${root1}" and node ${to} is in group "${root2}". They're in DIFFERENT groups! This means we can connect them without creating a loop.`
      })

      // Add the edge to MST
      uf.union(from, to)
      mstEdges.push({ from, to, weight })
      mstCost += weight

      steps.push({
        type: "accept",
        graph: graph.nodes.map(n => ({ id: n, label: n })),
        edges: graph.edges,
        visitedNodes: graph.nodes.filter(n => {
          return mstEdges.some(e => e.from === n || e.to === n)
        }),
        activeNode: null,
        highlightedEdges: [{ from, to }],
        mstEdges: mstEdges.map(e => ({ ...e })),
        mstCost,
        sortedEdges: allEdges.map(e => ({ ...e })),
        currentEdgeIndex: i,
        parent: uf.getParents(),
        activePseudoLine: 9,
        explanation: `✅ ACCEPT edge ${from}—${to} (weight ${weight})! Added to MST. We've now connected the groups that contained ${from} and ${to} into ONE bigger group. MST now has ${mstEdges.length} edge${mstEdges.length !== 1 ? 's' : ''}, total cost: ${mstCost}. We need ${graph.nodes.length - 1} edges total to connect ${graph.nodes.length} nodes.`
      })

      // Check if MST is complete (we need n-1 edges for n nodes)
      if (mstEdges.length === graph.nodes.length - 1) {
        break // MST is complete!
      }
    }
  }

  // Final step
  steps.push({
    type: "complete",
    graph: graph.nodes.map(n => ({ id: n, label: n })),
    edges: graph.edges,
    visitedNodes: graph.nodes,
    activeNode: null,
    highlightedEdges: mstEdges.map(e => ({ from: e.from, to: e.to })),
    mstEdges: mstEdges.map(e => ({ ...e })),
    mstCost,
    sortedEdges: allEdges.map(e => ({ ...e })),
    currentEdgeIndex: allEdges.length,
    parent: uf.getParents(),
    activePseudoLine: 11,
    explanation: `🎉 MST COMPLETE! We've built a Minimum Spanning Tree that connects all ${graph.nodes.length} nodes with the cheapest possible edges. Total cost: ${mstCost}. MST edges: ${mstEdges.map(e => `${e.from}—${e.to}(${e.weight})`).join(', ')}. Think of it like building roads between cities - we connected everyone with the minimum total cost!`
  })

  return steps
}
