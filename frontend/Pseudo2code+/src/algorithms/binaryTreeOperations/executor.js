/**
 * Binary Tree Operations Executor
 * Handles execution of operations and step generation
 */

import { BinaryTree, TreeNode } from "./BinaryTree.js"

/**
 * Execute operation and generate visualization steps
 */
export class BinaryTreeExecutor {
  static executeOperation(tree, operation, params = {}) {
    const executors = {
      insert: this.executeInsert,
      search: this.executeSearch,
      delete: this.executeDelete,
      inorder: this.executeInorder,
      preorder: this.executePreorder,
      postorder: this.executePostorder,
      levelOrder: this.executeLevelOrder,
      height: this.executeHeight,
      countNodes: this.executeCountNodes,
      countLeaves: this.executeCountLeaves
    }

    const executor = executors[operation]
    if (!executor) {
      throw new Error(`Unknown operation: ${operation}`)
    }

    return executor.call(this, tree, params)
  }

  static executeInsert(tree, params) {
    const value = params.value
    if (value === undefined || value === null) {
      throw new Error("Value is required for insert operation")
    }

    const steps = []
    const valueNum = Number(value)

    steps.push({
      type: "info",
      message: `Inserting node: ${valueNum}`,
      treeArray: tree.toArray(),
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 1,
      explanation: `Starting to insert value ${valueNum} into the tree. We need to find the first available position using level-order traversal.`
    })

    if (tree.isEmpty()) {
      steps.push({
        type: "info",
        message: "Tree is empty, inserting as root",
        treeArray: tree.toArray(),
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 2,
        explanation: "The tree is empty, so the new node will become the root."
      })

      tree.insert(valueNum)

      steps.push({
        type: "complete",
        message: `Node ${valueNum} inserted as root`,
        treeArray: tree.toArray(),
        activeNode: 0,
        highlightNodes: [0],
        activePseudoLine: 3,
        explanation: `Node ${valueNum} has been successfully inserted as the root of the tree.`,
        result: `Successfully inserted ${valueNum}` 
      })
    } else {
      steps.push({
        type: "info",
        message: "Finding first available position...",
        treeArray: tree.toArray(),
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 6,
        explanation: "Performing BFS to find the first available position for the new node."
      })

      tree.insert(valueNum)

      const treeArray = tree.toArray()
      const newNodeIndex = treeArray.length - 1

      steps.push({
        type: "complete",
        message: `Node ${valueNum} inserted at position ${newNodeIndex}`,
        treeArray,
        activeNode: newNodeIndex,
        highlightNodes: [newNodeIndex],
        activePseudoLine: 10,
        explanation: `Node ${valueNum} has been successfully inserted at the first available position in the tree.`,
        result: `Successfully inserted ${valueNum}`
      })
    }

    return { steps, result: true }
  }

