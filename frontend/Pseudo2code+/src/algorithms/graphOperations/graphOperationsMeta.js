export const graphOperationsMeta = {
  bfs: {
    time: "O(V + E)",
    space: "O(V)",
    stable: true,
    description: "BFS explores graph level by level using a queue. Uses linear time proportional to vertices + edges."
  },
  dfs: {
    time: "O(V + E)",
    space: "O(V)",
    stable: true,
    description: "DFS recursively explores graph using a stack. Visits all nodes and edges once."
  },
  detectCycle: {
    time: "O(V + E)",
    space: "O(V)",
    stable: true,
    description: "Uses DFS to detect back edges which indicate cycles. Works for both directed and undirected graphs."
  },
  checkPath: {
    time: "O(V + E)",
    space: "O(V)",
    stable: true,
    description: "Uses DFS to explore all reachable nodes from source. Returns true if target is found."
  },
  dijkstra: {
    time: "O(V²) with array, O((V+E)logV) with min-heap",
    space: "O(V)",
    stable: true,
    description: "Greedy algorithm for shortest paths in weighted graphs with non-negative weights. Updates distances iteratively."
  },
  astar: {
    time: "O((V+E)logV) average, O(b^d) worst case",
    space: "O(V)",
    stable: true,
    description: "Informed search algorithm combining Dijkstra with heuristic guidance. Uses f(n) = g(n) + h(n) where g is actual cost and h is estimated cost to goal. Guarantees optimal path if heuristic is admissible."
  },
  kruskal: {
    time: "O(E log E)",
    space: "O(V)",
    stable: true,
    description: "Greedy MST algorithm that sorts all edges by weight and adds the lightest edges that don't create cycles. Uses Union-Find to efficiently detect cycles. Ideal for sparse graphs."
  },
  prim: {
    time: "O(E log V) with min-heap, O(V²) with array",
    space: "O(V)",
    stable: true,
    description: "Greedy MST algorithm that grows the tree one vertex at a time, always adding the cheapest edge connecting the tree to a new vertex. Ideal for dense graphs."
  }
}
