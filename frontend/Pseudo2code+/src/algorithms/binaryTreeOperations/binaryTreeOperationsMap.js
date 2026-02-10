import { insertPseudo } from "./pseudocode/insertPseudo"
import { searchPseudo } from "./pseudocode/searchPseudo"
import { deletePseudo } from "./pseudocode/deletePseudo"
import { inorderPseudo } from "./pseudocode/inorderPseudo"
import { preorderPseudo } from "./pseudocode/preorderPseudo"
import { postorderPseudo } from "./pseudocode/postorderPseudo"
import { levelorderPseudo } from "./pseudocode/levelorderPseudo"
import { heightPseudo } from "./pseudocode/heightPseudo"
import { countnodesPseudo } from "./pseudocode/countnodesPseudo"
import { countleavesPseudo } from "./pseudocode/countleavesPseudo"

import { binaryTreeOperationsMeta } from "./binaryTreeOperationsMeta"
import BinaryTreeExecutor from "./executor.js"

export const binaryTreeOperations = {
  insert: {
    label: "Insert Node",
    description: "Add a new node to the tree at the first available position (level-order insertion)",
    algorithmName: "Binary Tree Insertion",
    generator: (tree, params) => BinaryTreeExecutor.executeInsert(tree, params),
    pseudocode: insertPseudo,
    paramType: "value",
    hasParams: true,
    info: { name: "Insert", ...binaryTreeOperationsMeta.insert }
  },

  search: {
    label: "Search Node",
    description: "Find a node with a specific value and show the path from root",
    algorithmName: "Binary Tree Search",
    generator: (tree, params) => BinaryTreeExecutor.executeSearch(tree, params),
    pseudocode: searchPseudo,
    paramType: "value",
    hasParams: true,
    info: { name: "Search", ...binaryTreeOperationsMeta.search }
  },

  delete: {
    label: "Delete Node",
    description: "Remove a node and replace it with the deepest rightmost node",
    algorithmName: "Binary Tree Deletion",
    generator: (tree, params) => BinaryTreeExecutor.executeDelete(tree, params),
    pseudocode: deletePseudo,
    paramType: "value",
    hasParams: true,
    info: { name: "Delete", ...binaryTreeOperationsMeta.delete }
  },

  inorder: {
    label: "Inorder Traversal",
    description: "Traverse tree in order: Left - Node - Right",
    algorithmName: "Inorder Traversal",
    generator: (tree) => BinaryTreeExecutor.executeInorder(tree),
    pseudocode: inorderPseudo,
    hasParams: false,
    info: { name: "Inorder", ...binaryTreeOperationsMeta.inorder }
  },

  preorder: {
    label: "Preorder Traversal",
    description: "Traverse tree in order: Node - Left - Right",
    algorithmName: "Preorder Traversal",
    generator: (tree) => BinaryTreeExecutor.executePreorder(tree),
    pseudocode: preorderPseudo,
    hasParams: false,
    info: { name: "Preorder", ...binaryTreeOperationsMeta.preorder }
  },

  postorder: {
    label: "Postorder Traversal",
    description: "Traverse tree in order: Left - Right - Node",
    algorithmName: "Postorder Traversal",
    generator: (tree) => BinaryTreeExecutor.executePostorder(tree),
    pseudocode: postorderPseudo,
    hasParams: false,
    info: { name: "Postorder", ...binaryTreeOperationsMeta.postorder }
  },

  levelorder: {
    label: "Level Order Traversal",
    description: "Traverse tree level by level using BFS",
    algorithmName: "Level Order Traversal",
    generator: (tree) => BinaryTreeExecutor.executeLevelOrder(tree),
    pseudocode: levelorderPseudo,
    hasParams: false,
    info: { name: "Level Order", ...binaryTreeOperationsMeta.levelorder }
  },

  height: {
    label: "Get Height",
    description: "Calculate the height of the tree",
    algorithmName: "Tree Height Calculation",
    generator: (tree) => BinaryTreeExecutor.executeHeight(tree),
    pseudocode: heightPseudo,
    hasParams: false,
    info: { name: "Height", ...binaryTreeOperationsMeta.height }
  },

  countNodes: {
    label: "Count Nodes",
    description: "Count the total number of nodes in the tree",
    algorithmName: "Count All Nodes",
    generator: (tree) => BinaryTreeExecutor.executeCountNodes(tree),
    pseudocode: countnodesPseudo,
    hasParams: false,
    info: { name: "Count Nodes", ...binaryTreeOperationsMeta.countNodes }
  },

  countLeaves: {
    label: "Count Leaves",
    description: "Count the total number of leaf nodes",
    algorithmName: "Count Leaf Nodes",
    generator: (tree) => BinaryTreeExecutor.executeCountLeaves(tree),
    pseudocode: countleavesPseudo,
    hasParams: false,
    info: { name: "Count Leaves", ...binaryTreeOperationsMeta.countLeaves }
  }
}