  static executeSearch(tree, params) {
    const value = params.value
    if (value === undefined || value === null) {
      throw new Error("Value is required for search operation")
    }

    const valueNum = Number(value)
    const steps = []

    if (tree.isEmpty()) {
      steps.push({
        type: "info",
        message: "Tree is empty",
        treeArray: [],
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 1,
        explanation: "The tree is empty, so the search value cannot be found."
      })

      steps.push({
        type: "complete",
        message: `Value ${valueNum} not found (empty tree)`,
        treeArray: [],
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 2,
        explanation: "Search completed. The value was not found.",
        result: "NOT FOUND"
      })

      return { steps, result: false }
    }

    steps.push({
      type: "info",
      message: `Searching for ${valueNum}...`,
      treeArray: tree.toArray(),
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 3,
      explanation: `Starting search for value ${valueNum}. We will use BFS to explore all nodes.`
    })

    const queue = [{ node: tree.root, index: 0 }]
    const treeArray = tree.toArray()
    const nodeIndices = new Map()

    // Build map of node values to indices
    treeArray.forEach((n) => {
      nodeIndices.set(n.value, n.index)
    })

    const visited = new Set()
    let visitedIndices = []

    while (queue.length > 0) {
      const { node, index } = queue.shift()
      
      if (!node || visited.has(node.value)) continue

      visited.add(node.value)
      const nodeIndex = nodeIndices.get(node.value) ?? index
      visitedIndices.push(nodeIndex)

      steps.push({
        type: "visiting",
        message: `Visiting node ${node.value}`,
        treeArray,
        activeNode: nodeIndex,
        highlightNodes: visitedIndices,
        activePseudoLine: 7,
        explanation: `Checking if node ${node.value} matches the search value ${valueNum}.`
      })

      if (node.value === valueNum) {
        steps.push({
          type: "complete",
          message: `Found ${valueNum}!`,
          treeArray,
          activeNode: nodeIndex,
          highlightNodes: visitedIndices,
          activePseudoLine: 5,
          explanation: `✓ Search completed successfully! Found value ${valueNum} in the tree.`,
          result: `FOUND at position ${nodeIndex}`
        })

        return { steps, result: true }
      }

      if (node.left) queue.push({ node: node.left, index: null })
      if (node.right) queue.push({ node: node.right, index: null })
    }

    steps.push({
      type: "complete",
      message: `Value ${valueNum} not found`,
      treeArray,
      activeNode: null,
      highlightNodes: visitedIndices,
      activePseudoLine: 10,
      explanation: `✗ Search completed. The value ${valueNum} was not found in the tree. All nodes were visited.`,
      result: "NOT FOUND"
    })

    return { steps, result: false }
  }

  static executeDelete(tree, params) {
    const value = params.value
    if (value === undefined || value === null) {
      throw new Error("Value is required for delete operation")
    }

    const valueNum = Number(value)
    const steps = []

    if (tree.isEmpty()) {
      steps.push({
        type: "info",
        message: "Tree is empty",
        treeArray: [],
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 1,
        explanation: "Cannot delete from an empty tree."
      })

      steps.push({
        type: "complete",
        message: `Cannot delete ${valueNum} (empty tree)`,
        treeArray: [],
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 2,
        explanation: "Deletion failed. The tree is empty.",
        result: "FAILED"
      })

      return { steps, result: false }
    }

    steps.push({
      type: "info",
      message: `Deleting node ${valueNum}...`,
      treeArray: tree.toArray(),
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 1,
      explanation: `Starting deletion of node with value ${valueNum}. First, we need to find this node.`
    })

    const nodeFound = tree.delete(valueNum)

    if (!nodeFound) {
      const treeArray = tree.toArray()
      steps.push({
        type: "complete",
        message: `Value ${valueNum} not found`,
        treeArray,
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 3,
        explanation: `Deletion failed. Value ${valueNum} was not found in the tree.`,
        result: "NOT FOUND"
      })

      return { steps, result: false }
    }

    const treeArray = tree.toArray()

    steps.push({
      type: "complete",
      message: `Node ${valueNum} deleted successfully`,
      treeArray,
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 10,
      explanation: `✓ Node ${valueNum} has been successfully deleted. The tree structure has been updated.`,
      result: "DELETED"
    })

    return { steps, result: true }
  }

