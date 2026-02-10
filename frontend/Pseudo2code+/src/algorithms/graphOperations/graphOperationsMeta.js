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
  }
}
