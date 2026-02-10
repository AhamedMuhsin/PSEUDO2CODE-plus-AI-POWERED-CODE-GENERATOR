/**
 * Graph Data Structure
 * Supports: Undirected, Directed, and Weighted graphs
 */
export class Graph {
  constructor(isDirected = false, isWeighted = false) {
    this.adjacencyList = new Map()
    this.isDirected = isDirected
    this.isWeighted = isWeighted
    this.nodes = []
    this.edges = []
  }

  // Add a node to the graph
  addNode(value) {
    if (!this.adjacencyList.has(value)) {
      this.adjacencyList.set(value, [])
      this.nodes.push(value)
    }
  }

  // Add an edge between two nodes
  addEdge(from, to, weight = 1) {
    if (!this.adjacencyList.has(from)) this.addNode(from)
    if (!this.adjacencyList.has(to)) this.addNode(to)

    this.adjacencyList.get(from).push({ node: to, weight })

    // If undirected, add reverse edge
    if (!this.isDirected) {
      this.adjacencyList.get(to).push({ node: from, weight })
    }

    this.edges.push({ from, to, weight })
  }

  // Get all neighbors of a node
  getNeighbors(node) {
    return this.adjacencyList.get(node) || []
  }

  // Breadth-First Search
  bfs(startNode) {
    const visited = new Set()
    const queue = [startNode]
    const result = []
    visited.add(startNode)

    while (queue.length > 0) {
      const node = queue.shift()
      result.push(node)

      const neighbors = this.getNeighbors(node)
      for (const neighbor of neighbors) {
        const nextNode = this.isWeighted ? neighbor.node : neighbor
        if (!visited.has(nextNode)) {
          visited.add(nextNode)
          queue.push(nextNode)
        }
      }
    }

    return result
  }

  // Depth-First Search
  dfs(startNode) {
    const visited = new Set()
    const result = []

    const dfsHelper = (node) => {
      visited.add(node)
      result.push(node)

      const neighbors = this.getNeighbors(node)
      for (const neighbor of neighbors) {
        const nextNode = this.isWeighted ? neighbor.node : neighbor
        if (!visited.has(nextNode)) {
          dfsHelper(nextNode)
        }
      }
    }

    dfsHelper(startNode)
    return result
  }

  // Check if path exists between two nodes
  hasPath(from, to) {
    const visited = new Set()

    const dfsHelper = (node) => {
      if (node === to) return true
      visited.add(node)

      const neighbors = this.getNeighbors(node)
      for (const neighbor of neighbors) {
        const nextNode = this.isWeighted ? neighbor.node : neighbor
        if (!visited.has(nextNode)) {
          if (dfsHelper(nextNode)) return true
        }
      }

      return false
    }

    return dfsHelper(from)
  }

  // Detect cycle in undirected graph
  hasCycle() {
    const visited = new Set()

    const dfsHelper = (node, parent) => {
      visited.add(node)

      const neighbors = this.getNeighbors(node)
      for (const neighbor of neighbors) {
        const nextNode = this.isWeighted ? neighbor.node : neighbor
        if (!visited.has(nextNode)) {
          if (dfsHelper(nextNode, node)) return true
        } else if (nextNode !== parent) {
          return true
        }
      }

      return false
    }

    for (const node of this.nodes) {
      if (!visited.has(node)) {
        if (dfsHelper(node, null)) return true
      }
    }

    return false
  }

  // Dijkstra's Algorithm for shortest path
  dijkstra(startNode) {
    const distances = {}
    const previousNodes = {}
    const unvisited = new Set()

    for (const node of this.nodes) {
      distances[node] = node === startNode ? 0 : Infinity
      previousNodes[node] = null
      unvisited.add(node)
    }

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

      const neighbors = this.getNeighbors(currentNode)
      for (const neighbor of neighbors) {
        const nextNode = this.isWeighted ? neighbor.node : neighbor
        const weight = this.isWeighted ? neighbor.weight : 1

        if (unvisited.has(nextNode)) {
          const newDistance = distances[currentNode] + weight
          if (newDistance < distances[nextNode]) {
            distances[nextNode] = newDistance
            previousNodes[nextNode] = currentNode
          }
        }
      }
    }

    return { distances, previousNodes }
  }

  // Get connected components
  getConnectedComponents() {
    const visited = new Set()
    const components = []

    const dfsHelper = (node, component) => {
      visited.add(node)
      component.push(node)

      const neighbors = this.getNeighbors(node)
      for (const neighbor of neighbors) {
        const nextNode = this.isWeighted ? neighbor.node : neighbor
        if (!visited.has(nextNode)) {
          dfsHelper(nextNode, component)
        }
      }
    }

    for (const node of this.nodes) {
      if (!visited.has(node)) {
        const component = []
        dfsHelper(node, component)
        components.push(component)
      }
    }

    return components
  }

  // Get degree of a node
  getDegree(node) {
    return this.getNeighbors(node).length
  }

  // Check if graph is connected
  isConnected() {
    if (this.nodes.length === 0) return true

    const visited = new Set()
    const queue = [this.nodes[0]]
    visited.add(this.nodes[0])

    while (queue.length > 0) {
      const node = queue.shift()
      const neighbors = this.getNeighbors(node)

      for (const neighbor of neighbors) {
        const nextNode = this.isWeighted ? neighbor.node : neighbor
        if (!visited.has(nextNode)) {
          visited.add(nextNode)
          queue.push(nextNode)
        }
      }
    }

    return visited.size === this.nodes.length
  }
}