  static executeInorder(tree, params) {
    const steps = []

    if (tree.isEmpty()) {
      steps.push({
        type: "info",
        message: "Tree is empty",
        treeArray: [],
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 1,
        explanation: "The tree is empty. Inorder traversal result: []"
      })

      steps.push({
        type: "complete",
        message: "Inorder traversal complete",
        treeArray: [],
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 2,
        traversalOrder: [],
        explanation: "Traversal completed with no nodes."
      })

      return { steps, result: [] }
    }

    const treeArray = tree.toArray()
    const result = []
    const traversalOrder = []
    let stepCount = 0

    steps.push({
      type: "info",
      message: "Starting Inorder Traversal (Left → Node → Right)",
      treeArray,
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 0,
      explanation: "Inorder traversal visits nodes in this order: Left subtree → Current node → Right subtree"
    })

    const inorderHelper = (node, nodeIdx) => {
      if (!node) return

      // Visit left
      if (node.left) {
        const leftIdx = treeArray.findIndex(n => n.value === node.left.value)
        inorderHelper(node.left, leftIdx)
      }

      // Process current node - generate a step for this visit
      traversalOrder.push(node.value)
      result.push(node.value)
      
      steps.push({
        type: "visiting",
        message: `Visiting node ${node.value}`,
        treeArray,
        activeNode: nodeIdx,
        highlightNodes: traversalOrder.slice(),
        traversalOrder: result.slice(),
        activePseudoLine: 6,
        explanation: `Processing node ${node.value}. Added to traversal result.`
      })

      // Visit right
      if (node.right) {
        const rightIdx = treeArray.findIndex(n => n.value === node.right.value)
        inorderHelper(node.right, rightIdx)
      }
    }

    inorderHelper(tree.root, 0)

    steps.push({
      type: "complete",
      message: "Inorder traversal complete",
      treeArray,
      activeNode: null,
      highlightNodes: traversalOrder,
      traversalOrder: result,
      activePseudoLine: 8,
      explanation: `✓ Traversal completed! Result: [${result.join(" → ")}]`,
      result
    })

    return { steps, result }
  }

  static executePreorder(tree, params) {
    const steps = []

    if (tree.isEmpty()) {
      steps.push({
        type: "info",
        message: "Tree is empty",
        treeArray: [],
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 1,
        explanation: "The tree is empty. Preorder traversal result: []"
      })
      return { steps, result: [] }
    }

    const treeArray = tree.toArray()
    const result = []
    const traversalOrder = []

    steps.push({
      type: "info",
      message: "Starting Preorder Traversal (Node → Left → Right)",
      treeArray,
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 0,
      explanation: "Preorder traversal visits nodes in this order: Current node → Left subtree → Right subtree"
    })

    const preorderHelper = (node, nodeIdx) => {
      if (!node) return

      // Process current node - generate step for this visit
      traversalOrder.push(node.value)
      result.push(node.value)
      steps.push({
        type: "visiting",
        message: `Visiting node ${node.value}`,
        treeArray,
        activeNode: nodeIdx,
        highlightNodes: traversalOrder.slice(),
        traversalOrder: result.slice(),
        activePseudoLine: 5,
        explanation: `Processing node ${node.value}. Added to traversal result.`
      })

      // Visit left
      if (node.left) {
        const leftIdx = treeArray.findIndex(n => n.value === node.left.value)
        preorderHelper(node.left, leftIdx)
      }

      // Visit right
      if (node.right) {
        const rightIdx = treeArray.findIndex(n => n.value === node.right.value)
        preorderHelper(node.right, rightIdx)
      }
    }

    preorderHelper(tree.root, 0)

    steps.push({
      type: "complete",
      message: "Preorder traversal complete",
      treeArray,
      activeNode: null,
      highlightNodes: traversalOrder,
      traversalOrder: result,
      activePseudoLine: 8,
      explanation: `✓ Traversal completed! Result: [${result.join(" → ")}]`,
      result
    })

    return { steps, result }
  }

  static executePostorder(tree, params) {
    const steps = []

    if (tree.isEmpty()) {
      steps.push({
        type: "info",
        message: "Tree is empty",
        treeArray: [],
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 1,
        explanation: "The tree is empty. Postorder traversal result: []"
      })
      return { steps, result: [] }
    }

    const treeArray = tree.toArray()
    const result = []
    const traversalOrder = []

    steps.push({
      type: "info",
      message: "Starting Postorder Traversal (Left → Right → Node)",
      treeArray,
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 0,
      explanation: "Postorder traversal visits nodes in this order: Left subtree → Right subtree → Current node"
    })

    const postorderHelper = (node, nodeIdx) => {
      if (!node) return

      // Visit left
      if (node.left) {
        const leftIdx = treeArray.findIndex(n => n.value === node.left.value)
        postorderHelper(node.left, leftIdx)
      }

      // Visit right
      if (node.right) {
        const rightIdx = treeArray.findIndex(n => n.value === node.right.value)
        postorderHelper(node.right, rightIdx)
      }

      // Process current node - generate step for this visit
      traversalOrder.push(node.value)
      result.push(node.value)
      steps.push({
        type: "visiting",
        message: `Visiting node ${node.value}`,
        treeArray,
        activeNode: nodeIdx,
        highlightNodes: traversalOrder.slice(),
        traversalOrder: result.slice(),
        activePseudoLine: 7,
        explanation: `Processing node ${node.value}. Added to traversal result.`
      })
    }

    postorderHelper(tree.root, 0)

    steps.push({
      type: "complete",
      message: "Postorder traversal complete",
      treeArray,
      activeNode: null,
      highlightNodes: traversalOrder,
      traversalOrder: result,
      activePseudoLine: 8,
      explanation: `✓ Traversal completed! Result: [${result.join(" → ")}]`,
      result
    })

    return { steps, result }
  }

