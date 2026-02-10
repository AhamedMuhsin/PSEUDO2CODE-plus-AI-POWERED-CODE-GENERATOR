/**
 * Binary Tree Operations Registry
 * Defines all available operations with metadata and pseudocode
 */

const operationsRegistry = {
  // ============ BASIC OPERATIONS ============
  insert: {
    label: "Insert Node",
    description: "Add a new node to the tree at the first available position (level-order insertion from left to right)",
    algorithmName: "Binary Tree Insertion",
    paramType: "value",
    hasParams: true,
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(n)",
    stable: false,
    pseudocode: `ALGORITHM INSERT(value)
  IF tree is empty THEN
    Create root node with value
  ELSE
    Create queue for BFS
    ENQUEUE root node
    
    WHILE queue is not empty DO
      node ← DEQUEUE
      
      IF node.left is NULL THEN
        node.left ← new Node(value)
        RETURN
      ELSE
        ENQUEUE node.left
      END IF
      
      IF node.right is NULL THEN
        node.right ← new Node(value)
        RETURN
      ELSE
        ENQUEUE node.right
      END IF
    END WHILE
  END IF
END ALGORITHM`
  },

  search: {
    label: "Search Node",
    description: "Find a node with a specific value and show the path from root",
    algorithmName: "Binary Tree Search",
    paramType: "value",
    hasParams: true,
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(n)",
    stable: false,
    pseudocode: `ALGORITHM SEARCH(value)
  IF tree is empty THEN
    RETURN Not Found
  END IF
  
  Create queue for BFS
  ENQUEUE root node
  path ← []
  
  WHILE queue is not empty DO
    node ← DEQUEUE
    ADD node to path
    
    IF node.value = value THEN
      RETURN Found, path from root
    END IF
    
    IF node.left is not NULL THEN
      ENQUEUE node.left
    END IF
    
    IF node.right is not NULL THEN
      ENQUEUE node.right
    END IF
  END WHILE
  
  RETURN Not Found
END ALGORITHM`
  },

  delete: {
    label: "Delete Node",
    description: "Remove a node and replace it with the deepest rightmost node",
    algorithmName: "Binary Tree Deletion",
    paramType: "value",
    hasParams: true,
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(n)",
    stable: false,
    pseudocode: `ALGORITHM DELETE(value)
  IF tree is empty THEN
    RETURN False
  END IF
  
  // Find node to delete
  nodeToDelete ← BFS_FIND(root, value)
  IF nodeToDelete is NULL THEN
    RETURN False
  END IF
  
  // Find deepest rightmost node
  lastNode ← BFS_FIND_LAST(root)
  
  // Replace value
  nodeToDelete.value ← lastNode.value
  
  // Delete last node
  REMOVE lastNode from tree
  
  RETURN True
END ALGORITHM`
  },

  // ============ TRAVERSAL OPERATIONS ============
  inorder: {
    label: "Inorder Traversal (LNR)",
    description: "Visit tree in Left → Node → Right order",
    algorithmName: "Inorder Traversal",
    paramType: null,
    hasParams: false,
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(h)",
    stable: false,
    pseudocode: `ALGORITHM INORDER_TRAVERSAL(node)
  IF node is NULL THEN
    RETURN
  END IF
  
  // Process left subtree
  INORDER_TRAVERSAL(node.left)
  
  // Process current node
  VISIT(node)
  result ← node.value
  
  // Process right subtree
  INORDER_TRAVERSAL(node.right)
END ALGORITHM

// Call: INORDER_TRAVERSAL(root)`
  },

  preorder: {
    label: "Preorder Traversal (NLR)",
    description: "Visit tree in Node → Left → Right order",
    algorithmName: "Preorder Traversal",
    paramType: null,
    hasParams: false,
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(h)",
    stable: false,
    pseudocode: `ALGORITHM PREORDER_TRAVERSAL(node)
  IF node is NULL THEN
    RETURN
  END IF
  
  // Process current node first
  VISIT(node)
  result ← node.value
  
  // Process left subtree
  PREORDER_TRAVERSAL(node.left)
  
  // Process right subtree
  PREORDER_TRAVERSAL(node.right)
END ALGORITHM

// Call: PREORDER_TRAVERSAL(root)`
  },

  postorder: {
    label: "Postorder Traversal (LRN)",
    description: "Visit tree in Left → Right → Node order",
    algorithmName: "Postorder Traversal",
    paramType: null,
    hasParams: false,
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(h)",
    stable: false,
    pseudocode: `ALGORITHM POSTORDER_TRAVERSAL(node)
  IF node is NULL THEN
    RETURN
  END IF
  
  // Process left subtree
  POSTORDER_TRAVERSAL(node.left)
  
  // Process right subtree
  POSTORDER_TRAVERSAL(node.right)
  
  // Process current node last
  VISIT(node)
  result ← node.value
END ALGORITHM

// Call: POSTORDER_TRAVERSAL(root)`
  },

  levelOrder: {
    label: "Level Order Traversal (BFS)",
    description: "Visit tree level by level, left to right",
    algorithmName: "Level Order Traversal",
    paramType: null,
    hasParams: false,
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(w)",
    stable: true,
    pseudocode: `ALGORITHM LEVEL_ORDER_TRAVERSAL(root)
  IF root is NULL THEN
    RETURN
  END IF
  
  queue ← Create empty queue
  ENQUEUE(queue, root)
  
  WHILE queue is not empty DO
    node ← DEQUEUE(queue)
    
    // Process current node
    VISIT(node)
    result ← node.value
    
    // Add children to queue
    IF node.left is not NULL THEN
      ENQUEUE(queue, node.left)
    END IF
    
    IF node.right is not NULL THEN
      ENQUEUE(queue, node.right)
    END IF
  END WHILE
END ALGORITHM`
  },

  // ============ UTILITY OPERATIONS ============
  height: {
    label: "Height of Tree",
    description: "Calculate the height of the entire tree and highlight the deepest path",
    algorithmName: "Tree Height Calculation",
    paramType: null,
    hasParams: false,
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(h)",
    stable: false,
    pseudocode: `ALGORITHM HEIGHT(node)
  IF node is NULL THEN
    RETURN -1
  END IF
  
  leftHeight ← HEIGHT(node.left)
  rightHeight ← HEIGHT(node.right)
  
  nodeHeight ← 1 + MAX(leftHeight, rightHeight)
  
  RETURN nodeHeight
END ALGORITHM

// Tree height = HEIGHT(root)`
  },

  countNodes: {
    label: "Count Nodes",
    description: "Count the total number of nodes in the tree",
    algorithmName: "Node Counting",
    paramType: null,
    hasParams: false,
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(h)",
    stable: false,
    pseudocode: `ALGORITHM COUNT_NODES(node)
  IF node is NULL THEN
    RETURN 0
  END IF
  
  leftCount ← COUNT_NODES(node.left)
  rightCount ← COUNT_NODES(node.right)
  
  totalCount ← 1 + leftCount + rightCount
  
  RETURN totalCount
END ALGORITHM

// Total nodes = COUNT_NODES(root)`
  },

  countLeaves: {
    label: "Count Leaf Nodes",
    description: "Count the number of leaf nodes (nodes with no children)",
    algorithmName: "Leaf Node Counting",
    paramType: null,
    hasParams: false,
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(h)",
    stable: false,
    pseudocode: `ALGORITHM COUNT_LEAF_NODES(node)
  IF node is NULL THEN
    RETURN 0
  END IF
  
  // If both children are NULL, it's a leaf
  IF node.left is NULL AND node.right is NULL THEN
    RETURN 1
  END IF
  
  leftLeaves ← COUNT_LEAF_NODES(node.left)
  rightLeaves ← COUNT_LEAF_NODES(node.right)
  
  totalLeaves ← leftLeaves + rightLeaves
  
  RETURN totalLeaves
END ALGORITHM`
  }
}

export default operationsRegistry
