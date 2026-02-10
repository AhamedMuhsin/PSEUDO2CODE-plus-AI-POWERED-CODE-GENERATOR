export const bfsPseudo = [
  "BFS(graph, startNode)",
  "  queue ← initialize with startNode",
  "  visited ← set containing startNode",
  "  result ← empty array",
  "  ",
  "  while queue is not empty:",
  "    currentNode ← queue.dequeue()",
  "    result.add(currentNode)",
  "    ",
  "    for each neighbor of currentNode:",
  "      if neighbor not in visited:",
  "        visited.add(neighbor)",
  "        queue.enqueue(neighbor)",
  "  ",
  "  return result"
]

export const dfsPseudo = [
  "DFS(graph, startNode)",
  "  visited ← empty set",
  "  result ← empty array",
  "  ",
  "  DFSHelper(startNode):",
  "    visited.add(startNode)",
  "    result.add(startNode)",
  "    ",
  "    for each neighbor of startNode:",
  "      if neighbor not in visited:",
  "        DFSHelper(neighbor)",
  "    ",
  "    return result"
]

export const detectCyclePseudo = [
  "DetectCycle(graph)",
  "  visited ← empty set",
  "  cycleFound ← false",
  "  ",
  "  for each node in graph:",
  "    if node not in visited:",
  "      if DFSVisit(node, null):",
  "        cycleFound ← true",
  "        break",
  "  ",
  "  DFSVisit(node, parent):",
  "    visited.add(node)",
  "    for each neighbor of node:",
  "      if neighbor not in visited:",
  "        DFSVisit(neighbor, node)",
  "      else if neighbor != parent:",
  "        return true (cycle found)",
  "    return false"
]

export const checkPathPseudo = [
  "CheckPath(graph, start, end)",
  "  visited ← empty set",
  "  ",
  "  return DFSPath(start, end, visited)",
  "  ",
  "  DFSPath(node, end, visited):",
  "    if node == end:",
  "      return true",
  "    ",
  "    visited.add(node)",
  "    for each neighbor of node:",
  "      if neighbor not in visited:",
  "        if DFSPath(neighbor, end, visited):",
  "          return true",
  "    ",
  "    return false"
]

export const dijkstraPseudo = [
  "Dijkstra(graph, startNode)",
  "  distances ← {all: ∞, start: 0}",
  "  previous ← empty map",
  "  unvisited ← all nodes",
  "  ",
  "  while unvisited not empty:",
  "    current ← node with min distance",
  "    unvisited.remove(current)",
  "    ",
  "    for each neighbor in current.neighbors:",
  "      if unvisited.contains(neighbor):",
  "        newDist ← distances[current] + weight",
  "        if newDist < distances[neighbor]:",
  "          distances[neighbor] ← newDist",
  "          previous[neighbor] ← current",
  "  ",
  "  return distances"
]
