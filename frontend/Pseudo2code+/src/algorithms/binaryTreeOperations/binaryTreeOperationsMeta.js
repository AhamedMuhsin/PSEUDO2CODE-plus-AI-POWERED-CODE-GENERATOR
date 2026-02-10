export const binaryTreeOperationsMeta = {
  insert: {
    time: "O(n)",
    space: "O(n)",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: false,
    description: "Insert a new node with a given value at the first available position (level-order insertion from left to right). The tree remains balanced."
  },

  search: {
    time: "O(n)",
    space: "O(n)",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: true,
    description: "Find a node with a specific value in the tree. Returns the path from root to the found node using BFS."
  },

  delete: {
    time: "O(n)",
    space: "O(n)",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: false,
    description: "Remove a node with a specific value by replacing it with the deepest rightmost node. Maintains tree structure."
  },

  inorder: {
    time: "O(n)",
    space: "O(h)",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: true,
    description: "Traverse the tree in-order (Left-Node-Right). Produces sorted output for Binary Search Trees."
  },

  preorder: {
    time: "O(n)",
    space: "O(h)",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: true,
    description: "Traverse the tree pre-order (Node-Left-Right). Useful for creating a copy of the tree."
  },

  postorder: {
    time: "O(n)",
    space: "O(h)",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: true,
    description: "Traverse the tree post-order (Left-Right-Node). Useful for deleting the tree or computing values bottom-up."
  },

  levelorder: {
    time: "O(n)",
    space: "O(w)",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    stable: true,
    inPlace: false,
    description: "Traverse the tree level-by-level using BFS. Also known as Breadth-First Traversal."
  },

  height: {
    time: "O(n)",
    space: "O(h)",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: true,
    description: "Calculate the height of the tree (maximum distance from root to any leaf). Returns the number of edges in the longest path."
  },

  countNodes: {
    time: "O(n)",
    space: "O(h)",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: true,
    description: "Count the total number of nodes in the tree. Traverse all nodes and increment counter."
  },

  countLeaves: {
    time: "O(n)",
    space: "O(h)",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: true,
    description: "Count the total number of leaf nodes (nodes with no children). A node is a leaf if both its children are null."
  }
}
