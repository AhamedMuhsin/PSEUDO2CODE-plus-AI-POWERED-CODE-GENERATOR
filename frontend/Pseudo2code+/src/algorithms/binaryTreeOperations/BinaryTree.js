/**
 * Binary Tree Data Structure
 * Supports various operations: Insert, Search, Delete, Traversals, etc.
 */

class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.parent = null
  }
}

class BinaryTree {
  constructor() {
    this.root = null
    this.nodeCount = 0
  }

  /**
   * INSERT: Add a new node to the tree (level-order insertion)
   * Finds the first available position from left to right at the deepest level
   */
  insert(value) {
    const newNode = new TreeNode(value)
    
    if (!this.root) {
      this.root = newNode
      this.nodeCount = 1
      return
    }

    // Use BFS to find the first empty position
    const queue = [this.root]
    while (queue.length > 0) {
      const current = queue.shift()
      
      if (!current.left) {
        current.left = newNode
        newNode.parent = current
        this.nodeCount++
        return
      } else {
        queue.push(current.left)
      }

      if (!current.right) {
        current.right = newNode
        newNode.parent = current
        this.nodeCount++
        return
      } else {
        queue.push(current.right)
      }
    }
  }

  /**
   * SEARCH: Find a node with the given value
   * Returns path from root to found node
   */
  search(value) {
    const path = []
    const queue = [{ node: this.root, depth: 0 }]
    
    while (queue.length > 0) {
      const { node } = queue.shift()
      
      if (!node) continue
      
      path.push(node)
      
      if (node.value === value) {
        return { found: true, path }
      }
      
      if (node.left) queue.push({ node: node.left, depth: 1 })
      if (node.right) queue.push({ node: node.right, depth: 1 })
    }
    
    return { found: false, path: [] }
  }

  /**
   * DELETE: Remove a node from the tree
   * Replace deleted node with the deepest rightmost node
   */
  delete(value) {
    if (!this.root) return false

    // Find the node to delete
    let nodeToDelete = null
    let parentOfDelete = null
    const queue = [{ node: this.root, parent: null }]

    while (queue.length > 0) {
      const { node, parent } = queue.shift()
      if (!node) continue

      if (node.value === value) {
        nodeToDelete = node
        parentOfDelete = parent
        break
      }

      queue.push({ node: node.left, parent: node })
      queue.push({ node: node.right, parent: node })
    }

    if (!nodeToDelete) return false

    // Find the last node (deepest, rightmost)
    let lastNode = null
    let parentOfLast = null
    queue.length = 0
    queue.push({ node: this.root, parent: null })

    while (queue.length > 0) {
      const { node, parent } = queue.shift()
      if (!node) continue

      lastNode = node
      parentOfLast = parent

      if (node.left) queue.push({ node: node.left, parent: node })
      if (node.right) queue.push({ node: node.right, parent: node })
    }

    // Replace value
    nodeToDelete.value = lastNode.value

    // Remove last node
    if (parentOfLast) {
      if (parentOfLast.left === lastNode) {
        parentOfLast.left = null
      } else if (parentOfLast.right === lastNode) {
        parentOfLast.right = null
      }
    } else {
      // Last node is root and only node
      this.root = null
    }

    this.nodeCount--
    return true
  }

  /**
   * INORDER TRAVERSAL: Left -> Node -> Right (LNR)
   */
  inorderTraversal() {
    const result = []
    const steps = []

    const traverse = (node, depth = 0) => {
      if (!node) return

      // Go to left subtree
      if (node.left) {
        steps.push({
          action: "visiting_left",
          node,
          depth,
          message: `Going to left subtree of ${node.value}`
        })
        traverse(node.left, depth + 1)
      }

      // Visit node
      steps.push({
        action: "visiting_node",
        node,
        depth,
        message: `Processing node ${node.value}`,
        highlightNode: node.value
      })
      result.push(node.value)

      // Go to right subtree
      if (node.right) {
        steps.push({
          action: "visiting_right",
          node,
          depth,
          message: `Going to right subtree of ${node.value}`
        })
        traverse(node.right, depth + 1)
      }
    }

    traverse(this.root)
    return { result, steps }
  }

  /**
   * PREORDER TRAVERSAL: Node -> Left -> Right (NLR)
   */
  preorderTraversal() {
    const result = []
    const steps = []

    const traverse = (node, depth = 0) => {
      if (!node) return

      // Visit node first
      steps.push({
        action: "visiting_node",
        node,
        depth,
        message: `Processing node ${node.value}`,
        highlightNode: node.value
      })
      result.push(node.value)

      // Go to left subtree
      if (node.left) {
        steps.push({
          action: "visiting_left",
          node,
          depth,
          message: `Going to left subtree of ${node.value}`
        })
        traverse(node.left, depth + 1)
      }

      // Go to right subtree
      if (node.right) {
        steps.push({
          action: "visiting_right",
          node,
          depth,
          message: `Going to right subtree of ${node.value}`
        })
        traverse(node.right, depth + 1)
      }
    }

    traverse(this.root)
    return { result, steps }
  }

  /**
   * POSTORDER TRAVERSAL: Left -> Right -> Node (LRN)
   */
  postorderTraversal() {
    const result = []
    const steps = []

    const traverse = (node, depth = 0) => {
      if (!node) return

      // Go to left subtree
      if (node.left) {
        steps.push({
          action: "visiting_left",
          node,
          depth,
          message: `Going to left subtree of ${node.value}`
        })
        traverse(node.left, depth + 1)
      }

      // Go to right subtree
      if (node.right) {
        steps.push({
          action: "visiting_right",
          node,
          depth,
          message: `Going to right subtree of ${node.value}`
        })
        traverse(node.right, depth + 1)
      }

      // Visit node last
      steps.push({
        action: "visiting_node",
        node,
        depth,
        message: `Processing node ${node.value}`,
        highlightNode: node.value
      })
      result.push(node.value)
    }

    traverse(this.root)
    return { result, steps }
  }

