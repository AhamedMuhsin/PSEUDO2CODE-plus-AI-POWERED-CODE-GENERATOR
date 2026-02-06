export const arrayOperationsMeta = {
  traverse: {
    time: "O(n)",
    space: "O(1)",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    stable: true,
    inPlace: true,
    description: "Visits each element in the array sequentially. Used to access or update all elements."
  },

  linearSearch: {
    time: "O(n)",
    space: "O(1)",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    stable: true,
    inPlace: true,
    description: "Searches for an element by checking each element one by one from start to end."
  },

  binarySearch: {
    time: "O(log n)",
    space: "O(1)",
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    stable: true,
    inPlace: true,
    description: "Searches in a sorted array by repeatedly dividing the search interval in half. Works only on sorted arrays."
  },

  insertEnd: {
    time: "O(1)",
    space: "O(1)",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    stable: true,
    inPlace: true,
    description: "Adds a new element at the end of the array. Direct constant-time operation."
  },

  insertIndex: {
    time: "O(n)",
    space: "O(1)",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: true,
    description: "Inserts an element at a specific index by shifting all elements after it to the right."
  },

  deleteEnd: {
    time: "O(1)",
    space: "O(1)",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    stable: true,
    inPlace: true,
    description: "Removes the last element from the array. Direct constant-time operation."
  },

  deleteIndex: {
    time: "O(n)",
    space: "O(1)",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    stable: false,
    inPlace: true,
    description: "Removes an element at a specific index by shifting all elements after it to the left."
  },

  updateIndex: {
    time: "O(1)",
    space: "O(1)",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    stable: true,
    inPlace: true,
    description: "Updates the value at a specific index in the array. Direct constant-time operation."
  }
}