  static executeLevelOrder(tree, params) {
    const steps = []

    if (tree.isEmpty()) {
      steps.push({
        type: "info",
        message: "Tree is empty",
        treeArray: [],
        activeNode: null,
        highlightNodes: [],
        activePseudoLine: 1,
        explanation: "The tree is empty. Level order traversal result: []"
      })
      return { steps, result: [] }
    }

    const treeArray = tree.toArray()
    const result = []
    const traversalOrder = []
    const queue = [{ node: tree.root, index: 0 }]

    steps.push({
      type: "info",
      message: "Starting Level Order Traversal (BFS)",
      treeArray,
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 0,
      explanation: "Level order (BFS) visits nodes level by level, from left to right"
    })

    while (queue.length > 0) {
      const { node, index } = queue.shift()

      if (!node) continue

      // Generate step for this node visit
      traversalOrder.push(node.value)
      result.push(node.value)

      steps.push({
        type: "visiting",
        message: `Visiting node ${node.value}`,
        treeArray,
        activeNode: index,
        highlightNodes: traversalOrder.slice(),
        traversalOrder: result.slice(),
        activePseudoLine: 8,
        explanation: `Processing node ${node.value}. Added to traversal result.`
      })

      // Enqueue children
      if (node.left) {
        const leftIdx = treeArray.findIndex(n => n.value === node.left.value)
        queue.push({ node: node.left, index: leftIdx })
      }

      if (node.right) {
        const rightIdx = treeArray.findIndex(n => n.value === node.right.value)
        queue.push({ node: node.right, index: rightIdx })
      }
    }

    steps.push({
      type: "complete",
      message: "Level order traversal complete",
      treeArray,
      activeNode: null,
      highlightNodes: traversalOrder,
      traversalOrder: result,
      activePseudoLine: 15,
      explanation: `✓ Traversal completed! Result: [${result.join(" → ")}]`,
      result
    })

    return { steps, result }
  }

  static executeHeight(tree, params) {
    const steps = []

    if (tree.isEmpty()) {
      steps.push({
        type: "complete",
        message: "Tree is empty, height = -1",
        treeArray: [],
        result: -1
      })
      return { steps, result: -1 }
    }

    const { height, steps: heightSteps, highlightPath } = tree.getHeightWithSteps()
    const treeArray = tree.toArray()
    const nodeIndices = new Map()

    treeArray.forEach((n) => {
      nodeIndices.set(n.value, n.index)
    })

    steps.push({
      type: "info",
      message: "Calculating tree height recursively...",
      treeArray,
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 1,
      explanation: "Height is calculated as: 1 + max(height of left subtree, height of right subtree)"
    })

    const visited = []

    heightSteps.forEach((step) => {
      if (step.action === "visiting_node") {
        const nodeIdx = nodeIndices.get(step.node.value) ?? -1
        if (nodeIdx >= 0) visited.push(nodeIdx)

        steps.push({
          type: "visiting",
          message: `Processing node ${step.node.value}`,
          treeArray,
          activeNode: nodeIdx,
          highlightNodes: visited,
          activePseudoLine: 2,
          explanation: step.message
        })
      } else if (step.action === "height_result") {
        steps.push({
          type: "info",
          message: `Height of node ${step.node.value} = ${step.height}`,
          treeArray,
          activeNode: nodeIndices.get(step.node.value) ?? -1,
          highlightNodes: visited,
          activePseudoLine: 6,
          explanation: step.message
        })
      }
    })

    steps.push({
      type: "complete",
      message: `Tree height = ${height}`,
      treeArray,
      activeNode: null,
      highlightNodes: visited,
      activePseudoLine: -1,
      explanation: `Height calculation complete. The tree has a height of ${height}.`,
      result: height
    })

    return { steps, result: height }
  }