  /**
   * LEVEL ORDER TRAVERSAL (BFS): Visit nodes level by level
   */
  levelOrderTraversal() {
    const result = []
    const steps = []

    if (!this.root) return { result, steps }

    const queue = [{ node: this.root, level: 0 }]
    let levelStart = 0
    let levelSize = 1

    while (queue.length > 0) {
      const { node, level } = queue.shift()

      if (levelStart === 0) {
        steps.push({
          action: "level_start",
          level,
          message: `Processing Level ${level}`
        })
        levelStart = level
        levelSize = 0
      }

      steps.push({
        action: "visiting_node",
        node,
        level,
        message: `Processing node ${node.value} (Level ${level})`,
        highlightNode: node.value
      })
      result.push(node.value)

      if (node.left) {
        queue.push({ node: node.left, level: level + 1 })
      }
      if (node.right) {
        queue.push({ node: node.right, level: level + 1 })
      }

      if (queue.length > 0 && queue[0].level !== level) {
        steps.push({
          action: "level_end",
          level,
          message: `Completed Level ${level}`
        })
        levelStart = 0
      }
    }

    return { result, steps }
  }

  /**
   * HEIGHT: Get the height of the tree from a given node
   */
  getHeight(node = this.root) {
    if (!node) return -1
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
  }

  /**
   * Get height with visualization steps
   */
  getHeightWithSteps() {
    const steps = []
    const visitedNodes = []

    const calculateHeight = (node, depth = 0) => {
      if (!node) {
        steps.push({
          action: "null_node",
          message: "Null node reached (height = -1)",
          depth
        })
        return -1
      }

      steps.push({
        action: "visiting_node",
        node,
        message: `Calculating height of node ${node.value}`,
        highlightNode: node.value,
        depth
      })
      visitedNodes.push(node.value)

      const leftHeight = calculateHeight(node.left, depth + 1)
      const rightHeight = calculateHeight(node.right, depth + 1)

      const height = 1 + Math.max(leftHeight, rightHeight)

      steps.push({
        action: "height_result",
        node,
        height,
        message: `Height of node ${node.value}: 1 + max(${leftHeight}, ${rightHeight}) = ${height}`,
        highlightNode: node.value
      })

      return height
    }

    const height = calculateHeight(this.root)

    return { height, steps, highlightPath: visitedNodes }
  }

  /**
   * COUNT NODES: Get total number of nodes
   */
  countNodes() {
    return this.nodeCount
  }

  /**
   * Count nodes with visualization steps
   */
  countNodesWithSteps() {
    const steps = []
    let count = 0

    const traverse = (node) => {
      if (!node) return

      steps.push({
        action: "visiting_node",
        node,
        message: `Counting node ${node.value} (Total: ${count + 1})`,
        highlightNode: node.value
      })
      count++

      if (node.left) traverse(node.left)
      if (node.right) traverse(node.right)
    }

    traverse(this.root)

    return { count, steps }
  }

  /**
   * COUNT LEAF NODES: Get number of leaf nodes
   */
  countLeafNodes() {
    let count = 0

    const traverse = (node) => {
      if (!node) return
      if (!node.left && !node.right) count++
      if (node.left) traverse(node.left)
      if (node.right) traverse(node.right)
    }

    traverse(this.root)
    return count
  }

  /**
   * Count leaf nodes with visualization steps
   */
  countLeafNodesWithSteps() {
    const steps = []
    const leafNodes = []
    let count = 0

    const traverse = (node) => {
      if (!node) return

      if (!node.left && !node.right) {
        steps.push({
          action: "leaf_node",
          node,
          message: `Found leaf node ${node.value} (Total leaves: ${count + 1})`,
          highlightNode: node.value
        })
        leafNodes.push(node.value)
        count++
      } else {
        steps.push({
          action: "visiting_node",
          node,
          message: `Checking node ${node.value} (has left: ${!!node.left}, has right: ${!!node.right})`,
          highlightNode: node.value
        })
      }

      if (node.left) traverse(node.left)
      if (node.right) traverse(node.right)
    }

    traverse(this.root)

    return { count, steps, leafNodes }
  }

  /**
   * Convert tree to array representation for rendering
   * Returns nodes in array format for canvas rendering
   */
  toArray() {
    if (!this.root) return []

    const result = []
    const visited = new Set()

    const traverse = (node, parentIndex = -1, isLeft = null) => {
      if (!node || visited.has(node)) return

      visited.add(node)
      const index = result.length
      result.push({
        value: node.value,
        index,
        parentIndex,
        isLeft,
        left: node.left ? true : false,
        right: node.right ? true : false
      })

      if (node.left) traverse(node.left, index, true)
      if (node.right) traverse(node.right, index, false)
    }

    traverse(this.root)
    return result
  }

  /**
   * Clear the tree
   */
  clear() {
    this.root = null
    this.nodeCount = 0
  }

  /**
   * Check if tree is empty
   */
  isEmpty() {
    return this.root === null
  }

  /**
   * Get tree size
   */
  size() {
    return this.nodeCount
  }
}

export { BinaryTree, TreeNode }
