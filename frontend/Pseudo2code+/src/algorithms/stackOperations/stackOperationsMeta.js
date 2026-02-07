export const stackOperationsMeta = {
  push: {
    time: "O(1)",
    space: "O(1)",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    stable: true,
    inPlace: true,
    description: "Adds an element to the top of the stack. A constant-time operation that increments the top pointer and places the element."
  },

  pop: {
    time: "O(1)",
    space: "O(1)",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    stable: true,
    inPlace: true,
    description: "Removes and returns the element from the top of the stack. A constant-time operation that decrements the top pointer."
  },

  peek: {
    time: "O(1)",
    space: "O(1)",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    stable: true,
    inPlace: true,
    description: "Returns the element at the top of the stack without removing it. A constant-time read-only operation."
  },

  isEmpty: {
    time: "O(1)",
    space: "O(1)",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    stable: true,
    inPlace: true,
    description: "Checks whether the stack is empty by verifying if the top pointer is at -1. A constant-time operation."
  },

  size: {
    time: "O(1)",
    space: "O(1)",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    stable: true,
    inPlace: true,
    description: "Returns the number of elements currently stored in the stack. A constant-time operation with O(1) space."
  }
}
