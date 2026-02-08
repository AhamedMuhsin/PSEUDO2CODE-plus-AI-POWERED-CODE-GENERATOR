export const linkedListMeta = {
  singly: {
    traverse: {
      algorithmName: "Singly Linked List Traverse",
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Traverse nodes from head to null"
    },

    insertHead: {
      algorithmName: "Singly Linked List Insert at Head",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Insert a node at the beginning of the list"
    },

    insertTail: {
      algorithmName: "Singly Linked List Insert at Tail",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Insert a node at the end of the list"
    },

    insertAtIndex: {
      algorithmName: "Singly Linked List Insert at Index",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Insert a node at a specific index"
    },

    deleteHead: {
      algorithmName: "Singly Linked List Delete at Head",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Remove the first node of the list"
    },

    deleteTail: {
      algorithmName: "Singly Linked List Delete at Tail",
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Remove the last node of the list"
    },

    deleteAtIndex: {
      algorithmName: "Singly Linked List Delete at Index",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Remove a node at a specific index"
    },

    search: {
      algorithmName: "Singly Linked List Search",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Search for a value in the linked list"
    }
  },

  doubly: {
    traverse: {
      algorithmName: "Doubly Linked List Traverse",
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Traverse nodes using next and prev pointers"
    },

    insertHead: {
      algorithmName: "Doubly Linked List Insert at Head",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Insert a node at the beginning"
    },

    insertTail: {
      algorithmName: "Doubly Linked List Insert at Tail",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Insert a node at the end"
    },

    insertAtIndex: {
      algorithmName: "Doubly Linked List Insert at Index",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Insert a node at a specific index"
    },

    deleteHead: {
      algorithmName: "Doubly Linked List Delete at Head",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Remove the first node"
    },

    deleteTail: {
      algorithmName: "Doubly Linked List Delete at Tail",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Remove the last node"
    },

    deleteAtIndex: {
      algorithmName: "Doubly Linked List Delete at Index",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Remove node at a specific index"
    },

    search: {
      algorithmName: "Doubly Linked List Search",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Search for a value in the list"
    }
  },

  circular: {
    traverse: {
      algorithmName: "Circular Linked List Traverse",
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Traverse nodes until reaching the head again"
    },

    insertHead: {
      algorithmName: "Circular Linked List Insert at Head",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Insert a node at the beginning"
    },

    insertTail: {
      algorithmName: "Circular Linked List Insert at Tail",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Insert a node at the end"
    },

    insertAtIndex: {
      algorithmName: "Circular Linked List Insert at Index",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Insert node at a specific index"
    },

    deleteHead: {
      algorithmName: "Circular Linked List Delete at Head",
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Remove the first node"
    },

    deleteTail: {
      algorithmName: "Circular Linked List Delete at Tail",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Remove the last node"
    },

    deleteAtIndex: {
      algorithmName: "Circular Linked List Delete at Index",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Remove node at a specific index"
    },

    search: {
      algorithmName: "Circular Linked List Search",
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      stable: true,
      inPlace: true,
      description: "Search for a value in the circular list"
    }
  }
}