  static executeCountNodes(tree, params) {
    const steps = []

    if (tree.isEmpty()) {
      steps.push({
        type: "complete",
        message: "Tree is empty, node count = 0",
        treeArray: [],
        result: 0
      })
      return { steps, result: 0 }
    }

    const { count, steps: countSteps } = tree.countNodesWithSteps()
    const treeArray = tree.toArray()
    const nodeIndices = new Map()

    treeArray.forEach((n) => {
      nodeIndices.set(n.value, n.index)
    })

    steps.push({
      type: "info",
      message: "Starting node count...",
      treeArray,
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 1,
      explanation: "Counting all nodes in the tree by traversing each one."
    })

    const visited = []

    countSteps.forEach((step) => {
      if (step.action === "visiting_node") {
        const nodeIdx = nodeIndices.get(step.highlightNode) ?? -1
        if (nodeIdx >= 0) visited.push(nodeIdx)

        steps.push({
          type: "visiting",
          message: step.message,
          treeArray,
          activeNode: nodeIdx,
          highlightNodes: visited,
          activePseudoLine: 4,
          explanation: step.message
        })
      }
    })

    steps.push({
      type: "complete",
      message: `Total nodes = ${count}`,
      treeArray,
      activeNode: null,
      highlightNodes: visited,
      activePseudoLine: -1,
      explanation: `Node count complete. Total number of nodes: ${count}`,
      result: count
    })

    return { steps, result: count }
  }

  static executeCountLeaves(tree, params) {
    const steps = []

    if (tree.isEmpty()) {
      steps.push({
        type: "complete",
        message: "Tree is empty, leaf count = 0",
        treeArray: [],
        result: 0
      })
      return { steps, result: 0 }
    }

    const { count, steps: countSteps, leafNodes } = tree.countLeafNodesWithSteps()
    const treeArray = tree.toArray()
    const nodeIndices = new Map()

    treeArray.forEach((n) => {
      nodeIndices.set(n.value, n.index)
    })

    steps.push({
      type: "info",
      message: "Starting leaf node count...",
      treeArray,
      activeNode: null,
      highlightNodes: [],
      activePseudoLine: 1,
      explanation: "Counting all leaf nodes (nodes with no children) in the tree."
    })

    const visited = []
    const leafIndices = []

    countSteps.forEach((step) => {
      if (step.action === "leaf_node") {
        const nodeIdx = nodeIndices.get(step.highlightNode) ?? -1
        if (nodeIdx >= 0) {
          visited.push(nodeIdx)
          leafIndices.push(nodeIdx)
        }

        steps.push({
          type: "visiting",
          message: step.message,
          treeArray,
          activeNode: nodeIdx,
          highlightNodes: leafIndices,
          activePseudoLine: 4,
          explanation: step.message
        })
      } else if (step.action === "visiting_node") {
        const nodeIdx = nodeIndices.get(step.highlightNode) ?? -1
        if (nodeIdx >= 0) visited.push(nodeIdx)

        steps.push({
          type: "info",
          message: step.message,
          treeArray,
          activeNode: nodeIdx,
          highlightNodes: visited,
          activePseudoLine: 7,
          explanation: step.message
        })
      }
    })

    steps.push({
      type: "complete",
      message: `Total leaf nodes = ${count}`,
      treeArray,
      activeNode: null,
      highlightNodes: leafIndices,
      activePseudoLine: -1,
      explanation: `Leaf node count complete. Total number of leaf nodes: ${count}`,
      result: count
    })

    return { steps, result: count }
  }
}

export default BinaryTreeExecutor
